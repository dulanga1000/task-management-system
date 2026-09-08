import crypto from "crypto";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import {hashPassword,comparePassword} from "../utils/password.js";
import type {RegisterInput,LoginInput} from "../validations/auth.validation.js";
import {generateAccessToken,generateRefreshToken,verifyRefreshToken} from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";

// Hash refresh token before storing it in database
const hashRefreshToken = (
  token: string
): string => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

// Calculate refresh token expiry date
const getRefreshTokenExpiry = (): Date => {
  const expiresIn =
    process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  const days = parseInt(expiresIn);

  const expiryDate = new Date();

  expiryDate.setDate(
    expiryDate.getDate() + days
  );

  return expiryDate;
};

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

  // Generate short-lived access token
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  // Generate long-lived refresh token
  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  // Hash refresh token before storing it
  const hashedRefreshToken =
    hashRefreshToken(refreshToken);

  // Store refresh token in database
  await RefreshToken.create({
    user: user._id,
    tokenHash: hashedRefreshToken,
    expiresAt: getRefreshTokenExpiry(),
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
    accessToken,
    refreshToken,
  };
};

// Refresh access token
export const refreshAccessToken = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token is required",
      401
    );
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      401
    );
  }

  const hashedRefreshToken =
    hashRefreshToken(refreshToken);

  const storedToken =
    await RefreshToken.findOne({
      tokenHash: hashedRefreshToken,
    });

  if (!storedToken) {
    throw new AppError(
      "Invalid or expired refresh token",
      401
    );
  }

  if (storedToken.revokedAt) {
    throw new AppError(
      "Refresh token has been revoked",
      401
    );
  }

  if (storedToken.expiresAt < new Date()) {
    await RefreshToken.findByIdAndUpdate(
      storedToken._id,
      {
        revokedAt: new Date(),
      }
    );

    throw new AppError(
      "Refresh token has expired",
      401
    );
  }

  validateObjectId(
    payload.userId,
    "user ID"
  );

  const user = await User.findById(
    payload.userId
  );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    accessToken,
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

// Logout a user
export const logoutUser = async (
  refreshToken: string
): Promise<void> => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token is required",
      401
    );
  }

  const hashedRefreshToken =
    hashRefreshToken(refreshToken);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash: hashedRefreshToken,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    }
  );
};