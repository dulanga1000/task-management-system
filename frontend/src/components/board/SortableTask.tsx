"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface SortableTaskProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onTaskAssign?: (taskId: string) => void;
}

export default function SortableTask({
  task,
  onTaskClick,
  onTaskAssign,
}: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none focus:outline-none"
    >
      <TaskCard
        task={task}
        isDragging={isDragging}
        onClick={() => onTaskClick(task)}
        onAssign={onTaskAssign ? () => onTaskAssign(task._id) : undefined}
      />
    </div>
  );
}
