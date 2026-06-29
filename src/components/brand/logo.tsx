import { cn } from '@/lib/utils';

export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" className={cn('h-10 w-10', className)} fill="none">
      <defs>
        <linearGradient id="civicshield-mark-gradient" x1="10" y1="6" x2="63" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.34" stopColor="#3B82F6" />
          <stop offset="0.72" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <filter id="civicshield-mark-glow" x="-18" y="-18" width="108" height="108" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="5.8" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.129 0 0 0 0 0.412 0 0 0 0 0.961 0 0 0 0.28 0" />
          <feBlend in="SourceGraphic" mode="screen" />
        </filter>
      </defs>
      <g filter="url(#civicshield-mark-glow)">
        <path
          d="M36 5.5c8.9 6 18.3 9 28.2 9.3v18.4c0 15.2-9.7 29-24.2 34.3L36 69l-4-1.5C17.5 62.2 7.8 48.4 7.8 33.2V14.8C17.7 14.5 27.1 11.5 36 5.5Z"
          fill="url(#civicshield-mark-gradient)"
        />
        <path
          d="M36 15.8c6.2 3.9 12.7 6.2 19.6 6.6v9.5c0 10.9-6.7 21-17.1 25.2L36 58.2l-2.5-1.1c-10.4-4.2-17.1-14.3-17.1-25.2v-9.5c6.9-.4 13.4-2.7 19.6-6.6Z"
          fill="rgba(255,255,255,0.16)"
        />
        <path
          d="M23.8 31.8c0-2.2 1.8-4 4-4h13.8c9.2 0 16.6 7.4 16.6 16.6S50.8 61 41.6 61h-8.3c-1.5 0-2.9.6-4 1.7l-3.7 3.7c-1.5 1.5-4.1.5-4.1-1.7V31.8Z"
          fill="rgba(255,255,255,0.18)"
        />
        <path d="M32 38.2h12.8" stroke="white" strokeLinecap="round" strokeWidth="3" />
        <path d="M32 46.7h17.8" stroke="white" strokeLinecap="round" strokeWidth="3" />
        <circle cx="26.5" cy="38.2" r="2.6" fill="white" />
        <circle cx="26.5" cy="46.7" r="2.6" fill="white" fillOpacity="0.92" />
      </g>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <ShieldMark />
      <div className="flex flex-col leading-none">
        <span className="text-[1.08rem] font-black tracking-[-0.055em] text-slate-950 dark:text-white">CivicShield AI</span>
        <span className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
          Official-source grounded
        </span>
      </div>
    </div>
  );
}
