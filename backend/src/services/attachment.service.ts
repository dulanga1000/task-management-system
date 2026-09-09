import Attachment, { type IAttachment } from "../models/Attachment.js";
import Task from "../models/Task.js";
import { USER_ROLES, type UserRole } from "../constants/roles.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";
import { env } from "../config/env.js";
import { uploadToStorage, deleteFromStorage, generateStorageKey, getPresignedFileUrl } from "../utils/storage.js";
import { logActivity } from "./activity.service.js";

export interface AttachmentResponseDto {
  _id: string;
  task: string;
  originalName: string;
  storageKey: string;
  bucket: string;
  mimeType: string;
  size: number;
  type: "IMAGE" | "PDF";
  uploadedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
  };
  url?: string;
  createdAt: string;
  updatedAt: string;
}

// Upload an attachment (image or PDF) for a task

export const uploadAttachment = async (
  taskId: string,
  file: Express.Multer.File,
  userId: string,
  userRole: UserRole
): Promise<AttachmentResponseDto> => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  // Enforce task permission: Admin, task creator, or assigned user
  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isCreator = task.creator?.toString() === userId;
  const isAssigned = task.assignedUser?.toString() === userId;

  if (!isAdmin && !isCreator && !isAssigned) {
    throw new AppError(
      "You do not have permission to add attachments to this task",
      403
    );
  }

  const mime = file.mimetype.toLowerCase();
  const isPdf = mime === "application/pdf";
  const type: "IMAGE" | "PDF" = isPdf ? "PDF" : "IMAGE";

  // Generate safe collision-resistant key
  const storageKey = generateStorageKey(taskId, type, file.originalname);

  // Upload file buffer directly to Supabase S3
  await uploadToStorage(storageKey, file.buffer, mime);

  // Save metadata to MongoDB with compensating rollback on failure
  let createdAttachment: IAttachment;
  try {
    createdAttachment = await Attachment.create({
      task: taskId,
      originalName: file.originalname,
      storageKey,
      bucket: env.supabase.s3Bucket,
      mimeType: mime,
      size: file.size,
      type,
      uploadedBy: userId,
    });
  } catch (dbError) {
    // Compensating rollback: delete uploaded storage object if DB write fails
    try {
      await deleteFromStorage(storageKey);
    } catch (cleanupError) {
      console.error(
        "Failed to clean up storage object after DB save error:",
        cleanupError
      );
    }
    throw dbError;
  }

  // Generate short-lived presigned URL for the uploaded object
  const url = await getPresignedFileUrl(storageKey, 3600);

  const populated = await Attachment.findById(createdAttachment._id)
    .populate("uploadedBy", "firstName lastName username email")
    .lean();

  await logActivity(taskId, userId, "ATTACHMENT_ADDED", {
    fileName: file.originalname,
  });

  return {
    ...populated,
    url,
  } as unknown as AttachmentResponseDto;
};

// Retrieve all attachments for a task

export const getTaskAttachments = async (
  taskId: string
): Promise<AttachmentResponseDto[]> => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const attachments = await Attachment.find({ task: taskId })
    .populate("uploadedBy", "firstName lastName username email")
    .sort({ createdAt: -1 })
    .lean();

  // Attach signed URLs for each attachment
  const attachmentsWithUrls = await Promise.all(
    attachments.map(async (att) => {
      let url = "";
      try {
        url = await getPresignedFileUrl(att.storageKey, 3600);
      } catch (err) {
        console.error(
          `Failed to generate presigned URL for ${att.storageKey}:`,
          err
        );
      }
      return {
        ...att,
        url,
      };
    })
  );

  return attachmentsWithUrls as unknown as AttachmentResponseDto[];
};


// Delete an attachment from Supabase Storage and MongoDB

export const deleteTaskAttachment = async (
  taskId: string,
  attachmentId: string,
  userId: string,
  userRole: UserRole
): Promise<{ message: string }> => {
  validateObjectId(taskId, "task ID");
  validateObjectId(attachmentId, "attachment ID");

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const attachment = await Attachment.findById(attachmentId);
  if (!attachment) {
    throw new AppError("Attachment not found", 404);
  }

  // Verify attachment belongs to this task
  if (attachment.task.toString() !== taskId) {
    throw new AppError(
      "Attachment does not belong to the specified task",
      400
    );
  }

  // Permission check: Admin, attachment uploader, or task creator
  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isUploader = attachment.uploadedBy.toString() === userId;
  const isTaskCreator = task.creator?.toString() === userId;

  if (!isAdmin && !isUploader && !isTaskCreator) {
    throw new AppError(
      "You do not have permission to delete this attachment",
      403
    );
  }

  // Delete object from Supabase S3 storage first
  await deleteFromStorage(attachment.storageKey);

  // Delete document from MongoDB
  await Attachment.findByIdAndDelete(attachmentId);

  await logActivity(taskId, userId, "ATTACHMENT_DELETED", {
    fileName: attachment.originalName,
  });

  return { message: "Attachment deleted successfully" };
};
