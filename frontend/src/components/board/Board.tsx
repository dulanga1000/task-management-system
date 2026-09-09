"use client";

import type { Task, TaskStatus } from "@/types/task";

import BoardColumn from "./BoardColumn";

interface BoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
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
}: BoardProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-950">
            My Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your work and track your progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {columns.map((column) => (
          <BoardColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={tasks.filter(
              (task) => task.status === column.status
            )}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </section>
  );
}