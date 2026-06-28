import { Badge } from '@/components/ui/badge';

export function SessionBadge({ label }: { label: string }) {
  return <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">{label}</Badge>;
}
