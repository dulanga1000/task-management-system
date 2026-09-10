import Activity, { type ActivityType, type IActivityDetails } from "../models/Activity.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";
import { getPresignedFileUrl } from "../utils/storage.js";

const populateActivityUserAvatar = async (userObj: any) => {
  if (!userObj) return null;
  if (userObj.profilePicture?.storageKey) {
    try {
      const url = await getPresignedFileUrl(userObj.profilePicture.storageKey, 3600);
      return {
        ...userObj,
        profilePicture: {
          storageKey: userObj.profilePicture.storageKey,
          mimeType: userObj.profilePicture.mimeType,
          size: userObj.profilePicture.size,
          updatedAt: userObj.profilePicture.updatedAt,
          url,
        },
      };
    } catch (err) {
      console.warn("Failed to generate presigned URL for activity user avatar:", err);
    }
  }
  return {
    ...userObj,
    profilePicture: null,
  };
};

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


// Fetch all activities/audit events for a specific task.

export const getTaskActivities = async (taskId: string) => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId)
    .populate("assignedUser", "firstName lastName username email")
    .lean();

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const activities = await Activity.find({ task: taskId })
    .populate("user", "firstName lastName username email profilePicture")
    .populate("details.assignedToUserId", "firstName lastName username email")
    .sort({ createdAt: -1 })
    .lean();

  const populatedActivities = await Promise.all(
    activities.map(async (act: any) => {
      const user = await populateActivityUserAvatar(act.user);

      // Dynamically resolve TASK_ASSIGNED display name
      if (act.type === "TASK_ASSIGNED" && act.details) {
        if (act.details.assignedToUserId && typeof act.details.assignedToUserId === "object") {
          const aUser = act.details.assignedToUserId;
          const currentName = `${aUser.firstName || ""} ${aUser.lastName || ""}`.trim() || aUser.username;
          if (currentName) {
            act.details.assignedToName = currentName;
          }
        } else {
          // Check for legacy activities where assignedToUserId was not recorded
          const taskAssignee: any = task.assignedUser;
          if (taskAssignee) {
            const taskAssigneeName = `${taskAssignee.firstName || ""} ${taskAssignee.lastName || ""}`.trim() || taskAssignee.username;
            if (
              act.details.assignedToName === "Dulanga Bandara" ||
              (user && `${user.firstName || ""} ${user.lastName || ""}`.trim() === "MMDN Bandara")
            ) {
              act.details.assignedToName = taskAssigneeName || "MMDN Bandara";
            }
          } else if (user && `${user.firstName || ""} ${user.lastName || ""}`.trim() === "MMDN Bandara" && act.details.assignedToName === "Dulanga Bandara") {
            act.details.assignedToName = "MMDN Bandara";
          }
        }
      }

      return {
        ...act,
        user,
      };
    })
  );

  return populatedActivities;
};


// Add a user comment to a task activity stream.

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
    .populate("user", "firstName lastName username email profilePicture")
    .lean();

  if (populated) {
    populated.user = await populateActivityUserAvatar(populated.user);
  }

  return populated;
};
