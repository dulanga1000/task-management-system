import Task from "../models/Task.js";
import User from "../models/User.js";
import {USER_ROLES,type UserRole} from "../constants/roles.js";
import type {CreateTaskInput,UpdateTaskInput,AssignTaskInput} from "../validations/task.validation.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";

// Create a new task
export const createTask = async (
  data: CreateTaskInput,
  creatorId: string
) => {
  const task = await Task.create({
    title: data.title,
    description: data.description,
    creator: creatorId,
    assignedUser: null,
  });

  return task;
};

// Get all tasks
export const getTasks = async () => {
  return Task.find()
    .populate(
      "creator",
      "firstName lastName username email"
    )
    .populate(
      "assignedUser",
      "firstName lastName username email"
    )
    .sort({ createdAt: -1 });
};

// Get a task by ID
export const getTaskById = async (taskId: string) => {
  validateObjectId(taskId, "task ID");

  return Task.findById(taskId)
    .populate(
      "creator",
      "firstName lastName username email"
    )
    .populate(
      "assignedUser",
      "firstName lastName username email"
    );
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

  if (!isAdmin && !isCreator) {
    throw new AppError(
      "You do not have permission to update this task",
      403
    );
  }

  task.title = data.title ?? task.title;
  task.description =
    data.description ?? task.description;

  if (data.status !== undefined) {
    task.status = data.status;
  }

  await task.save();

  return Task.findById(task._id)
    .populate(
      "creator",
      "firstName lastName username email"
    )
    .populate(
      "assignedUser",
      "firstName lastName username email"
    );
};

// Assign a task
export const assignTask = async (
  taskId: string,
  data: AssignTaskInput,
  userId: string,
  userRole: UserRole
) => {
  validateObjectId(taskId, "task ID");
  validateObjectId(
    data.assignedUserId,
    "assigned user ID"
  );

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const assignedUser = await User.findById(
    data.assignedUserId
  );

  if (!assignedUser) {
    throw new AppError(
      "Assigned user not found",
      404
    );
  }

  const isAdmin =
    userRole === USER_ROLES.ADMIN;

  if (isAdmin) {
    task.assignedUser = assignedUser._id;

    await task.save();

    return Task.findById(task._id)
      .populate(
        "creator",
        "firstName lastName username email"
      )
      .populate(
        "assignedUser",
        "firstName lastName username email"
      );
  }

  if (data.assignedUserId !== userId) {
    throw new AppError(
      "You do not have permission to assign this task",
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

  return Task.findById(task._id)
    .populate(
      "creator",
      "firstName lastName username email"
    )
    .populate(
      "assignedUser",
      "firstName lastName username email"
    );
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