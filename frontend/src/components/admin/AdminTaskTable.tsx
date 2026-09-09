"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import type { User } from "@/types/user";
import type { PaginationMeta } from "@/types/pagination";
import AdminTaskRow from "./AdminTaskRow";
import ReassignTaskModal from "./ReassignTaskModal";
import DeleteTaskConfirmModal from "./DeleteTaskConfirmModal";
import Pagination from "@/components/ui/Pagination";

interface AdminTaskTableProps {
  tasks: Task[];
  users: User[];
  onReassignTask: (taskId: string, userId: string) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  pagination?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  title?: string;
  subtitle?: string;
  showViewAllLink?: boolean;
  limit?: number;
}

export default function AdminTaskTable({
  tasks,
  users,
  onReassignTask,
  onUpdateTaskStatus,
  onDeleteTask,
  pagination,
  onPageChange,
  onLimitChange,
  title = "All System Tasks",
  subtitle = "Complete listing of tasks across all projects and users.",
  showViewAllLink = false,
  limit,
}: AdminTaskTableProps) {
  const [reassigningTask, setReassigningTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const displayedTasks = limit ? tasks.slice(0, limit) : tasks;

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden">
      {/* Table Header / Action Bar */}
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
            {displayedTasks.length} {displayedTasks.length === 1 ? "task" : "tasks"}
          </span>

          {showViewAllLink && (
            <Link
              href="/admin/tasks"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {displayedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-gray-800">
              No tasks found
            </p>
            <p className="mt-1 text-xs text-gray-400 max-w-xs">
              There are no tasks matching the selected filters or currently created in the system.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Task
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Creator
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Assigned User
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {displayedTasks.map((task) => (
                <AdminTaskRow
                  key={task._id}
                  task={task}
                  onReassign={(t) => setReassigningTask(t)}
                  onStatusChange={onUpdateTaskStatus}
                  onDelete={(t) => setDeletingTask(t)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && onPageChange && displayedTasks.length > 0 && (
        <Pagination
          pagination={pagination}
          itemCount={displayedTasks.length}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}

      {/* Reassign Modal */}
      <ReassignTaskModal
        open={!!reassigningTask}
        task={reassigningTask}
        users={users}
        onClose={() => setReassigningTask(null)}
        onReassign={onReassignTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTaskConfirmModal
        open={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={onDeleteTask}
      />
    </section>
  );
}