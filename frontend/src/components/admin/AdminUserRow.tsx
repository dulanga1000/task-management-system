"use client";

import React from "react";
import { ShieldCheck, User as UserIcon, Calendar, CheckSquare } from "lucide-react";
import type { User } from "@/types/user";

interface AdminUserRowProps {
  user: User;
  assignedTasksCount?: number;
}

export default function AdminUserRow({
  user,
  assignedTasksCount = 0,
}: AdminUserRowProps) {
  const isAdmin = user.role === "ADMIN";

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50/70 last:border-0">
      {/* User Info & Avatar */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {user.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt={user.firstName}
              className="h-9 w-9 shrink-0 rounded-xl object-cover ring-2 ring-white shadow-xs border border-slate-200"
            />
          ) : (
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-2 ring-white shadow-xs ${
                isAdmin
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.firstName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900 text-xs sm:text-sm">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              @{user.username}
            </p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 text-xs font-medium text-gray-600">
        {user.email}
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
            isAdmin
              ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20"
              : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
          }`}
        >
          {isAdmin ? (
            <ShieldCheck className="h-3 w-3 text-purple-600" />
          ) : (
            <UserIcon className="h-3 w-3 text-gray-500" />
          )}
          <span>{user.role}</span>
        </span>
      </td>

      {/* Assigned Tasks Workload */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <CheckSquare className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-800">
            {assignedTasksCount} {assignedTasksCount === 1 ? "task" : "tasks"}
          </span>
        </div>
      </td>

      {/* Joined Date */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
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
    </tr>
  );
}
