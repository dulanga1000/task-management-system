import User from "../models/User.js";
import {hashPassword,comparePassword} from "../utils/password.js";
import type {RegisterInput,LoginInput} from "../validations/auth.validation.js";
import { generateToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";

// Register a new user
export const registerUser = async (
  data: RegisterInput
) => {
  const username = data.username.toLowerCase();
  const email = data.email.toLowerCase();

  const existingUsername = await User.findOne({
    username,
  });

  if (existingUsername) {
    throw new AppError(
      "Username is already taken",
      409
    );
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      409
    );
  }

  const hashedPassword = await hashPassword(
    data.password
  );

  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

// Login a user
export const loginUser = async (
  data: LoginInput
) => {
  const email = data.email.toLowerCase();

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

// Get current user
export const getCurrentUser = async (
  userId: string
) => {
  validateObjectId(userId, "user ID");

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};