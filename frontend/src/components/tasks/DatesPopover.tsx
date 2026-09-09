"use client";

import React, { useState } from "react";

interface DatesPopoverProps {
  currentDueDate?: string | null;
  onSave: (dateIso: string | null) => void;
  onClose: () => void;
}

export default function DatesPopover({
  currentDueDate,
  onSave,
  onClose,
}: DatesPopoverProps) {
  const initialDate = currentDueDate
    ? new Date(currentDueDate).toISOString().slice(0, 16)
    : new Date(Date.now() + 86400000).toISOString().slice(0, 16);

  const [dateVal, setDateVal] = useState(initialDate);

  const handlePreset = (offsetDays: number) => {
    const d = new Date(Date.now() + offsetDays * 86400000);
    d.setHours(17, 0, 0, 0); // 5:00 PM default
    setDateVal(d.toISOString().slice(0, 16));
  };

  const handleSave = () => {
    if (!dateVal) {
      onSave(null);
    } else {
      onSave(new Date(dateVal).toISOString());
    }
    onClose();
  };

  const handleRemove = () => {
    onSave(null);
    onClose();
  };

  return (
    <div className="absolute left-0 top-full mt-2 z-40 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
        <span className="text-xs font-bold text-gray-800">Due Date</span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm font-semibold cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Quick Presets */}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => handlePreset(0)}
            className="flex-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handlePreset(1)}
            className="flex-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handlePreset(7)}
            className="flex-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Next Week
          </button>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Select Date & Time
          </label>
          <input
            type="datetime-local"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold !text-white hover:bg-blue-700 cursor-pointer"
          >
            Save Date
          </button>
          {currentDueDate && (
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
