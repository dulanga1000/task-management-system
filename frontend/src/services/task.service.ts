import api from "./api";

import type {
  AssignTaskData,
  CreateTaskData,
  TaskResponse,
  TasksResponse,
  UpdateTaskData,
} from "@/types/task";

export const getTasks = async () => {
  const response = await api.get<TasksResponse>("/tasks");

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
  const response = await api.put<TaskResponse>(
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
    `/tasks/${taskId}/assign`,
    data
  );

  return response.data;
};