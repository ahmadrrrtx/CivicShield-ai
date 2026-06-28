export function ChatTypingPlaceholder() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-950/40 dark:bg-blue-950/20">
      <div className="flex items-center gap-2" aria-live="polite" aria-label="Assistant is preparing a response">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-400 [animation-delay:150ms]" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-400 [animation-delay:300ms]" />
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Grounding response against official sources…</span>
      </div>
    </div>
  );
}
