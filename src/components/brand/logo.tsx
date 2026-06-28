import { cn } from '@/lib/utils';

export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" className={cn('h-9 w-9', className)} fill="none">
      <defs>
        <linearGradient id="shieldGradient" x1="10" y1="8" x2="62" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.46" stopColor="#2563EB" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <filter id="shieldGlow" x="-20" y="-20" width="112" height="112" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.145 0 0 0 0 0.388 0 0 0 0 0.922 0 0 0 0.34 0" />
          <feBlend in2="SourceGraphic" mode="normal" />
        </filter>
      </defs>
      <path
        d="M36 5.5c8.9 6 18.3 9 28.2 9.3v18.4c0 15.2-9.7 29-24.2 34.3L36 69l-4-1.5C17.5 62.2 7.8 48.4 7.8 33.2V14.8C17.7 14.5 27.1 11.5 36 5.5Z"
        fill="url(#shieldGradient)"
        filter="url(#shieldGlow)"
      />
      <path
        d="M36 16.2c6.1 3.9 12.5 6.1 19.3 6.5v9.2c0 10.7-6.6 20.6-16.8 24.8L36 57.8l-2.5-1.1C23.3 52.5 16.7 42.6 16.7 31.9v-9.2c6.8-.4 13.2-2.6 19.3-6.5Z"
        fill="rgba(255,255,255,0.17)"
      />
      <path d="M24 38.2h24" stroke="white" strokeLinecap="round" strokeWidth="3.4" />
      <path d="M28.5 32.5 36 26l7.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
      <path d="M29.5 45.5h13" stroke="white" strokeLinecap="round" strokeWidth="3.4" />
      <circle cx="23.5" cy="38.2" r="2.8" fill="white" />
      <circle cx="48.5" cy="38.2" r="2.8" fill="white" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <ShieldMark />
      <div className="flex flex-col leading-none">
        <span className="text-[1.08rem] font-black tracking-[-0.055em] text-slate-950 dark:text-white">
          CivicShield AI
        </span>
        <span className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
          Public help, verified
        </span>
      </div>
    </div>
  );
}
