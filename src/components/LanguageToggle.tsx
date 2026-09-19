import { LANGUAGES, type SupportedLanguage } from "@/types/risk";

interface LanguageToggleProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  disabled?: boolean;
}

export default function LanguageToggle({ value, onChange, disabled }: LanguageToggleProps) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as SupportedLanguage)}
        aria-label="Explanation language"
        className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3.5 pr-8 text-sm font-medium text-slate-700 transition hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeLabel} · {lang.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400"
      >
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
