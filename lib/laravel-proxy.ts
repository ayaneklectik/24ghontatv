import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const REQUEST_TIMEOUT_MS = 15_000;

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export async function proxyToLaravel(
  request: NextRequest,
  options: {
    path: string;
    authenticated?: boolean;
    publicBase?: boolean;
    transformResponse?: (payload: unknown) => unknown;
  },
): Promise<Response> {
  const base = options.publicBase
    ? process.env.LARAVEL_PUBLIC_API_URL
    : process.env.LARAVEL_API_URL;

  if (!base) {
    return Response.json(
      { error: 'Backend API is not configured.' },
      { status: 503 },
    );
  }

  let laravelToken: string | null = null;

  if (options.authenticated) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    laravelToken = typeof token?.laravelToken === 'string'
      ? token.laravelToken
      : null;

    if (!laravelToken) {
      return Response.json(
        { error: 'Unauthenticated.' },
        { status: 401 },
      );
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers = new Headers();
    headers.set('Accept', 'application/json');

    if (laravelToken) {
      headers.set('Authorization', `Bearer ${laravelToken}`);
    }

    const contentType = request.headers.get('content-type');
    const isMultipart = Boolean(contentType?.includes('multipart/form-data'));

    let body: BodyInit | undefined;

    if (!['GET', 'HEAD'].includes(request.method)) {
      if (isMultipart) {
        const incoming = await request.formData();
        const outgoing = new FormData();

        for (const [key, value] of incoming.entries()) {
          if (typeof value === 'string') {
            outgoing.append(key, value);
          } else {
            outgoing.append(key, value, value.name || 'upload');
          }
        }

        body = outgoing;
      } else {
        const text = await request.text();
        if (text) body = text;
        if (contentType) headers.set('Content-Type', contentType);
      }
    }

    const response = await fetch(joinUrl(base, options.path), {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
      signal: controller.signal,
    });

    const responseContentType = response.headers.get('content-type') ?? 'application/json';
    const raw = await response.arrayBuffer();

    let outgoingBody: BodyInit = raw;

    if (responseContentType.includes('application/json')) {
      const text = new TextDecoder().decode(raw);
      try {
        const parsed = JSON.parse(text);
        const transformed = options.transformResponse
          ? options.transformResponse(parsed)
          : parsed;
        outgoingBody = JSON.stringify(transformed);
      } catch {
        outgoingBody = text;
      }
    }

    return new Response(outgoingBody, {
      status: response.status,
      headers: {
        'Content-Type': responseContentType.includes('application/json')
          ? 'application/json; charset=utf-8'
          : responseContentType,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'Backend API request timed out.'
      : 'Backend API is unavailable.';

    return Response.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
