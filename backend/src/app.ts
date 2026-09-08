import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management System API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

//Global error handler
app.use(errorMiddleware);
export default app;