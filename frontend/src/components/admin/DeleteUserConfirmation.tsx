"use client";

import React, { useState } from "react";
import { AlertTriangle, X, AlertCircle } from "lucide-react";
import type { User } from "@/types/user";

interface DeleteUserConfirmationProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
}

export default function DeleteUserConfirmation({
  open,
  user,
  onClose,
  onConfirm,
}: DeleteUserConfirmationProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !user) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      setError("");

      await onConfirm(user.id);

      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete user account. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-950">
                Delete User Account
              </h2>
              <p className="text-xs text-gray-400">
                Destructive administrative action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="mt-5 rounded-xl border border-gray-200/80 bg-gray-50/80 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700">
              {user.firstName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {user.email} (@{user.username})
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold text-amber-950">
            Warning: This action cannot be undone.
          </p>
          <p className="mt-1 text-amber-800">
            This will permanently delete this user. Their assigned tasks will become unassigned.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-9 rounded-xl border border-gray-200 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex h-9 items-center justify-center rounded-xl bg-red-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            {deleting ? "Deleting User..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
