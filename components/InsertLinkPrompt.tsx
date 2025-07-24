"use client";

import { useState, useRef, useEffect } from "react";

export default function InsertLinkPrompt({
  onSubmit,
  onClose,
  placeholder = "Enter URL",
}: {
  onSubmit: (url: string) => void;
  onClose: () => void;
  placeholder?: string;
}) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      onClose();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="absolute z-50 top-[40%] left-[50%] -translate-x-1/2 bg-white border border-slate-300 p-4 rounded-xl shadow-xl w-80">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="url"
          placeholder={placeholder}
          className="w-full p-2 rounded-md border border-slate-200 text-black"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black/90 text-white py-1 px-4 rounded hover:bg-black">
          Insert
        </button>
      </form>
    </div>
  );
}
