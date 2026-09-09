import type { User } from "@/types/user";
import UserRow from "./UserRow";

interface UserTableProps {
  users: User[];
}

export default function UserTable({
  users,
}: UserTableProps) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            Users
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            All registered users in the system.
          </p>
        </div>

        <span className="text-sm font-medium text-gray-500">
          {users.length} users
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              No users found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}