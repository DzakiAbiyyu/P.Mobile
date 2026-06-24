// minio.js

import { Client } from "minio";
import dotenv from "dotenv";
dotenv.config();
export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const bucketName = process.env.MINIO_BUCKET_NAME;

// OPTIONAL: hanya log, bukan admin operation
export const initMinio = () => {
  console.log("[MinIO] Client initialized");
  console.log("[MinIO] Endpoint:", process.env.MINIO_ENDPOINT);
  console.log("[MinIO] Bucket:", bucketName);
};
