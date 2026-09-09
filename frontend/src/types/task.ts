import type { User } from "./user";

export type TaskStatus = "TODO" | "DOING" | "DONE";

export interface TaskUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;

  creator: TaskUser;

  assignedUser: TaskUser | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface AssignTaskData {
  assignedUserId: string;
}

import type { PaginationMeta } from "./pagination";

export interface TasksResponse {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
    pagination?: PaginationMeta;
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: {
    task: Task;
  };
}