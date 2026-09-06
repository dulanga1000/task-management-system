import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import type { RegisterInput } from "../validations/auth.validation.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import type { LoginInput } from "../validations/auth.validation.js";

//Register a new user
export const registerUser = async (data: RegisterInput) => {
  const username = data.username.toLowerCase();
  const email = data.email.toLowerCase();

  const existingUsername = await User.findOne({
    username,
  });

  if (existingUsername) {
    throw new Error("Username is already taken");
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await hashPassword(data.password);

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
export const loginUser = async (data: LoginInput) => {
  const email = data.email.toLowerCase();

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
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
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
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