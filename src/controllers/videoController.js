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
  const videoFile = req.files?.video?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  if (!videoFile) return res.status(400).json({ error: "No video uploaded." });

  const thumbnailPath = thumbnailFile
    ? thumbnailFile.path
    : `${videoFile.path}.jpg`;

  try {
    // Get video duration
    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoFile.path, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    const duration = metadata.format.duration;
    if (duration > 3600) {
      fs.unlinkSync(videoFile.path);
      if (thumbnailFile) fs.unlinkSync(thumbnailFile.path);
      return res.status(400).json({ error: "Video duration must be under 1 hour." });
    }

    // Generate thumbnail if not provided by client
    if (!thumbnailFile) {
      await new Promise((resolve, reject) => {
        ffmpeg(videoFile.path)
          .on('end', resolve)
          .on('error', reject)
          .screenshots({
            count: 1,
            folder: path.dirname(thumbnailPath),
            filename: path.basename(thumbnailPath),
            size: '320x568',
          });
      });
    }

    // Upload video to MinIO
    const objectName = `${Date.now()}-${videoFile.originalname}`;
    await minioClient.fPutObject(VIDEO_BUCKET, objectName, videoFile.path, {
      "Content-Type": videoFile.mimetype,
    });
    const videoUrl = `http://10.4.56.28:9000/${VIDEO_BUCKET}/${objectName}`;

    // Upload thumbnail to MinIO
    const thumbnailName = `${Date.now()}-${videoFile.originalname}-thumb.jpg`;
    await minioClient.fPutObject(THUMBNAIL_BUCKET, thumbnailName, thumbnailPath, {
      "Content-Type": "image/jpeg",
    });
    const thumbnailUrl = `http://10.4.56.28:9000/${THUMBNAIL_BUCKET}/${thumbnailName}`;

    // Save to Postgres
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

    // Cleanup
    fs.unlinkSync(videoFile.path);
    if (!thumbnailFile) fs.unlinkSync(thumbnailPath);

    res.status(201).json(video);
  } catch (error) {
    console.error("Failed to upload video:", error);
    if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
    if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
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
            id: true,
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
            id: true,
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