export type AttachmentType = "IMAGE" | "PDF";

export interface AttachmentUploader {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
}

export interface Attachment {
  _id: string;
  task: string;
  originalName: string;
  storageKey: string;
  bucket: string;
  mimeType: string;
  size: number;
  type: AttachmentType;
  uploadedBy: AttachmentUploader;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttachmentsResponse {
  success: boolean;
  message: string;
  data: {
    attachments: Attachment[];
  };
}

export interface AttachmentResponse {
  success: boolean;
  message: string;
  data: {
    attachment: Attachment;
  };
}
