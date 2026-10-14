import { cache } from 'react';

const REQUEST_TIMEOUT_MS = 15_000;

export async function fetchLaravelPublic<T>(
  path: string,
  options: { timeoutMs?: number; revalidateSeconds?: number } = {},
): Promise<T> {
  const base = process.env.LARAVEL_PUBLIC_API_URL;

  if (!base) {
    throw new Error('LARAVEL_PUBLIC_API_URL is not configured.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? REQUEST_TIMEOUT_MS,
  );

  try {
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    };

    if (options.revalidateSeconds && options.revalidateSeconds > 0) {
      fetchOptions.next = { revalidate: options.revalidateSeconds };
    } else {
      fetchOptions.cache = 'no-store';
    }

    const response = await fetch(
      `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`,
      fetchOptions,
    );

    const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      (payload as any)?.message ||
      (payload as any)?.error ||
      `Laravel API returned ${response.status}.`,
    );
  }

    return payload as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Laravel API request timed out.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const fetchLaravelHome = cache(() => fetchLaravelPublic<any>('home', { revalidateSeconds: 30 }));
