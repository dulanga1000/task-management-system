import { Router } from "express";
import {getMe,login,register} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {loginSchema,registerSchema,} from "../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";

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
  validate(loginSchema),
  login
);

// Get current user
router.get(
  "/me",
  authenticate,
  getMe
);

export default router;