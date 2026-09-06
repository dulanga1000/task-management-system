import { z } from "zod";

// Register schema

export const registerSchema = z.object({
  firstName: z
    .string({ error: "First name is required" })
    .trim()
    .min(2, { error: "First name must be at least 2 characters" })
    .max(100, { error: "First name must be at most 100 characters" }),

  lastName: z
    .string({ error: "Last name is required" })
    .trim()
    .min(2, { error: "Last name must be at least 2 characters" })
    .max(100, { error: "Last name must be at most 100 characters" }),

  username: z
    .string({ error: "Username is required" })
    .trim()
    .min(2, { error: "Username must be at least 2 characters" })
    .max(100, { error: "Username must be at most 100 characters" }),

  email: z
    .string({ error: "Email is required" })
    .trim()
    .email({ error: "Please provide a valid email address" }),

  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(100, { error: "Password must be at most 100 characters" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      error: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "Password must contain at least one special character",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login schema

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .email({ error: "Please provide a valid email address" }),

  password: z
    .string({ error: "Password is required" })
    .min(1, { error: "Password is required" }),
});

export type LoginInput = z.infer<typeof loginSchema>;