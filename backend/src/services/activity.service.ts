import Activity, { type ActivityType, type IActivityDetails } from "../models/Activity.js";
import Task from "../models/Task.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";

/**
 * Asynchronously log a task activity.
 * Caught errors are logged to avoid failing primary business transactions.
 */
export const logActivity = async (
  taskId: string,
  userId: string,
  type: ActivityType,
  details?: IActivityDetails
): Promise<void> => {
  try {
    await Activity.create({
      task: taskId,
      user: userId,
      type,
      ...(details ? { details } : {}),
    });
  } catch (error) {
    console.error("Failed to record task activity:", error);
  }
};

/**
 * Fetch all activities/audit events for a specific task.
 */
export const getTaskActivities = async (taskId: string) => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const activities = await Activity.find({ task: taskId })
    .populate("user", "firstName lastName username email")
    .sort({ createdAt: -1 })
    .lean();

  return activities;
};

/**
 * Add a user comment to a task activity stream.
 */
export const addTaskComment = async (
  taskId: string,
  userId: string,
  commentText: string
) => {
  validateObjectId(taskId, "task ID");

  const trimmedComment = commentText?.trim();
  if (!trimmedComment) {
    throw new AppError("Comment text cannot be empty", 400);
  }

  if (trimmedComment.length > 2000) {
    throw new AppError("Comment cannot exceed 2000 characters", 400);
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const created = await Activity.create({
    task: taskId,
    user: userId,
    type: "COMMENT_ADDED",
    details: {
      comment: trimmedComment,
    },
  });

  const populated = await Activity.findById(created._id)
    .populate("user", "firstName lastName username email")
    .lean();

  return populated;
};
