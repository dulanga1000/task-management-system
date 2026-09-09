"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Attachment } from "@/types/attachment";
import {getTaskAttachments,uploadTaskAttachment,deleteTaskAttachment} from "@/services/attachment.service";
import { AttachmentUpload } from "./AttachmentUpload";
import { AttachmentItem } from "./AttachmentItem";
import { Paperclip, Image as ImageIcon, FileText, X } from "lucide-react";

interface AttachmentSectionProps {
  taskId: string;
  currentUserId?: string;
  isAdmin?: boolean;
  canManageTask?: boolean;
  onAttachmentChange?: () => void;
}

export const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  taskId,
  currentUserId,
  isAdmin = false,
  canManageTask = true,
  onAttachmentChange,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<Attachment | null>(null);

  const fetchAttachments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTaskAttachments(taskId);
      setAttachments(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load attachments.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      fetchAttachments();
    }
  }, [taskId, fetchAttachments]);

  const handleUpload = async (file: File) => {
    const newAttachment = await uploadTaskAttachment(taskId, file);
    setAttachments((prev) => [newAttachment, ...prev]);
    onAttachmentChange?.();
  };

  const handleDelete = async (attachmentId: string) => {
    await deleteTaskAttachment(taskId, attachmentId);
    setAttachments((prev) => prev.filter((a) => a._id !== attachmentId));
    onAttachmentChange?.();
  };

  const images = attachments.filter((a) => a.type === "IMAGE");
  const pdfs = attachments.filter((a) => a.type === "PDF");

  const canDeleteAttachment = (att: Attachment) => {
    if (isAdmin) return true;
    if (currentUserId && att.uploadedBy?._id === currentUserId) return true;
    return false;
  };

  return (
    <div className="border-t border-gray-100 pt-5 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-gray-900">
            Attachments & Evidence
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
            {attachments.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      {canManageTask && (
        <AttachmentUpload onUpload={handleUpload} disabled={loading} />
      )}

      {/* Attachments Display */}
      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading attachments...</span>
        </div>
      ) : attachments.length === 0 ? (
        <div className="py-4 text-center rounded-xl bg-gray-50/50 border border-gray-100 text-xs text-gray-400">
          No attachments or evidence uploaded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Images Section */}
          {images.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Images ({images.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img) => (
                  <AttachmentItem
                    key={img._id}
                    attachment={img}
                    canDelete={canDeleteAttachment(img)}
                    onDelete={handleDelete}
                    onPreviewImage={(att) => setPreviewImage(att)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PDF Documents Section */}
          {pdfs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>PDF Documents ({pdfs.length})</span>
              </div>
              <div className="space-y-2">
                {pdfs.map((pdf) => (
                  <AttachmentItem
                    key={pdf._id}
                    attachment={pdf}
                    canDelete={canDeleteAttachment(pdf)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-800/40 flex flex-col"
          >
            <div className="flex items-center justify-between p-3.5 border-b border-gray-100 bg-white">
              <div className="min-w-0 pr-4">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {previewImage.originalName}
                </p>
                <p className="text-[10px] text-gray-400">
                  Uploaded by {previewImage.uploadedBy?.firstName} {previewImage.uploadedBy?.lastName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              {previewImage.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewImage.url}
                  alt={previewImage.originalName}
                  className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
                />
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              {previewImage.url && (
                <a
                  href={previewImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={previewImage.originalName}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
                >
                  Download Original
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
