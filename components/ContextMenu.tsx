"use client";

import { Editor } from "@tiptap/core";
import React from "react";
import { FaAngleRight, FaComment, FaRegCopy, FaRobot } from "react-icons/fa";
import { FaArrowsTurnToDots } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { NodeSelection } from "prosemirror-state";

const ContextMenu = ({
  editor,
  setContextMenu,
  currentBlockPos,
  setShowAIModal,
  aiContent,
}: {
  editor: Editor;
  setContextMenu: any;
  currentBlockPos: number | null;
  setShowAIModal: React.Dispatch<React.SetStateAction<boolean>>;
  aiContent: string;
}) => {
  const duplicateCurrentBlock = () => {
    if (!editor || currentBlockPos === null) return;

    const node = editor.state.doc.nodeAt(currentBlockPos);
    if (!node) return;

    // Calculate the insertion point (right after the current block)
    const insertPos = currentBlockPos + node.nodeSize;

    // Insert the duplicated block in a new line
    editor
      .chain()
      .focus()
      .insertContentAt(insertPos, { type: "paragraph", content: [] }) // Force a new line (adjust if needed)
      .insertContentAt(insertPos + 1, node.toJSON()) // Insert duplicate
      .setTextSelection(insertPos + 2) // Focus the new block (optional)
      .run();

    setContextMenu(null); // Close the context menu
  };

  const deleteCurrentBlock = () => {
    if (!editor || currentBlockPos === null) return;
    const node = editor.state.doc.nodeAt(currentBlockPos);
    if (!node) return;

    editor
      .chain()
      .focus()
      .deleteRange({
        from: currentBlockPos,
        to: currentBlockPos + node.nodeSize,
      })
      .run();

    setContextMenu(null);
  };

  const addCommentToBlock = () => {
    if (!editor || currentBlockPos === null) return;

    const comment = prompt("Enter your comment:");
    if (!comment) return;

    const node = editor.state.doc.nodeAt(currentBlockPos);
    if (!node) return;

    const newNode = {
      ...node.toJSON(),
      attrs: {
        ...node.attrs,
        comment,
      },
    };

    editor
      .chain()
      .focus()
      .deleteRange({
        from: currentBlockPos,
        to: currentBlockPos + node.nodeSize,
      })
      .insertContentAt(currentBlockPos, newNode)
      .run();

    setContextMenu(null);
  };

  const replaceBlockWithAIResponse = (aiResponseContent: string) => {
    if (!editor || currentBlockPos === null) return;

    const node = editor.state.doc.nodeAt(currentBlockPos);
    if (!node) return;

    // Create a transaction that replaces the entire node at currentBlockPos
    editor
      .chain()
      .focus()
      .deleteRange({
        from: currentBlockPos,
        to: currentBlockPos + node.nodeSize,
      }) // Remove the old block
      .insertContentAt(currentBlockPos, {
        type: "paragraph", // You can change this to match your node type
        content: [{ type: "text", text: aiResponseContent }],
      })
      .run();
  };

  const menuItems = [
    {
      label: "Turn into",
      icon: <FaArrowsTurnToDots />,
      submenuKey: "turn-into",
    },
    {
      label: "Colors",
      icon: <IoIosColorPalette />,
      submenuKey: "colors",
    },
    {
      label: "Duplicate",
      icon: <FaRegCopy />,
      action: duplicateCurrentBlock,
    },
    {
      label: "Delete",
      icon: <MdDeleteOutline />,
      action: deleteCurrentBlock,
    },
    {
      label: "Comment",
      icon: <FaComment />,
      action: addCommentToBlock,
    },
    {
      label: "Ask AI",
      icon: <FaRobot />,
      action: () => {
        setShowAIModal(true);
        replaceBlockWithAIResponse(aiContent);
      },
    },
  ];

  const convertBlockTo = (
    nodeType:
      | "paragraph"
      | "heading"
      | "bulletList"
      | "orderedList"
      | "taskList"
      | "codeBlock"
      | "blockquote",
    attrs: any = {}
  ) => {
    if (!editor || currentBlockPos === null) return;

    const { state, view } = editor;
    const nodeSelection = NodeSelection.create(state.doc, currentBlockPos);
    const tr = state.tr.setSelection(nodeSelection);
    view.dispatch(tr);
    view.focus();

    const chain = editor.chain().focus();

    switch (nodeType) {
      case "bulletList":
        chain.toggleBulletList().run();
        break;
      case "orderedList":
        chain.toggleOrderedList().run();
        break;
      case "taskList":
        chain.toggleTaskList().run();
        break;
      case "codeBlock":
        chain.toggleCodeBlock().run();
        break;
      case "blockquote":
        chain.toggleBlockquote().run();
        break;
      case "heading":
        chain.setNode("heading", attrs).run();
        break;
      case "paragraph":
        chain.setNode("paragraph").run();
        break;
    }

    setContextMenu(null);
  };

  const turnIntoList = [
    { label: "Text", icon: "T", action: () => convertBlockTo("paragraph") },
    {
      label: "Heading 1",
      icon: "H1",
      action: () => convertBlockTo("heading", { level: 1 }),
    },
    {
      label: "Heading 2",
      icon: "H2",
      action: () => convertBlockTo("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      icon: "H3",
      action: () => convertBlockTo("heading", { level: 3 }),
    },
    {
      label: "Bullet List",
      icon: "•",
      action: () => convertBlockTo("bulletList"),
    },
    {
      label: "Numbered List",
      icon: "1.",
      action: () => convertBlockTo("orderedList"),
    },
    {
      label: "To-do List",
      icon: "☑",
      action: () => convertBlockTo("taskList"),
    },
    {
      label: "Code Block",
      icon: "</>",
      action: () => convertBlockTo("codeBlock"),
    },
    { label: "Quote", icon: "❝", action: () => convertBlockTo("blockquote") },
  ];

  const colorItems = [
    { label: "White", color: "#ffffff" },
    { label: "Black", color: "#000000" },
    { label: "Red", color: "#ff0000" },
    { label: "Blue", color: "#0000ff" },
    { label: "Green", color: "#008000" },
    { label: "Yellow", color: "#ffff00" },
    { label: "Purple", color: "#800080" },
    { label: "Pink", color: "#ffc0cb" },
    { label: "Orange", color: "#ffa500" },
    { label: "Brown", color: "#a52a2a" },
    { label: "Gray", color: "#808080" },
  ];

  return (
    <div className="w-64 bg-white shadow-xl border border-gray-200 rounded-xl py-2 p-1 text-sm animate-fade-in">
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative group border-b border-gray-100 cursor-pointer">
            <button
              onClick={item.action}
              className="w-full flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
              <span className="flex items-center gap-3 text-gray-700">
                <span className="p-1.5 rounded-full bg-gray-100 text-gray-600">
                  {item.icon}
                </span>
                {item.label}
              </span>
              {item.submenuKey && (
                <FaAngleRight className="text-xs text-gray-400" />
              )}
            </button>

            {/* Submenu: Turn Into */}
            {item.submenuKey === "turn-into" && (
              <div className="absolute top-0 left-full ml-2 w-52 h-[250px] overflow-y-auto scroll bg-white border border-gray-200 rounded-lg shadow-md p-2 space-y-1 z-10 hidden group-hover:block cursor-pointer">
                {turnIntoList.map((sub, i) => (
                  <button
                    key={i}
                    onClick={sub.action}
                    className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 text-left">
                    <span className="font-medium">{sub.icon}</span>
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {/* Submenu: Colors */}
            {item.submenuKey === "colors" && (
              <div className="absolute top-0 left-full ml-2 w-52 h-[250px] overflow-y-auto scroll bg-white border border-gray-200 rounded-lg shadow-md p-2 space-y-1 z-10 hidden group-hover:block">
                {colorItems.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!editor) return;
                      editor.chain().focus().setColor(color.color).run();
                      setContextMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 text-left cursor-pointer">
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color.color }}></span>
                    {color.label}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
