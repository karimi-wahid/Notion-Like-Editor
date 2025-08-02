"use client";

import React, { useEffect, useState, useRef } from "react";
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
  hoveredRow,
  hoveredCol,
}: any) => {
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [focusedCol, setFocusedCol] = useState<number | null>(null);
  const [hoveringRow, setHoveringRow] = useState<number | null>(null);
  const [hoveringCol, setHoveringCol] = useState<number | null>(null);

  const rowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const colTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editor) return;

    const updateFocus = () => {
      if (!editor.isActive("table")) {
        setFocusedRow(null);
        setFocusedCol(null);
        return;
      }

      const { state } = editor;
      const $anchor = state.selection.$anchor;
      let depth = $anchor.depth;

      while (depth > 0) {
        const node = $anchor.node(depth);
        if (
          node.type.name === "tableCell" ||
          node.type.name === "tableHeader"
        ) {
          const rowNode = $anchor.node(depth - 1);
          const tableNode = $anchor.node(depth - 2);

          const rowIndex = tableNode.content.findIndex(
            (child) => child === rowNode
          );
          const colIndex = rowNode.content.findIndex((child) => child === node);

          setFocusedRow(rowIndex);
          setFocusedCol(colIndex);
          return;
        }
        depth--;
      }

      setFocusedRow(null);
      setFocusedCol(null);
    };

    const clearFocus = () => {
      setFocusedRow(null);
      setFocusedCol(null);
    };

    editor.on("selectionUpdate", updateFocus);
    editor.on("blur", clearFocus);

    return () => {
      editor.off("selectionUpdate", updateFocus);
      editor.off("blur", clearFocus);
    };
  }, [editor]);

  if (!editor?.isActive("table") || !tableRect) return null;

  const editorBounds = editorContainerRef.current!.getBoundingClientRect();
  const cellHeight = tableRect.height / tableRows;
  const cellWidth = tableRect.width / tableCols;

  const shouldShowRow = (index: number) =>
    (index === hoveredRow || index === focusedRow || index === hoveringRow) &&
    index < tableRows;
  const shouldShowCol = (index: number) =>
    (index === hoveredCol || index === focusedCol || index === hoveringCol) &&
    index < tableCols;

  return (
    <>
      {/* Row controls */}
      {Array.from({ length: tableRows }).map((_, rowIndex) => {
        if (!shouldShowRow(rowIndex)) return null;
        return (
          <div
            key={`row-${rowIndex}`}
            className="absolute z-30 space-y-2.5"
            style={{
              left: 0,
              top:
                tableRect.top - editorBounds.top + rowIndex * cellHeight + 20,
            }}
            onMouseEnter={() => {
              if (rowTimeoutRef.current) clearTimeout(rowTimeoutRef.current);
              setHoveringRow(rowIndex);
            }}
            onMouseLeave={() => {
              rowTimeoutRef.current = setTimeout(() => {
                setHoveringRow(null);
              }, 300);
            }}>
            <div className="relative z-40 group">
              {rowIndex === tableRows - 1 ? (
                <button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="p-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-transform hover:scale-110 cursor-pointer"
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
                      onClick={() =>
                        editor.chain().focus().addRowBefore().run()
                      }
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
          </div>
        );
      })}

      {/* Column controls */}
      {Array.from({ length: tableCols }).map((_, colIndex) => {
        if (!shouldShowCol(colIndex)) return null;
        return (
          <div
            key={`col-${colIndex}`}
            className="absolute z-30 space-y-2.5"
            style={{
              top: tableRect.top - editorBounds.top - 11,
              left:
                tableRect.left - editorBounds.left + colIndex * cellWidth + 50,
            }}
            onMouseEnter={() => {
              if (colTimeoutRef.current) clearTimeout(colTimeoutRef.current);
              setHoveringCol(colIndex);
            }}
            onMouseLeave={() => {
              colTimeoutRef.current = setTimeout(() => {
                setHoveringCol(null);
              }, 300);
            }}>
            <div className="relative z-40 group">
              {colIndex === tableCols - 1 ? (
                <div className="flex items-center space-x-3 justify-between">
                  <button
                    onClick={() =>
                      editor.chain().focus().addColumnAfter().run()
                    }
                    className="p-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full transition-transform hover:scale-110 cursor-pointer"
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
                      onClick={() =>
                        editor.chain().focus().addColumnBefore().run()
                      }
                      className="px-3 py-2 hover:bg-gray-100 text-left text-sm w-full">
                      Add column <FaLongArrowAltLeft />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().addColumnAfter().run()
                      }
                      className="px-3 py-2 hover:bg-gray-100 text-left text-sm w-full">
                      Add column <FaLongArrowAltRight />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().deleteColumn().run()
                      }
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
          </div>
        );
      })}
    </>
  );
};

export default TableControls;
