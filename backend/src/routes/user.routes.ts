import { Router } from "express";

import { getAll,getById } from "../controllers/user.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import { USER_ROLES } from "../constants/roles.js";

const router = Router();
// Get all users
router.get(
  "/",
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  getAll
);

// Get a user by ID
router.get(
  "/:id",
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  getById
);

export default router;