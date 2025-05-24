import { video_tag } from "@prisma/client";
import prisma from "../configs/prisma.js";
import fs from "fs";
import { minioClient, BUCKET } from "../configs/minio.js";

export const getVideoTags = (req, res) => {
  try {
    const tags = Object.values(video_tag);
    res.json(tags);
  } catch (error) {
    console.error("Failed to fetch video tags:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const uploadVideo = async (req, res) => {
  const { tag, title, description, user_id } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded." });

  const objectName = `${Date.now()}-${file.originalname}`;

  try {
    // Upload to MinIO
    await minioClient.fPutObject(BUCKET, objectName, file.path, {
      "Content-Type": file.mimetype,
    });

    const videoUrl = `http://localhost:9000/${BUCKET}/${objectName}`;
    // Upload to Postgres
    const video = await prisma.upload_videos.create({
      data: {
        tag,
        title,
        description,
        video_url: videoUrl,
        user_id,
      },
    });

    fs.unlinkSync(file.path);

    res.status(201).json(video);
  } catch (error) {
    console.error("Failed to upload video:", error);
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
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getVideo = async (req, res) => {
  const { tag, search } = req.query;
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
      where,
      orderBy: { created_at: "desc" },
    });

    res.json(videos);
  } catch (error) {
    console.error("Failed to fetch video:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
