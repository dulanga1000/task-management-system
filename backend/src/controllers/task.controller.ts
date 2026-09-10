import type { Request,Response,NextFunction} from "express";
import {createTask,getTasks,getTaskById,updateTask,assignTask,deleteTask,reorderTasks} from "../services/task.service.js";

// Create a new task
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
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
      req.user.userId,
      req.user.role
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks with optional pagination
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = req.query;

    const { tasks, pagination } = await getTasks({
      page: page as string | undefined,
      limit: limit as string | undefined,
    });

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: {
        tasks,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a task by ID
export const getById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
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
    next(error);
  }
};

// Update a task
export const update = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
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
    next(error);
  }
};

// Assign a task
export const assign = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const task = await assignTask(
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
      message: "Task assigned successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const remove = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
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
    next(error);
  }
};

// Reorder tasks
export const reorder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { items } = req.body;
    await reorderTasks(items, req.user.userId, req.user.role);

    res.status(200).json({
      success: true,
      message: "Tasks reordered successfully",
    });
  } catch (error) {
    next(error);
  }
};