"use client";

import React, { useState, useEffect } from "react";
import { Attachment } from "@/types/attachment";
import { getTaskAttachmentSignedUrl } from "@/services/attachment.service";
import { FileText, Download, Trash2, ExternalLink, Eye } from "lucide-react";

interface AttachmentItemProps {
  attachment: Attachment;
  canDelete: boolean;
  onDelete?: (id: string) => Promise<void>;
  onPreviewImage?: (attachment: Attachment) => void;
}

export const AttachmentItem: React.FC<AttachmentItemProps> = ({
  attachment,
  canDelete,
  onDelete,
  onPreviewImage,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(attachment.url);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    setCurrentUrl(attachment.url);
    setHasRefreshed(false);
  }, [attachment.url]);

  const handleImageError = async () => {
    if (hasRefreshed || !attachment.task || !attachment._id) return;
    setHasRefreshed(true);
    try {
      const freshUrl = await getTaskAttachmentSignedUrl(
        attachment.task,
        attachment._id
      );
      if (freshUrl) {
        setCurrentUrl(freshUrl);
      }
    } catch {
      // safe fallback
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;

    if (window.confirm(`Delete "${attachment.originalName}" permanently?`)) {
      try {
        setIsDeleting(true);
        await onDelete(attachment._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const uploaderName = attachment.uploadedBy
    ? `${attachment.uploadedBy.firstName || ""} ${
        attachment.uploadedBy.lastName || ""
      }`.trim() || `@${attachment.uploadedBy.username}`
    : "Unknown";

  if (attachment.type === "IMAGE") {
    return (
      <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all">
        {/* Image Thumbnail Container */}
        <div
          onClick={() => onPreviewImage?.({ ...attachment, url: currentUrl })}
          className="relative h-28 w-full bg-gray-100 overflow-hidden cursor-pointer flex items-center justify-center"
        >
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt={attachment.originalName}
              onError={handleImageError}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-400 text-xs">No preview</div>
          )}

          {/* Hover Overlay with Preview action */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/90 text-gray-800 shadow-sm hover:bg-white transition-colors">
              <Eye className="w-4 h-4" />
            </span>
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-white/90 text-gray-800 shadow-sm hover:bg-white transition-colors"
                title="Open original file"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Content & Metadata */}
        <div className="p-2.5 flex items-center justify-between gap-2 border-t border-gray-100">
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-semibold text-gray-800 truncate"
              title={attachment.originalName}
            >
              {attachment.originalName}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
              <span>{formatFileSize(attachment.size)}</span>
              <span>•</span>
              <span className="truncate">{uploaderName}</span>
            </div>
          </div>

          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Delete attachment"
            >
              {isDeleting ? (
                <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // PDF Document layout
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/70 transition-all shadow-xs gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p
            className="text-xs font-semibold text-gray-900 truncate"
            title={attachment.originalName}
          >
            {attachment.originalName}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
            <span className="font-medium text-rose-600">PDF</span>
            <span>•</span>
            <span>{formatFileSize(attachment.size)}</span>
            <span>•</span>
            <span className="truncate">by {uploaderName}</span>
            {attachment.createdAt && (
              <>
                <span>•</span>
                <span>{formatDate(attachment.createdAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={attachment.originalName}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-[11px] font-semibold text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open</span>
          </a>
        )}

        {canDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Delete PDF"
          >
            {isDeleting ? (
              <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
