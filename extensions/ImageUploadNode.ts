// ImageUploadNode.tsx
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React from "react";
import ImageUploadBox from "@/components/ImageUploadBox";

export const ImageUploadNode = Node.create({
  name: "imageUpload",

  group: "block",

  atom: true, // treated as one unit

  addAttributes() {
    return {
      // you can add attributes if needed
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }];
  },

  renderHTML() {
    return ["div", mergeAttributes({ "data-type": "image-upload" }), 0];
  },

  addNodeView() {
    // Use ReactNodeViewRenderer to render React component inline
    return ReactNodeViewRenderer(ImageUploadBoxWrapper);
  },
});

// Wrapper to pass editor and getPos props to ImageUploadBox
const ImageUploadBoxWrapper = (props) => {
  const { editor, node, getPos, updateAttributes, deleteNode } = props;

  // onUpload handler to replace this node with an image node after upload
  const handleUpload = (url: string) => {
    if (!editor || !getPos) return;
    const pos = getPos();

    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .insertContentAt(pos, {
        type: "image",
        attrs: {
          src: url,
        },
      })
      .run();
  };

  // onClose handler to delete the node (if user cancels)
  const handleClose = () => {
    if (!editor || !getPos) return;
    const pos = getPos();
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  return <ImageUploadBox onUpload={handleUpload} onClose={handleClose} />;
};
