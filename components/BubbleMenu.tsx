"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuLetterText,
} from "react-icons/lu";
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdOutlineSubscript,
  MdOutlineSuperscript,
} from "react-icons/md";
import {
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaQuoteLeft,
  FaStrikethrough,
  FaUnderline,
} from "react-icons/fa";
import Select from "./Select";
import LinkDropdown from "./LinkDropdown";
import { GiRobotGolem } from "react-icons/gi";

interface BubbleMenusProps {
  editor: Editor;
  setShowAIModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleAskAIAtEndOfBlock: () => void;
}

const BubbleMenus: React.FC<BubbleMenusProps> = ({
  editor,
  setShowAIModal,
  handleAskAIAtEndOfBlock,
}) => {
  const [showText, setShowText] = useState(false);
  const [selectedText, setSelectedText] = useState<any>(LuLetterText);
  const [editorState, setEditorState] = useState(0);
  const [showBubbleMenu, setShowBubbleMenu] = useState(true);

  useEffect(() => {
    if (!editor) return;
    const forceRerender = () => setEditorState((prev) => prev + 1);
    editor.on("selectionUpdate", forceRerender);
    editor.on("transaction", forceRerender);
    return () => {
      editor.off("selectionUpdate", forceRerender);
      editor.off("transaction", forceRerender);
    };
  }, [editor]);

  const singleButtons = [
    {
      icon: FaBold,
      action: () => editor.chain().focus().toggleBold().run(),
      format: "bold",
    },
    {
      icon: FaItalic,
      action: () => editor.chain().focus().toggleItalic().run(),
      format: "italic",
    },
    {
      icon: FaUnderline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      format: "underline",
    },
    {
      icon: FaStrikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      format: "strike",
    },
    {
      icon: FaCode,
      action: () => editor.chain().focus().toggleCode().run(),
      format: "code",
    },
  ];

  const buttons = [
    {
      label: "Text",
      icon: LuLetterText,
      action: () => editor.chain().focus().setParagraph().run(),
      format: "paragraph",
    },
    {
      label: "Heading 1",
      icon: LuHeading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      format: { type: "heading", level: 1 },
    },
    {
      label: "Heading 2",
      icon: LuHeading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      format: { type: "heading", level: 2 },
    },
    {
      label: "Heading 3",
      icon: LuHeading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      format: { type: "heading", level: 3 },
    },
    {
      label: "Bullet List",
      icon: MdFormatListBulleted,
      action: () => editor.chain().focus().toggleBulletList().run(),
      format: "bulletList",
    },
    {
      label: "Ordered List",
      icon: MdFormatListNumbered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      format: "orderedList",
    },
    {
      label: "Blockquote",
      icon: FaQuoteLeft,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      format: "blockquote",
    },
    {
      label: "Code Block",
      icon: FaCode,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      format: "codeBlock",
    },
    {
      label: "Subscript",
      icon: MdOutlineSubscript,
      action: () => editor.chain().focus().toggleSubscript().run(),
      format: "subscript",
    },
    {
      label: "Superscript",
      icon: MdOutlineSuperscript,
      action: () => editor.chain().focus().toggleSuperscript().run(),
      format: "superscript",
    },
    {
      label: "Highlight",
      icon: FaHighlighter,
      action: () => editor.chain().focus().toggleHighlight().run(),
      format: "highlight",
    },
  ];

  const isActive = (format: any) => {
    if (!editor) return false;
    if (typeof format === "string") return editor.isActive(format);
    if (typeof format === "object" && format.type)
      return editor.isActive(format.type, { level: format.level });
    return false;
  };

  const hideBubbleMenu = () => {
    setShowBubbleMenu(false);
    editor?.commands.blur();
    setShowText(false);
  };

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) =>
        showBubbleMenu && !editor.state.selection.empty
      }
      options={{ placement: "top-start", offset: 4 }}
      className="bg-white rounded-xl px-3 py-1 shadow-lg border border-gray-200">
      <div className="flex items-center gap-4 w-fit">
        <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
          <button
            onClick={() => {
              hideBubbleMenu();
              handleAskAIAtEndOfBlock();
            }}
            className="text-sm px-2 py-1 rounded hover:bg-gray-100 transition cursor-pointer">
            Explain
          </button>
          <button
            onClick={() => {
              hideBubbleMenu();
              handleAskAIAtEndOfBlock();
            }}
            className="text-sm px-2 py-1 rounded hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer">
            <span>
              <GiRobotGolem />
            </span>
            Ask AI
          </button>
        </div>
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowText((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-100 transition cursor-pointer"
            aria-haspopup="true"
            aria-expanded={showText}>
            {selectedText}
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showText && (
            <ul className="absolute top-10 left-[-15px] w-52 max-h-64 rounded-md bg-white overflow-y-auto shadow-lg p-2 z-50 border border-gray-200 space-y-1 scroll">
              {buttons.map((btn, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => {
                      btn.action();
                      setSelectedText(btn.icon);
                      hideBubbleMenu();
                    }}
                    className={` flex w-full items-center gap-2 px-2 py-1 rounded text-sm transition cursor-pointer ${
                      isActive(btn.format)
                        ? "bg-gray-200 text-gray-900 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}>
                    <btn.icon size={14} />
                    <span>{btn.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <ul className="flex items-center gap-1">
            {singleButtons.map((btn, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    btn.action();
                    setShowText(false);
                  }}
                  className={` flex items-center justify-center px-2 py-1 rounded transition cursor-pointer ${
                    isActive(btn.format)
                      ? "bg-gray-200 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  } `}>
                  <btn.icon size={12} />
                </button>
              </li>
            ))}
          </ul>

          <LinkDropdown editor={editor} />
          <Select editor={editor} />
        </div>
      </div>
    </BubbleMenu>
  );
};

export default BubbleMenus;
