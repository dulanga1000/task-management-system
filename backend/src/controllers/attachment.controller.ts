import type { Request, Response, NextFunction } from "express";
import {
  uploadAttachment,
  getTaskAttachments,
  deleteTaskAttachment,
} from "../services/attachment.service.js";

/**
 * Upload an attachment to a task
 */
export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.taskId as string;
    const file = req.file!;

    const attachment = await uploadAttachment(
      taskId,
      file,
      req.user!.userId,
      req.user!.role
    );

    res.status(201).json({
      success: true,
      message: "Attachment uploaded successfully",
      data: {
        attachment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all attachments for a task
 */
export const getByTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.taskId as string;
    const attachments = await getTaskAttachments(taskId);

    res.status(200).json({
      success: true,
      message: "Attachments retrieved successfully",
      data: {
        attachments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an attachment from a task
 */
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId, attachmentId } = req.params;

    const result = await deleteTaskAttachment(
      taskId as string,
      attachmentId as string,
      req.user!.userId,
      req.user!.role
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
