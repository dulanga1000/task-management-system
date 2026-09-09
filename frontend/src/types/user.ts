export type UserRole = "USER" | "ADMIN";

export interface UserProfilePicture {
  storageKey?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  profilePicture?: UserProfilePicture | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}