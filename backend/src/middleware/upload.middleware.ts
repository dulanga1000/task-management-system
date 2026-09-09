import multer from "multer";
import path from "path";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
]);

/**
 * Verify file magic bytes / signature against declared MIME type
 */
export const verifyFileMagicBytes = (
  buffer: Buffer,
  mimeType: string
): boolean => {
  if (!buffer || buffer.length < 4) return false;

  // PNG: 89 50 4E 47
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // JPEG/JPG: FF D8 FF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // WEBP: RIFF at 0..3 and WEBP at 8..11
  if (mimeType === "image/webp") {
    if (buffer.length < 12) return false;
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  // PDF: %PDF- (25 50 44 46)
  if (mimeType === "application/pdf") {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    );
  }

  return false;
};

// Multer memory storage configuration
const storage = multer.memoryStorage();

const multerUpload = multer({
  storage,
  limits: {
    fileSize: MAX_PDF_SIZE, // Global max
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(
        new AppError(
          `Unsupported file extension: ${ext}. Allowed: JPG, PNG, WEBP, PDF`,
          400
        )
      );
    }

    if (!ALLOWED_MIME_TYPES.has(mime)) {
      return cb(
        new AppError(
          `Unsupported MIME type: ${mime}. Allowed: image/jpeg, image/png, image/webp, application/pdf`,
          400
        )
      );
    }

    cb(null, true);
  },
});

/**
 * Express middleware wrapper for file upload with strict magic byte and size enforcement
 */
export const uploadAttachmentFile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const upload = multerUpload.single("file");

  upload(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError("File size exceeds maximum allowed limit", 400)
          );
        }
        return next(new AppError(`File upload error: ${err.message}`, 400));
      }
      return next(err);
    }

    if (!req.file) {
      return next(new AppError("File is required", 400));
    }

    const file = req.file;
    const mime = file.mimetype.toLowerCase();
    const isPdf = mime === "application/pdf";

    // Enforce individual category size limits
    if (isPdf && file.size > MAX_PDF_SIZE) {
      return next(new AppError("PDF size must not exceed 10 MB", 400));
    }

    if (!isPdf && file.size > MAX_IMAGE_SIZE) {
      return next(new AppError("Image size must not exceed 5 MB", 400));
    }

    // Verify magic bytes
    const isValidSignature = verifyFileMagicBytes(file.buffer, mime);
    if (!isValidSignature) {
      return next(
        new AppError(
          "File content does not match declared type. Invalid file signature.",
          400
        )
      );
    }

    next();
  });
};

const ALLOWED_PROFILE_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_PROFILE_IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

/**
 * Express middleware wrapper for profile picture upload:
 * Strictly restricts to image formats (JPG, PNG, WEBP), max 5 MB, and verifies magic bytes.
 */
export const uploadProfilePictureFile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const upload = multer({
    storage,
    limits: {
      fileSize: MAX_IMAGE_SIZE,
      files: 1,
    },
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const mime = file.mimetype.toLowerCase();

      if (!ALLOWED_PROFILE_IMAGE_EXTS.has(ext)) {
        return cb(
          new AppError(
            `Unsupported file extension: ${ext}. Allowed image formats: JPG, PNG, WEBP`,
            400
          )
        );
      }

      if (!ALLOWED_PROFILE_IMAGE_MIMES.has(mime)) {
        return cb(
          new AppError(
            `Unsupported image type: ${mime}. Allowed: image/jpeg, image/png, image/webp`,
            400
          )
        );
      }

      cb(null, true);
    },
  }).single("file");

  upload(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(new AppError("Profile picture must not exceed 5 MB", 400));
        }
        return next(new AppError(`File upload error: ${err.message}`, 400));
      }
      return next(err);
    }

    if (!req.file) {
      return next(new AppError("Profile picture file is required", 400));
    }

    const file = req.file;
    const mime = file.mimetype.toLowerCase();

    if (file.size > MAX_IMAGE_SIZE) {
      return next(new AppError("Profile picture must not exceed 5 MB", 400));
    }

    // Verify magic bytes
    const isValidSignature = verifyFileMagicBytes(file.buffer, mime);
    if (!isValidSignature) {
      return next(
        new AppError(
          "File content does not match declared image type. Invalid file signature.",
          400
        )
      );
    }

    next();
  });
};

