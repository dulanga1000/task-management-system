"use client";

import React, { useState } from "react";
import {Clock,User as UserIcon,UserCheck,Pencil,Trash2,MoreVertical,Circle,CheckCircle2} from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";

interface AdminTaskRowProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onReassign: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onDelete: (task: Task) => void;
}

const statusBadgeStyles = {
  TODO: "bg-amber-50 text-amber-700 border-amber-200/80",
  DOING: "bg-blue-50 text-blue-700 border-blue-200/80",
  DONE: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "In Progress",
  DONE: "Done",
};

export default function AdminTaskRow({
  task,
  onEdit,
  onReassign,
  onStatusChange,
  onDelete,
}: AdminTaskRowProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as TaskStatus;
    if (nextStatus === task.status) return;

    try {
      setUpdatingStatus(true);
      await onStatusChange(task._id, nextStatus);
    } catch (err) {
      console.error("Failed to change status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50/70 last:border-0">
      {/* Title & Description */}
      <td className="px-6 py-4">
        <div className="max-w-[280px] sm:max-w-xs">
          <p className="font-semibold text-gray-900 line-clamp-1">
            {task.title}
          </p>
          {task.description && (
            <p className="mt-0.5 text-xs text-gray-400 line-clamp-1 font-normal">
              {task.description}
            </p>
          )}
        </div>
      </td>

      {/* Creator */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {task.creator?.profilePicture?.url ? (
            <img
              src={task.creator.profilePicture.url}
              alt={task.creator.firstName}
              className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 ring-1 ring-gray-200">
              {task.creator?.firstName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-800">
              {task.creator?.firstName} {task.creator?.lastName}
            </p>
            <p className="text-[10px] text-gray-400">
              @{task.creator?.username}
            </p>
          </div>
        </div>
      </td>

      {/* Assigned To */}
      <td className="px-6 py-4">
        {task.assignedUser ? (
          <div className="flex items-center gap-2">
            {task.assignedUser.profilePicture?.url ? (
              <img
                src={task.assignedUser.profilePicture.url}
                alt={task.assignedUser.firstName}
                className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-blue-600/20"
              />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700 ring-1 ring-blue-600/20">
                {task.assignedUser.firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {task.assignedUser.firstName} {task.assignedUser.lastName}
              </p>
              <p className="text-[10px] text-slate-400">
                {task.assignedUser.email}
              </p>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            <UserIcon className="h-3 w-3 text-slate-400" />
            Unassigned
          </span>
        )}
      </td>

      {/* Status Selector */}
      <td className="px-6 py-4">
        <div className="relative inline-block">
          <select
            value={task.status}
            onChange={handleStatusSelect}
            disabled={updatingStatus}
            aria-label="Update task status"
            className={`rounded-lg border px-2.5 py-1 text-xs font-bold outline-none transition-all cursor-pointer ${
              statusBadgeStyles[task.status]
            } ${updatingStatus ? "opacity-50" : ""}`}
          >
            <option value="TODO">To Do</option>
            <option value="DOING">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </td>

      {/* Created Date */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          <span>
            {new Date(task.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </td>

      {/* Action Buttons */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Edit Button */}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
              title="Edit task details"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          )}

          {/* Reassign Button */}
          <button
            type="button"
            onClick={() => onReassign(task)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer"
            title="Reassign to another user"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Reassign</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
