import User from "../models/User.js";
import Task from "../models/Task.js";

export interface AdminStatsResult {
  totalUsers: number;
  totalTasks: number;
  todoTasks: number;
  doingTasks: number;
  doneTasks: number;
}

export const getAdminStats = async (): Promise<AdminStatsResult> => {
  const [totalUsers, totalTasks, todoTasks, doingTasks, doneTasks] =
    await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: "TODO" }),
      Task.countDocuments({ status: "DOING" }),
      Task.countDocuments({ status: "DONE" }),
    ]);

  return {
    totalUsers,
    totalTasks,
    todoTasks,
    doingTasks,
    doneTasks,
  };
};
