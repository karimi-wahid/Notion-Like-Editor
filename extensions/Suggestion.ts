import { computePosition, flip, shift } from "@floating-ui/dom";
import { posToDOMRect, ReactRenderer } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import {
  FiType,
  FiCheckSquare,
  FiFileText,
  FiGrid,
  FiMinus,
  FiLink,
  FiSmile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFile,
  FiBookmark,
} from "react-icons/fi";
import CommandList from "@/components/CommandList";
import {
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaHighlighter,
  FaQuoteRight,
} from "react-icons/fa";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdOutlineSubscript,
  MdOutlineSuperscript,
} from "react-icons/md";
import { IoIosCheckmark, IoIosCreate } from "react-icons/io";
import { MdAdd, MdAutoFixHigh, MdCreate } from "react-icons/md";
import { HiOutlineMinus } from "react-icons/hi";

let reactRenderer: ReactRenderer | null = null;

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to
      ),
  };

  computePosition(virtualElement as any, element, {
    placement: "right-end",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    Object.assign(element.style, {
      position: strategy,
      left: `${x}px`,
      top: `${y}px`,
      width: "max-content",
    });
  });
};

export default {
  items: ({ query }: { query: string }) => {
    const allSections = [
      {
        name: "Mark",
        items: [
          {
            title: "Text",
            icon: FiType,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("paragraph")
                .run();
            },
          },
          {
            title: "Heading 1",
            icon: LuHeading1,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
            },
          },
          {
            title: "Heading 2",
            icon: LuHeading2,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
            },
          },
          {
            title: "Heading 3",
            icon: LuHeading3,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 3 })
                .run();
            },
          },
          {
            title: "Quote",
            icon: FaQuoteRight,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBlockquote()
                .run();
            },
          },
          {
            title: "Divider",
            icon: FiMinus,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHorizontalRule()
                .run();
            },
          },
          {
            title: "Link",
            icon: FiLink,
            command: ({ editor, range }: any) => {
              const url = window.prompt("Enter URL");
              if (url) {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setLink({ href: url })
                  .run();
              }
            },
          },
          {
            title: "Subscript",
            icon: MdOutlineSubscript,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).toggleSubscript().run();
            },
          },
          {
            title: "Superscript",
            icon: MdOutlineSuperscript,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleSuperscript()
                .run();
            },
          },
          {
            title: "Highlight",
            icon: FaHighlighter,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).toggleHighlight().run();
            },
          },
        ],
      },
      {
        name: "Lists",
        items: [
          {
            title: "Bullet List",
            icon: MdFormatListBulleted,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run();
            },
          },
          {
            title: "Numbered List",
            icon: MdFormatListNumbered,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run();
            },
          },
          {
            title: "To-do List",
            icon: FiCheckSquare,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
          },
        ],
      },
      {
        name: "Text Alignment",
        items: [
          {
            title: "Align Left",
            icon: FaAlignLeft,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setTextAlign("left")
                .run();
            },
          },
          {
            title: "Align Center",
            icon: FaAlignJustify,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setTextAlign("center")
                .run();
            },
          },
          {
            title: "Align Right",
            icon: FaAlignRight,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setTextAlign("right")
                .run();
            },
          },
        ],
      },
      {
        name: "AI Block",
        items: [
          {
            title: "Improve Writing",
            icon: MdCreate,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run();
            },
          },
          {
            title: "Fix Grammer",
            icon: MdAutoFixHigh,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run();
            },
          },
          {
            title: "Make Shorter",
            icon: HiOutlineMinus,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
          },
          {
            title: "Make Longer",
            icon: MdAdd,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
          },
          {
            title: "Continue Writing",
            icon: IoIosCheckmark,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
          },
        ],
      },
      {
        name: "Media",
        items: [
          {
            title: "Image",
            icon: FiImage,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).run();
              window.dispatchEvent(
                new CustomEvent("open-image-upload", {
                  detail: { editor, range, type: "image" },
                })
              );
            },
          },
          {
            title: "Video",
            icon: FiVideo,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).run();
              window.dispatchEvent(
                new CustomEvent("open-insert-link", {
                  detail: { editor, range, type: "video" },
                })
              );
            },
          },
          {
            title: "Audio",
            icon: FiMusic,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).run();
              window.dispatchEvent(
                new CustomEvent("open-insert-link", {
                  detail: { editor, range, type: "audio" },
                })
              );
            },
          },
          {
            title: "File",
            icon: FiFile,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).run();
              window.dispatchEvent(
                new CustomEvent("open-insert-link", {
                  detail: { editor, range, type: "file" },
                })
              );
            },
          },
          {
            title: "Web Bookmark",
            icon: FiBookmark,
            command: ({ editor, range }: any) => {
              editor.chain().focus().deleteRange(range).run();
              window.dispatchEvent(
                new CustomEvent("open-insert-link", {
                  detail: { editor, range, type: "link" },
                })
              );
            },
          },
        ],
      },

      {
        name: "Extras",
        items: [
          {
            title: "Emoji",
            icon: FiSmile,
            command: ({ editor, range }: any) => {
              window.dispatchEvent(
                new CustomEvent("open-emoji-picker", {
                  detail: { editor, range },
                })
              );
            },
          },
          {
            title: "Table",
            icon: FiGrid,
            command: ({ editor, range }: any) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertTable({
                  rows: 2,
                  cols: 2,
                  withHeaderRow: true,
                })
                .run();
            },
          },
        ],
      },
    ];

    // Filter items per section by query and remove empty sections
    return allSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.title.toLowerCase().startsWith(query.toLowerCase())
        ),
      }))
      .filter((section) => section.items.length > 0);
  },
  render: () => {
    let popup: HTMLElement;

    return {
      onStart: (props: any) => {
        reactRenderer = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        popup = document.createElement("div");
        popup.classList.add("slash-command-popup");
        popup.appendChild(reactRenderer.element);
        document.body.appendChild(popup);

        if (props.clientRect) {
          updatePosition(props.editor, popup);
        }
      },

      onUpdate(props: any) {
        reactRenderer?.updateProps(props);

        if (props.clientRect) {
          updatePosition(props.editor, popup);
        }
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup?.remove();
          reactRenderer?.destroy();
          return true;
        }
        // Prevent default Enter behavior when a command is selected
        if (props.event.key === "Enter") {
          props.event.preventDefault();
          return reactRenderer?.ref?.onKeyDown?.(props) ?? true;
        }
        return reactRenderer?.ref?.onKeyDown?.(props) ?? false;
      },

      onExit() {
        popup?.remove();
        reactRenderer?.destroy();
      },
    };
  },
};
