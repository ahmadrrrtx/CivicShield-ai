export function jsonNoStore(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', 'no-store, max-age=0');
  headers.set('Pragma', 'no-cache');
  return Response.json(body, { ...init, headers });
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return jsonNoStore({ ok: false, error: message, ...extra }, { status });
}
