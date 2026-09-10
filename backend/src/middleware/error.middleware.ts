import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/app-error.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  // Handle Mongoose Validation Error
  if (error instanceof mongoose.Error.ValidationError) {
    const errorMessages = Object.values(error.errors).map((err) => err.message);
    res.status(400).json({
      success: false,
      message: errorMessages[0] || "Validation failed",
      errors: errorMessages,
    });

    return;
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid ${error.path}: ${error.value}`,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};