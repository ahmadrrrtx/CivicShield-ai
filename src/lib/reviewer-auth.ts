import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentSession } from '@/lib/session';

export type ReviewerRecord = {
  id: string;
  email: string;
  active: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

function getReviewerAllowlist() {
  return (process.env.REVIEWER_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isReviewerEmail(email?: string) {
  if (!email) return false;
  const allowlist = getReviewerAllowlist();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

export async function hasDatabaseReviewerAccess(email?: string) {
  if (!email) return false;

  try {
    const reviewer = await db.reviewerAccess.findUnique({
      where: {
        email: email.trim().toLowerCase()
      },
      select: {
        active: true
      }
    });

    return Boolean(reviewer?.active);
  } catch {
    return false;
  }
}

export async function listReviewerAccessRecords(limit = Number(process.env.REVIEWER_MANAGEMENT_PAGE_SIZE || 20)): Promise<ReviewerRecord[]> {
  try {
    const records = await db.reviewerAccess.findMany({
      orderBy: [{ active: 'desc' }, { updatedAt: 'desc' }],
      take: limit
    });

    return records.map((record) => ({
      id: record.id,
      email: record.email,
      active: record.active,
      notes: record.notes ?? undefined,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString()
    }));
  } catch {
    return [];
  }
}

export async function upsertReviewerAccess(input: { email: string; active?: boolean; notes?: string }) {
  try {
    const email = input.email.trim().toLowerCase();
    const saved = await db.reviewerAccess.upsert({
      where: { email },
      update: {
        active: input.active ?? true,
        notes: input.notes?.trim() || null,
        updatedAt: new Date()
      },
      create: {
        email,
        active: input.active ?? true,
        notes: input.notes?.trim() || null
      }
    });

    return {
      id: saved.id,
      email: saved.email,
      active: saved.active,
      notes: saved.notes ?? undefined,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString()
    } satisfies ReviewerRecord;
  } catch {
    return null;
  }
}

export async function updateReviewerAccessStatus(reviewerId: string, active: boolean) {
  try {
    const updated = await db.reviewerAccess.update({
      where: { id: reviewerId },
      data: {
        active,
        updatedAt: new Date()
      }
    });

    return {
      id: updated.id,
      email: updated.email,
      active: updated.active,
      notes: updated.notes ?? undefined,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    } satisfies ReviewerRecord;
  } catch {
    return null;
  }
}

export async function getReviewerAccess() {
  const session = await getCurrentSession();
  const reviewerEmail = session.type === 'user' ? session.email : undefined;
  const dbAllowed = session.type === 'user' ? await hasDatabaseReviewerAccess(reviewerEmail) : false;
  const envAllowed = session.type === 'user' ? isReviewerEmail(reviewerEmail) : false;
  const allowed = session.type === 'user' && (dbAllowed || envAllowed);

  return {
    session,
    allowed,
    reviewerEmail,
    source: dbAllowed ? 'database' : envAllowed ? 'env' : 'none'
  } as const;
}

export async function requireReviewerAccess() {
  const access = await getReviewerAccess();
  if (!access.allowed) {
    redirect('/app');
  }
  return access;
}
