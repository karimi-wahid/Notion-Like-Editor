"use client";

import type { Editor } from "@tiptap/core";
import { useCallback, useEffect, useState } from "react";
import { FiImage, FiUpload, FiLink, FiSearch } from "react-icons/fi";
import Image from "next/image";

export default function ImageUploadBox({
  editor,
  setImageUploadData,
}: {
  editor: Editor | null;
  setImageUploadData: (data: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("upload");
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("nature");
  const [pexelsImages, setPexelsImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchPexelsImages = async () => {
    setLoading(true);
    const res = await fetch(`/api/pexels?query=${search}`);
    const data = await res.json();
    setPexelsImages(data.photos || []);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    addImage();
    console.log("image url", url);
    setUrl("");
    setActiveTab("upload");
    setImageUploadData(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUrl(objectUrl);
    }
  };

  const addImage = useCallback(() => {
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
    setImageUploadData(false);
  }, [editor, url]);

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
        ${value !== "upload" ? "rounded-none" : ""}`}
      onClick={() => setActiveTab(value)}
      type="button">
      {children}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full z-50">
      <div className="w-full">
        <div className="bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-100 rounded-t-lg border-b border-gray-300">
            <TabButton value="upload">Upload</TabButton>
            <TabButton value="embed">Embed link</TabButton>
            <TabButton value="pixels">Pexels</TabButton>
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
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-xs rounded-md"
                  />
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md py-3 text-base transition-colors duration-200">
                  Insert image
                </button>
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
            {activeTab === "pixels" && (
              <div className="space-y-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Pexels images..."
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md pl-9 pr-3 py-2 transition-colors duration-200"
                  />
                  <button
                    onClick={fetchPexelsImages}
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:underline text-sm">
                    Search
                  </button>
                </div>

                <div className="h-64 w-full rounded-md border border-gray-300 p-2 overflow-y-auto custom-scrollbar bg-gray-50 flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-gray-500">Loading images...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                      {pexelsImages.map((photo: any) => (
                        <div
                          key={photo.id}
                          className="flex flex-col items-center text-center cursor-pointer"
                          onClick={() => {
                            setUrl(photo.src.large);
                            addImage();
                            setIsOpen(false);
                          }}>
                          <img
                            src={photo.src.medium}
                            alt={photo.photographer}
                            className="rounded-md object-cover aspect-square w-full h-auto"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            by {photo.photographer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
