import { Router } from "express";
import { getActivities, postComment } from "../controllers/activity.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

// GET /api/tasks/:taskId/activities
router.get("/", authenticate, getActivities);

// POST /api/tasks/:taskId/activities or /comments
router.post("/", authenticate, postComment);
router.post("/comments", authenticate, postComment);

export default router;
