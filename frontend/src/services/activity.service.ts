import api from "./api";
import type {
  TaskActivity,
  ActivitiesResponse,
  AddCommentResponse,
} from "@/types/activity";

export const getTaskActivities = async (
  taskId: string
): Promise<TaskActivity[]> => {
  const response = await api.get<ActivitiesResponse>(
    `/tasks/${taskId}/activities`
  );
  return response.data.data || [];
};

export const addTaskComment = async (
  taskId: string,
  comment: string
): Promise<TaskActivity> => {
  const response = await api.post<AddCommentResponse>(
    `/tasks/${taskId}/activities/comments`,
    { comment }
  );
  return response.data.data;
};
