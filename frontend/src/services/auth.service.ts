import api from "./api";

import type {LoginData,RegisterData} from "@/types/auth";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      role: "USER" | "ADMIN";
    };
    accessToken: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: "USER" | "ADMIN";
    createdAt: string;
    updatedAt: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: "USER" | "ADMIN";
    createdAt: string;
    updatedAt: string;
  };
}

export const registerUser = async (
  data: RegisterData
) => {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      data
    );

  return response.data;
};

export const loginUser = async (
  data: LoginData
) => {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      data
    );

  return response.data;
};

export const refreshAccessToken = async () => {
  const response =
    await api.post<RefreshResponse>(
      "/auth/refresh"
    );

  return response.data;
};

export const getCurrentUser = async () => {
  const response =
    await api.get<MeResponse>(
      "/auth/me"
    );

  return response.data;
};

export const logoutUser = async () => {
  const response =
    await api.post(
      "/auth/logout"
    );

  return response.data;
};