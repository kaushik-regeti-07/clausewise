"use client";

import { useCallback, useState } from "react";
import UploadZone from "@/components/UploadZone";
import DocumentViewer from "@/components/DocumentViewer";
import RiskCard from "@/components/RiskCard";
import RiskSummary from "@/components/RiskSummary";
import LanguageToggle from "@/components/LanguageToggle";
import {
  BackArrowIcon,
  DownloadIcon,
  LogoMark,
  SparkleIcon,
  StepIcon,
  STEP_ICON_PATHS,
} from "@/components/icons";
import { buildReportText, downloadTextFile } from "@/lib/report";
import { SAMPLE_DOCUMENTS } from "@/lib/samples";
import type { AnalysisResult, SupportedLanguage } from "@/types/risk";

const STEPS = [
  {
    icon: STEP_ICON_PATHS.upload,
    title: "Upload or paste",
    body: "Drop in a rental agreement, insurance policy, loan contract, or medical bill.",
  },
  {
    icon: STEP_ICON_PATHS.scan,
    title: "Nemotron scans every clause",
    body: "An NVIDIA Nemotron model on Nebius Token Factory reads the full document, not just a summary.",
  },
  {
    icon: STEP_ICON_PATHS.understand,
    title: "See what actually matters",
    body: "Risky clauses are ranked, color-coded, and explained in plain English or Hindi.",
  },
];

export default function Home() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | undefined>();
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [resultsByLanguage, setResultsByLanguage] = useState<
    Partial<Record<SupportedLanguage, AnalysisResult>>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const runAnalysis = useCallback(async (text: string, lang: SupportedLanguage) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: lang }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed.");
        return;
      }
      setResultsByLanguage((prev) => ({ ...prev, [lang]: data }));
    } catch {
      setError("Something went wrong talking to the analysis service.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTextReady = useCallback(
    (text: string, name?: string) => {
      setDocumentText(text);
      setFileName(name);
      setResultsByLanguage({});
      setActiveItemId(null);
      runAnalysis(text, language);
    },
    [language, runAnalysis]
  );

  const handleLanguageChange = useCallback(
    (lang: SupportedLanguage) => {
      setLanguage(lang);
      if (documentText && !resultsByLanguage[lang]) {
        runAnalysis(documentText, lang);
      }
    },
    [documentText, resultsByLanguage, runAnalysis]
  );

  const reset = () => {
    setDocumentText(null);
    setFileName(undefined);
    setResultsByLanguage({});
    setActiveItemId(null);
    setError(null);
  };

  const result = resultsByLanguage[language];
  const activeItem = result?.items.find((i) => i.id === activeItemId) ?? null;

  const handleDownload = () => {
    if (!result) return;
    const base = (fileName ?? "document").replace(/\.[^/.]+$/, "");
    downloadTextFile(buildReportText(result, fileName, language), `clausewise-${base}-${language}.txt`);
  };

  if (!documentText) {
    return (
      <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-slate-50 px-6 py-20">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200 via-violet-200 to-transparent opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-amber-100 opacity-50 blur-3xl" />

        <div className="relative mb-12 flex max-w-2xl flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-3">
            <LogoMark />
            <span className="text-2xl font-bold tracking-tight text-slate-900">ClauseWise</span>
          </div>

          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            <SparkleIcon className="h-3.5 w-3.5" />
            Powered by NVIDIA Nemotron on Nebius Token Factory
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Know what you&apos;re signing{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              before you sign it
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-500">
            Upload any rental agreement, insurance policy, loan contract, or medical bill.
            ClauseWise finds the hidden fees, risky clauses, and deadlines - and explains them in
            plain language.
          </p>
        </div>

        <div className="relative w-full">
          <UploadZone onTextReady={handleTextReady} />
        </div>

        <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400">
          <span>No document handy? Try a sample:</span>
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleTextReady(sample.text, sample.fileName)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <div className="relative mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <StepIcon d={step.icon} />
                </div>
                <span className="text-xs font-semibold text-slate-400">STEP {i + 1}</span>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="flex flex-wrap items-center justify-between gap-y-2 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={reset}
            aria-label="Back to upload"
            title="Back to upload"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <BackArrowIcon className="h-4 w-4" />
          </button>
          <LogoMark className="h-8 w-8 shrink-0" />
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight text-slate-900">ClauseWise</h1>
            {fileName && <p className="truncate text-xs text-slate-400">{fileName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle value={language} onChange={handleLanguageChange} disabled={loading} />
          <button
            type="button"
            onClick={handleDownload}
            disabled={!result}
            title="Download report"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <div className="h-[75vh]">
          <DocumentViewer text={documentText} highlight={activeItem?.clauseExcerpt} />
        </div>

        <div className="h-[75vh] space-y-4 overflow-y-auto pr-1">
          {loading && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <p className="font-medium text-slate-600">Reading every clause…</p>
              <p className="text-sm text-slate-400">Nemotron is scanning the full document, this can take a moment.</p>
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {result && (
            <div className="animate-[fadeIn_0.4s_ease-out] space-y-4">
              <RiskSummary result={result} />
              {result.items.length === 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  No significant red flags found in this document.
                </div>
              ) : (
                result.items.map((item, i) => (
                  <div
                    key={item.id}
                    className="animate-[fadeIn_0.4s_ease-out_backwards]"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <RiskCard
                      item={item}
                      active={item.id === activeItemId}
                      onClick={() => setActiveItemId(item.id === activeItemId ? null : item.id)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
