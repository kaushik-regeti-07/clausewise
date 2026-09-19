"use client";

import { useCallback, useRef, useState } from "react";
import { PasteIcon, UploadCloudIcon, UploadIcon } from "@/components/icons";

interface UploadZoneProps {
  onTextReady: (text: string, fileName?: string) => void;
  disabled?: boolean;
}

export default function UploadZone({ onTextReady, disabled }: UploadZoneProps) {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setBusy(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/extract", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not read that file.");
          return;
        }
        onTextReady(data.text, file.name);
      } catch {
        setError("Something went wrong reading that file.");
      } finally {
        setBusy(false);
      }
    },
    [onTextReady]
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-5 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            mode === "upload"
              ? "bg-slate-900 text-white shadow-md shadow-slate-300"
              : "bg-white text-slate-500 hover:bg-slate-100"
          }`}
        >
          <UploadIcon className="h-3.5 w-3.5" />
          Upload a file
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            mode === "paste"
              ? "bg-slate-900 text-white shadow-md shadow-slate-300"
              : "bg-white text-slate-500 hover:bg-slate-100"
          }`}
        >
          <PasteIcon className="h-3.5 w-3.5" />
          Paste text
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`group cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center shadow-sm transition-all duration-200 ${
            isDragging
              ? "scale-[1.02] border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
              : "border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
          }`}
        >
          <div
            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
              isDragging
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500"
            }`}
          >
            {busy ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <UploadCloudIcon className="h-7 w-7" />
            )}
          </div>
          <p className="font-medium text-slate-700">
            {busy ? "Reading document…" : "Drop a PDF here, or click to choose a file"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            PDF or .txt · works best with text-based (not scanned) documents
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            className="hidden"
            disabled={disabled || busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <textarea
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            rows={10}
            placeholder="Paste your rental agreement, policy, or bill text here…"
            className="w-full resize-none rounded-xl border-0 p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            disabled={disabled || !pasteValue.trim()}
            onClick={() => onTextReady(pasteValue.trim())}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Analyze this text
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
