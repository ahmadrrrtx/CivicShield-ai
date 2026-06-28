import { cn } from '@/lib/utils';

export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn('h-8 w-8', className)}
      fill="none"
    >
      <defs>
        <linearGradient id="shieldGradient" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="0.5" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path
        d="M32 6c7.6 5 15.9 7.5 24.8 7.6v16.4c0 13.3-8.5 25.4-21.2 30.2L32 61.6l-3.6-1.4C15.7 55.4 7.2 43.3 7.2 30V13.6C16.1 13.5 24.4 11 32 6Z"
        fill="url(#shieldGradient)"
      />
      <path
        d="M32 17c5.3 3.4 10.9 5.2 16.9 5.5v7.8c0 9.3-5.8 17.8-14.6 21.4l-2.3 1-2.3-1c-8.8-3.6-14.6-12.1-14.6-21.4v-7.8c6-.3 11.6-2.1 16.9-5.5Z"
        fill="rgba(255,255,255,0.14)"
      />
      <path
        d="M23 33.5c2.8-5.3 6.2-8 10.4-8 4.1 0 7.3 2.2 9.6 6.5"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="25" cy="37" r="2.2" fill="white" />
      <circle cx="39" cy="37" r="2.2" fill="white" />
      <path d="M29 43c1.1 1 2.1 1.4 3 1.4 1 0 2-.4 3-1.4" stroke="white" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <ShieldMark />
      <div className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
          CivicShield AI
        </span>
        <span className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Trusted public guidance
        </span>
      </div>
    </div>
  );
}
