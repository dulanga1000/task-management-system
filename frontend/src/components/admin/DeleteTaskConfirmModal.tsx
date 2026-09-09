"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import type { Task } from "@/types/task";

interface DeleteTaskConfirmModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void>;
}

export default function DeleteTaskConfirmModal({
  task,
  open,
  onClose,
  onConfirm,
}: DeleteTaskConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !task) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");
      await onConfirm(task._id);
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to delete task. Please try again."
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-950">
                Delete Task
              </h2>
              <p className="text-xs text-gray-400">
                This action is permanent and cannot be undone.
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

        {/* Task Name Box */}
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>You are about to permanently delete:</span>
          </div>
          <p className="mt-2 text-sm font-bold text-gray-900 line-clamp-2">
            {task.title}
          </p>
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Footer Actions */}
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
            onClick={handleDelete}
            disabled={deleting}
            className="h-9 rounded-xl bg-red-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            {deleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
