"use client";

import { useState } from "react";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import {
  ResizableImage,
  ResizableImageComponent,
  ResizableImageNodeViewRendererProps,
} from "tiptap-extension-resizable-image";

const NodeView = (props: ResizableImageNodeViewRendererProps) => {
  const editor = props.editor;
  const [open, setOpen] = useState(false);

  const setTextAlign = (textAlign: string) => {
    editor.chain().focus().setTextAlign(textAlign).run();
    setOpen(false);
  };

  return (
    <NodeViewWrapper
      className="relative inline-block image-component"
      data-drag-handle>
      {/* Trigger */}
      <div
        className="inline-flex relative"
        onClick={() => setOpen((prev) => !prev)}>
        <ResizableImageComponent {...props} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 flex gap-1 rounded-md bg-white p-1 shadow-lg border z-50">
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
            onClick={() => setTextAlign("left")}>
            <IconAlignLeft className="h-4 w-4" />
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
            onClick={() => setTextAlign("center")}>
            <IconAlignCenter className="h-4 w-4" />
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
            onClick={() => setTextAlign("right")}>
            <IconAlignRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export const ImageResize = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer((props) =>
      NodeView(props as unknown as ResizableImageNodeViewRendererProps)
    );
  },
});
