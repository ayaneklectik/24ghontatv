import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return proxyToLaravel(request, {
    authenticated: true,
    path: `users${request.nextUrl.search}`,
    transformResponse(payload) {
      const root = payload as any;
      const page = root?.data ?? {};
      const rows = Array.isArray(page?.data) ? page.data : [];

      return rows.map((user: any) => ({
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.user_type,
        status: Number(user.status) === 1,
        createdAt: user.created_at,
      }));
    },
  });
}

export async function POST(request: NextRequest) {
  return proxyToLaravel(request, {
    authenticated: true,
    path: 'users',
  });
}
