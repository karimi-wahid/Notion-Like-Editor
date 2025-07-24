"use client";

import type React from "react";

import { useState } from "react";
import { FaCheck, FaTimes, FaBars, FaRedo } from "react-icons/fa";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  color?: string;
}

const menuItems: MenuItem[] = [
  {
    id: "accept",
    label: "Accept",
    icon: <FaCheck className="w-3 h-3" />,
    color: "text-green-600",
  },
  {
    id: "discard",
    label: "Discard",
    icon: <FaTimes className="w-3 h-3" />,
    color: "text-red-600",
  },
  {
    id: "insert",
    label: "Insert below",
    icon: <FaBars className="w-3 h-3" />,
    color: "text-gray-600",
  },
  {
    id: "try-again",
    label: "Try again",
    icon: <FaRedo className="w-3 h-3" />,
    color: "text-gray-600",
  },
];

export default function ActionMenu({
  setShowAIModal,
  editor,
  aiSuggestion,
}: {
  setShowAIModal: React.Dispatch<React.SetStateAction<boolean>>;
  editor: any;
  aiSuggestion: any;
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    switch (itemId) {
      case "accept":
        // Replace selected text with AI suggestion
        editor
          .chain()
          .focus()
          .insertContentAt(
            {
              from: editor.state.selection.from,
              to: editor.state.selection.to,
            },
            aiSuggestion
          )
          .run();
        break;
      case "discard":
        // Do nothing, just close
        break;
      case "insert":
        // Insert AI suggestion as new paragraph below
        editor.chain().focus().splitBlock().insertContent(aiSuggestion).run();
        break;
      case "try-again":
        // You can trigger AI again or show a toast
        // For now, just close
        break;
      default:
        break;
    }
    setShowAIModal(false);
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 max-w-[200px]">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className={
              " px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-100 "
            }
            onClick={() => handleItemClick(item.id)}>
            <div className="flex items-center gap-3">
              <span className={item.color || "text-gray-600"}>{item.icon}</span>
              <span className="text-gray-800 font-sm">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
