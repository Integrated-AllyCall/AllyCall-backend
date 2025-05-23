import dotenv from "dotenv";
import { Client } from "minio";

export const BUCKET = "videos";
dotenv.config()

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const ensureBucket = async () => {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET, "us-east-1");
    console.log("Created MinIO bucket:", BUCKET);
  }
};
