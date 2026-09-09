"use client";

import React, { useRef, useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  saving?: boolean;
}

export function RichTextViewer({ html, placeholder = "Add a more detailed description..." }: { html: string; placeholder?: string }) {
  if (!html || !html.trim() || html === "<br>" || html === "<p></p>") {
    return <span className="text-gray-400 italic">{placeholder}</span>;
  }

  return (
    <div
      className="prose prose-sm max-w-none text-gray-800 leading-relaxed break-words
        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:my-1
        prose-p:my-1.5 prose-strong:font-bold prose-strong:text-gray-950
        prose-em:italic prose-ul:list-disc prose-ul:pl-5 prose-ul:my-1
        prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-1 prose-li:my-0.5
        prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function RichTextEditor({
  value,
  onChange,
  onSave,
  onCancel,
  saving = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  // Sync internal editor HTML with incoming value only on initial mount or major external resets
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // If empty or converting markdown asterisks from previous raw edits to HTML
      let formatted = value || "";
      if (formatted.startsWith("**") && formatted.endsWith("**") && !formatted.includes("<")) {
        formatted = `<b>${formatted.slice(2, -2)}</b>`;
      }
      editorRef.current.innerHTML = formatted;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCmd = (command: string, valueArg: string = "") => {
    editorRef.current?.focus();
    document.execCommand(command, false, valueArg);
    handleInput();
  };

  const handleLink = () => {
    const url = window.prompt("Enter website link URL:", "https://");
    if (url && url.trim()) {
      executeCmd("createLink", url.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        executeCmd("bold");
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        executeCmd("italic");
      } else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        handleLink();
      }
    }
  };

  return (
    <div className="rounded-xl border border-blue-500 ring-2 ring-blue-500/20 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Visual WYSIWYG Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/90 px-3 py-1.5 text-xs text-gray-700 select-none">
        {/* Headings */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowHeadingMenu(!showHeadingMenu);
              setShowListMenu(false);
            }}
            className="flex items-center gap-1 rounded px-2 py-1 font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
            title="Headings"
          >
            <span>Tt</span>
            <span className="text-[10px]">▾</span>
          </button>
          {showHeadingMenu && (
            <div className="absolute left-0 top-full mt-1 z-30 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  executeCmd("formatBlock", "<h3>");
                  setShowHeadingMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-gray-100 cursor-pointer"
              >
                Heading 3
              </button>
              <button
                type="button"
                onClick={() => {
                  executeCmd("formatBlock", "<p>");
                  setShowHeadingMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
              >
                Normal text
              </button>
            </div>
          )}
        </div>

        {/* Bold */}
        <button
          type="button"
          onClick={() => executeCmd("bold")}
          className="flex h-7 w-7 items-center justify-center rounded font-extrabold hover:bg-gray-200 transition-colors cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => executeCmd("italic")}
          className="flex h-7 w-7 items-center justify-center rounded italic font-serif hover:bg-gray-200 transition-colors cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Lists */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowListMenu(!showListMenu);
              setShowHeadingMenu(false);
            }}
            className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-200 transition-colors cursor-pointer"
            title="Lists"
          >
            <span>:=</span>
            <span className="text-[10px]">▾</span>
          </button>
          {showListMenu && (
            <div className="absolute left-0 top-full mt-1 z-30 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  executeCmd("insertUnorderedList");
                  setShowListMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
              >
                • Bulleted list
              </button>
              <button
                type="button"
                onClick={() => {
                  executeCmd("insertOrderedList");
                  setShowListMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 cursor-pointer"
              >
                1. Numbered list
              </button>
            </div>
          )}
        </div>

        {/* Link */}
        <button
          type="button"
          onClick={handleLink}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-gray-200 transition-colors cursor-pointer"
          title="Insert Link (Ctrl+K)"
        >
          🔗
        </button>

        {/* Inline Code */}
        <button
          type="button"
          onClick={() => {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              const range = sel.getRangeAt(0);
              const selectedText = range.toString();
              const codeEl = document.createElement("code");
              codeEl.className = "bg-gray-100 px-1 py-0.5 rounded text-xs font-mono";
              codeEl.textContent = selectedText || "code";
              range.deleteContents();
              range.insertNode(codeEl);
              handleInput();
            }
          }}
          className="flex h-7 w-7 items-center justify-center rounded font-mono text-xs hover:bg-gray-200 transition-colors cursor-pointer"
          title="Inline Code"
        >
          &lt;/&gt;
        </button>
      </div>

      {/* WYSIWYG Content Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="min-h-[140px] max-h-[350px] overflow-y-auto p-4 text-sm text-gray-900 outline-none leading-relaxed
          prose prose-sm max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-strong:font-bold prose-strong:text-gray-950
          prose-em:italic
          prose-ul:list-disc prose-ul:pl-5
          prose-ol:list-decimal prose-ol:pl-5
          prose-a:text-blue-600 prose-a:underline"
        data-placeholder="Add a more detailed description..."
      />

      {/* Editor Footer */}
      {(onSave || onCancel) && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold !text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          <span className="text-[11px] text-gray-400">Rich visual formatting enabled</span>
        </div>
      )}
    </div>
  );
}
