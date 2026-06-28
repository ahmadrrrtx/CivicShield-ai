import type { NextRequest } from 'next/server';

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export function getRequestId(request: NextRequest) {
  return request.headers.get('x-request-id') || crypto.randomUUID();
}
