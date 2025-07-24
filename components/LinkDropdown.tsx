"use client";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { FaLink } from "react-icons/fa";

export default function LinkDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setLink = () => {
    if (url.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      setIsOpen(false);
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
    setUrl("");
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Icon button to toggle dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer ${
          editor.isActive("link")
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600"
        }`}
        title="Link options">
        <FaLink size={12} />
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
          <h3 className="text-sm text-gray-700 font-medium mb-2">
            Insert Link
          </h3>

          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3"
          />

          <div className="flex justify-between gap-2">
            <button
              onClick={setLink}
              className="flex-1 px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-black/90 transition">
              Set Link
            </button>
            <button
              onClick={unsetLink}
              disabled={!editor.isActive("link")}
              className={`flex-1 px-3 py-1.5 text-sm rounded transition ${
                editor.isActive("link")
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              Unset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
