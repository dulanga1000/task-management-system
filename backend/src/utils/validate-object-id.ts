import mongoose from "mongoose";
import { AppError } from "./app-error.js";

/**
 * Validates if a string is a valid MongoDB ObjectId.
 * @param id The string to validate.
 * @param fieldName The name of the field being validated (used in error messages).
 */
export const validateObjectId = (
  id: string,
  fieldName: string = "ID"
): void => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
};