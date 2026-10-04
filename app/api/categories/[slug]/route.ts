import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  return proxyToLaravel(request, {
    publicBase: true,
    path: `categories/${encodeURIComponent(slug)}`,
  });
}
