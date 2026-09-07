import type { Request, Response } from "express";
import {createTask,getTasks,getTaskById,updateTask,deleteTask} from "../services/task.service.js";

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

export const update = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const task = await updateTask(
      req.params.id,
      req.body
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
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const task = await deleteTask(req.params.id);

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
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};