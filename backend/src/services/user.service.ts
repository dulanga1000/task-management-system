import User, { type IUser } from "../models/User.js";
import { validateObjectId } from "../utils/validate-object-id.js";
import {
  parsePaginationParams,
  buildPaginationMeta,
} from "../utils/pagination.js";
import type {
  PaginationParams,
  PaginationMeta,
} from "../types/pagination.js";

export interface GetUsersResult {
  users: Omit<IUser, "password">[];
  pagination: PaginationMeta;
}

// Get all users with server-side pagination
export const getUsers = async (
  params: PaginationParams = {}
): Promise<GetUsersResult> => {
  const { page, limit, skip } = parsePaginationParams(params);

  const [users, totalItems] = await Promise.all([
    User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  const pagination = buildPaginationMeta(totalItems, page, limit);

  return {
    users: users as unknown as Omit<IUser, "password">[],
    pagination,
  };
};

// Get a user by ID
export const getUserById = async (userId: string) => {
  validateObjectId(userId, "user ID");

  return User.findById(userId).select("-password").lean();
};