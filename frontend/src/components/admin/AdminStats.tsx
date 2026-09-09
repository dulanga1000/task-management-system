"use client";

import React from "react";
import {
  Users,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserX,
} from "lucide-react";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";
import AdminStatWidget from "./AdminStatWidget";

interface AdminStatsProps {
  users: User[];
  tasks: Task[];
}

export default function AdminStats({ users, tasks }: AdminStatsProps) {
  const totalUsers = users.length;
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter((t) => t.status === "TODO").length;
  const doingTasks = tasks.filter((t) => t.status === "DOING").length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const unassignedTasks = tasks.filter((t) => !t.assignedUser).length;

  const completionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          System Overview & Metrics
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Key governance and operational performance indicators.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Users */}
        <AdminStatWidget
          title="Total Users"
          value={totalUsers}
          subtitle="Registered accounts"
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />

        {/* Total Tasks */}
        <AdminStatWidget
          title="Total Tasks"
          value={totalTasks}
          subtitle="All status columns"
          icon={CheckSquare}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />

        {/* In Progress */}
        <AdminStatWidget
          title="In Progress"
          value={doingTasks}
          subtitle="Currently active"
          icon={Clock}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
          badge={{
            text: `${doingTasks} active`,
            variant: "info",
          }}
        />

        {/* Completed */}
        <AdminStatWidget
          title="Completed"
          value={doneTasks}
          subtitle="Marked as done"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          badge={{
            text: "Finished",
            variant: "success",
          }}
        />

        {/* Unassigned */}
        <AdminStatWidget
          title="Unassigned"
          value={unassignedTasks}
          subtitle="Needs allocation"
          icon={UserX}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          badge={
            unassignedTasks > 0
              ? { text: "Action required", variant: "warning" }
              : undefined
          }
        />

        {/* Completion Rate */}
        <AdminStatWidget
          title="Completion"
          value={`${completionRate}%`}
          subtitle="System completion rate"
          icon={TrendingUp}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          badge={{
            text: `${completionRate}%`,
            variant: completionRate >= 50 ? "success" : "default",
          }}
        />
      </div>
    </section>
  );
}