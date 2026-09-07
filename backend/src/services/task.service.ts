import Task from "../models/Task.js";
import type { CreateTaskInput,UpdateTaskInput } from "../validations/task.validation.js";

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

export const getTasks = async () => {
  return Task.find()
    .populate("creator", "firstName lastName username email")
    .populate("assignedUser", "firstName lastName username email")
    .sort({ createdAt: -1 });
};

export const getTaskById = async (taskId: string) => {
  return Task.findById(taskId)
    .populate("creator", "firstName lastName username email")
    .populate("assignedUser", "firstName lastName username email");
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput
) => {
  return Task.findByIdAndUpdate(
    taskId,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("creator", "firstName lastName username email")
    .populate("assignedUser", "firstName lastName username email");
};

export const deleteTask = async (taskId: string) => {
  return Task.findByIdAndDelete(taskId);
};