"use client";

import React from "react";
import { Clock, MoreHorizontal, UserPlus, Paperclip, AlignLeft, CheckSquare } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onAssign?: () => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  canDrag?: boolean;
  className?: string;
}

export default function TaskCard({
  task,
  onClick,
  onAssign,
  isDragging,
  isOverlay,
  canDrag = true,
  className = "",
}: TaskCardProps) {
  if (isDragging) {
    return (
      <div
        className={`w-full min-h-[110px] rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 transition-all ${className}`}
      />
    );
  }

  // Strip HTML tags for clean text check
  const cleanDesc = task.description
    ? task.description.replace(/<[^>]*>?/gm, "").trim()
    : "";

  const checklistTotal = task.checklist?.length || 0;
  const checklistCompleted =
    task.checklist?.filter((i) => i.completed).length || 0;

  // Assigned user initials (e.g. "DB")
  const assigneeInitials = task.assignedUser
    ? task.assignedUser.firstName && task.assignedUser.lastName
      ? `${task.assignedUser.firstName[0]}${task.assignedUser.lastName[0]}`.toUpperCase()
      : task.assignedUser.firstName.charAt(0).toUpperCase()
    : null;

  return (
    <div
      onClick={onClick}
      className={`group relative w-full select-none rounded-xl border border-gray-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 ${
        isOverlay
          ? "cursor-grabbing rotate-2 scale-105 shadow-2xl ring-2 ring-primary/40 border-transparent bg-white/95 backdrop-blur-md"
          : "cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md"
      } ${className}`}
    >
      {/* Cover Image Preview (Trello style) */}
      {task.coverImageUrl && (
        <div className="-mx-4 -mt-4 mb-3 overflow-hidden rounded-t-xl bg-gray-100 border-b border-gray-100">
          <img
            src={task.coverImageUrl}
            alt={task.title}
            className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

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
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug">
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

      {/* Badges and Footer Row */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-2.5">
        <div className="flex flex-wrap items-center gap-2.5 text-gray-400">
          {/* Description Indicator (≡) */}
          {cleanDesc && (
            <div
              className="flex items-center text-gray-500 hover:text-gray-700"
              title="This card has a description"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </div>
          )}

          {/* Attachment Indicator (attachment count) */}
          {typeof task.attachmentCount === "number" && task.attachmentCount > 0 && (
            <div
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
              title={`${task.attachmentCount} attachment${
                task.attachmentCount > 1 ? "s" : ""
              }`}
            >
              <Paperclip className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold text-gray-600">
                {task.attachmentCount}
              </span>
            </div>
          )}

          {/* Checklist Badge */}
          {checklistTotal > 0 && (
            <div
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                checklistCompleted === checklistTotal
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
              title="Checklist progress"
            >
              <CheckSquare className="h-3 w-3" />
              <span>
                {checklistCompleted}/{checklistTotal}
              </span>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div
              className="flex items-center gap-1 text-gray-400"
              title="Due date"
            >
              <Clock className="h-3 w-3" />
              <span className="text-[11px] font-medium">
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Assigned User Avatar or Quick Assign */}
        {task.assignedUser ? (
          task.assignedUser.profilePicture?.url ? (
            <img
              src={task.assignedUser.profilePicture.url}
              alt={task.assignedUser.firstName}
              className="h-6 w-6 shrink-0 rounded-full object-cover ring-2 ring-white shadow-xs"
              title={`Assigned to ${task.assignedUser.firstName} ${
                task.assignedUser.lastName || ""
              }`}
            />
          ) : (
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white shadow-xs"
              title={`Assigned to ${task.assignedUser.firstName} ${
                task.assignedUser.lastName || ""
              }`}
            >
              {assigneeInitials}
            </div>
          )
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
            <span>Assign</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
