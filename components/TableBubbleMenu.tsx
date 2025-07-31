import { useState, useEffect, useRef } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash,
  FiArrowUp,
  FiArrowDown,
  FiColumns,
} from "react-icons/fi";
import {
  BiTable,
  BiMerge,
  BiChevronLeftSquare,
  BiSolidPaint,
} from "react-icons/bi";
import {
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
  MdOutlineTableRestaurant,
  MdTableChart,
  MdTableRows,
} from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
const TableDropdownMenu = ({ editor }: { editor: any }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  if (!editor || !editor.isActive("table")) return null;

  return (
    <div className="absolute z-50">
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="bg-white mt-[-20px] border border-slate-200 shadow-sm p-1 rounded hover:bg-gray-100 transition">
        <CgMenuGridO />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="mt-2 bg-white shadow-2xl border border-slate-200 rounded-md p-3 w-[250px] flex flex-col gap-2 max-h-[300px] overflow-y-auto scroll">
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().addColumnBefore().run()}>
            <FiChevronLeft className="inline-block mr-1" /> Add column before
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().addColumnAfter().run()}>
            <FiChevronRight className="inline-block mr-1" /> Add column after
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().deleteColumn().run()}>
            <FiTrash className="inline-block mr-1" /> Delete column
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().addRowBefore().run()}>
            <FiArrowUp className="inline-block mr-1" /> Add row before
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().addRowAfter().run()}>
            <FiArrowDown className="inline-block mr-1" /> Add row after
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().deleteRow().run()}>
            <FiTrash className="inline-block mr-1" /> Delete row
          </button>
          <button
            className="btnTable text-red-500"
            onClick={() => {
              editor.chain().focus().deleteTable().run();
              setShowMenu(false);
            }}>
            <BiTable className="inline-block mr-1" /> Delete table
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().mergeCells().run()}>
            <BiMerge className="inline-block mr-1" /> Merge cells
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().splitCell().run()}>
            <BiSolidPaint className="inline-block mr-1" /> Split cell
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
            <BiChevronLeftSquare className="inline-block mr-1" /> Toggle header
            column
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
            <MdTableRows className="inline-block mr-1" /> Toggle header row
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
            <MdTableChart className="inline-block mr-1" /> Toggle header cell
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().mergeOrSplit().run()}>
            <FiColumns className="inline-block mr-1" /> Merge or split
          </button>
          <button
            className="btnTable"
            onClick={() =>
              editor.chain().focus().setCellAttribute("colspan", 2).run()
            }>
            <MdOutlineTableRestaurant className="inline-block mr-1" /> Set cell
            attribute
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().fixTables().run()}>
            <HiMiniWrenchScrewdriver className="inline-block mr-1" /> Fix tables
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().goToNextCell().run()}>
            <MdOutlineNavigateNext className="inline-block mr-1" /> Go to next
            cell
          </button>
          <button
            className="btnTable"
            onClick={() => editor.chain().focus().goToPreviousCell().run()}>
            <MdOutlineNavigateBefore className="inline-block mr-1" /> Go to
            previous cell
          </button>
        </div>
      )}
    </div>
  );
};

export default TableDropdownMenu;
