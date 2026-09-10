import api from "./api";
import type {Attachment,AttachmentsResponse,AttachmentResponse} from "@/types/attachment";

export const getTaskAttachments = async (
  taskId: string
): Promise<Attachment[]> => {
  const response = await api.get<AttachmentsResponse>(
    `/tasks/${taskId}/attachments`
  );
  return response.data.data.attachments;
};

export const uploadTaskAttachment = async (
  taskId: string,
  file: File
): Promise<Attachment> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<AttachmentResponse>(
    `/tasks/${taskId}/attachments`,
    formData
  );

  return response.data.data.attachment;
};

export const deleteTaskAttachment = async (
  taskId: string,
  attachmentId: string
): Promise<void> => {
  await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
};

export interface AttachmentUrlResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    expiresIn: number;
  };
}

export const getTaskAttachmentSignedUrl = async (
  taskId: string,
  attachmentId: string
): Promise<string> => {
  const response = await api.get<AttachmentUrlResponse>(
    `/tasks/${taskId}/attachments/${attachmentId}/url`
  );
  return response.data.data.url;
};
