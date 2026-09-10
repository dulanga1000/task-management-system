import rateLimit from "express-rate-limit";

export const authRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many authentication attempts. Please try again later.",
    },
  });

export const refreshRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 60,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many refresh attempts. Please try again later.",
    },
  });

export const apiRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 300,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many requests. Please slow down and try again later.",
    },
  });