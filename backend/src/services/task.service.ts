import Task from "../models/Task.js";
import User from "../models/User.js";
import Attachment from "../models/Attachment.js";
import { getPresignedFileUrl } from "../utils/storage.js";
import { USER_ROLES, type UserRole } from "../constants/roles.js";
import type { CreateTaskInput, UpdateTaskInput, AssignTaskInput } from "../validations/task.validation.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";
import { parsePaginationParams, buildPaginationMeta } from "../utils/pagination.js";
import type { PaginationParams, PaginationMeta } from "../types/pagination.js";
import { logActivity } from "./activity.service.js";

// Create a new task
export const createTask = async (
  data: CreateTaskInput,
  creatorId: string,
  creatorRole?: UserRole
) => {
  let assignedUserId: any = null;

  if (data.assignedUserId && data.assignedUserId.trim() !== "") {
    validateObjectId(data.assignedUserId, "assigned user ID");
    const targetUser = await User.findById(data.assignedUserId);
    if (!targetUser) {
      throw new AppError("Assigned user not found", 404);
    }

    const isAdmin = creatorRole === USER_ROLES.ADMIN;
    if (!isAdmin) {
      // Normal users can only assign eligible unassigned tasks to themselves
      if (data.assignedUserId !== creatorId) {
        throw new AppError("Normal users can only assign tasks to themselves", 403);
      }
    }
    assignedUserId = targetUser._id;
  }

  const task = await Task.create({
    title: data.title,
    description: data.description,
    creator: creatorId,
    assignedUser: assignedUserId,
    labels: data.labels || [],
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    checklist: data.checklist || [],
  });

  await logActivity(task._id.toString(), creatorId, "TASK_CREATED", {
    newValue: task.status,
  });

  if (assignedUserId) {
    const assignedUser = await User.findById(assignedUserId);
    const assigneeDisplayName = assignedUser
      ? `${assignedUser.firstName} ${assignedUser.lastName}`.trim() || assignedUser.username
      : "User";
    await logActivity(task._id.toString(), creatorId, "TASK_ASSIGNED", {
      assignedToName: assigneeDisplayName,
      assignedToUserId: assignedUser?._id.toString(),
    });
  }

  return getTaskById(task._id.toString());
};

export interface GetTasksResult {
  tasks: any[];
  pagination: PaginationMeta;
}

const populateUserAvatar = async (userObj: any) => {
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
      console.warn("Failed to generate presigned URL for user avatar:", err);
    }
  }
  return {
    ...userObj,
    profilePicture: null,
  };
};

export const getTasks = async (
  params: PaginationParams = {}
): Promise<GetTasksResult> => {
  const { page, limit, skip } = parsePaginationParams(params);

  const [rawTasks, totalItems] = await Promise.all([
    Task.find()
      .populate(
        "creator",
        "firstName lastName username email profilePicture"
      )
      .populate(
        "assignedUser",
        "firstName lastName username email profilePicture"
      )
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(),
  ]);

  const taskIds = rawTasks.map((t) => t._id);
  const attachments = await Attachment.find({ task: { $in: taskIds } })
    .sort({ createdAt: -1 })
    .lean();

  const tasks = await Promise.all(
    rawTasks.map(async (task) => {
      const taskAttachments = attachments.filter(
        (a) => a.task.toString() === task._id.toString()
      );
      const attachmentCount = taskAttachments.length;
      const firstImage = taskAttachments.find((a) => a.type === "IMAGE");
      let coverImageUrl: string | null = null;

      if (firstImage?.storageKey) {
        try {
          coverImageUrl = await getPresignedFileUrl(firstImage.storageKey, 3600);
        } catch (err) {
          console.warn("Failed to generate presigned URL for task cover image:", err);
        }
      }

      const [creator, assignedUser] = await Promise.all([
        populateUserAvatar(task.creator),
        populateUserAvatar(task.assignedUser),
      ]);

      return {
        ...task,
        creator,
        assignedUser,
        attachmentCount,
        coverImageUrl,
      };
    })
  );

  const pagination = buildPaginationMeta(totalItems, page, limit);

  return {
    tasks,
    pagination,
  };
};

// Get a task by ID
export const getTaskById = async (taskId: string) => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId)
    .populate(
      "creator",
      "firstName lastName username email profilePicture"
    )
    .populate(
      "assignedUser",
      "firstName lastName username email profilePicture"
    )
    .lean();

  if (!task) return null;

  const taskAttachments = await Attachment.find({ task: taskId })
    .sort({ createdAt: -1 })
    .lean();

  const attachmentCount = taskAttachments.length;
  const firstImage = taskAttachments.find((a) => a.type === "IMAGE");
  let coverImageUrl: string | null = null;
  if (firstImage?.storageKey) {
    try {
      coverImageUrl = await getPresignedFileUrl(firstImage.storageKey, 3600);
    } catch (err) {
      console.warn("Failed to generate presigned URL for task cover image:", err);
    }
  }

  const [creator, assignedUser] = await Promise.all([
    populateUserAvatar(task.creator),
    populateUserAvatar(task.assignedUser),
  ]);

  return {
    ...task,
    creator,
    assignedUser,
    attachmentCount,
    coverImageUrl,
  };
};

