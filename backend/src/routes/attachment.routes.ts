import { Router } from "express";
import {
  upload,
  getByTask,
  remove,
} from "../controllers/attachment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadAttachmentFile } from "../middleware/upload.middleware.js";

const router = Router({ mergeParams: true });

// All attachment routes require authentication
router.use(authenticate);

// Upload a new attachment to a task
router.post("/", uploadAttachmentFile, upload);

// Get all attachments for a task
router.get("/", getByTask);

// Delete an attachment from a task
router.delete("/:attachmentId", remove);

export default router;
