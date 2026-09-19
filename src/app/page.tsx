"use client";

import { useCallback, useState } from "react";
import UploadZone from "@/components/UploadZone";
import DocumentViewer from "@/components/DocumentViewer";
import RiskCard from "@/components/RiskCard";
import RiskSummary from "@/components/RiskSummary";
import LanguageToggle from "@/components/LanguageToggle";
import type { AnalysisResult, SupportedLanguage } from "@/types/risk";

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

  if (!documentText) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-16">
        <div className="mb-10 max-w-2xl text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">ClauseWise</h1>
          <p className="text-lg text-slate-500">
            Upload any rental agreement, insurance policy, loan contract, or medical bill.
            ClauseWise finds the hidden fees, risky clauses, and deadlines - and explains them in
            plain language.
          </p>
        </div>
        <UploadZone onTextReady={handleTextReady} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ClauseWise</h1>
          {fileName && <p className="text-xs text-slate-400">{fileName}</p>}
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle value={language} onChange={handleLanguageChange} disabled={loading} />
          <button onClick={reset} className="text-sm text-slate-500 hover:text-slate-800">
            Analyze another
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <div className="h-[75vh]">
          <DocumentViewer text={documentText} highlight={activeItem?.clauseExcerpt} />
        </div>

        <div className="h-[75vh] space-y-4 overflow-y-auto pr-1">
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
              Analyzing document…
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {result && (
            <>
              <RiskSummary result={result} />
              {result.items.length === 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  No significant red flags found in this document.
                </div>
              ) : (
                result.items.map((item) => (
                  <RiskCard
                    key={item.id}
                    item={item}
                    active={item.id === activeItemId}
                    onClick={() => setActiveItemId(item.id === activeItemId ? null : item.id)}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
