import { z } from "zod";

// Schema for updating user details by Admin
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { error: "First name must be at least 2 characters" })
    .max(100, { error: "First name must be at most 100 characters" })
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, { error: "Last name must be at least 2 characters" })
    .max(100, { error: "Last name must be at most 100 characters" })
    .optional(),

  username: z
    .string()
    .trim()
    .min(2, { error: "Username must be at least 2 characters" })
    .max(100, { error: "Username must be at most 100 characters" })
    .optional(),

  email: z
    .string()
    .trim()
    .email({ error: "Please provide a valid email address" })
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Schema for updating own profile by any authenticated user
export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { error: "First name must be at least 2 characters" })
      .max(100, { error: "First name must be at most 100 characters" })
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, { error: "Last name must be at least 2 characters" })
      .max(100, { error: "Last name must be at most 100 characters" })
      .optional(),

    username: z
      .string()
      .trim()
      .min(2, { error: "Username must be at least 2 characters" })
      .max(100, { error: "Username must be at most 100 characters" })
      .optional(),

    email: z
      .string()
      .trim()
      .email({ error: "Please provide a valid email address" })
      .optional(),
  })
  .refine(
    (data) =>
      data.firstName !== undefined ||
      data.lastName !== undefined ||
      data.username !== undefined ||
      data.email !== undefined,
    {
      message: "At least one field must be provided for update",
    }
  );

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Schema for changing password by any authenticated user
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ error: "Current password is required" })
    .min(1, { error: "Current password is required" }),

  newPassword: z
    .string({ error: "New password is required" })
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

  confirmPassword: z.string().optional(),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

