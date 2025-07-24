"use client";

import { Editor } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ColorOption {
  value: string;
  textColor?: string;
  bgColor?: string;
}

const textColors: ColorOption[] = [
  { value: "#ffffff", textColor: "#ffffff" },
  { value: "#000000", textColor: "#000000" },
  { value: "#9ca3af", textColor: "#9ca3af" },
  { value: "#f97316", textColor: "#f97316" },
  { value: "#22c55e", textColor: "#22c55e" },
  { value: "#3b82f6", textColor: "#3b82f6" },
  { value: "#8b5cf6", textColor: "#8b5cf6" },
  { value: "#ec4899", textColor: "#ec4899" },
];

const bgColors: ColorOption[] = [
  { value: "#ffffff", bgColor: "#ffffff" },
  { value: "#1f2937", bgColor: "#1f2937" },
  { value: "#92400e", bgColor: "#92400e" },
  { value: "#78350f", bgColor: "#78350f" },
  { value: "#0f766e", bgColor: "#0f766e" },
  { value: "#3730a3", bgColor: "#3730a3" },
  { value: "#6b21a8", bgColor: "#6b21a8" },
  { value: "#7f1d1d", bgColor: "#7f1d1d" },
];

export default function Select({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState<string>("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  const applyTextColor = (color: string) => {
    setSelectedTextColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  const applyBgColor = (color: string) => {
    setSelectedBgColor(color);
    editor?.chain().focus().setHighlight({ color }).run();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-1 flex items-center border border-slate-200 rounded-sm transition-colors justify-between gap-2 min-w-[30px] cursor-pointer">
        <span className="font-bold" style={{ color: selectedTextColor }}>
          A
        </span>
        {isOpen ? (
          <FaChevronUp className="text-gray-400 text-sm" />
        ) : (
          <FaChevronDown className="text-gray-400 text-sm" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 border border-slate-300 rounded-md mt-1 shadow-lg z-10 min-w-[200px] bg-white text-white p-3 space-y-4">
          {/* Text Color */}
          <div>
            <h3 className="mb-2 text-gray-400 text-sm font-medium">
              Text color
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {textColors.map((color, idx) => (
                <button
                  key={idx}
                  className={`w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center cursor-pointer ${
                    selectedTextColor === color.textColor
                      ? "ring ring-blue-500"
                      : ""
                  }`}
                  onClick={() => applyTextColor(color.textColor!)}>
                  <span
                    className="font-bold"
                    style={{ color: color.textColor }}>
                    A
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <h3 className="mb-2 text-gray-400 text-sm font-medium">
              Background color
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {bgColors.map((color, idx) => (
                <button
                  key={idx}
                  className={`w-9 h-9 rounded-md border border-gray-300 cursor-pointer ${
                    selectedBgColor === color.bgColor
                      ? "ring ring-blue-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color.bgColor }}
                  onClick={() => applyBgColor(color.bgColor!)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
