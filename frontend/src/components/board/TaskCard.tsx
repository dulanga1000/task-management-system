"use client";

import React from "react";
import { Clock, MoreHorizontal, User as UserIcon, UserPlus } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onAssign?: () => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  className?: string;
}

export default function TaskCard({
  task,
  onClick,
  onAssign,
  isDragging,
  isOverlay,
  className = "",
}: TaskCardProps) {
  if (isDragging) {
    return (
      <div
        className={`w-full min-h-[110px] rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 transition-all ${className}`}
      />
    );
  }

  // Strip HTML tags for clean text preview
  const cleanDesc = task.description ? task.description.replace(/<[^>]*>?/gm, "").trim() : "";

  const checklistTotal = task.checklist?.length || 0;
  const checklistCompleted = task.checklist?.filter((i) => i.completed).length || 0;

  return (
    <div
      onClick={onClick}
      className={`group relative w-full select-none rounded-xl border border-gray-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 ${
        isOverlay
          ? "cursor-grabbing rotate-2 scale-105 shadow-2xl ring-2 ring-primary/40 border-transparent bg-white/95 backdrop-blur-md"
          : "cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md"
      } ${className}`}
    >
      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((lbl) => (
            <span
              key={lbl.name}
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${lbl.color}`}
            >
              {lbl.name}
            </span>
          ))}
        </div>
      )}

      {/* Card Header: Title & Actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {task.title}
        </h3>

        <button
          type="button"
          aria-label="Task options"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="shrink-0 rounded-md p-1 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100 cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Clean Description Snippet */}
      {cleanDesc && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500 font-normal">
          {cleanDesc}
        </p>
      )}

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        {/* Date / Due Date / Checklist */}
        <div className="flex items-center gap-2 text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-[11px] font-medium">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : new Date(task.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
            </span>
          </div>

          {checklistTotal > 0 && (
            <div
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                checklistCompleted === checklistTotal
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
              title="Checklist progress"
            >
              <span>☑️</span>
              <span>
                {checklistCompleted}/{checklistTotal}
              </span>
            </div>
          )}
        </div>

        {/* Assigned User Avatar or Quick Assign Button */}
        {task.assignedUser ? (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-2 ring-white shadow-xs"
            title={`Assigned to ${task.assignedUser.firstName} ${task.assignedUser.lastName || ""}`}
          >
            {task.assignedUser.firstName.charAt(0).toUpperCase()}
          </div>
        ) : onAssign ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAssign();
            }}
            className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-xs"
            title="Assign task to me"
          >
            <UserPlus className="h-3 w-3" />
            <span>Assign to me</span>
          </button>
        ) : (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-2 ring-white"
            title="Unassigned"
          >
            <UserIcon className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
}
