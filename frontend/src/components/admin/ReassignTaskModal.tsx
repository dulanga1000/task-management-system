"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, UserX, X, AlertCircle } from "lucide-react";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

interface ReassignTaskModalProps {
  task: Task | null;
  users: User[];
  open: boolean;
  onClose: () => void;
  onReassign: (taskId: string, userId: string) => Promise<void>;
  currentUserId?: string;
}

export default function ReassignTaskModal({
  task,
  users,
  open,
  onClose,
  onReassign,
  currentUserId,
}: ReassignTaskModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setSelectedUserId(task.assignedUser?._id || "");
    } else {
      setSelectedUserId("");
    }
    setError("");
  }, [task, open]);

  if (!open || !task) {
    return null;
  }

  const currentAssignee = task.assignedUser;

  // Allow assignment to any registered account (including Admin themselves)
  const eligibleUsers = users;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      setError("Please select a user to assign this task to.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await onReassign(task._id, selectedUserId);

      setSelectedUserId("");
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to reassign task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Reassign Task
              </h2>
              <p className="text-xs text-slate-500">
                Allocate this task to any registered team member.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Summary Banner */}
        <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Task Subject
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">
            {task.title}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5 text-xs">
            <span className="text-slate-500 font-medium">Current Assignee:</span>
            {currentAssignee ? (
              <span className="font-semibold text-slate-800">
                {currentAssignee.firstName} {currentAssignee.lastName}
                {currentAssignee._id === currentUserId ? " (You)" : ""}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/60">
                <UserX className="h-3 w-3" />
                Unassigned
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="assignedUserSelect"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Select New Assignee
            </label>

            <select
              id="assignedUserSelect"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">-- Choose a team member --</option>
              {eligibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.email}){u.id === currentUserId ? " (You)" : u.role === "ADMIN" ? " (Admin)" : ""}
                </option>
              ))}
            </select>

            {currentUserId && selectedUserId !== currentUserId && currentAssignee?._id !== currentUserId && (
              <button
                type="button"
                onClick={() => setSelectedUserId(currentUserId)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Assign to myself</span>
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-9 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !selectedUserId}
              className="flex h-9 items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? "Reassigning..." : "Confirm Reassignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}