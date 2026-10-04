import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyToLaravel(request, {
    publicBase: true,
    path: `news/${encodeURIComponent(id)}`,
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyToLaravel(request, {
    authenticated: true,
    path: `news/${encodeURIComponent(id)}`,
  });
}
