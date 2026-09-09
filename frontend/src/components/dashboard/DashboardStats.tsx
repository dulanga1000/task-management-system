"use client";

import type { Task } from "@/types/task";

interface DashboardStatsProps {
  tasks: Task[];
}

export default function DashboardStats({
  tasks,
}: DashboardStatsProps) {
  const total = tasks.length;

  const todo = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const doing = tasks.filter(
    (task) => task.status === "DOING"
  ).length;

  const done = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const stats = [
    {
      label: "Total tasks",
      value: total,
      description: "All your tasks",
    },
    {
      label: "To do",
      value: todo,
      description: "Waiting to start",
    },
    {
      label: "In progress",
      value: doing,
      description: "Currently working",
    },
    {
      label: "Completed",
      value: done,
      description: "Successfully finished",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.label}
          </p>

          <div className="mt-3 flex items-end justify-between">
            <p className="text-3xl font-bold tracking-tight text-gray-950">
              {stat.value}
            </p>
          </div>

          <p className="mt-1 text-xs text-gray-400">
            {stat.description}
          </p>
        </div>
      ))}
    </section>
  );
}