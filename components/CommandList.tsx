import React, { useEffect, useState } from "react";

type CommandItem = {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  command: ({ editor, range }: any) => void;
};

type CommandSection = {
  name: string;
  items: CommandItem[];
};

interface CommandListProps {
  items: CommandSection[];
  command: (item: CommandItem) => void;
}

const CommandList: React.FC<CommandListProps> = ({ items, command }) => {
  const flatItems = items.flatMap((section) => section.items);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex(
          (prev) => (prev + flatItems.length - 1) % flatItems.length
        );
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const item = flatItems[selectedIndex];
        if (item) command(item);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [flatItems, selectedIndex, command]);

  const handleSelect = (item: CommandItem) => {
    command(item);
  };

  return (
    <div className="absolute z-50 w-72 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl p-1 flex flex-col scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {items.length === 0 ? (
        <div className="text-gray-400 text-sm px-4 py-2 italic select-none">
          No matches found
        </div>
      ) : (
        items.map((section, sectionIndex) => (
          <div key={sectionIndex} className="py-1">
            <div className="text-[11px] text-gray-400 font-semibold px-4 py-1 uppercase tracking-wide border-t border-gray-200 w-[95%]">
              {section.name}
            </div>
            {section.items.map((item, index) => {
              const flatIndex =
                items.slice(0, sectionIndex).flatMap((s) => s.items).length +
                index;
              const Icon = item.icon;
              const isSelected = flatIndex === selectedIndex;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className={`group flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gray-100 text-black"
                      : "hover:bg-gray-50 text-gray-800"
                  }`}>
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 text-gray-400 group-hover:text-black transition-colors duration-150`}
                    />
                  )}
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        ))
      )}
      {/* Absolute positioned ESC info */}
      <div className="sticky bottom-0 left-0 px-0 py-1 bg-slate-100 flex items-center justify-center rounded text-xs text-gray-500 pointer-events-none">
        <p>
          Press <span className="font-semibold">Esc</span> to close
        </p>
      </div>
    </div>
  );
};

export default CommandList;
