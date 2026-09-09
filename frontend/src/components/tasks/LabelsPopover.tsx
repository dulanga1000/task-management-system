"use client";

import React from "react";
import type { TaskLabel } from "@/types/task";

export const PRESET_LABELS: TaskLabel[] = [
  { name: "Bug", color: "bg-red-500 text-white" },
  { name: "Feature", color: "bg-emerald-500 text-white" },
  { name: "Urgent", color: "bg-orange-500 text-white" },
  { name: "Enhancement", color: "bg-blue-500 text-white" },
  { name: "Design", color: "bg-purple-500 text-white" },
  { name: "In Review", color: "bg-amber-500 text-white" },
  { name: "Docs", color: "bg-slate-600 text-white" },
];

interface LabelsPopoverProps {
  selectedLabels: TaskLabel[];
  onChange: (labels: TaskLabel[]) => void;
  onClose: () => void;
}

export default function LabelsPopover({
  selectedLabels = [],
  onChange,
  onClose,
}: LabelsPopoverProps) {
  const isSelected = (preset: TaskLabel) =>
    selectedLabels.some((l) => l.name === preset.name);

  const toggleLabel = (preset: TaskLabel) => {
    if (isSelected(preset)) {
      onChange(selectedLabels.filter((l) => l.name !== preset.name));
    } else {
      onChange([...selectedLabels, preset]);
    }
  };

  return (
    <div className="absolute left-0 top-full mt-2 z-40 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
        <span className="text-xs font-bold text-gray-800">Labels</span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm font-semibold cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {PRESET_LABELS.map((preset) => {
          const active = isSelected(preset);
          return (
            <div
              key={preset.name}
              onClick={() => toggleLabel(preset)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => {}} // handled by parent div onClick
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div
                className={`flex-1 rounded-md px-2.5 py-1 text-xs font-semibold shadow-xs flex items-center justify-between ${preset.color}`}
              >
                <span>{preset.name}</span>
                {active && <span>✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
