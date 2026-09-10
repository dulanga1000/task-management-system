"use client";

import React from "react";
import { ShieldCheck, User as UserIcon, Calendar, CheckSquare, Pencil, Trash2 } from "lucide-react";
import type { User } from "@/types/user";

interface UserRowProps {
  user: User;
  assignedTasksCount?: number;
  currentUserId?: string;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserRow({
  user,
  assignedTasksCount = 0,
  currentUserId,
  onEdit,
  onDelete,
}: UserRowProps) {
  const isAdmin = user.role === "ADMIN";
  const isCurrentUser = user.id === currentUserId;

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50/70 last:border-0">
      {/* User Info & Avatar */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {user.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt={user.firstName}
              className="h-9 w-9 shrink-0 rounded-xl object-cover ring-2 ring-white shadow-2xs border border-slate-200"
            />
          ) : (
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-2 ring-white shadow-2xs ${
                isAdmin
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {user.firstName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                {user.firstName} {user.lastName}
              </p>
              {isCurrentUser && (
                <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-600/20">
                  You
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              @{user.username}
            </p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 text-xs font-medium text-slate-600">
        {user.email}
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
            isAdmin
              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
              : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
          }`}
        >
          {isAdmin ? (
            <ShieldCheck className="h-3 w-3 text-blue-600" />
          ) : (
            <UserIcon className="h-3 w-3 text-slate-500" />
          )}
          <span>{user.role}</span>
        </span>
      </td>

      {/* Assigned Tasks Workload */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-800">
            {assignedTasksCount} {assignedTasksCount === 1 ? "task" : "tasks"}
          </span>
        </div>
      </td>

      {/* Joined Date */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3 w-3" />
          <span>
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      </td>

      {/* Actions (Only rendered if onEdit or onDelete passed) */}
      {(onEdit || onDelete) && (
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            {/* Standard users can be edited by Admin */}
            {!isAdmin && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(user)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
                title="Edit user details"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            )}

            {/* Standard users can be deleted by Admin; Admins cannot be deleted */}
            {!isAdmin && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(user)}
                className="flex items-center gap-1 rounded-lg border border-red-200/80 bg-red-50/50 px-2.5 py-1 text-xs font-semibold text-red-600 shadow-2xs hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                title="Delete user account"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}