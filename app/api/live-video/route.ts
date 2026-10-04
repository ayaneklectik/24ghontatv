import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return proxyToLaravel(request, {
    publicBase: true,
    path: 'live-video' + request.nextUrl.search,
  });
}
