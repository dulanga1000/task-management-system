"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import type { TaskActivity } from "@/types/activity";
import { getTaskActivities, addTaskComment } from "@/services/activity.service";
import useAuth from "@/hooks/useAuth";

interface ActivityFeedProps {
  taskId: string;
  refreshTrigger?: number;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 45) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return "1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getInitials(firstName?: string, lastName?: string, username?: string): string {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (firstName) return firstName.charAt(0).toUpperCase();
  if (username) return username.substring(0, 2).toUpperCase();
  return "U";
}

const AVATAR_BG_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-teal-600",
  "bg-rose-600",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_BG_COLORS[Math.abs(hash) % AVATAR_BG_COLORS.length];
}

function statusToReadable(status?: string): string {
  switch (status) {
    case "TODO":
      return "To Do";
    case "DOING":
      return "In Progress";
    case "DONE":
      return "Done";
    default:
      return status || "";
  }
}

export default function ActivityFeed({ taskId, refreshTrigger = 0 }: ActivityFeedProps) {
  const { user: currentUser } = useAuth();
  const [activities, setActivities] = useState<TaskActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideDetails, setHideDetails] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTaskActivities(taskId);
      setActivities(data);
    } catch (err) {
      console.error("Failed to load task activities:", err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshTrigger]);

  const handleCommentSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      setCommentError("");
      const newComment = await addTaskComment(taskId, commentText.trim());
      setActivities((prev) => [newComment, ...prev]);
      setCommentText("");
      setIsInputFocused(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to post comment";
      setCommentError(msg);
    } finally {
      setSubmittingComment(false);
    }
  };

  const filteredActivities = hideDetails
    ? activities.filter((a) => a.type === "COMMENT_ADDED")
    : activities;

  const currentInitials = getInitials(
    currentUser?.firstName,
    currentUser?.lastName,
    currentUser?.username
  );

  return (
    <div className="flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>Comments and activity</span>
        </div>

        <button
          type="button"
          onClick={() => setHideDetails(!hideDetails)}
          className="rounded px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          {hideDetails ? "Show details" : "Hide details"}
        </button>
      </div>

      {/* Write a comment */}
      <div className="flex gap-2.5 items-start">
        {currentUser?.profilePicture?.url ? (
          <img
            src={currentUser.profilePicture.url}
            alt="My Profile"
            className="h-8 w-8 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/5"
          />
        ) : (
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(
              currentUser?.username || "user"
            )}`}
          >
            {currentInitials}
          </div>
        )}

        <div className="flex-1">
          <form onSubmit={handleCommentSubmit} className="space-y-2">
            <div
              className={`overflow-hidden rounded-lg border transition-all ${
                isInputFocused
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                placeholder="Write a comment..."
                rows={isInputFocused || commentText ? 3 : 1}
                className="w-full resize-none px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>

            {commentError && (
              <p className="text-xs text-red-600">{commentError}</p>
            )}

            {(isInputFocused || commentText.length > 0) && (
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  {submittingComment ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCommentText("");
                    setIsInputFocused(false);
                    setCommentError("");
                  }}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Activities / Comments List */}
      <div className="space-y-4 pt-1">
        {loading ? (
          <div className="py-6 text-center text-xs text-gray-400 animate-pulse">
            Loading activity...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">
            {hideDetails ? "No comments yet." : "No activity recorded yet."}
          </div>
        ) : (
          filteredActivities.map((act) => {
            const userName =
              act.user
                ? `${act.user.firstName || ""} ${act.user.lastName || ""}`.trim() ||
                  `@${act.user.username}`
                : "Unknown user";

            const initials = getInitials(
              act.user?.firstName,
              act.user?.lastName,
              act.user?.username
            );

            const avatarBg = getAvatarColor(act.user?.username || userName);

            return (
              <div key={act._id} className="flex items-start gap-2.5 text-xs">
                {/* Avatar Badge */}
                {act.user?.profilePicture?.url ? (
                  <img
                    src={act.user.profilePicture.url}
                    alt={userName}
                    className="h-7 w-7 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/5"
                  />
                ) : (
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ${avatarBg}`}
                  >
                    {initials}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 space-y-1">
                  {act.type === "COMMENT_ADDED" ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{userName}</span>
                        <span className="text-[11px] text-gray-400">
                          {formatRelativeTime(act.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1 rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-800 shadow-sm leading-relaxed whitespace-pre-wrap break-words">
                        {act.details?.comment}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="leading-snug text-gray-700">
                        <strong className="font-semibold text-gray-900">{userName} </strong>
                        {act.type === "TASK_CREATED" && (
                          <span>added this card to {statusToReadable(act.details?.newValue || "TODO")}</span>
                        )}
                        {act.type === "STATUS_CHANGED" && (
                          <span>
                            moved this task {act.details?.oldValue ? `from ${statusToReadable(act.details.oldValue)} ` : ""}
                            to {statusToReadable(act.details?.newValue)}
                          </span>
                        )}
                        {act.type === "ATTACHMENT_ADDED" && (
                          <span>
                            attached{" "}
                            <span className="font-medium text-blue-600 underline">
                              {act.details?.fileName || "a file"}
                            </span>{" "}
                            to this card
                          </span>
                        )}
                        {act.type === "ATTACHMENT_DELETED" && (
                          <span>
                            deleted the{" "}
                            <span className="font-medium text-gray-900">
                              {act.details?.fileName || "attachment"}
                            </span>{" "}
                            from this card
                          </span>
                        )}
                        {act.type === "TASK_ASSIGNED" && (
                          <span>
                            assigned this task to{" "}
                            <strong className="font-semibold text-gray-900">
                              {act.details?.assignedToName || "a team member"}
                            </strong>
                          </span>
                        )}
                        {(act.type === "DETAILS_UPDATED" ||
                          act.type === "TITLE_UPDATED" ||
                          act.type === "DESCRIPTION_UPDATED") && (
                          <span>updated the task details</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {formatRelativeTime(act.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
