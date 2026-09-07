import type { Request, Response } from "express";
import {createTask,getTasks,getTaskById,updateTask,deleteTask} from "../services/task.service.js";

// Create a new task
export const create = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const task = await createTask(
      req.body,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// Get all tasks
export const getAll = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const tasks = await getTasks();

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: {
        tasks,
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks",
    });
  }
};

// Get a task by ID
export const getById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
    });
  }
};

// Update a task
export const update = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const task = await updateTask(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.role
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to update this task"
    ) {
      res.status(403).json({
        success: false,
        message: error.message,
      });

      return;
    }

    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// Delete a task
export const remove = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const task = await deleteTask(
      req.params.id,
      req.user.userId,
      req.user.role
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to delete this task"
    ) {
      res.status(403).json({
        success: false,
        message: error.message,
      });

      return;
    }

    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};