"use client";

import { FormEvent, useEffect, useState } from "react";
import type {
  CreateTaskData,
  Task,
  TaskStatus,
  UpdateTaskData,
  TaskLabel,
  TaskChecklistItem,
} from "@/types/task";
import type { User } from "@/types/user";
import useAuth from "@/hooks/useAuth";
import { AttachmentSection } from "./AttachmentSection";
import ActivityFeed from "./ActivityFeed";
import RichTextEditor, { RichTextViewer } from "./RichTextEditor";
import LabelsPopover from "./LabelsPopover";
import DatesPopover from "./DatesPopover";
import ChecklistSection from "./ChecklistSection";

interface TaskModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;

  onCreate: (
    data: CreateTaskData,
    assignedUserId?: string
  ) => Promise<unknown>;

  onUpdate?: (
    taskId: string,
    data: UpdateTaskData
  ) => Promise<unknown>;

  onDelete?: (
    taskId: string
  ) => Promise<unknown>;

  onAssign?: (
    taskId: string,
    assignedUserId?: string
  ) => Promise<unknown>;

  currentUserId?: string;
  users?: User[];
}

export default function TaskModal({
  open,
  task,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onAssign,
  currentUserId,
  users,
}: TaskModalProps) {
  const { user: currentUser } = useAuth();
  const effectiveUserId = currentUserId || currentUser?.id;
  const isEditing = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [assignedUserId, setAssignedUserId] = useState<string>("");

  const [labels, setLabels] = useState<TaskLabel[]>([]);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<TaskChecklistItem[]>([]);
  const [hasChecklist, setHasChecklist] = useState(false);

  // Popover toggles
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showLabelsPopover, setShowLabelsPopover] = useState(false);
  const [showDatesPopover, setShowDatesPopover] = useState(false);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [activityRefreshKey, setActivityRefreshKey] = useState(0);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const eligibleUsers = users || [];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setAssignedUserId(task.assignedUser?._id || "");
      setLabels(task.labels || []);
      setDueDate(task.dueDate || null);
      setChecklist(task.checklist || []);
      setHasChecklist((task.checklist && task.checklist.length > 0) || false);
      setIsEditingDescription(false);
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setAssignedUserId("");
      setLabels([]);
      setDueDate(null);
      setChecklist([]);
      setHasChecklist(false);
      setIsEditingDescription(true);
    }

    setShowAddMenu(false);
    setShowLabelsPopover(false);
    setShowDatesPopover(false);
    setError("");
  }, [task, open]);

  if (!open) {
    return null;
  }

  const alreadyAssignedToMe = task?.assignedUser?._id === currentUserId;
  const isDescriptionDirty = isEditing && task && description !== task.description;

  const handleUpdateField = async (fields: UpdateTaskData) => {
    if (!task || !onUpdate) return;
    try {
      await onUpdate(task._id, fields);
      setActivityRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update task.";
      setError(errorMsg);
    }
  };

  const handleSaveLabels = async (newLabels: TaskLabel[]) => {
    setLabels(newLabels);
    if (isEditing) {
      await handleUpdateField({ labels: newLabels });
    }
  };

  const handleSaveDueDate = async (newDate: string | null) => {
    setDueDate(newDate);
    if (isEditing) {
      await handleUpdateField({ dueDate: newDate });
    }
  };

  const handleChecklistChange = async (newItems: TaskChecklistItem[]) => {
    setChecklist(newItems);
    if (isEditing) {
      await handleUpdateField({ checklist: newItems });
    }
  };

  const handleDeleteChecklist = async () => {
    setChecklist([]);
    setHasChecklist(false);
    if (isEditing) {
      await handleUpdateField({ checklist: [] });
    }
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (isEditing && task) {
        if (onUpdate) {
          await onUpdate(task._id, {
            title,
            description,
            status,
            labels,
            dueDate,
            checklist,
          });
        }

        // If assignee was changed or assigned by Admin
        const previousAssignedId = task.assignedUser?._id || "";
        if (assignedUserId !== previousAssignedId && onAssign) {
          if (assignedUserId) {
            await onAssign(task._id, assignedUserId);
          }
        }

        setActivityRefreshKey((k) => k + 1);
      } else {
        await onCreate(
          {
            title,
            description,
            labels,
            dueDate,
            checklist,
          },
          assignedUserId || undefined
        );
      }

      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!task || !onUpdate) return;
    try {
      setSaving(true);
      setError("");
      await onUpdate(task._id, {
        description,
      });
      setIsEditingDescription(false);
      setActivityRefreshKey((k) => k + 1);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Failed to update description.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !onDelete) return;

    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      await onDelete(task._id);
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Failed to delete task.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAssign = async () => {
    if (!task || !onAssign) return;

    try {
      setAssigning(true);
      setError("");
      await onAssign(task._id);
      setActivityRefreshKey((k) => k + 1);
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Failed to assign task.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-2 sm:p-4 backdrop-blur-sm">
      <div
        className={`w-full overflow-hidden rounded-2xl bg-white shadow-2xl transition-all ${
          isEditing
            ? "max-w-5xl max-h-[92vh] flex flex-col"
            : "max-w-lg max-h-[90vh] overflow-y-auto"
        }`}
      >
        {/* Modal Top Nav Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <select
                  value={status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as TaskStatus;
                    setStatus(newStatus);
                    if (task && onUpdate) {
                      await onUpdate(task._id, { status: newStatus });
                      setActivityRefreshKey((k) => k + 1);
                    }
                  }}
                  className={`h-8 rounded-md px-3 text-xs font-semibold cursor-pointer border outline-none transition-colors ${
                    status === "DONE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : status === "DOING"
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <option value="TODO">To Do ▾</option>
                  <option value="DOING">In Progress ▾</option>
                  <option value="DONE">Done ▾</option>
                </select>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-bold text-gray-950">Create Task</h2>
                <p className="text-xs text-gray-500">
                  Create a new task for your workspace.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Create Task Form */}
        {!isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Title
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                minLength={2}
                maxLength={200}
                placeholder="What needs to be done?"
                required
                className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <RichTextEditor
                value={description}
                onChange={(val) => setDescription(val)}
              />
            </div>

            {eligibleUsers.length > 0 && (
              <div>
                <label
                  htmlFor="create-task-assignee"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Assign To (Optional)
                </label>
                <select
                  id="create-task-assignee"
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="">-- Unassigned --</option>
                  {eligibleUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} (@{u.username})
                      {u.id === currentUserId
                        ? " (You)"
                        : u.role === "ADMIN"
                        ? " (Admin)"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-semibold !text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Creating..." : "Create task"}
              </button>
            </div>
          </form>
        ) : (
          /* Trello Two-Column Detail View */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-7">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (Card Content) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <span>Task Title</span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={async () => {
                      if (
                        task &&
                        onUpdate &&
                        title !== task.title &&
                        title.trim().length >= 2
                      ) {
                        await onUpdate(task._id, { title: title.trim() });
                        setActivityRefreshKey((k) => k + 1);
                      }
                    }}
                    placeholder="Task title"
                    className="w-full text-xl font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none py-1 transition-colors"
                  />
                </div>

                {/* Active Labels & Due Date Pills */}
                {(labels.length > 0 || dueDate) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {labels.map((lbl) => (
                      <span
                        key={lbl.name}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold shadow-xs flex items-center gap-1.5 ${lbl.color}`}
                      >
                        <span>{lbl.name}</span>
                        <button
                          type="button"
                          onClick={() => handleSaveLabels(labels.filter((l) => l.name !== lbl.name))}
                          className="hover:opacity-75 font-bold cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {dueDate && (
                      <div className="flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-800">
                        <span>🕒 Due {new Date(dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        <button
                          type="button"
                          onClick={() => handleSaveDueDate(null)}
                          className="hover:text-blue-950 font-bold cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Action Pills (Trello Style) */}
                <div className="relative flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 mr-1">
                    Add to card:
                  </span>

                  {/* + Add Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenu(!showAddMenu);
                        setShowLabelsPopover(false);
                        setShowDatesPopover(false);
                      }}
                      className="flex items-center gap-1.5 rounded-md bg-gray-100 hover:bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
                    >
                      <span>+ Add</span>
                    </button>

                    {showAddMenu && (
                      <div className="absolute left-0 top-full mt-2 z-40 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddMenu(false);
                            setShowLabelsPopover(true);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <span>🏷️</span>
                          <span>Labels</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddMenu(false);
                            setShowDatesPopover(true);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <span>🕒</span>
                          <span>Due Date</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddMenu(false);
                            setHasChecklist(true);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <span>☑️</span>
                          <span>Checklist</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Labels Button & Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLabelsPopover(!showLabelsPopover);
                        setShowDatesPopover(false);
                        setShowAddMenu(false);
                      }}
                      className="flex items-center gap-1.5 rounded-md bg-gray-100 hover:bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
                    >
                      <span>🏷️ Labels</span>
                    </button>

                    {showLabelsPopover && (
                      <LabelsPopover
                        selectedLabels={labels}
                        onChange={handleSaveLabels}
                        onClose={() => setShowLabelsPopover(false)}
                      />
                    )}
                  </div>

                  {/* Dates Button & Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDatesPopover(!showDatesPopover);
                        setShowLabelsPopover(false);
                        setShowAddMenu(false);
                      }}
                      className="flex items-center gap-1.5 rounded-md bg-gray-100 hover:bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
                    >
                      <span>🕒 Dates</span>
                    </button>

                    {showDatesPopover && (
                      <DatesPopover
                        currentDueDate={dueDate}
                        onSave={handleSaveDueDate}
                        onClose={() => setShowDatesPopover(false)}
                      />
                    )}
                  </div>

                  {/* Checklist Button */}
                  <button
                    type="button"
                    onClick={() => setHasChecklist(true)}
                    className="flex items-center gap-1.5 rounded-md bg-gray-100 hover:bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
                  >
                    <span>☑️ Checklist</span>
                  </button>
                </div>

                {/* Description with WYSIWYG Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
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
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      <span>Description</span>
                    </div>

                    {isDescriptionDirty && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        Unsaved changes
                      </span>
                    )}
                  </div>

                  {isEditingDescription ? (
                    <RichTextEditor
                      value={description}
                      onChange={(val) => setDescription(val)}
                      onSave={handleSaveDescription}
                      onCancel={() => {
                        setDescription(task.description);
                        setIsEditingDescription(false);
                      }}
                      saving={saving}
                    />
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors min-h-[90px]"
                    >
                      <RichTextViewer html={description} />
                    </div>
                  )}
                </div>

                {/* Checklist Section (when enabled or has items) */}
                {(hasChecklist || checklist.length > 0) && (
                  <ChecklistSection
                    items={checklist}
                    onChange={handleChecklistChange}
                    onDeleteChecklist={handleDeleteChecklist}
                  />
                )}

                {/* Assignment Box */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Assignment & Members
                    </p>
                    {task.assignedUser && eligibleUsers.length > 0 && (
                      <span className="text-xs text-gray-500">
                        Currently:{" "}
                        <strong className="text-gray-800 font-semibold">
                          {task.assignedUser.firstName} {task.assignedUser.lastName}
                        </strong>
                      </span>
                    )}
                  </div>

                  {eligibleUsers.length > 0 ? (
                    <div className="mt-3">
                      <select
                        id="edit-task-assignee"
                        value={assignedUserId}
                        onChange={async (e) => {
                          const newId = e.target.value;
                          setAssignedUserId(newId);
                          if (onAssign && newId) {
                            await onAssign(task._id, newId);
                            setActivityRefreshKey((k) => k + 1);
                          }
                        }}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                      >
                        <option value="">-- Unassigned --</option>
                        {eligibleUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.firstName} {u.lastName} (@{u.username})
                            {u.id === currentUserId
                              ? " (You)"
                              : u.role === "ADMIN"
                              ? " (Admin)"
                              : ""}
                          </option>
                        ))}
                      </select>

                      {currentUserId && assignedUserId !== currentUserId && (
                        <button
                          type="button"
                          onClick={async () => {
                            setAssignedUserId(currentUserId);
                            if (onAssign) {
                              await onAssign(task._id, currentUserId);
                              setActivityRefreshKey((k) => k + 1);
                            }
                          }}
                          className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>⚡ Assign to myself</span>
                        </button>
                      )}
                    </div>
                  ) : task.assignedUser ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {task.assignedUser.firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {task.assignedUser.firstName} {task.assignedUser.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{task.assignedUser.username}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          This task is unassigned
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          You can assign it to yourself.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAssign}
                        disabled={assigning}
                        className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold !text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                      >
                        {assigning ? "Assigning..." : "Assign to me"}
                      </button>
                    </div>
                  )}

                  {alreadyAssignedToMe && !eligibleUsers.length && (
                    <p className="mt-2 text-xs font-medium text-green-600">
                      ✓ Assigned to you
                    </p>
                  )}
                </div>

                {/* Evidence & Attachments */}
                <AttachmentSection
                  taskId={task._id}
                  currentUserId={effectiveUserId}
                  isAdmin={currentUser?.role === "ADMIN"}
                  canManageTask={
                    currentUser?.role === "ADMIN" ||
                    task.creator?._id === effectiveUserId ||
                    task.assignedUser?._id === effectiveUserId
                  }
                  onAttachmentChange={() => setActivityRefreshKey((k) => k + 1)}
                />

                {/* Metadata & Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5 text-xs text-gray-400">
                  <div className="space-y-0.5">
                    <p>
                      Created {new Date(task.createdAt).toLocaleDateString()} by{" "}
                      <span className="font-semibold text-gray-700">
                        {task.creator
                          ? `${task.creator.firstName || ""} ${task.creator.lastName || ""}`.trim() ||
                            `@${task.creator.username}`
                          : "Former Member"}
                      </span>
                    </p>
                  </div>

                  {onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 cursor-pointer"
                    >
                      {deleting ? "Deleting..." : "Delete task"}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column (Trello Comments and Activity Stream) */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-8 pt-6 lg:pt-0">
                <ActivityFeed
                  taskId={task._id}
                  refreshTrigger={activityRefreshKey}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}