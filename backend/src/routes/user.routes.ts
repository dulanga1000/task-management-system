import { Router } from "express";

import {
  getAll,
  getById,
  update,
  remove,
  updateMe,
  changePassword,
} from "../controllers/user.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { USER_ROLES } from "../constants/roles.js";
import {
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/user.validation.js";

const router = Router();

// Update own profile (Any authenticated user: USER or ADMIN)
router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateMe
);

// Change own password (Any authenticated user: USER or ADMIN)
router.patch(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);

// Get all users (Admin only)
router.get(
  "/",
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  getAll
);

// Get a user by ID (Admin only)
router.get(
  "/:id",
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  getById
);

// Update a user (Admin only)
router.patch(
  "/:id",
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  validate(updateUserSchema),
  update
);

// Delete a user (Admin only)
router.delete(
  "/:id",
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  remove
);

export default router;