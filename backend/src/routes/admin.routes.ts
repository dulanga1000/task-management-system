import { Router } from "express";
import { getStats } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";

const router = Router();

// Get overall system administration statistics
router.get(
  "/stats",
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  getStats
);

export default router;
