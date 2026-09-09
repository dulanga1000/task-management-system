"use client";

import { useState } from "react";
import {DndContext,DragOverlay,pointerWithin,rectIntersection,closestCorners,KeyboardSensor,PointerSensor,useSensor,useSensors,DragStartEvent,DragEndEvent,CollisionDetection} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Task, TaskStatus, UpdateTaskData } from "@/types/task";
import BoardColumn from "./BoardColumn";
import TaskCard from "./TaskCard";

interface BoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate?: (taskId: string, data: UpdateTaskData) => Promise<void>;
  onTaskAssign?: (taskId: string) => Promise<void>;
  onReorderTasks?: (tasks: Task[]) => Promise<void> | void;
  onError?: (message: string) => void;
  currentUserId?: string;
  isAdmin?: boolean;
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
  onReorderTasks,
  onError,
  currentUserId,
  isAdmin = false,
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

  const canDragTask = (task: Task) => {
    if (isAdmin) return true;
    const assignedId =
      task.assignedUser?._id ||
      (typeof task.assignedUser === "string" ? task.assignedUser : null);
    return !!currentUserId && assignedId === currentUserId;
  };

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
    if (!task) return;
    setActiveTask(task);
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

    if (!canDragTask(currentTask)) {
      // Revert automatically to original place & alert user visibly
      onError?.("You do not have permission to update this task");
      return;
    }

    // Resolve target status:
    // Case 1: overId is a column status ("TODO" | "DOING" | "DONE")
    // Case 2: over.data.current is a Column
    // Case 3: overId is another task id or over.data.current is a Task
    let targetStatus: TaskStatus | null = null;
    let overTask: Task | null = null;

    if (["TODO", "DOING", "DONE"].includes(overId)) {
      targetStatus = overId as TaskStatus;
    } else if (over.data.current?.type === "Column") {
      targetStatus = over.data.current.status as TaskStatus;
    } else {
      overTask =
        tasks.find((t) => t._id === overId) ||
        (over.data.current?.task as Task | undefined) ||
        null;
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (!targetStatus) return;

    // SCENARIO 1: Same column reorder (dragging up / down within same column)
    if (currentTask.status === targetStatus) {
      if (overTask && overTask._id !== currentTask._id) {
        const oldIndex = tasks.findIndex((t) => t._id === activeId);
        const newIndex = tasks.findIndex((t) => t._id === overId);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = arrayMove(tasks, oldIndex, newIndex);
          await onReorderTasks?.(reordered);
        }
      }
      return;
    }

    // SCENARIO 2: Cross column move (status changed)
    const updatedTask = { ...currentTask, status: targetStatus };
    const remainingTasks = tasks.filter((t) => t._id !== activeId);

    let newTasks: Task[];
    if (overTask) {
      const overIndex = remainingTasks.findIndex((t) => t._id === overId);
      if (overIndex !== -1) {
        remainingTasks.splice(overIndex, 0, updatedTask);
        newTasks = remainingTasks;
      } else {
        newTasks = [...remainingTasks, updatedTask];
      }
    } else {
      newTasks = [...remainingTasks, updatedTask];
    }

    // Update order locally & persist
    await onReorderTasks?.(newTasks);

    // Trigger status update
    if (onTaskUpdate) {
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
            currentUserId={currentUserId}
            isAdmin={isAdmin}
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