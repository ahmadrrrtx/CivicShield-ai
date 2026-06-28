import Link from 'next/link';
import { ReviewerManagementPanel } from '@/components/app/reviewer-management-panel';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { listReviewerAccessRecords, requireReviewerAccess } from '@/lib/reviewer-auth';

export default async function ReviewersPage() {
  const access = await requireReviewerAccess();
  const reviewers = await listReviewerAccessRecords();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_28%)] p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                Reviewer administration
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white lg:text-4xl">
                Durable reviewer access management
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Manage reviewer authorization records stored in the database while preserving environment allowlist fallback for bootstrap operations.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{reviewers.length} reviewer records</Badge>
                <Badge>Access source: {access.source}</Badge>
              </div>
            </div>
            <Link href="/app/review" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
              Back to review queue
            </Link>
          </div>
        </div>
      </Card>

      <ReviewerManagementPanel reviewers={reviewers} />
    </div>
  );
}
