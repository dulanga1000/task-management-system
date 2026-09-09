import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// --------------------------------------------------
// SECURITY
// --------------------------------------------------

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// --------------------------------------------------
// BODY PARSING
// --------------------------------------------------

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// --------------------------------------------------
// COOKIES
// --------------------------------------------------

app.use(cookieParser());

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Task Management System API is running",
  });
});

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

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

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use(errorMiddleware);

export default app;