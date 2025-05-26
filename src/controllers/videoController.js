import { video_tag } from "@prisma/client";
import prisma from "../configs/prisma.js";
import fs from "fs";
import { minioClient, VIDEO_BUCKET,THUMBNAIL_BUCKET } from "../configs/minio.js";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export const getVideoTags = (req, res) => {
  try {
    const tags = Object.values(video_tag);
    res.json(tags);
  } catch (error) {
    console.error("Failed to fetch video tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadVideo = async (req, res) => {
  const { tag, title, description, user_id } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded." });

  const thumbnailPath = `${file.path}.jpg`;

  try {
    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(file.path, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    const duration = metadata.format.duration;
    if (duration > 3600) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Video duration must be under 1 hour." });
    }

    await new Promise((resolve, reject) => {
      ffmpeg(file.path)
        .on('end', resolve)
        .on('error', reject)
        .screenshots({
          count: 1,
          folder: path.dirname(file.path),
          filename: path.basename(thumbnailPath),
          size: '320x568',
        });
    });

    // Upload to MinIO
    const objectName = `${Date.now()}-${file.originalname}`;
    await minioClient.fPutObject(VIDEO_BUCKET, objectName, file.path, {
      "Content-Type": file.mimetype,
    });
    const videoUrl = `http://10.4.56.28:9000/${VIDEO_BUCKET}/${objectName}`;

    const thumbnailName = `${Date.now()}-${file.originalname}-thumb.jpg`;
    await minioClient.fPutObject(THUMBNAIL_BUCKET, thumbnailName, thumbnailPath, {
      "Content-Type": "image/jpeg",
    });
    const thumbnailUrl = `http://10.4.56.28:9000/${THUMBNAIL_BUCKET}/${thumbnailName}`;
    // Upload to Postgres
    const video = await prisma.upload_videos.create({
      data: {
        tag,
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        user_id,
        duration,
      },
    });
    
    fs.unlinkSync(thumbnailPath);
    fs.unlinkSync(file.path);

    res.status(201).json(video);
  } catch (error) {
    console.error("Failed to upload video:", error);
    fs.unlinkSync(thumbnailPath);
    fs.unlinkSync(file.path);
    res.status(500).json({ error: "Upload failed" });
  }
};

export const updateVideoDetails = async (req, res) => {
  const id = parseInt(req.params.id);
  const { tag, title, description } = req.body;
  try {
    const video = await prisma.upload_videos.update({
      where: {
        id: id,
      },
      data: {
        tag,
        title,
        description,
      },
    });
    res.status(201).json(video);
  } catch (error) {
    console.error("Failed to update details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getVideo = async (req, res) => {
  const { tag, search, num } = req.query;
  try {
    const where = {};

    if (tag) {
      where.tag = tag;
    }
    if (search) {
      const words = search.split(" ").filter(Boolean);
      where.OR = words.flatMap((word) => [
        { title: { contains: word, mode: "insensitive" } },
        { description: { contains: word, mode: "insensitive" } },
      ]);
    }

    const videos = await prisma.upload_videos.findMany({
      take: num ? parseInt(num) : undefined,
      where,
      include: {
        users: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(videos);
  } catch (error) {
    console.error("Failed to fetch video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getVideoByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ error: "User Id is required." });
    }

    const videos = await prisma.upload_videos.findMany({
      where: {
        user_id: id
      },
      include: {
        users: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(videos);
  } catch (error) {
    console.error("Failed to fetch video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};