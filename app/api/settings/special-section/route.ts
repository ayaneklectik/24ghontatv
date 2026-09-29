import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return proxyToLaravel(request, {
    publicBase: true,
    path: 'special-section',
  });
}

export async function POST(request: NextRequest) {
  return proxyToLaravel(request, {
    authenticated: true,
    path: 'special-section',
  });
}
