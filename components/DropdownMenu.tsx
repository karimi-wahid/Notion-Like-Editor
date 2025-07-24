import React, { useState, useEffect, useCallback } from "react";

interface Item {
  title: string;
  [key: string]: any;
}

interface DropdownMenuProps {
  items: Item[];
  command: (item: Item) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, command }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const upHandler = useCallback(() => {
    setSelectedIndex(
      (prevIndex) => (prevIndex + items.length - 1) % items.length
    );
  }, [items.length]);

  const downHandler = useCallback(() => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const enterHandler = useCallback(() => {
    selectItem(selectedIndex);
  }, [selectedIndex, selectItem]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item) {
        command(item);
      }
    },
    [command, items]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        upHandler();
        event.preventDefault(); // Prevent scrolling the page
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        event.preventDefault(); // Prevent scrolling the page
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        event.preventDefault(); // Prevent form submission
        return true;
      }

      return false;
    },
    [upHandler, downHandler, enterHandler]
  );

  // Make sure the component has focus so keydown events are captured
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, []);

  return (
    <div
      className="dropdown-menu"
      onKeyDown={onKeyDown}
      tabIndex={0} // Make the div focusable
      ref={dropdownRef}>
      {items.length > 0 ? (
        items.map((item, index) => (
          <button
            key={index}
            className={index === selectedIndex ? "is-selected" : ""}
            onClick={() => selectItem(index)}>
            {item.title}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
};

export default DropdownMenu;
