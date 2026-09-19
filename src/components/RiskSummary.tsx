import type { AnalysisResult } from "@/types/risk";

function scoreColor(score: number) {
  if (score >= 66) return "text-red-600";
  if (score >= 33) return "text-amber-600";
  return "text-emerald-600";
}

export default function RiskSummary({ result }: { result: AnalysisResult }) {
  const highCount = result.items.filter((i) => i.riskLevel === "high").length;
  const mediumCount = result.items.filter((i) => i.riskLevel === "medium").length;
  const lowCount = result.items.filter((i) => i.riskLevel === "low").length;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 font-medium">
            {result.documentType}
          </p>
          <p className="mt-1 text-slate-700">{result.summary}</p>
        </div>
        <div className="text-center shrink-0">
          <div className={`text-3xl font-bold ${scoreColor(result.riskScore)}`}>{result.riskScore}</div>
          <div className="text-xs text-slate-400">risk score</div>
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
