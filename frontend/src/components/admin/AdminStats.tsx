"use client";

import React from "react";
import {
  Users,
  CheckSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  UserX,
} from "lucide-react";
import type { AdminStatsData } from "@/types/admin";
import useAdminStats from "@/hooks/useAdminStats";
import AdminStatWidget from "./AdminStatWidget";

interface AdminStatsProps {
  stats?: AdminStatsData | null;
  loading?: boolean;
}

export default function AdminStats({
  stats: propStats,
  loading: propLoading,
}: AdminStatsProps) {
  // If stats not provided via props, fetch from the /api/admin/stats endpoint
  const { stats: hookStats, loading: hookLoading } = useAdminStats({
    enabled: !propStats,
  });

  const stats = propStats || hookStats;
  const loading = propLoading || (propStats ? false : hookLoading);

  const totalUsers = stats?.totalUsers ?? 0;
  const totalTasks = stats?.totalTasks ?? 0;
  const doingTasks = stats?.doingTasks ?? 0;
  const doneTasks = stats?.doneTasks ?? 0;
  const todoTasks = stats?.todoTasks ?? 0;

  // Unassigned tasks = total tasks minus sum of assigned status tasks or calculated
  const completionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          System Overview & Metrics
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Accurate system-wide metrics across all users and tasks.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Users */}
        <AdminStatWidget
          title="Total Users"
          value={loading ? "..." : totalUsers}
          subtitle="Registered accounts"
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />

        {/* Total Tasks */}
        <AdminStatWidget
          title="Total Tasks"
          value={loading ? "..." : totalTasks}
          subtitle="All status columns"
          icon={CheckSquare}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />

        {/* In Progress */}
        <AdminStatWidget
          title="In Progress"
          value={loading ? "..." : doingTasks}
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
          value={loading ? "..." : doneTasks}
          subtitle="Marked as done"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          badge={{
            text: "Finished",
            variant: "success",
          }}
        />

        {/* To Do */}
        <AdminStatWidget
          title="To Do"
          value={loading ? "..." : todoTasks}
          subtitle="Awaiting start"
          icon={UserX}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />

        {/* Completion Rate */}
        <AdminStatWidget
          title="Completion"
          value={loading ? "..." : `${completionRate}%`}
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