import { Router } from "express";
import {create,getAll,getById,update,assign,remove} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {assignTaskSchema, createTaskSchema,updateTaskSchema} from "../validations/task.validation.js";
import attachmentRoutes from "./attachment.routes.js";
import activityRoutes from "./activity.routes.js";

const router = Router();

// Sub-routes for task attachments: /api/tasks/:taskId/attachments
router.use("/:taskId/attachments", attachmentRoutes);

// Sub-routes for task activities and comments: /api/tasks/:taskId/activities
router.use("/:taskId/activities", activityRoutes);


router.post(
  "/",
  authenticate,
  validate(createTaskSchema),
  create
);

router.get(
  "/",
  authenticate,
  getAll
);

router.get(
  "/:id",
  authenticate,
  getById
);

router.patch(
  "/:id",
  authenticate,
  validate(updateTaskSchema),
  update
);

router.patch(
  "/:id/assignment",
  authenticate,
  validate(assignTaskSchema),
  assign
);

router.delete(
  "/:id",
  authenticate,
  remove
);

export default router;