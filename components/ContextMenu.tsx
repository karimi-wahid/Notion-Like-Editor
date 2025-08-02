"use client";

import { Editor } from "@tiptap/core";
import React from "react";
import { FaAngleRight, FaComment, FaRegCopy, FaRobot } from "react-icons/fa";
import { FaArrowsTurnToDots } from "react-icons/fa6";
import { IoIosColorPalette, IoMdReturnRight } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

const ContextMenu = ({
  editor,
  setContextMenu,
}: {
  editor: Editor;
  setContextMenu: any;
}) => {
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
      action: () => alert("Duplicate action"),
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

  const turnIntoList = [
    { label: "Text", icon: "T", action: () => alert("Turn into Text") },
    { label: "Heading 1", icon: "H1", action: () => alert("Heading 1") },
    { label: "Heading 2", icon: "H2", action: () => alert("Heading 2") },
    { label: "Heading 3", icon: "H3", action: () => alert("Heading 3") },
  ];

  const colorItems = [
    { label: "White", icon: "A", action: () => alert("White") },
    { label: "Black", icon: "A", action: () => alert("Black") },
    { label: "Red", icon: "A", action: () => alert("Red") },
    { label: "Blue", icon: "A", action: () => alert("Blue") },
    { label: "Green", icon: "A", action: () => alert("Green") },
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
                      onClick={color.action}
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
