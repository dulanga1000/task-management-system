"use client";

import React, { useState, useRef } from "react";
import type { User } from "@/types/user";
import { uploadProfilePicture, deleteProfilePicture } from "@/services/user.service";
import { Camera, Trash2, Upload, X, Loader2 } from "lucide-react";

interface ProfilePictureManagerProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfilePictureManager: React.FC<ProfilePictureManagerProps> = ({
  user,
  onUpdateUser,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (user.username || "U").slice(0, 2).toUpperCase();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type.toLowerCase();
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedMimes.includes(mime) && (!ext || !allowedExts.includes(ext))) {
      setError("Unsupported image format. Please select a JPG, PNG, or WEBP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture size exceeds the 5 MB limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setShowModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);
      const res = await uploadProfilePicture(selectedFile);
      onUpdateUser(res.data.user);
      handleCloseModal();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to upload profile picture.");
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!user.profilePicture) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);
      const res = await deleteProfilePicture();
      onUpdateUser(res.data.user);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to delete profile picture.");
      setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Avatar Display */}
        <div className="relative group shrink-0">
          {user.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-20 w-20 rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-gray-200/80"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-md shadow-blue-500/20">
              {initials}
            </div>
          )}

          {/* Hover overlay button to trigger file picker */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Change photo"
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-950/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* User Info & Photo Action Buttons */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <span className="text-xs font-medium text-gray-400">
              @{user.username}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>

          {/* Photo Action Buttons */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-gray-500" />
              <span>{user.profilePicture ? "Change photo" : "Upload photo"}</span>
            </button>

            {user.profilePicture && (
              <button
                type="button"
                onClick={handleDeletePhoto}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Remove</span>
              </button>
            )}
          </div>

          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* Image Preview & Upload Confirmation Modal */}
      {showModal && previewUrl && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Update Profile Picture
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={uploading}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error in modal */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Preview Image Card */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50/80 border border-gray-100">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-32 rounded-2xl object-cover shadow-lg border-2 border-white ring-2 ring-blue-500/30"
              />
              <p className="mt-3 text-xs font-semibold text-gray-800 truncate max-w-xs">
                {selectedFile?.name}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {selectedFile ? formatFileSize(selectedFile.size) : ""}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={uploading}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 cursor-pointer transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Save Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
