import type { NextRequest } from 'next/server';
import { proxyToLaravel } from '@/lib/laravel-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return proxyToLaravel(request, {
    publicBase: true,
    path: `news${request.nextUrl.search}`,
    transformResponse(payload) {
      const root = payload as any;
      const rows = Array.isArray(root?.data?.data) ? root.data.data : [];

      return rows.map((item: any) => ({
        id: String(item.id),
        title: item.news_title,
        slug: item.title_link,
        excerpt: item.news_sub_title || item.excerpt || item.summary || '',
        content: item.dis ?? '',
        featuredImg: item.image_url ?? item.image ?? null,
        status: Number(item.status) === 1 ? 'PUBLISHED' : 'DRAFT',
        views: Number(item.hit ?? 0),
        createdAt: item.created_at ?? item.publishedAt ?? item.published_date ?? '',
        isBreaking: Boolean(item.isbreaking),
        isTop: false,
        isPopular: false,
        category: item.category
          ? {
              id: String(item.category.id),
              name: item.category.cat_name,
              slug: item.category.cat_slug ?? String(item.category.id),
            }
          : undefined,
        author: item.user_model
          ? { name: item.user_model.name }
          : undefined,
      }));
    },
  });
}
