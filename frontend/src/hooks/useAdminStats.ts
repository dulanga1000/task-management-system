"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminStats } from "@/services/admin.service";
import type { AdminStatsData } from "@/types/admin";

interface UseAdminStatsOptions {
  enabled?: boolean;
}

export default function useAdminStats(options: UseAdminStatsOptions = {}) {
  const { enabled = true } = options;

  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError("");

      const response = await getAdminStats();
      setStats(response.data);
    } catch (err: any) {
      console.error("Get admin stats failed:", err?.response?.data || err);
      setError(
        err?.response?.data?.message || "Failed to load admin statistics."
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    fetchStats();
  }, [enabled, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
