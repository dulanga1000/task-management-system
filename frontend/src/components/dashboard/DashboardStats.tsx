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
      label: "Total Tasks",
      value: total,
      description: "All board tasks",
      dot: "bg-slate-400",
      accent: "text-slate-900",
    },
    {
      label: "To Do",
      value: todo,
      description: "Waiting to start",
      dot: "bg-amber-500",
      accent: "text-amber-700",
    },
    {
      label: "In Progress",
      value: doing,
      description: "Currently working",
      dot: "bg-blue-500",
      accent: "text-blue-700",
    },
    {
      label: "Completed",
      value: done,
      description: "Successfully finished",
      dot: "bg-emerald-500",
      accent: "text-emerald-700",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {stat.label}
            </span>
            <span className={`h-2 w-2 rounded-full ${stat.dot}`} />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-slate-900">
              {stat.value}
            </p>
          </div>

          <p className="mt-1 text-[11px] font-medium text-slate-400">
            {stat.description}
          </p>
        </div>
      ))}
    </section>
  );
}