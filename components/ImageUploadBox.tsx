"use client";

import type { Editor } from "@tiptap/core";
import { useCallback, useEffect, useState } from "react";
import { FiImage, FiUpload, FiLink, FiSearch } from "react-icons/fi";
import "tiptap-extension-resizable-image/styles.css";

export default function ImageUploadBox({
  editor,
  setImageUploadData,
}: {
  editor: Editor | null;
  setImageUploadData: (data: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"upload" | "embed" | "pexels">(
    "upload"
  );
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("nature");
  const [pexelsImages, setPexelsImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch images from Pexels
  const fetchPexelsImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pexels?query=${search}`);
      const data = await res.json();
      setPexelsImages(data.photos || []);
    } finally {
      setLoading(false);
    }
  };

  // Add resizable image
  const addResizableImage = useCallback(
    (src?: string) => {
      const imageSrc = src || url;
      if (imageSrc) {
        editor?.commands.setResizableImage({ src: imageSrc });
      }
      setImageUploadData(false);
    },
    [editor, url, setImageUploadData]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResizableImage();
    resetForm();
  };

  const resetForm = () => {
    setIsOpen(false);
    setUrl("");
    setPreviewUrl(null);
    setActiveTab("upload");
  };

  // Handle file upload → base64 for persistence
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        setUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const TabButton = ({
    value,
    children,
  }: {
    value: "upload" | "embed" | "pexels";
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      className={`flex-1 py-3 px-4 text-sm font-medium text-center rounded-t-lg focus:outline-none transition-colors duration-200
            ${
              activeTab === value
                ? "bg-white text-gray-900 shadow"
                : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
      onClick={() => {
        setActiveTab(value);
        if (value !== "upload") setPreviewUrl(null);
      }}>
      {children}
    </button>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full absolute z-50 top-[40%] left-[50%] -translate-x-1/2">
      <div className="w-full">
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
            <div className="grid grid-cols-3 bg-gray-100 rounded-t-lg border-b border-gray-300">
              <TabButton value="upload">Upload</TabButton>
              <TabButton value="embed">Embed link</TabButton>
              <TabButton value="pexels">Pexels</TabButton>
            </div>
            <div className="p-4">
              {activeTab === "upload" && (
                <div className="flex flex-col items-center space-y-4 py-2">
                  <label
                    htmlFor="file-upload"
                    className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-md py-2 text-base transition-colors duration-200 cursor-pointer flex items-center justify-center">
                    <FiUpload className="mr-2 h-5 w-5" />
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
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md py-3 text-base">
                    Insert image
                  </button>
                  <p className="text-sm text-gray-500">
                    The maximum size per file is 5 MB.
                  </p>
                </div>
              )}

              {activeTab === "embed" && (
                <div className="flex flex-col items-center space-y-4 py-2">
                  <input
                    type="text"
                    placeholder="Paste the image link..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md py-3 text-base">
                    <FiLink className="mr-2 h-5 w-5 inline-block" />
                    Embed image
                  </button>
                </div>
              )}

              {activeTab === "pexels" && (
                <div className="space-y-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Pexels images..."
                      className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-3 py-2"
                    />
                    <button
                      onClick={fetchPexelsImages}
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:underline text-sm">
                      Search
                    </button>
                  </div>

                  <div className="h-64 w-full rounded-md border border-gray-300 p-2 overflow-y-auto bg-gray-50">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500">
                          Loading images...
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {pexelsImages.map((photo: any) => (
                          <div
                            key={photo.id}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => {
                              addResizableImage(photo.src.large);
                              resetForm();
                            }}>
                            <img
                              src={photo.src.medium}
                              alt={photo.photographer}
                              className="rounded-md object-cover aspect-square w-full"
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
        )}
      </div>
    </form>
  );
}
