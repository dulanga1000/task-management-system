import type { Request, Response, NextFunction } from "express";
import { getUsers, getUserById } from "../services/user.service.js";

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