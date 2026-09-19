import type { SupportedLanguage } from "@/types/risk";

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
];

interface LanguageToggleProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  disabled?: boolean;
}

export default function LanguageToggle({ value, onChange, disabled }: LanguageToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          disabled={disabled}
          onClick={() => onChange(lang.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition disabled:opacity-40 ${
            value === lang.code ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
