import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyToLaravel(request, {
    path: `${path.join('/')}${request.nextUrl.search}`,
    authenticated: true,
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
