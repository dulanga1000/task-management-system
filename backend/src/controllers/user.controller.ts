import type { Request, Response, NextFunction } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword as changeUserPassword,
} from "../services/user.service.js";

// Get all users with optional pagination
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = req.query;

    const { users, pagination } = await getUsers({
      page: page as string | undefined,
      limit: limit as string | undefined,
    });

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a user by ID
export const getById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a normal user's info (Admin only)
export const update = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a normal user account and unassign their tasks (Admin only)
export const remove = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteUser(req.params.id, req.user!.userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully and assigned tasks unassigned",
    });
  } catch (error) {
    next(error);
  }
};

// Update authenticated user's own profile
export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedUser = await updateProfile(req.user!.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change authenticated user's own password
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await changeUserPassword(req.user!.userId, req.body);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};