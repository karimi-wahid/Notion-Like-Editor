"use client";

import type React from "react";
import { useCallback, useState } from "react";
import Image from "next/image";

import { FiImage, FiUpload, FiLink, FiSearch } from "react-icons/fi";
import { Editor } from "@tiptap/core";

export default function ImageUploadBox({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    addImage();
  };

  const addImage = useCallback(() => {
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const TabButton = ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <button
      className={`flex-1 py-3 px-4 text-sm font-medium text-center rounded-t-lg focus:outline-none transition-colors duration-200
        ${
          activeTab === value
            ? "bg-white text-gray-900 shadow"
            : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
        }
        ${
          value === "upload"
            ? "rounded-tr-none rounded-bl-none rounded-br-none"
            : ""
        }
        ${value !== "upload" ? "rounded-none" : ""}
      `}
      onClick={() => setActiveTab(value)}
      type="button">
      {children}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full max-w-md">
        {!isOpen ? (
          <button
            type="button"
            className="w-full flex items-center justify-start text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md px-4 py-2 transition-colors duration-200"
            onClick={() => setIsOpen(true)}>
            <FiImage className="mr-2 h-5 w-5" />
            Add an image
          </button>
        ) : (
          <div className="bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-100 rounded-t-lg border-b border-gray-300">
              <TabButton value="upload">Upload</TabButton>
              <TabButton value="embed">Embed link</TabButton>
              <TabButton value="unsplash">Unsplash</TabButton>
            </div>
            <div className="p-4">
              {activeTab === "upload" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-2">
                  <label
                    htmlFor="file-upload"
                    className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-md py-2 text-base transition-colors duration-200 cursor-pointer flex items-center justify-center">
                    <FiUpload className="mr-2 h-5 w-5 inline-block align-middle text-sm" />
                    Upload file
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500">
                    The maximum size per file is 5 MB.
                  </p>
                </div>
              )}
              {activeTab === "embed" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-2">
                  <input
                    type="text"
                    placeholder="Paste the image link..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md py-3 text-base transition-colors duration-200">
                    <FiLink className="mr-2 h-5 w-5 inline-block align-middle" />
                    Embed image
                  </button>
                </div>
              )}
              {activeTab === "unsplash" && (
                <div className="space-y-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for an image..."
                      className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md pl-9 pr-3 py-2 transition-colors duration-200"
                    />
                  </div>
                  <div className="h-64 w-full rounded-md border border-gray-300 p-2 overflow-y-auto custom-scrollbar bg-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center text-center">
                          <Image
                            src={`/placeholder.svg?height=100&width=100&query=abstract%20image%20${i}`}
                            alt={`Unsplash image ${i + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md object-cover aspect-square"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            by Author {i + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
