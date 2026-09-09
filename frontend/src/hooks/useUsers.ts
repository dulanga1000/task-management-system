"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsers, getUserById } from "@/services/user.service";
import type { User } from "@/types/user";

interface UseUsersOptions {
  enabled?: boolean;
}

export default function useUsers(options: UseUsersOptions = {}) {
  const { enabled = true } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      setUsers(response.data.users);
    } catch (error: any) {
      console.error(
        "Get users failed:",
        error?.response?.data || error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    fetchUsers();
  }, [enabled, fetchUsers]);

  const getUser = async (userId: string) => {
    const response = await getUserById(userId);

    return response.data.user;
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
  };
}