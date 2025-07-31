"use client";
import React, { useEffect } from "react";
import { PiPlus } from "react-icons/pi";
import { RxDragHandleDots2 } from "react-icons/rx";
import {
  FaLongArrowAltDown,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaLongArrowAltUp,
} from "react-icons/fa";
import { RiDeleteBin3Line } from "react-icons/ri";
import TableBubbleMenu from "./TableBubbleMenu";
const TableControls = ({
  editor,
  editorContainerRef,
  tableRect,
  tableRows,
  tableCols,
  setShowRowMenu,
  setShowColMenu,
}: any) => {
  if (!editor?.isActive("table") || !tableRect) return null;
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!editor || !editorContainerRef.current) return;
      const tableElement = editorContainerRef.current.querySelector("table");
      if (!tableElement) return;
      if (!tableElement.contains(event.target as Node)) {
        editor.chain().focus().insertContent("<p></p>").run();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [editor, editorContainerRef]);
  const editorBounds = editorContainerRef.current!.getBoundingClientRect();
  const cellHeight = tableRect.height / tableRows;
  const cellWidth = tableRect.width / tableCols;
  return (
    <>
      {/* Row Controls */}
      {Array.from({ length: tableRows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="absolute z-10 space-y-2.5 w-[300px]"
          style={{
            left: 5,
            top: tableRect.top - editorBounds.top + rowIndex * cellHeight + 20,
          }}>
          {rowIndex === tableRows - 1 ? (
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="p-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full transition-transform hover:scale-110"
              title="Add row below">
              <PiPlus size={16} />
            </button>
          ) : (
            <div className="relative group">
              <button
                className="p-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-transform hover:scale-110"
                title="Row options">
                <RxDragHandleDots2 size={14} />
              </button>
              <div className="absolute left-7 top-0 z-20 hidden group-hover:flex flex-col bg-white border border-gray-200 rounded-md shadow-md min-w-[140px]">
                <button
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="px-3 py-2 hover:bg-gray-100 text-left text-sm w-full">
                  Add row <FaLongArrowAltUp />
                </button>
                <button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="px-3 py-2 hover:bg-gray-100 text-left text-sm w-full">
                  Add row <FaLongArrowAltDown />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="px-3 py-2 hover:bg-red-100 text-left text-sm text-red-500 w-full">
                  <span className="text-red-500 mr-2">
                    <RiDeleteBin3Line />
                  </span>
                  Delete row
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Column Controls */}
      {Array.from({ length: tableCols }).map((_, colIndex) => (
        <div
          key={`col-${colIndex}`}
          className="absolute z-10 space-y-2.5 w-[300px]"
          style={{
            top: tableRect.top - editorBounds.top - 11,
            left:
              tableRect.left - editorBounds.left + colIndex * cellWidth + 50,
          }}>
          {colIndex === tableCols - 1 ? (
            <div className="flex items-center gap-5">
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="p-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full transition-transform hover:scale-110"
                title="Add column right">
                <PiPlus size={16} />
              </button>
              <TableBubbleMenu editor={editor} />
            </div>
          ) : (
            <div className="relative group">
              <button
                className="p-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-transform hover:scale-110"
                title="Column options">
                <RxDragHandleDots2 size={14} />
              </button>
              <div className="absolute top-7 left-0 z-20 hidden group-hover:flex flex-col bg-white border border-gray-200 rounded-md shadow-md min-w-[150px]">
                <button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="px-3 py-2 hover:bg-gray-100 text-left text-sm w-full">
                  Add column <FaLongArrowAltLeft />
                </button>
                <button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="px-3 py-2 hover:bg-gray-100 text-left text-sm w-full">
                  Add column <FaLongArrowAltRight />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="px-3 py-2 hover:bg-red-100 text-left text-sm text-red-500">
                  <span className="text-red-500 mr-2">
                    <RiDeleteBin3Line />
                  </span>
                  Delete column
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
export default TableControls;
