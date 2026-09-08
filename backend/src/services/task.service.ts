import Task from "../models/Task.js";
import User from "../models/User.js";
import { USER_ROLES, type UserRole } from "../constants/roles.js";
import type {CreateTaskInput,UpdateTaskInput,AssignTaskInput} from "../validations/task.validation.js";

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
    .populate("creator", "firstName lastName username email")
    .populate("assignedUser", "firstName lastName username email")
    .sort({ createdAt: -1 });
};

// Get a task by ID

export const getTaskById = async (taskId: string) => {
  return Task.findById(taskId)
    .populate("creator", "firstName lastName username email")
    .populate("assignedUser", "firstName lastName username email");
};

// Update a task

export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput,
  userId: string,
  userRole: UserRole
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isCreator = task.creator.toString() === userId;

  if (!isAdmin && !isCreator) {
    throw new Error(
      "You do not have permission to update this task"
    );
  }

  task.title = data.title ?? task.title;
  task.description = data.description ?? task.description;

  if (data.status !== undefined) {
    task.status = data.status;
  }

  await task.save();

  return Task.findById(task._id)
    .populate("creator", "firstName lastName username email")
    .populate("assignedUser", "firstName lastName username email");
};

// Assign a task
export const assignTask = async (
  taskId: string,
  data: AssignTaskInput,
  userId: string,
  userRole: UserRole
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const assignedUser = await User.findById(data.assignedUserId);

  if (!assignedUser) {
    throw new Error("Assigned user not found");
  }

  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (isAdmin) {
    task.assignedUser = assignedUser._id;

    await task.save();

    return Task.findById(task._id)
      .populate("creator", "firstName lastName username email")
      .populate("assignedUser", "firstName lastName username email");
  }

  // Normal users can only assign tasks to themselves
  if (data.assignedUserId !== userId) {
    throw new Error(
      "You do not have permission to assign this task"
    );
  }

  // Normal users can only claim unassigned tasks
  if (task.assignedUser) {
    throw new Error(
      "You can only assign an unassigned task to yourself"
    );
  }

  task.assignedUser = assignedUser._id;

  await task.save();

  return Task.findById(task._id)
    .populate("creator", "firstName lastName username email")
    .populate("assignedUser", "firstName lastName username email");
};

// Delete a task

export const deleteTask = async (
  taskId: string,
  userId: string,
  userRole: UserRole
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isCreator = task.creator.toString() === userId;

  if (!isAdmin && !isCreator) {
    throw new Error(
      "You do not have permission to delete this task"
    );
  }

  await Task.findByIdAndDelete(taskId);

  return task;
};