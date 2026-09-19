import type { RiskItem } from "@/types/risk";

const RISK_STYLES: Record<RiskItem["riskLevel"], { badge: string; border: string; label: string }> = {
  high: { badge: "bg-red-100 text-red-700", border: "border-red-200", label: "High risk" },
  medium: { badge: "bg-amber-100 text-amber-700", border: "border-amber-200", label: "Medium risk" },
  low: { badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-200", label: "Low risk" },
};

interface RiskCardProps {
  item: RiskItem;
  active?: boolean;
  onClick?: () => void;
}

export default function RiskCard({ item, active, onClick }: RiskCardProps) {
  const style = RISK_STYLES[item.riskLevel];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border ${style.border} bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
        active ? "ring-2 ring-indigo-400" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="font-semibold text-slate-900">{item.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}>
          {style.label}
        </span>
      </div>
      <p className="text-xs text-slate-400 italic mb-2 line-clamp-2">&ldquo;{item.clauseExcerpt}&rdquo;</p>
      <p className="text-sm text-slate-700 mb-1">{item.explanation}</p>
      <p className="text-sm text-slate-500">
        <span className="font-medium text-slate-600">Why it matters: </span>
        {item.whyItMatters}
      </p>
    </button>
  );
}
