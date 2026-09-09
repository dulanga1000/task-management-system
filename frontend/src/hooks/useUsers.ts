"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsers, getUserById } from "@/services/user.service";
import type { User } from "@/types/user";
import type { PaginationMeta } from "@/types/pagination";

interface UseUsersOptions {
  enabled?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

export default function useUsers(options: UseUsersOptions = {}) {
  const { enabled = true, initialPage = 1, initialLimit = 10 } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError("");

      const response = await getUsers({ page, limit });

      setUsers(response.data.users);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error(
        "Get users failed:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }, [enabled, page, limit]);

  useEffect(() => {
    if (!enabled) return;

    fetchUsers();
  }, [enabled, fetchUsers]);

  const getUser = async (userId: string) => {
    const response = await getUserById(userId);

    return response.data.user;
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing page size
  };

  return {
    users,
    pagination,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    loading,
    error,
    fetchUsers,
    getUser,
  };
}