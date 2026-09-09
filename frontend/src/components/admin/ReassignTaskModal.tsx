"use client";

import { useState } from "react";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

interface ReassignTaskModalProps {
  task: Task | null;
  users: User[];
  open: boolean;
  onClose: () => void;
  onReassign: (
    taskId: string,
    userId: string
  ) => Promise<void>;
}

export default function ReassignTaskModal({
  task,
  users,
  open,
  onClose,
  onReassign,
}: ReassignTaskModalProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !task) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await onReassign(task._id, selectedUserId);

      setSelectedUserId("");
      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Failed to reassign task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              Reassign Task
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Assign this task to another user.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Task
          </p>

          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-950">
              {task.title}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="assignedUser"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Assign to
          </label>

          <select
            id="assignedUser"
            value={selectedUserId}
            onChange={(event) =>
              setSelectedUserId(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select a user
            </option>

            {users
              .filter((user) => user.role === "USER")
              .map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.firstName} {user.lastName} —{" "}
                  {user.email}
                </option>
              ))}
          </select>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Reassigning..." : "Reassign Task"}
          </button>
        </div>
      </div>
    </div>
  );
}