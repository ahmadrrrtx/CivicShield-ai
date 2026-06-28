import { db } from '@/lib/db';

type AuditLevel = 'info' | 'warn' | 'error';

export type AuditEventInput = {
  event: string;
  level?: AuditLevel;
  actorType?: string;
  actorId?: string;
  scopeType?: string;
  scopeId?: string;
  targetType?: string;
  targetId?: string;
  payload?: Record<string, unknown>;
};

export type AuditEventRecord = {
  id: string;
  event: string;
  level: AuditLevel;
  actorType?: string;
  actorId?: string;
  scopeType?: string;
  scopeId?: string;
  targetType?: string;
  targetId?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
};

function writeConsole(entry: { timestamp: string; level: AuditLevel; event: string; payload: Record<string, unknown> }) {
  if (entry.level === 'error') {
    console.error('[audit]', JSON.stringify(entry));
    return;
  }

  if (entry.level === 'warn') {
    console.warn('[audit]', JSON.stringify(entry));
    return;
  }

  console.info('[audit]', JSON.stringify(entry));
}

function parsePayload(payloadJson?: string | null) {
  if (!payloadJson) return undefined;
  try {
    const parsed = JSON.parse(payloadJson) as unknown;
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

export function auditLog(event: string, payload: Record<string, unknown>, level: AuditLevel = 'info') {
  writeConsole({
    timestamp: new Date().toISOString(),
    level,
    event,
    payload
  });
}

export async function persistAuditEvent(input: AuditEventInput) {
  const level = input.level ?? 'info';
  const payload = input.payload ?? {};
  const timestamp = new Date().toISOString();

  writeConsole({
    timestamp,
    level,
    event: input.event,
    payload
  });

  try {
    await db.auditEvent.create({
      data: {
        event: input.event,
        level,
        actorType: input.actorType,
        actorId: input.actorId,
        scopeType: input.scopeType,
        scopeId: input.scopeId,
        targetType: input.targetType,
        targetId: input.targetId,
        payloadJson: Object.keys(payload).length > 0 ? JSON.stringify(payload) : null
      }
    });

    return true;
  } catch {
    return false;
  }
}

export async function listAuditEvents(input?: {
  scopeType?: string;
  scopeId?: string;
  targetType?: string;
  targetId?: string;
  event?: string;
  limit?: number;
}): Promise<AuditEventRecord[]> {
  try {
    const records = await db.auditEvent.findMany({
      where: {
        ...(input?.scopeType ? { scopeType: input.scopeType } : {}),
        ...(input?.scopeId ? { scopeId: input.scopeId } : {}),
        ...(input?.targetType ? { targetType: input.targetType } : {}),
        ...(input?.targetId ? { targetId: input.targetId } : {}),
        ...(input?.event ? { event: input.event } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: input?.limit ?? Number(process.env.REVIEW_AUDIT_PAGE_SIZE || 20)
    });

    return records.map((record) => ({
      id: record.id,
      event: record.event,
      level: record.level as AuditLevel,
      actorType: record.actorType ?? undefined,
      actorId: record.actorId ?? undefined,
      scopeType: record.scopeType ?? undefined,
      scopeId: record.scopeId ?? undefined,
      targetType: record.targetType ?? undefined,
      targetId: record.targetId ?? undefined,
      payload: parsePayload(record.payloadJson),
      createdAt: record.createdAt.toISOString()
    }));
  } catch {
    return [];
  }
}
