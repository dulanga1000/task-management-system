import type { Request, Response, NextFunction } from "express";
import { getAdminStats as getStatsService } from "../services/admin.service.js";

export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await getStatsService();

    res.status(200).json({
      success: true,
      message: "Admin statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
