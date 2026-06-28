import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function ConversationCard({
  id,
  title,
  preview,
  updated,
  pinned = false,
  sessionType,
  grounded,
  citationCount
}: {
  id?: string;
  title: string;
  preview: string;
  updated: string;
  pinned?: boolean;
  sessionType?: 'guest' | 'user';
  grounded?: boolean;
  citationCount?: number;
}) {
  const content = (
    <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{title}</h3>
            {sessionType ? <Badge>{sessionType === 'user' ? 'Account' : 'Guest'}</Badge> : null}
            {typeof grounded === 'boolean' ? <Badge>{grounded ? 'Grounded' : 'Review needed'}</Badge> : null}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{preview}</p>
        </div>
        {pinned ? <Badge>Pinned</Badge> : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <p>Updated {updated}</p>
        {typeof citationCount === 'number' ? <p>{citationCount} source{citationCount === 1 ? '' : 's'}</p> : null}
      </div>
    </Card>
  );

  if (!id) return content;

  return (
    <Link href={`/app/history/${id}`} className="block">
      {content}
    </Link>
  );
}
