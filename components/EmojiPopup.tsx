"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { computePosition, offset, flip, shift } from "@floating-ui/dom";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

type Props = {
  editor: any;
  range: { from: number; to: number };
  onClose: () => void;
};

export default function EmojiPickerPopup({ editor, range, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const virtualElement = {
      getBoundingClientRect: () => editor.view.coordsAtPos(range.from),
    };

    if (ref.current) {
      computePosition(virtualElement, ref.current, {
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift()],
      }).then(({ x, y }) => {
        Object.assign(ref.current!.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: "absolute",
          zIndex: 1000,
        });
      });
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [editor, range, onClose]);

  return (
    <div
      ref={ref}
      className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl">
      <EmojiPicker
        theme="light"
        onEmojiClick={(emojiData: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(emojiData.emoji)
            .run();
          onClose();
        }}
      />
    </div>
  );
}
