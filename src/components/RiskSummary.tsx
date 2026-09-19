"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/types/risk";

function scoreColor(score: number) {
  if (score >= 66) return { text: "text-red-600", stroke: "#dc2626" };
  if (score >= 33) return { text: "text-amber-600", stroke: "#d97706" };
  return { text: "text-emerald-600", stroke: "#059669" };
}

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreRing({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const prevScore = useRef(0);

  useEffect(() => {
    const from = prevScore.current;
    const to = score;
    const duration = 700;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    prevScore.current = score;
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const colors = scoreColor(score);
  const offset = CIRCUMFERENCE * (1 - displayScore / 100);

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <span className={`absolute text-lg font-bold ${colors.text}`}>{displayScore}</span>
    </div>
  );
}

export default function RiskSummary({ result }: { result: AnalysisResult }) {
  const highCount = result.items.filter((i) => i.riskLevel === "high").length;
  const mediumCount = result.items.filter((i) => i.riskLevel === "medium").length;
  const lowCount = result.items.filter((i) => i.riskLevel === "low").length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {result.documentType}
          </p>
          <p className="mt-1 text-slate-700">{result.summary}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ScoreRing score={result.riskScore} />
          <div className="text-[11px] text-slate-400">risk score</div>
        </div>
      </div>
      <div className="mt-4 flex gap-4 text-sm text-slate-500">
        <span>{highCount} high</span>
        <span>{mediumCount} medium</span>
        <span>{lowCount} low</span>
      </div>
    </div>
  );
}
