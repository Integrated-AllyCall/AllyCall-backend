import dotenv from "dotenv";
import { Client } from "minio";

export const VIDEO_BUCKET = "videos";
export const THUMBNAIL_BUCKET = "video-thumbnails";

dotenv.config();

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const ensureBuckets = async () => {
  const videoExists = await minioClient.bucketExists(VIDEO_BUCKET);
  if (!videoExists) {
    await minioClient.makeBucket(VIDEO_BUCKET, "us-east-1");
    console.log("Created bucket:", VIDEO_BUCKET);
  }

  const thumbExists = await minioClient.bucketExists(THUMBNAIL_BUCKET);
  if (!thumbExists) {
    await minioClient.makeBucket(THUMBNAIL_BUCKET, "us-east-1");
    console.log("Created bucket:", THUMBNAIL_BUCKET);
  }
};
