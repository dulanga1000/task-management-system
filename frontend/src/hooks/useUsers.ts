"use client";

import { useCallback, useEffect, useState } from "react";
import {getUsers,getUserById,updateUser as updateUserApi,deleteUser as deleteUserApi} from "@/services/user.service";
import type { User, UpdateUserData } from "@/types/user";
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

  const updateUser = async (userId: string, data: UpdateUserData) => {
    const response = await updateUserApi(userId, data);
    const updatedUser = response.data.user;

    setUsers((previous) =>
      previous.map((u) => (u.id === userId ? updatedUser : u))
    );

    return updatedUser;
  };

  const deleteUser = async (userId: string) => {
    await deleteUserApi(userId);

    setUsers((previous) => previous.filter((u) => u.id !== userId));

    // Update pagination count if pagination exists
    setPagination((prev) => {
      if (!prev) return null;
      const newTotal = Math.max(0, prev.totalItems - 1);
      return {
        ...prev,
        totalItems: newTotal,
        totalPages: Math.ceil(newTotal / prev.limit) || 0,
      };
    });
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing page size
  };

  const clearError = () => setError("");

  return {
    users,
    pagination,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    loading,
    error,
    clearError,
    fetchUsers,
    getUser,
    updateUser,
    deleteUser,
  };
}