"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  CollisionDetection,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import type { Task, TaskStatus, UpdateTaskData } from "@/types/task";
import BoardColumn from "./BoardColumn";
import TaskCard from "./TaskCard";

interface BoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate?: (taskId: string, data: UpdateTaskData) => Promise<void>;
  onTaskAssign?: (taskId: string) => Promise<void>;
}

const columns: {
  title: string;
  status: TaskStatus;
}[] = [
  {
    title: "To Do",
    status: "TODO",
  },
  {
    title: "In Progress",
    status: "DOING",
  },
  {
    title: "Done",
    status: "DONE",
  },
];

export default function Board({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onTaskAssign,
}: BoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Multi-container collision detection strategy
  const customCollisionDetection: CollisionDetection = (args) => {
    // 1. Check direct pointer intersection
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // 2. Check bounding box intersection
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      return rectCollisions;
    }

    // 3. Fallback to closest corners
    return closestCorners(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task =
      tasks.find((t) => t._id === active.id) ||
      (active.data.current?.task as Task | undefined);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // If dropped on itself, no action needed
    if (activeId === overId) return;

    const currentTask =
      tasks.find((t) => t._id === activeId) ||
      (active.data.current?.task as Task | undefined);

    if (!currentTask) return;

    // Resolve target status:
    // Case 1: overId is a column status ("TODO" | "DOING" | "DONE")
    // Case 2: over.data.current is a Column
    // Case 3: overId is another task id or over.data.current is a Task
    let targetStatus: TaskStatus | null = null;

    if (["TODO", "DOING", "DONE"].includes(overId)) {
      targetStatus = overId as TaskStatus;
    } else if (over.data.current?.type === "Column") {
      targetStatus = over.data.current.status as TaskStatus;
    } else {
      const overTask =
        tasks.find((t) => t._id === overId) ||
        (over.data.current?.task as Task | undefined);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    // If status changed and update handler exists, trigger update
    if (targetStatus && currentTask.status !== targetStatus && onTaskUpdate) {
      await onTaskUpdate(activeId, { status: targetStatus });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row items-start gap-6 pb-6 overflow-x-auto min-h-[600px]">
        {columns.map((column) => (
          <BoardColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={tasks.filter((task) => task.status === column.status)}
            onTaskClick={onTaskClick}
            onTaskAssign={onTaskAssign}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeTask ? (
          <div className="w-[320px] max-w-full">
            <TaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}