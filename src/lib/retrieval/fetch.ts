import { isTrustedUrl } from '@/config/trusted-sources';
import { serverEnv } from '@/lib/env';

export type SafeFetchResult = {
  ok: boolean;
  url: string;
  status?: number;
  contentType?: string;
  text?: string;
  error?: string;
};

export async function safeFetchText(url: string): Promise<SafeFetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.RETRIEVAL_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'CivicShieldAI/0.1 (+https://civicshield.ai)'
      }
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      return { ok: false, url, status: response.status, contentType, error: 'Fetch failed.' };
    }

    if (!isTrustedUrl(response.url)) {
      return { ok: false, url: response.url, status: response.status, contentType, error: 'Redirected outside the trusted source allowlist.' };
    }

    if (!contentType.toLowerCase().includes('text/html') && !contentType.toLowerCase().includes('text/plain')) {
      return { ok: false, url: response.url, status: response.status, contentType, error: 'Unsupported content type.' };
    }

    const rawText = await response.text();
    const text = rawText.slice(0, serverEnv.RETRIEVAL_MAX_BYTES);

    return {
      ok: true,
      url: response.url,
      status: response.status,
      contentType,
      text
    };
  } catch (error) {
    return {
      ok: false,
      url,
      error: error instanceof Error ? error.message : 'Unknown fetch error.'
    };
  } finally {
    clearTimeout(timeout);
  }
}
