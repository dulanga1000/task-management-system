import { z } from "zod";

// Create task schema

export const createTaskSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(2, {
      error: "Title must be at least 2 characters",
    })
    .max(200, {
      error: "Title must be at most 200 characters",
    }),

  description: z
    .string({ error: "Description is required" })
    .trim()
    .max(2000, {
      error: "Description must be at most 2000 characters",
    }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

// Update task schema

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, {
      error: "Title must be at least 2 characters",
    })
    .max(200, {
      error: "Title must be at most 200 characters",
    })
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, {
      error: "Description must be at most 2000 characters",
    })
    .optional(),

  status: z
    .enum(["TODO", "DOING", "DONE"], {
      error: "Invalid task status",
    })
    .optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// Assign task schema
export const assignTaskSchema = z.object({
  assignedUserId: z
    .string({ error: "Assigned user ID is required" })
    .min(1, { error: "Assigned user ID is required" }),
});

export type AssignTaskInput = z.infer<typeof assignTaskSchema>;