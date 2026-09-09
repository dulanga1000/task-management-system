export interface AdminStatsData {
  totalUsers: number;
  totalTasks: number;
  todoTasks: number;
  doingTasks: number;
  doneTasks: number;
}

export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: AdminStatsData;
}
