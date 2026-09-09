import api from "./api";

import type {AssignTaskData,CreateTaskData,TaskResponse,TasksResponse,UpdateTaskData} from "@/types/task";
import type { PaginationParams } from "@/types/pagination";

export const getTasks = async (params?: PaginationParams) => {
  const response = await api.get<TasksResponse>("/tasks", {
    params,
  });

  return response.data;
};

export const getTaskById = async (taskId: string) => {
  const response = await api.get<TaskResponse>(
    `/tasks/${taskId}`
  );

  return response.data;
};

export const createTask = async (
  data: CreateTaskData
) => {
  const response = await api.post<TaskResponse>(
    "/tasks",
    data
  );

  return response.data;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskData
) => {
  const response = await api.patch<TaskResponse>(
    `/tasks/${taskId}`,
    data
  );

  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(
    `/tasks/${taskId}`
  );

  return response.data;
};

export const assignTask = async (
  taskId: string,
  data: AssignTaskData
) => {
  const response = await api.patch<TaskResponse>(
    `/tasks/${taskId}/assignment`,
    data
  );

  return response.data;
};

export const reorderTasks = async (
  items: { taskId: string; order: number }[]
) => {
  const response = await api.patch<{ success: boolean; message: string }>(
    "/tasks/reorder",
    { items }
  );

  return response.data;
};