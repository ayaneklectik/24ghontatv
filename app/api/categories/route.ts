import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return proxyToLaravel(request, {
    publicBase: true,
    path: 'categories',
    transformResponse(payload) {
      const root = payload as any;
      const categories = Array.isArray(root?.data) ? root.data : [];

      return categories.map((category: any) => ({
        id: String(category.id),
        name: category.cat_name,
        slug: category.cat_slug ?? String(category.id),
        parentId: null,
      }));
    },
  });
}
