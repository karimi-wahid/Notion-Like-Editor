import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ChartBlock from "./ChartBlock";

export const ChartNode = Node.create({
  name: "chartBlock",

  group: "block",

  atom: true,

  parseHTML() {
    return [{ tag: "chart-block" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["chart-block", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartBlock);
  },
});
