import User from "../models/User.js";

// Get all users
export const getUsers = async () => {
  return User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

// Get a user by ID
export const getUserById = async (userId: string) => {
  return User.findById(userId)
    .select("-password");
};