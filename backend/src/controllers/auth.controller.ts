import type { Request, Response, NextFunction, } from "express";
import { getCurrentUser, loginUser, registerUser, refreshAccessToken, logoutUser } from "../services/auth.service.js";
import { env } from "../config/env.js";

// COOKIE OPTIONS

export const getRefreshCookieOptions = () => ({
  httpOnly: true,

  secure:
    env.nodeEnv === "production",

  sameSite:
    (env.nodeEnv === "production" ? "none" : "lax") as "none" | "lax",

  maxAge:
    7 * 24 * 60 * 60 * 1000,

  path: "/api/auth",
});

// REGISTER

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user =
      await registerUser(req.body);

    res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result =
      await loginUser(req.body);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      getRefreshCookieOptions()
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// REFRESH

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken =
      req.cookies?.refreshToken;

    const result =
      await refreshAccessToken(
        refreshToken
      );

    /*
     * Set the new refresh token cookie during normal rotation.
     * Grace-window requests only return an access token, so
     * leave the existing cookie set by the winning request.
     */

    if (result.refreshToken) {
      res.cookie(
        "refreshToken",
        result.refreshToken,
        getRefreshCookieOptions()
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Access token refreshed successfully",
      data: {
        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET CURRENT USER

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });

      return;
    }

    const user =
      await getCurrentUser(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      message:
        "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken =
      req.cookies?.refreshToken;

    await logoutUser(
      refreshToken
    );

    res.clearCookie(
      "refreshToken",
      getRefreshCookieOptions()
    );

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};