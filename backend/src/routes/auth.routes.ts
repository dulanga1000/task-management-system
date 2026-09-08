import { Router } from "express";
import {getMe,login,register,refresh,logout} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {loginSchema,registerSchema,} from "../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// Register a new user
router.post(
  "/register",
  validate(registerSchema),
  register
);

// Login a user
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  login
);

// Refresh access token
router.post(
  "/refresh",
  authRateLimiter,
  refresh
);

// Get current user
router.get(
  "/me",
  authenticate,
  getMe
);

// Logout a user
router.post(
  "/logout",
  authRateLimiter,
  logout
);

export default router;