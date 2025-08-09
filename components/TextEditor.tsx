"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Gapcursor } from "@tiptap/extensions";
import { Placeholder } from "@tiptap/extensions";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import Highlight from "@tiptap/extension-highlight";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import AIModal from "./AIModal";
import Heading from "@tiptap/extension-heading";
import Commands from "@/extensions/Commands";
import suggestion from "@/extensions/Suggestion";
import BubbleMenus from "./BubbleMenu";
import EmojiPopup from "./EmojiPopup";
import InsertLinkPrompt from "./InsertLinkPrompt";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TableBubbleMenu from "./TableBubbleMenu";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { MdDragIndicator } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-text-style";
import ContextMenu from "./ContextMenu";
import ImageUploadBox from "./ImageUploadBox";
import ImageResize from "tiptap-extension-resize-image";
import { ResizableImage } from "tiptap-extension-resizable-image";
import TableControls from "./TableControls";
import { NodeSelection } from "prosemirror-state";
import { HiOutlineSparkles } from "react-icons/hi";
import "tiptap-extension-resizable-image/styles.css";

const TextEditor = forwardRef(
  (
    { initialContent }: { initialContent?: string },
    ref: React.Ref<{
      getContent: () => string;
      setContent: (content: string) => void;
      focus: () => void;
    }>
  ) => {
    const [isEditable, setIsEditable] = useState(true);
    const [showAIModal, setShowAIModal] = useState(false);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const aiBoxRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const scrollButtonRef = useRef<HTMLButtonElement | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [editorWidth, setEditorWidth] = useState<number>(0);
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);
    const [aiModalPosition, setAiModalPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [emojiData, setEmojiData] = useState<null | {
      editor: any;
      range: any;
    }>(null);
    const [prompt, setPrompt] = useState<null | {
      editor: any;
      range: { from: number; to: number };
      type: "video" | "audio" | "file" | "link";
    }>(null);

    const [imageUploadData, setImageUploadData] = useState(false);
    const imageUploadRef = useRef<HTMLDivElement | null>(null);
    const [imageUploadBoxPos, setImageUploadBoxPos] = useState<{
      x: number;
      y: number;
    } | null>(null);

    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);
    const [tableRect, setTableRect] = useState<DOMRect | null>(null);
    const [tableRows, setTableRows] = useState(0);
    const [tableCols, setTableCols] = useState(0);
    const [showRowMenu, setShowRowMenu] = useState(false);
    const [showColMenu, setShowColMenu] = useState(false);

    const [currentBlockPos, setCurrentBlockPos] = useState<number | null>(null);

    const editor = useEditor({
      extensions: [
        StarterKit,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Heading.configure({ levels: [1, 2, 3] }),
        Commands.configure({ suggestion }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Gapcursor,
        TableKit.configure({ table: { resizable: true } }),
        TableRow,
        TableHeader,
        TableCell,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({
          placeholder: "Start writing or press '/' for command options...",
        }),
        Emoji.configure({
          emojis: gitHubEmojis,
          enableEmoticons: true,
          suggestion,
        }),
        Image,
        ResizableImage.configure({
          defaultWidth: 200,
          defaultHeight: 200,
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
          isAllowedUri: (url, ctx) => {
            try {
              const parsedUrl = url.includes(":")
                ? new URL(url)
                : new URL(`${ctx.defaultProtocol}://${url}`);
              if (!ctx.defaultValidate(parsedUrl.href)) return false;

              const disallowedProtocols = ["ftp", "file", "mailto"];
              const protocol = parsedUrl.protocol.replace(":", "");
              if (disallowedProtocols.includes(protocol)) return false;

              const allowedProtocols = ctx.protocols.map((p) =>
                typeof p === "string" ? p : p.scheme
              );
              if (!allowedProtocols.includes(protocol)) return false;

              const disallowedDomains = [
                "example-phishing.com",
                "malicious-site.net",
              ];
              return !disallowedDomains.includes(parsedUrl.hostname);
            } catch {
              return false;
            }
          },
        }),
        Subscript,
        Superscript,
      ],
      editorProps: {
        attributes: {
          class:
            "tiptap-block-gap min-h-[500px] w-[800px] border border-slate-300 rounded-md outline-none py-2 px-3 overflow-x-auto max-w-full",
        },
      },
      content: "<p>Hello World! 🌎️</p>",
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const view = editor.view;
        const dom = view.dom as HTMLElement;
        const table = dom.querySelector("table");
        if (table) {
          const rect = table.getBoundingClientRect();
          setTableRect(rect);
          setTableRows(table.querySelectorAll("tr").length);
          setTableCols(table.querySelectorAll("tr")[0]?.children.length || 0);
        } else {
          setTableRect(null);
        }
      },
    });

    useEffect(() => {
      if (editor && initialContent !== undefined) {
        editor.commands.setContent(initialContent);
      }
    }, [initialContent, editor]);

    useImperativeHandle(
      ref,
      () => ({
        getContent: () => editor?.getJSON() || "",
        setContent: (content: string) => {
          if (editor) editor.commands.setContent(content);
        },
        shouldAutoLink: (url) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            return !disallowedDomains.includes(parsedUrl.hostname);
          } catch {
            return false;
          }
        },
      }),
      [editor]
    );

    // Table //

    const handleMouseOver = useCallback(
      (e: MouseEvent) => {
        const table = editor?.view.dom.querySelector("table");
        if (!table) return;

        const rows = Array.from(table.querySelectorAll("tr"));
        const rect = table.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cellWidth = rect.width / (rows[0]?.children.length || 1);
        const cellHeight = rect.height / rows.length;

        setHoveredCol(Math.floor(x / cellWidth));
        setHoveredRow(Math.floor(y / cellHeight));
      },
      [editor]
    );

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseOver);
      return () => document.removeEventListener("mousemove", handleMouseOver);
    }, [handleMouseOver]);

    // table //

    useEffect(() => {
      if (editor) editor.setEditable(isEditable);
    }, [isEditable, editor]);

    useEffect(() => {
      function updateWidth() {
        const rect = editorContainerRef.current?.getBoundingClientRect();
        if (rect) setEditorWidth(rect.width);
      }
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, []);

    useEffect(() => {
      const handler = (e: CustomEvent) => {
        setEmojiData({ editor: e.detail.editor, range: e.detail.range });
      };
      window.addEventListener("open-emoji-picker", handler as EventListener);
      return () =>
        window.removeEventListener(
          "open-emoji-picker",
          handler as EventListener
        );
    }, []);

    useEffect(() => {
      const handler = (e: CustomEvent) => {
        setPrompt({
          editor: e.detail.editor,
          range: e.detail.range,
          type: e.detail.type,
        });
      };
      window.addEventListener("open-insert-link", handler as EventListener);
      return () =>
        window.removeEventListener(
          "open-insert-link",
          handler as EventListener
        );
    }, []);

    useEffect(() => {
      if (!showAIModal || !aiBoxRef.current) {
        setShowScrollButton(false);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          setShowScrollButton(!entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0,
        }
      );

      observer.observe(aiBoxRef.current);

      return () => {
        if (aiBoxRef.current) observer.unobserve(aiBoxRef.current);
      };
    }, [showAIModal, aiBoxRef.current]);

    /// Table Controls ///
    // Handle table hover and calculate table dimensions
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!editor?.isActive("table")) {
          setHoveredRow(null);
          setHoveredCol(null);
          setTableRect(null);
          return;
        }

        const target = e.target as HTMLElement;
        const cell = target.closest("th, td");
        const table = target.closest("table");

        if (!cell || !table) {
          setHoveredRow(null);
          setHoveredCol(null);
          return;
        }

        const rect = table.getBoundingClientRect();
        setTableRect(rect);

        // Calculate row and column counts
        const rows = Array.from(table.querySelectorAll("tr"));
        const rowIndex = rows.findIndex((row) => row.contains(cell));
        if (rowIndex === -1) return;

        const cells = Array.from(rows[rowIndex].querySelectorAll("th, td"));
        const cellIndex = cells.findIndex((c) => c === cell);
        if (cellIndex === -1) return;

        setTableRows(rows.length);
        setTableCols(cells.length);
        setHoveredRow(rowIndex);
        setHoveredCol(cellIndex);
      };

      document.addEventListener("mousemove", handleMouseMove);
      return () => document.removeEventListener("mousemove", handleMouseMove);
    }, [editor]);

    // Table here -------------//
    useEffect(() => {
      if (!editor || !editorContainerRef.current) return;
      const container = editorContainerRef.current;

      function onClick(e: MouseEvent) {
        if (!editor || !container) return;

        const target = e.target as HTMLElement;

        // Ignore clicks inside the table (anywhere inside)
        if (target.closest("table")) {
          return; // Don't add paragraph if click is inside the table
        }

        // Your existing logic to add a paragraph if clicking below the last node
        const lastChild = container.lastElementChild;
        if (!lastChild) return;

        const rect = lastChild.getBoundingClientRect();
        const clickY = e.clientY;
        const isBelow = clickY > rect.bottom + 20;

        const lastNode = editor.state.doc.lastChild;
        const isLastParagraphEmpty =
          lastNode?.type.name === "paragraph" &&
          (lastNode?.textContent?.trim() === "" ||
            lastNode?.textContent?.trim() === "\u200B");

        if (isBelow && !isLastParagraphEmpty) {
          editor.commands.focus("end");
          editor.commands.enter();
        }
      }

      container.addEventListener("click", onClick);
      return () => container.removeEventListener("click", onClick);
    }, [editor]);

    // hide imageupload box when clicing outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          imageUploadRef.current &&
          !imageUploadRef.current.contains(event.target as Node)
        ) {
          setImageUploadData(false);
        }
      }

      if (imageUploadData) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [imageUploadData]);

    useEffect(() => {
      const handler = (e: CustomEvent) => {
        setImageUploadData({ editor: e.detail.editor });
      };
      window.addEventListener("open-image-upload", handler as EventListener);
      return () =>
        window.removeEventListener(
          "open-image-upload",
          handler as EventListener
        );
    }, []);

    const scrollToAIBox = () => {
      aiBoxRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    const handleAskAIAtEndOfBlock = () => {
      if (!editor || !editor.view) return;
      const { state, view } = editor;
      const { $from } = state.selection;
      const blockStartPos = $from.start($from.depth);
      const blockNode = $from.node($from.depth);
      const blockEndPos = blockStartPos + blockNode.nodeSize - 2;
      const coords = view.coordsAtPos(blockEndPos);
      const containerRect = editorContainerRef.current?.getBoundingClientRect();
      const y = containerRect
        ? coords.bottom - containerRect.top + 8
        : coords.bottom + 8;
      setAiModalPosition({ x: 0, y });
      setShowAIModal(true);
    };

    // Context menu
    function getBlockDOMNode(
      view: Editor["view"],
      pos: number
    ): HTMLElement | null {
      let dom = view.nodeDOM(pos);
      if (!dom) return null;

      // If it's a text node, go to its parent element node
      while (dom.nodeType !== 1) {
        dom = dom.parentNode;
        if (!dom) return null;
      }

      return dom as HTMLElement;
    }

    // outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(event.target as Node)
        ) {
          setContextMenu(null);
        }
      };

      if (contextMenu) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [contextMenu]);

    // imageuploadbox
    useEffect(() => {
      const handler = (e: CustomEvent) => {
        const editor = e.detail.editor;
        const view = editor.view;
        const state = editor.state;
        const { $from } = state.selection;
        const blockStartPos = $from.start($from.depth);
        const blockNode = $from.node($from.depth);
        const blockEndPos = blockStartPos + blockNode.nodeSize - 2;

        const coords = view.coordsAtPos(blockEndPos);
        const containerRect =
          editorContainerRef.current?.getBoundingClientRect();

        const y = containerRect
          ? coords.bottom - containerRect.top + 8
          : coords.bottom + 8;

        // Optional x if needed, you can center it or align it
        setImageUploadBoxPos({ x: 0, y });

        // Now show image upload box
        setImageUploadData({ editor });
      };

      window.addEventListener("open-image-upload", handler as EventListener);
      return () =>
        window.removeEventListener(
          "open-image-upload",
          handler as EventListener
        );
    }, []);
    const [aiContent, setAIContent] = useState("");

    return (
      <div>
        {editor && (
          <BubbleMenus
            editor={editor}
            setShowAIModal={setShowAIModal}
            handleAskAIAtEndOfBlock={handleAskAIAtEndOfBlock}
          />
        )}
        <DragHandle
          editor={editor}
          tippyOptions={{ placement: "left" }}
          className="cursor-grabbing items-center flex pr-3 space-x-1">
          <button
            type="button"
            onClick={() => {
              if (!editor) return;
              const { state } = editor;
              const { $from } = state.selection;
              editor
                .chain()
                .focus()
                .setTextSelection($from.end()) // Move cursor to end of block
                .splitBlock()
                .insertContent("/")
                .run();
            }}
            className="text-gray-400 hover:bg-gray-100 rounded transition cursor-pointer"
            title="Insert slash command">
            <FaPlus size={15} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!editor) return;

              const { state, view } = editor;
              const { $from } = state.selection;
              const pos = $from.start($from.depth);
              setCurrentBlockPos(pos);

              // ✅ Select the full block using NodeSelection
              const node = state.doc.nodeAt(pos);
              if (node) {
                const transaction = state.tr.setSelection(
                  NodeSelection.create(state.doc, pos)
                );
                view.dispatch(transaction);
                view.focus();
              }
              // ✅ Show context menu at block position
              const domNode = getBlockDOMNode(editor.view, pos);
              if (!domNode || !editorContainerRef.current) return;

              const rect = domNode.getBoundingClientRect();
              const containerRect =
                editorContainerRef.current.getBoundingClientRect();

              setContextMenu({
                x: rect.left - containerRect.left,
                y: rect.bottom - containerRect.top + 5, // +5 for some margin below
              });
            }}
            title="Block options">
            <MdDragIndicator size={20} />
          </button>
        </DragHandle>
        <div className="relative w-fit mx-auto">
          {showAIModal && aiModalPosition && (
            <div
              ref={modalRef}
              className="absolute left-0 z-50 w-full"
              style={{ top: aiModalPosition.y }}>
              <div ref={aiBoxRef}>
                <AIModal
                  setShowAIModal={setShowAIModal}
                  editorWidth={editorWidth}
                  scrollButtonRef={scrollButtonRef}
                  editor={editor}
                  setAIContent={setAIContent}
                  aiContent={aiContent}
                />
              </div>
            </div>
          )}

          <div ref={editorContainerRef} className="relative w-full">
            <EditorContent editor={editor} />

            {contextMenu && (
              <div
                ref={contextMenuRef}
                style={{
                  position: "absolute",
                  left: contextMenu.x,
                  top: contextMenu.y,
                  zIndex: 1000,
                }}>
                <ContextMenu
                  editor={editor}
                  setContextMenu={setContextMenu}
                  currentBlockPos={currentBlockPos}
                  setShowAIModal={setShowAIModal}
                  aiContent={aiContent}
                  handleAskAIAtEndOfBlock={handleAskAIAtEndOfBlock}
                />
              </div>
            )}
          </div>
          {emojiData && (
            <EmojiPopup
              editor={emojiData.editor}
              range={emojiData.range}
              onClose={() => setEmojiData(null)}
            />
          )}
          {prompt && (
            <InsertLinkPrompt
              placeholder={`Paste ${prompt.type.toUpperCase()} URL`}
              onSubmit={(url) => {
                const { editor, range, type } = prompt;
                const chain = editor.chain().focus().deleteRange(range);
                switch (type) {
                  case "video":
                    chain
                      .insertContent(`<video controls src="${url}" />`)
                      .run();
                    break;
                  case "audio":
                    chain
                      .insertContent(`<audio controls src="${url}" />`)
                      .run();
                    break;
                  case "file":
                    chain
                      .insertContent(
                        `<a href="${url}" target="_blank">📎 Download File</a>`
                      )
                      .run();
                    break;
                  case "link":
                  default:
                    chain.setLink({ href: url }).run();
                    break;
                }
              }}
              onClose={() => setPrompt(null)}
            />
          )}
          {imageUploadData && imageUploadBoxPos && (
            <div
              ref={imageUploadRef}
              className="absolute left-0 z-50 w-full"
              style={{ top: imageUploadBoxPos.y }}>
              <ImageUploadBox
                editor={editor}
                setImageUploadData={setImageUploadData}
              />
            </div>
          )}

          {/* Table Controls */}
          {editor && (
            <TableControls
              editor={editor}
              editorContainerRef={editorContainerRef}
              tableRect={tableRect}
              tableRows={tableRows}
              tableCols={tableCols}
              setShowRowMenu={setShowRowMenu}
              setShowColMenu={setShowColMenu}
              hoveredRow={hoveredRow}
              hoveredCol={hoveredCol}
            />
          )}
        </div>

        {/* Scroll button fixed bottom center */}
        {showAIModal && showScrollButton && (
          <button
            ref={scrollButtonRef}
            onClick={scrollToAIBox}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition">
            <HiOutlineSparkles size={16} className="text-purple-500" />
          </button>
        )}
      </div>
    );
  }
);

export default TextEditor;
