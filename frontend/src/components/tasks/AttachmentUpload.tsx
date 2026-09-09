"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";

interface AttachmentUploadProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  onUpload,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const [uploadingFileSize, setUploadingFileSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUploadFile = async (file: File) => {
    setError(null);
    const mime = file.type.toLowerCase();
    const ext = file.name.split(".").pop()?.toLowerCase();

    const allowedImageExts = ["jpg", "jpeg", "png", "webp"];
    const isImage =
      mime.startsWith("image/") || (ext && allowedImageExts.includes(ext));
    const isPdf = mime === "application/pdf" || ext === "pdf";

    if (!isImage && !isPdf) {
      setError("Unsupported format. Please select a PNG, JPG, WEBP, or PDF.");
      return;
    }

    if (isImage && file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5 MB limit.");
      return;
    }

    if (isPdf && file.size > 10 * 1024 * 1024) {
      setError("PDF size exceeds 10 MB limit.");
      return;
    }

    try {
      setUploading(true);
      setUploadingFileName(file.name);
      setUploadingFileSize(file.size);
      await onUpload(file);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to upload file.");
      setError(msg);
    } finally {
      setUploading(false);
      setUploadingFileName(null);
      setUploadingFileSize(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {/* Auto-uploading or Drag-and-Drop Area */}
      {uploading ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/60 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            {uploadingFileName?.toLowerCase().endsWith(".pdf") ? (
              <FileText className="w-5 h-5 text-rose-500" />
            ) : (
              <ImageIcon className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {uploadingFileName}
            </p>
            <p className="text-[11px] text-gray-500">
              {uploadingFileSize ? formatFileSize(uploadingFileSize) : "Processing..."}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            disabled
              ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
              : isDragOver
              ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
              : "border-gray-200 hover:border-blue-400 hover:bg-gray-50/70"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-gray-800">
            Click to select or drag & drop evidence to upload automatically
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Images (PNG, JPG, WEBP up to 5MB) • Documents (PDF up to 10MB)
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-xs text-red-600 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 text-sm font-semibold cursor-pointer px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
