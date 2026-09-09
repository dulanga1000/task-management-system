"use client";

import React, { useState } from "react";
import type { TaskChecklistItem } from "@/types/task";

interface ChecklistSectionProps {
  items: TaskChecklistItem[];
  onChange: (items: TaskChecklistItem[]) => void;
  onDeleteChecklist?: () => void;
}

export default function ChecklistSection({
  items = [],
  onChange,
  onDeleteChecklist,
}: ChecklistSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState("");

  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const toggleItem = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, completed: !i.completed } : i
    );
    onChange(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    onChange(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: TaskChecklistItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      text: newItemText.trim(),
      completed: false,
    };

    onChange([...items, newItem]);
    setNewItemText("");
  };

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <span>☑️</span>
          <span>Checklist</span>
        </div>

        {onDeleteChecklist && (
          <button
            type="button"
            onClick={onDeleteChecklist}
            className="rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200 hover:text-red-600 transition-colors cursor-pointer"
          >
            Delete
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{percent}%</span>
            <span>{completed} of {total} completed</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${
                percent === 100 ? "bg-emerald-500" : "bg-blue-600"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Item List */}
      <div className="space-y-1.5 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-start gap-2.5 rounded-lg p-2 hover:bg-white hover:shadow-xs transition-all"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span
              onClick={() => toggleItem(item.id)}
              className={`flex-1 text-sm leading-snug cursor-pointer select-none ${
                item.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-800 font-medium"
              }`}
            >
              {item.text}
            </span>
            <button
              type="button"
              onClick={() => deleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 text-sm font-semibold transition-opacity px-1 cursor-pointer"
              title="Delete item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add an item */}
      {isAdding ? (
        <form onSubmit={handleAddItem} className="space-y-2 pt-1">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add an item..."
            autoFocus
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold !text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewItemText("");
              }}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded-md bg-gray-200/70 hover:bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 cursor-pointer transition-colors"
        >
          + Add an item
        </button>
      )}
    </div>
  );
}
