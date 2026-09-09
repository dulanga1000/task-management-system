import { z } from "zod";

// Label item schema
const labelSchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().trim().min(1).max(50),
});

// Checklist item schema
const checklistItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1).max(500),
  completed: z.boolean(),
});

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
    .max(50000, {
      error: "Description must be at most 50000 characters",
    }),

  labels: z.array(labelSchema).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  checklist: z.array(checklistItemSchema).optional(),
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
    .max(50000, {
      error: "Description must be at most 50000 characters",
    })
    .optional(),

  status: z
    .enum(["TODO", "DOING", "DONE"], {
      error: "Invalid task status",
    })
    .optional(),

  labels: z.array(labelSchema).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  checklist: z.array(checklistItemSchema).optional(),
  order: z.number().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// Assign task schema
export const assignTaskSchema = z.object({
  assignedUserId: z
    .string({ error: "Assigned user ID is required" })
    .min(1, { error: "Assigned user ID is required" }),
});

export type AssignTaskInput = z.infer<typeof assignTaskSchema>;

// Reorder tasks schema
export const reorderTasksSchema = z.object({
  items: z
    .array(
      z.object({
        taskId: z.string().min(1, { error: "Task ID is required" }),
        order: z.number(),
      })
    )
    .min(1, { error: "Items array cannot be empty" }),
});

export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>;