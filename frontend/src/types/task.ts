import type { User } from "./user";
import type { PaginationMeta } from "./pagination";

export type TaskStatus = "TODO" | "DOING" | "DONE";

export interface TaskUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface TaskLabel {
  name: string;
  color: string;
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creator: TaskUser | null;
  assignedUser: TaskUser | null;
  labels?: TaskLabel[];
  dueDate?: string | null;
  checklist?: TaskChecklistItem[];
  attachmentCount?: number;
  coverImageUrl?: string | null;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  labels?: TaskLabel[];
  dueDate?: string | null;
  checklist?: TaskChecklistItem[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  labels?: TaskLabel[];
  dueDate?: string | null;
  checklist?: TaskChecklistItem[];
  order?: number;
}

export interface ReorderItem {
  taskId: string;
  order: number;
}

export interface AssignTaskData {
  assignedUserId: string;
}

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