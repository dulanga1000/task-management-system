import type {Request,Response,NextFunction} from "express";
import {getCurrentUser,loginUser,registerUser,refreshAccessToken,logoutUser} from "../services/auth.service.js";
import { env } from "../config/env.js";

// Register a new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login a user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await loginUser(req.body);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const result = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const user = await getCurrentUser(req.user.userId);

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

// Logout a user
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};