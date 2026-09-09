"use client";

import type { Task, TaskStatus } from "@/types/task";

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const statusStyles = {
  TODO: {
    dot: "bg-gray-400",
    count: "bg-gray-100 text-gray-600",
  },
  DOING: {
    dot: "bg-blue-500",
    count: "bg-blue-50 text-blue-600",
  },
  DONE: {
    dot: "bg-green-500",
    count: "bg-green-50 text-green-600",
  },
};

export default function BoardColumn({
  title,
  status,
  tasks,
  onTaskClick,
}: BoardColumnProps) {
  const styles = statusStyles[status];

  return (
    <div className="flex min-h-[500px] flex-col rounded-xl border border-gray-200 bg-gray-100/70">
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}
          />

          <h2 className="text-sm font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${styles.count}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300">
            <p className="text-xs text-gray-400">
              No tasks here
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <button
              key={task._id}
              type="button"
              onClick={() => onTaskClick(task)}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                  {task.title}
                </h3>

                <span className="shrink-0 text-gray-300">
                  •••
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                {task.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-400">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>

                {task.assignedUser ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {task.assignedUser.firstName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-gray-400">
                    Unassigned
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}