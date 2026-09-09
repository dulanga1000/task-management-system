import type { Request, Response, NextFunction } from "express";
import { getTaskActivities, addTaskComment } from "../services/activity.service.js";

export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.taskId as string;
    const activities = await getTaskActivities(taskId);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const taskId = req.params.taskId as string;
    const { comment } = req.body;
    const userId = req.user.userId;

    const newComment = await addTaskComment(taskId, userId, comment);

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};
