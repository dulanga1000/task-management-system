import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstMessage = result.error.issues[0]?.message || "Validation failed";
      res.status(400).json({
        success: false,
        message: firstMessage,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.length > 0 ? issue.path.join(".") : "body",
          message: issue.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
