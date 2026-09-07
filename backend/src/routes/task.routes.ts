import { Router } from "express";
import {create,getAll,getById,update,remove} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {createTaskSchema,updateTaskSchema} from "../validations/task.validation.js";

const router = Router();

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

router.delete(
  "/:id",
  authenticate,
  remove
);

export default router;