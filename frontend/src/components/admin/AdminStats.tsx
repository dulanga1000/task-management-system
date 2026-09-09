import type { Task } from "@/types/task";
import type { User } from "@/types/user";

interface AdminStatsProps {
  users: User[];
  tasks: Task[];
}

export default function AdminStats({
  users,
  tasks,
}: AdminStatsProps) {
  const totalUsers = users.length;
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const doingTasks = tasks.filter(
    (task) => task.status === "DOING"
  ).length;

  const doneTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
    },
    {
      title: "Total Tasks",
      value: totalTasks,
    },
    {
      title: "To Do",
      value: todoTasks,
    },
    {
      title: "Doing",
      value: doingTasks,
    },
    {
      title: "Done",
      value: doneTasks,
    },
  ];

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-950">
          Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current system statistics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}