// Update a task
export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput,
  userId: string,
  userRole: UserRole
) => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isCreator =
    task.creator.toString() === userId;
  const isAssigned =
    task.assignedUser?.toString() === userId;

  if (!isAdmin && !isCreator && !isAssigned) {
    throw new AppError(
      "You do not have permission to update this task",
      403
    );
  }

  const previousStatus = task.status;
  const previousTitle = task.title;
  const previousDescription = task.description;

  task.title = data.title ?? task.title;
  task.description =
    data.description ?? task.description;

  if (data.status !== undefined) {
    task.status = data.status;
  }

  if (data.labels !== undefined) {
    task.labels = data.labels;
  }

  if (data.dueDate !== undefined) {
    task.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  if (data.checklist !== undefined) {
    task.checklist = data.checklist;
  }

  if (data.order !== undefined) {
    task.order = data.order;
  }

  await task.save();

  if (data.status !== undefined && data.status !== previousStatus) {
    await logActivity(task._id.toString(), userId, "STATUS_CHANGED", {
      oldValue: previousStatus,
      newValue: task.status,
    });
  }

  if (
    (data.title !== undefined && data.title !== previousTitle) ||
    (data.description !== undefined && data.description !== previousDescription)
  ) {
    await logActivity(task._id.toString(), userId, "DETAILS_UPDATED", {
      oldValue: previousTitle,
      newValue: task.title,
    });
  }

  return getTaskById(task._id.toString());
};

// Assign a task
export const assignTask = async (
  taskId: string,
  data: AssignTaskInput,
  userId: string,
  userRole: UserRole
) => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const isAdmin = userRole === USER_ROLES.ADMIN;

  // Unassign task if assignedUserId is null or empty
  if (!data.assignedUserId || data.assignedUserId.trim() === "") {
    if (!isAdmin) {
      throw new AppError(
        "Only administrators can unassign tasks",
        403
      );
    }

    task.assignedUser = null;
    await task.save();

    await logActivity(task._id.toString(), userId, "TASK_UNASSIGNED", {});

    return getTaskById(task._id.toString());
  }

  validateObjectId(
    data.assignedUserId,
    "assigned user ID"
  );

  const assignedUser = await User.findById(
    data.assignedUserId
  );

  if (!assignedUser) {
    throw new AppError(
      "Assigned user not found",
      404
    );
  }

  const assigneeDisplayName = `${assignedUser.firstName} ${assignedUser.lastName}`.trim() || assignedUser.username;

  if (isAdmin) {
    task.assignedUser = assignedUser._id;

    await task.save();

    await logActivity(task._id.toString(), userId, "TASK_ASSIGNED", {
      assignedToName: assigneeDisplayName,
      assignedToUserId: assignedUser._id.toString(),
    });

    return getTaskById(task._id.toString());
  }

  if (data.assignedUserId !== userId) {
    throw new AppError(
      "You do not have permission to assign this task",
      403
    );
  }

  // Normal users cannot assign tasks to an administrator
  if (!isAdmin && assignedUser.role === USER_ROLES.ADMIN) {
    throw new AppError(
      "You cannot assign tasks to an administrator",
      403
    );
  }

  if (task.assignedUser) {
    throw new AppError(
      "You can only assign an unassigned task to yourself",
      403
    );
  }

  task.assignedUser = assignedUser._id;

  await task.save();

  await logActivity(task._id.toString(), userId, "TASK_ASSIGNED", {
    assignedToName: assigneeDisplayName,
    assignedToUserId: assignedUser._id.toString(),
  });

  return getTaskById(task._id.toString());
};

// Delete a task
export const deleteTask = async (
  taskId: string,
  userId: string,
  userRole: UserRole
) => {
  validateObjectId(taskId, "task ID");

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const isAdmin =
    userRole === USER_ROLES.ADMIN;

  const isCreator =
    task.creator.toString() === userId;

  if (!isAdmin && !isCreator) {
    throw new AppError(
      "You do not have permission to delete this task",
      403
    );
  }

  await Task.findByIdAndDelete(taskId);

  return task;
};

// Reorder tasks
export const reorderTasks = async (
  items: { taskId: string; order: number }[],
  userId: string,
  userRole: UserRole
) => {
  const isAdmin = userRole === USER_ROLES.ADMIN;

  const bulkOps = items.map((item) => {
    validateObjectId(item.taskId, "task ID");
    const filter: Record<string, any> = { _id: item.taskId };
    if (!isAdmin) {
      filter.assignedUser = userId;
    }
    return {
      updateOne: {
        filter,
        update: { $set: { order: item.order } },
      },
    };
  });

  if (bulkOps.length > 0) {
    await Task.bulkWrite(bulkOps);
  }
};