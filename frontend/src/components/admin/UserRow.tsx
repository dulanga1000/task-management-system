import type { User } from "@/types/user";

interface UserRowProps {
  user: User;
}

export default function UserRow({ user }: UserRowProps) {
  const isAdmin = user.role === "ADMIN";

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-950">
            {user.firstName} {user.lastName}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            @{user.username}
          </p>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {user.email}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            isAdmin
              ? "bg-purple-50 text-purple-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {user.role}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "-"}
      </td>
    </tr>
  );
}