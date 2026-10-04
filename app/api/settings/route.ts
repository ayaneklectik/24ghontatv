import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return proxyToLaravel(request, {
    publicBase: true,
    path: 'site',
    transformResponse(payload) {
      const data = (payload as any)?.data ?? {};
      const app = data?.app ?? {};
      return {
        siteTitle: app.app_title ?? '',
        siteDescription: app.app_description ?? '',
        logo: app.logo_img ?? null,
        contact: app.contact ?? '',
        email: app.email ?? '',
        address: app.address ?? '',
      };
    },
  });
}

export async function PUT(request: NextRequest) {
  return proxyToLaravel(request, {
    authenticated: true,
    path: 'app-settings',
  });
}
