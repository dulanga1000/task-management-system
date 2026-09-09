"use client";

import React, { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import SortableTask from "./SortableTask";

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskAssign?: (taskId: string) => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

const statusConfig = {
  TODO: {
    icon: Circle,
    color: "text-amber-500",
    bg: "bg-amber-50/50",
    border: "border-amber-200",
    count: "bg-amber-100 text-amber-800 border-amber-200/60",
  },
  DOING: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    count: "bg-blue-100 text-blue-800 border-blue-200/60",
  },
  DONE: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50/50",
    border: "border-emerald-200",
    count: "bg-emerald-100 text-emerald-800 border-emerald-200/60",
  },
};

export default function BoardColumn({
  title,
  status,
  tasks,
  onTaskClick,
  onTaskAssign,
  currentUserId,
  isAdmin = false,
}: BoardColumnProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const taskIds = useMemo(() => tasks.map((t) => t._id), [tasks]);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "Column",
      status,
    },
  });

  return (
    <div className="flex w-full md:w-80 lg:w-[350px] shrink-0 flex-col rounded-2xl border border-gray-200/70 bg-gray-50/70 backdrop-blur-md shadow-xs">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Icon className={`h-4 w-4 ${config.color}`} />
          <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
        </div>

        <span
          className={`flex h-6 min-w-[24px] items-center justify-center rounded-full border px-2 text-xs font-bold ${config.count}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable Task List Container */}
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 p-3 min-h-[500px] transition-all duration-200 ${
          isOver
            ? "bg-primary/[0.04] ring-2 ring-primary/30 ring-inset rounded-b-2xl"
            : ""
        }`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="pointer-events-none flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-200/80 bg-white/40 p-6">
              <p className="text-xs font-medium text-gray-400">
                Drop tasks here
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const assignedId =
                task.assignedUser?._id ||
                (typeof task.assignedUser === "string"
                  ? task.assignedUser
                  : null);
              const isAssignedToCurrentUser =
                !!currentUserId && assignedId === currentUserId;
              const canDrag = isAdmin || isAssignedToCurrentUser;

              return (
                <SortableTask
                  key={task._id}
                  task={task}
                  canDrag={canDrag}
                  onTaskClick={onTaskClick}
                  onTaskAssign={onTaskAssign}
                />
              );
            })
          )}
        </SortableContext>
      </div>
    </div>
  );
}