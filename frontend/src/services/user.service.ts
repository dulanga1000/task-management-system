import api from "./api";
import type { User } from "@/types/user";
import type { PaginationParams, PaginationMeta } from "@/types/pagination";

interface ApiUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: ApiUser[];
    pagination?: PaginationMeta;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: ApiUser;
  };
}

const normalizeUser = (
  user: ApiUser
): User => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getUsers = async (params?: PaginationParams) => {
  const response = await api.get<UsersResponse>("/users", {
    params,
  });

  return {
    ...response.data,
    data: {
      users: response.data.data.users.map(normalizeUser),
      pagination: response.data.data.pagination,
    },
  };
};

export const getUserById = async (
  userId: string
) => {
  const response =
    await api.get<UserResponse>(
      `/users/${userId}`
    );

  return {
    ...response.data,
    data: {
      user: normalizeUser(
        response.data.data.user
      ),
    },
  };
};