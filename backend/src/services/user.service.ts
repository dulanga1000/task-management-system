import User from "../models/User.js";
import { validateObjectId } from "../utils/validate-object-id.js";

// Get all users
export const getUsers = async () => {
  return User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

// Get a user by ID
export const getUserById = async (userId: string) => {
  validateObjectId(userId, "user ID");

  return User.findById(userId)
    .select("-password");
};