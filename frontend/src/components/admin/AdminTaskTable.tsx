import type { Task } from "@/types/task";

interface AdminTaskTableProps {
  tasks: Task[];
}

const statusStyles = {
  TODO: "bg-gray-100 text-gray-700",
  DOING: "bg-blue-50 text-blue-700",
  DONE: "bg-green-50 text-green-700",
};

const statusLabels = {
  TODO: "To Do",
  DOING: "Doing",
  DONE: "Done",
};

export default function AdminTaskTable({
  tasks,
}: AdminTaskTableProps) {
  const recentTasks = tasks.slice(0, 5);

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-950">
          Recent Tasks
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest tasks created in the system.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {recentTasks.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              No tasks available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Task
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Creator
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Assigned To
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-[280px]">
                        <p className="truncate font-medium text-gray-950">
                          {task.title}
                        </p>

                        <p className="mt-1 truncate text-sm text-gray-500">
                          {task.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.creator?.firstName}{" "}
                      {task.creator?.lastName}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.assignedUser
                        ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}`
                        : "Unassigned"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                      >
                        {statusLabels[task.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}