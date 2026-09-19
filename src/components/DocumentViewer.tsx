"use client";

import { useEffect, useMemo, useRef } from "react";

interface DocumentViewerProps {
  text: string;
  highlight?: string | null;
}

export default function DocumentViewer({ text, highlight }: DocumentViewerProps) {
  const markRef = useRef<HTMLElement | null>(null);

  const parts = useMemo(() => {
    if (!highlight) return [{ text, isMatch: false }];
    const needle = highlight.slice(0, 60).toLowerCase();
    const idx = text.toLowerCase().indexOf(needle);
    if (idx === -1) return [{ text, isMatch: false }];
    const matchLen = Math.min(highlight.length, 200);
    return [
      { text: text.slice(0, idx), isMatch: false },
      { text: text.slice(idx, idx + matchLen), isMatch: true },
      { text: text.slice(idx + matchLen), isMatch: false },
    ];
  }, [text, highlight]);

  useEffect(() => {
    markRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlight]);

  return (
    <div className="h-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.isMatch ? (
          <mark
            key={i}
            ref={(el) => {
              markRef.current = el;
            }}
            className="rounded bg-amber-200 px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </div>
  );
}
