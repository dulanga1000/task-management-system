import { Router } from "express";
import { getMe, login, register, refresh, logout } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authRateLimiter, refreshRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  register
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  login
);

router.post(
  "/refresh",
  refreshRateLimiter,
  refresh
);

router.post(
  "/logout",
  logout
);

router.get(
  "/me",
  authenticate,
  getMe
);

export default router;