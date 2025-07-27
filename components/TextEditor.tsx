"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Gapcursor } from "@tiptap/extensions";
import { Placeholder } from "@tiptap/extensions";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import Highlight from "@tiptap/extension-highlight";
import DragHandle from "@tiptap/extension-drag-handle-react";
import React, { useEffect, useRef, useState } from "react";
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
import { GiRobotGolem } from "react-icons/gi";

const TextEditor = () => {
  const [isEditable, setIsEditable] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const aiBoxRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const scrollButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [editorWidth, setEditorWidth] = useState<number>(0);
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
    type: "image" | "video" | "audio" | "file" | "link";
  }>(null);

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
      Table.configure({ table: { resizable: true } }),
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
      Subscript,
      Superscript,
    ],
    immediatelyRender: false,
    content: "<p>Hello World! 🌎️</p>",
    editorProps: {
      attributes: {
        class:
          "tiptap-block-gap min-h-[500px] w-[800px] border border-slate-300 rounded-md outline-none py-2 px-3 overflow-x-auto max-w-full",
      },
    },
  });

  useEffect(() => {
    if (editor) editor.setEditable(isEditable);
  }, [isEditable, editor]);

  // set editor width on mount and window resize
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
      window.removeEventListener("open-emoji-picker", handler as EventListener);
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
      window.removeEventListener("open-insert-link", handler as EventListener);
  }, []);

  // Intersection Observer to control scroll button visibility
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
        <MdDragIndicator size={20} className="text-gray-400" />
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
              />
            </div>
          </div>
        )}
        <div ref={editorContainerRef} className="relative w-full">
          <EditorContent editor={editor} />
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
                  chain.insertContent(`<video controls src="${url}" />`).run();
                  break;
                case "audio":
                  chain.insertContent(`<audio controls src="${url}" />`).run();
                  break;
                case "image":
                  chain.setImage({ src: url }).run();
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
        <TableBubbleMenu editor={editor} />
      </div>

      {/* Scroll button fixed bottom center */}
      {showAIModal && showScrollButton && (
        <button
          ref={scrollButtonRef}
          onClick={scrollToAIBox}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition">
          <GiRobotGolem /> AI
        </button>
      )}
    </div>
  );
};

export default TextEditor;
