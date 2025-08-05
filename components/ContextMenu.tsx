"use client";

import { Editor } from "@tiptap/core";
import React from "react";
import { FaAngleRight, FaComment, FaRegCopy, FaRobot } from "react-icons/fa";
import { FaArrowsTurnToDots } from "react-icons/fa6";
import { IoIosColorPalette, IoMdReturnRight } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { NodeSelection } from "prosemirror-state";

const ContextMenu = ({
  editor,
  setContextMenu,
  currentBlockPos,
}: {
  editor: Editor;
  setContextMenu: any;
  currentBlockPos: number | null;
}) => {
  const duplicateCurrentBlock = () => {
    if (!editor || currentBlockPos === null) return;

    const node = editor.state.doc.nodeAt(currentBlockPos);
    if (!node) return;

    editor
      .chain()
      .focus()
      .insertContentAt(currentBlockPos + node.nodeSize, node.toJSON())
      .run();

    setContextMenu(null);
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
      label: "Move to",
      icon: <IoMdReturnRight />,
      action: () => alert("Move to action"),
    },
    {
      label: "Delete",
      icon: <MdDeleteOutline />,
      action: () => alert("Delete action"),
    },
    {
      label: "Comment",
      icon: <FaComment />,
      action: () => alert("Comment action"),
    },
    {
      label: "Ask AI",
      icon: <FaRobot />,
      action: () => alert("Ask AI action"),
    },
  ];

  // const convertBlockTo = (
  //     nodeType: 'heading' | 'paragraph',
  //     attrs: any = {},
  // ) => {
  //     if (!editor) return

  //     const { state, view } = editor
  //     const { $from } = state.selection

  //     const pos = $from.start($from.depth)
  //     const node = state.doc.nodeAt(pos)
  //     if (!node) return

  //     // Create NodeSelection at block position
  //     const nodeSelection = NodeSelection.create(state.doc, pos)
  //     const tr = state.tr.setSelection(nodeSelection)
  //     view.dispatch(tr)
  //     view.focus()

  //     // Now run setNode command with updated selection
  //     editor.chain().focus().setNode(nodeType, attrs).run()

  //     setContextMenu(null)
  // }

  const convertBlockTo = (
    nodeType: "heading" | "paragraph",
    attrs: any = {}
  ) => {
    if (!editor || currentBlockPos === null) return;

    // Set selection explicitly to the block
    const { state, view } = editor;
    const nodeSelection = NodeSelection.create(state.doc, currentBlockPos);
    const tr = state.tr.setSelection(nodeSelection);
    view.dispatch(tr);
    view.focus();

    editor.chain().focus().setNode(nodeType, attrs).run();

    setContextMenu(null);
  };

  const turnIntoList = [
    {
      label: "Text",
      icon: "T",
      action: () => convertBlockTo("paragraph"),
    },
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
  ];

  const colorItems = [
    { label: "White", icon: "A", color: "#ffffff" },
    { label: "Black", icon: "A", color: "#000000" },
    { label: "Red", icon: "A", color: "#ff0000" },
    { label: "Blue", icon: "A", color: "#0000ff" },
    { label: "Green", icon: "A", color: "#008000" },
  ];

  return (
    <div className="w-64 bg-white border border-gray-200 rounded py-5 px-2 text-sm">
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`group relative flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer`}>
            <button
              onClick={item.action}
              className="flex items-center gap-3 w-full text-left">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>

            {item.submenuKey && (
              <span className="text-xs text-gray-400">
                <FaAngleRight />
              </span>
            )}

            {/* Submenu: Turn into */}
            {item.submenuKey === "turn-into" && (
              <div className="absolute top-0 left-full ml-1 w-56 bg-white border border-gray-200 rounded p-2 hidden group-hover:block z-10">
                <ul className="space-y-1">
                  {turnIntoList.map((sub, i) => (
                    <li
                      key={i}
                      onClick={sub.action}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
                      <span>{sub.icon}</span>
                      <span>{sub.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submenu: Colors */}
            {item.submenuKey === "colors" && (
              <div className="absolute top-0 left-full ml-1 w-56 bg-white border border-gray-200 rounded p-2 hidden group-hover:block z-10">
                <ul className="space-y-1">
                  {colorItems.map((color, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        if (!editor) return;
                        editor.chain().focus().setColor(color.color).run();
                        setContextMenu(null);
                      }}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
                      <span>{color.icon}</span>
                      <span>{color.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
