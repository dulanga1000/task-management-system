"use client";

import { FormEvent, useEffect, useState } from "react";

import type {
  CreateTaskData,
  Task,
  TaskStatus,
  UpdateTaskData,
} from "@/types/task";
import type { User } from "@/types/user";

interface TaskModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;

  onCreate: (
    data: CreateTaskData,
    assignedUserId?: string
  ) => Promise<unknown>;

  onUpdate?: (
    taskId: string,
    data: UpdateTaskData
  ) => Promise<unknown>;

  onDelete?: (
    taskId: string
  ) => Promise<unknown>;

  onAssign?: (
    taskId: string,
    assignedUserId?: string
  ) => Promise<unknown>;

  currentUserId?: string;
  users?: User[];
}

export default function TaskModal({
  open,
  task,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onAssign,
  currentUserId,
  users,
}: TaskModalProps) {
  const isEditing = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<TaskStatus>("TODO");
  const [assignedUserId, setAssignedUserId] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const eligibleUsers = users || [];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setAssignedUserId(task.assignedUser?._id || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setAssignedUserId("");
    }

    setError("");
  }, [task, open]);

  if (!open) {
    return null;
  }

  const alreadyAssignedToMe =
    task?.assignedUser?._id === currentUserId;

  const isUnassigned = !task?.assignedUser;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (isEditing && task) {
        if (onUpdate) {
          await onUpdate(task._id, {
            title,
            description,
            status,
          });
        }

        // If assignee was changed or assigned by Admin
        const previousAssignedId = task.assignedUser?._id || "";
        if (assignedUserId !== previousAssignedId && onAssign) {
          if (assignedUserId) {
            await onAssign(task._id, assignedUserId);
          }
        }
      } else {
        await onCreate(
          {
            title,
            description,
          },
          assignedUserId || undefined
        );
      }

      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !onDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await onDelete(task._id);

      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Failed to delete task."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleAssign = async () => {
    if (!task || !onAssign) return;

    try {
      setAssigning(true);
      setError("");

      await onAssign(task._id);

      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Failed to assign task."
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/40 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-950">
              {isEditing
                ? "Task details"
                : "Create task"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "View and manage this task."
                : "Create a new task for your workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              minLength={2}
              maxLength={200}
              required
              className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={5}
              maxLength={2000}
              required
              className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Assignee Selection (When creating task as Admin) */}
          {!isEditing && eligibleUsers.length > 0 && (
            <div>
              <label
                htmlFor="create-task-assignee"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Assign To (Optional)
              </label>

              <select
                id="create-task-assignee"
                value={assignedUserId}
                onChange={(event) =>
                  setAssignedUserId(event.target.value)
                }
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="">-- Unassigned --</option>
                {eligibleUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} (@{u.username}){u.id === currentUserId ? " (You)" : u.role === "ADMIN" ? " (Admin)" : ""}
                  </option>
                ))}
              </select>

              {currentUserId && assignedUserId !== currentUserId && (
                <button
                  type="button"
                  onClick={() => setAssignedUserId(currentUserId)}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>⚡ Assign to myself</span>
                </button>
              )}
            </div>
          )}

          {/* Status */}
          {isEditing && (
            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as TaskStatus
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="TODO">To Do</option>
                <option value="DOING">
                  In Progress
                </option>
                <option value="DONE">Done</option>
              </select>
            </div>
          )}

          {/* Assignment */}
          {isEditing && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Assignment
                </p>
                {task.assignedUser && eligibleUsers.length > 0 && (
                  <span className="text-xs text-gray-500">
                    Currently: <strong className="text-gray-800 font-semibold">{task.assignedUser.firstName} {task.assignedUser.lastName}</strong>
                  </span>
                )}
              </div>

              {eligibleUsers.length > 0 ? (
                <div className="mt-3">
                  <label
                    htmlFor="edit-task-assignee"
                    className="mb-1.5 block text-xs font-medium text-gray-700"
                  >
                    Assignee
                  </label>
                  <select
                    id="edit-task-assignee"
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="">-- Unassigned --</option>
                    {eligibleUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} (@{u.username}){u.id === currentUserId ? " (You)" : u.role === "ADMIN" ? " (Admin)" : ""}
                      </option>
                    ))}
                  </select>

                  {currentUserId && assignedUserId !== currentUserId && (
                    <button
                      type="button"
                      onClick={() => setAssignedUserId(currentUserId)}
                      className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>⚡ Assign to myself</span>
                    </button>
                  )}
                </div>
              ) : task.assignedUser ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {task.assignedUser.firstName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {task.assignedUser.firstName}{" "}
                      {task.assignedUser.lastName}
                    </p>

                    <p className="text-xs text-gray-500">
                      @{task.assignedUser.username}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      This task is unassigned
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      You can assign it to yourself.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={assigning}
                    className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold !text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                  >
                    {assigning
                      ? "Assigning..."
                      : "Assign to me"}
                  </button>
                </div>
              )}

              {alreadyAssignedToMe && !eligibleUsers.length && (
                <p className="mt-3 text-xs font-medium text-green-600">
                  ✓ Assigned to you
                </p>
              )}

              {!isUnassigned &&
                !alreadyAssignedToMe &&
                !eligibleUsers.length && (
                  <p className="mt-3 text-xs text-gray-500">
                    This task is assigned to another user.
                  </p>
                )}
            </div>
          )}

          {/* Metadata */}
          {isEditing && task && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400">
                  Created
                </p>

                <p className="mt-1 font-medium text-gray-700">
                  {new Date(
                    task.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-gray-400">
                  Created by
                </p>

                <p className="mt-1 font-medium text-gray-700">
                  {task.creator
                    ? `${task.creator.firstName || ""} ${task.creator.lastName || ""}`.trim() ||
                      `@${task.creator.username}`
                    : "Former Member"}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-5">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete task"}
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-semibold !text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Save changes"
                    : "Create task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}