import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { errorMiddleware } from "./middleware/error.middleware.js";
import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";

const app = express();

// TRUST PROXY
// Required for Azure App Service, Vercel, and reverse proxies
// so express-rate-limit identifies distinct client IPs instead of the proxy IP
app.set("trust proxy", 1);

// SECURITY

app.use(helmet());

const allowedOrigins = env.clientUrl.includes(",")
  ? env.clientUrl.split(",").map((url) => url.trim())
  : env.clientUrl;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// BODY PARSING (Protected against payload DoS)

app.use(express.json({ limit: "10kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// COOKIES
app.use(cookieParser());

// HEALTH CHECK

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Task Management System API is running",
  });
});

// RATE LIMITING (Global API Protection)

app.use("/api", apiRateLimiter);

// ROUTES

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// GLOBAL ERROR HANDLER

app.use(errorMiddleware);

export default app;