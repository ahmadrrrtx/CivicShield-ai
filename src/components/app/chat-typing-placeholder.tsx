const steps = ['Checking official sources', 'Verifying citations', 'Preparing safe next steps'];

export function ChatTypingPlaceholder() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.9),rgba(236,253,245,0.75))] p-4 dark:border-blue-950/50 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(8,47,73,0.6))]">
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/20">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-blue-400/25" />
          <svg viewBox="0 0 32 32" className="relative h-6 w-6" fill="none" aria-hidden="true">
            <path d="M16 3.5c4 2.7 8.2 4 12.6 4.2v8.4c0 6.8-4.3 12.9-10.8 15.3L16 32l-1.8-.6C7.7 29 3.4 22.9 3.4 16.1V7.7C7.8 7.5 12 6.2 16 3.5Z" fill="currentColor" />
            <path d="M10.5 17h11M13 14l3-2.7 3 2.7M13.8 20.3h4.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">CivicShield is verifying before answering…</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">This may take a few seconds because unsupported answers should fail safely.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-200">
            <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" style={{ animationDelay: `${index * 180}ms` }} />
            {step}
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-slate-900">
        <div className="h-full w-1/2 animate-[pulse_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
      </div>
    </div>
  );
}
