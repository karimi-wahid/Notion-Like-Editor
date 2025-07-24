"use client";
import React, { useEffect, useRef, useState } from "react";
import ActionMenu from "./ActionMenu";
import { Editor } from "@tiptap/core";

interface AIModalProps {
  setShowAIModal: React.Dispatch<React.SetStateAction<boolean>>;
  editorWidth: number;
  scrollButtonRef: React.RefObject<HTMLButtonElement>;
  editor: Editor | null;
}

const AIModal: React.FC<AIModalProps> = ({
  setShowAIModal,
  editorWidth,
  scrollButtonRef,
  editor,
}) => {
  const [inputValue, setInputValue] = useState("");
  const aiBoxRef = useRef<HTMLDivElement | null>(null);
  const [showWhichModal, setShowWhichModal] = useState(true);
  const [hideAIOptions, setHideAIOptions] = useState(true);

  const editOptions = [
    {
      label: "Improve writing",
      color: "text-purple-400",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      label: "Fix grammar",
      color: "text-blue-400",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Make shorter",
      color: "text-pink-400",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      ),
    },
    {
      label: "Make longer",
      color: "text-orange-400",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
  ];

  const changeModal = () => {
    setHideAIOptions(false);
    setTimeout(() => {
      setShowWhichModal(false);
    }, 3000);
  };

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!aiBoxRef.current) return;
      if (!e.target) return;

      // Allow clicking on scrollbar on the right edge (within ~20px)
      if (
        e.clientX >=
        document.documentElement.clientWidth - 20 /* scrollbar width */
      ) {
        return; // do not close modal if clicked on scrollbar
      }

      // Allow clicking on scroll button without closing modal
      if (
        scrollButtonRef.current &&
        (scrollButtonRef.current === e.target ||
          scrollButtonRef.current.contains(e.target as Node))
      ) {
        return;
      }

      if (!aiBoxRef.current.contains(e.target as Node)) {
        setShowAIModal(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setShowAIModal, scrollButtonRef]);

  return (
    <div
      ref={aiBoxRef}
      className="relative z-50 text-black"
      style={{
        width: editorWidth || 600,
      }}>
      {/* Input Section */}
      <div className="relative w-full px-2 py-2 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI to edit or generate..."
          className="w-full border border-gray-300 placeholder:text-gray-400 placeholder:text-[14px] text-gray-800 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          className="absolute right-4 top-[50%] translate-y-[-50%] h-8 w-8 bg-black hover:bg-black/70 rounded-md flex items-center justify-center transition-colors"
          onClick={() => {
            if (editor) {
              editor
                .chain()
                .focus()
                .insertContentAt(
                  {
                    from: editor.state.selection.from,
                    to: editor.state.selection.to,
                  },
                  "The Content has been changed by ai"
                )
                .run();
            }
          }}>
          <svg
            className="w-4 h-4 text-white rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>

      {/* Options Section */}
      {showWhichModal ? (
        hideAIOptions && (
          <div className="p-4 space-y-4 max-w-[300px] bg-slate-50 rounded-md shadow-lg border border-gray-200">
            {/* Edit or review selection */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Edit or review selection</h3>
              <div>
                {editOptions.map((option, index) => (
                  <button
                    onClick={() => changeModal()}
                    key={index}
                    className="w-full flex items-center justify-start text-left p-1 cursor-pointer hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-md transition-colors">
                    <span className={`mr-3 ${option.color}`}>
                      {option.icon}
                    </span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Use AI to do more */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-900">
                Use AI to do more
              </h3>
              <button
                onClick={() => setShowAIModal(false)}
                className="w-full flex items-center justify-start text-left p-1 cursor-pointer hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-md transition-colors">
                <svg
                  className="w-4 h-4 mr-3 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Continue writing
              </button>
            </div>
          </div>
        )
      ) : (
        <ActionMenu
          setShowAIModal={setShowAIModal}
          editor={editor}
          aiSuggestion={"The Content has been changed by AI"}
        />
      )}
    </div>
  );
};

export default AIModal;
