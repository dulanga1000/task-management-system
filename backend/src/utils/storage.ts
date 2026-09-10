import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import crypto from "crypto";
import { env } from "../config/env.js";

let s3ClientInstance: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: env.supabase.s3Region,
      endpoint: env.supabase.s3Endpoint,
      credentials: {
        accessKeyId: env.supabase.s3AccessKeyId,
        secretAccessKey: env.supabase.s3SecretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
};

/**
 * Generate a safe, collision-resistant storage key following the pattern:
 * tasks/{taskId}/images/{safeName}-{timestamp}-{random}.{ext}
 * tasks/{taskId}/pdfs/{safeName}-{timestamp}-{random}.{ext}
 */
export const generateStorageKey = (
  taskId: string,
  type: "IMAGE" | "PDF",
  originalName: string
): string => {
  const ext =
    path.extname(originalName).toLowerCase() ||
    (type === "PDF" ? ".pdf" : ".jpg");

  const rawBase = path.basename(originalName, ext);
  const safeBase =
    rawBase
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30) || (type === "IMAGE" ? "evidence" : "document");

  const randomSuffix = crypto.randomBytes(3).toString("hex");
  const uniqueFileName = `${safeBase}-${Date.now()}-${randomSuffix}${ext}`;
  const subFolder = type === "IMAGE" ? "images" : "pdfs";

  return `tasks/${taskId}/${subFolder}/${uniqueFileName}`;
};

/**
 * Generate a secure collision-resistant storage key for user profile pictures following:
 * profile-pictures/{userId}/profile-{uniqueId}.{ext}
 */
export const generateProfilePictureKey = (
  userId: string,
  originalName: string
): string => {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const uniqueId = crypto.randomBytes(4).toString("hex");
  return `profile-pictures/${userId}/profile-${uniqueId}${ext}`;
};

let bucketVerified = false;

// Ensure target bucket exists in Supabase Storage

export const ensureBucketExists = async (): Promise<void> => {
  if (bucketVerified) return;
  const client = getS3Client();
  try {
    await client.send(
      new CreateBucketCommand({
        Bucket: env.supabase.s3Bucket,
      })
    );
    bucketVerified = true;
  } catch (err: any) {
    if (
      err.name === "BucketAlreadyExists" ||
      err.name === "BucketAlreadyOwnedByYou" ||
      err.$metadata?.httpStatusCode === 409
    ) {
      bucketVerified = true;
    } else {
      console.warn("Storage ensureBucketExists note:", err.message);
    }
  }
};

// Upload buffer directly to Supabase S3 storage

export const uploadToStorage = async (
  storageKey: string,
  buffer: Buffer,
  mimeType: string
): Promise<void> => {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: env.supabase.s3Bucket,
    Key: storageKey,
    Body: buffer,
    ContentType: mimeType,
  });

  try {
    await client.send(command);
  } catch (error: any) {
    if (
      error.name === "NoSuchBucket" ||
      error.$metadata?.httpStatusCode === 404
    ) {
      await ensureBucketExists();
      await client.send(command);
    } else {
      throw error;
    }
  }
};

// Delete object from Supabase S3 storage
export const deleteFromStorage = async (storageKey: string): Promise<void> => {
  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: env.supabase.s3Bucket,
    Key: storageKey,
  });

  await client.send(command);
};

// Generate a short-lived presigned URL for viewing/downloading an attachment or avatar securely
export const getPresignedFileUrl = async (
  storageKey: string,
  expiresInSeconds: number = env.supabase.signedUrlExpiresIn
): Promise<string> => {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: env.supabase.s3Bucket,
    Key: storageKey,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
};
