"use client";

import { useCallback, useRef, useState } from "react";

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
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4 justify-center">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            mode === "upload" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Upload a file
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            mode === "paste" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
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
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition ${
            isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50"
          }`}
        >
          <p className="text-slate-700 font-medium">
            {busy ? "Reading document…" : "Drop a PDF here, or click to choose a file"}
          </p>
          <p className="text-slate-400 text-sm mt-1">
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
        <div className="space-y-3">
          <textarea
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            rows={10}
            placeholder="Paste your rental agreement, policy, or bill text here…"
            className="w-full rounded-xl border border-slate-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            disabled={disabled || !pasteValue.trim()}
            onClick={() => onTextReady(pasteValue.trim())}
            className="w-full rounded-xl bg-slate-900 text-white py-3 font-medium disabled:opacity-40"
          >
            Analyze this text
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
