"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import type { User } from "@/types/user";
import type { Task } from "@/types/task";
import type { PaginationMeta } from "@/types/pagination";
import UserRow from "./UserRow";
import Pagination from "@/components/ui/Pagination";

interface UserTableProps {
  users: User[];
  tasks?: Task[];
  pagination?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  currentUserId?: string;
  title?: string;
  subtitle?: string;
  showViewAllLink?: boolean;
  limit?: number;
}

export default function UserTable({
  users,
  tasks = [],
  pagination,
  onPageChange,
  onLimitChange,
  onEditUser,
  onDeleteUser,
  currentUserId,
  title = "Registered Users",
  subtitle = "All accounts registered within this system workspace.",
  showViewAllLink = false,
  limit,
}: UserTableProps) {
  const displayedUsers = limit ? users.slice(0, limit) : users;
  const hasActions = !!(onEditUser || onDeleteUser);

  // Build task count lookup map by assigned user id
  const taskCountMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tasks) {
      if (t.assignedUser?._id) {
        map.set(t.assignedUser._id, (map.get(t.assignedUser._id) || 0) + 1);
      }
    }
    return map;
  }, [tasks]);

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {displayedUsers.length}{" "}
            {displayedUsers.length === 1 ? "user" : "users"}
          </span>

          {showViewAllLink && (
            <Link
              href="/admin/users"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        {displayedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-gray-800">
              No users found
            </p>
            <p className="mt-1 text-xs text-gray-400 max-w-xs">
              No registered user accounts match your criteria.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Assigned Workload
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Joined Date
                </th>
                {hasActions && (
                  <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {displayedUsers.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  assignedTasksCount={taskCountMap.get(u.id) || 0}
                  currentUserId={currentUserId}
                  onEdit={onEditUser}
                  onDelete={onDeleteUser}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && onPageChange && displayedUsers.length > 0 && (
        <Pagination
          pagination={pagination}
          itemCount={displayedUsers.length}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </section>
  );
}