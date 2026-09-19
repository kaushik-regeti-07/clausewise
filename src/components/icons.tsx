export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2" strokeWidth={2.2}>
        <path
          d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path d="M14 3v5h5" stroke="currentColor" strokeLinejoin="round" />
        <path d="M9 13.5 11 15.5 15.5 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function UploadCloudIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={1.6}>
      <path
        d="M7 18a4.2 4.2 0 0 1-.7-8.34 5.5 5.5 0 0 1 10.6-2A4.5 4.5 0 0 1 17.5 18H7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 11v6.5M9.5 13.5 12 11l2.5 2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PasteIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={2}>
      <rect x="7" y="4" width="10" height="4" rx="1" stroke="currentColor" />
      <path d="M9 4H6a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3" stroke="currentColor" />
      <path d="M9 12h6M9 16h6" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

export function UploadIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={2}>
      <path d="M12 15V4M8 8l4-4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 13.8 8.4 20 10 13.8 11.6 12 18l-1.8-6.4L4 10l6.2-1.6L12 2Z" />
    </svg>
  );
}

export function StepIcon({
  className = "h-5 w-5",
  d,
}: {
  className?: string;
  d: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={1.8}>
      <path d={d} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const STEP_ICON_PATHS = {
  upload: "M12 15V4M8 8l4-4 4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3",
  scan: "M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3M4 12h16",
  understand: "M9 13.5 11 15.5 15.5 11M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
};
