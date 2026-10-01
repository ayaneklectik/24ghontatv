
import { resolveArticleContentImages, resolveMediaUrl } from '@/lib/urls';

function resolveAdminMediaUrl(value?: string | null): string | null {
  if (!value) return null;
  const raw = String(value).trim();
  return raw ? resolveMediaUrl(raw, '') : null;
}

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  order: number;
  status: number;
  postCount: number;
  parentId: string | null;
  type: 'MAIN' | 'SUB';
};

export type AdminNews = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string | null;
  status: number;
  views: number;
  createdAt?: string;
  publishedAt?: string;
  isBreaking?: boolean;
  isLead?: boolean;
  isTop?: boolean;
  category?: { id: string; name: string; slug: string } | null;
  author?: { id?: string; name: string } | null;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Request failed: ${response.status}`);
  }

  return payload as T;
}

export function mapAdminNews(item: any): AdminNews {
  return {
    id: String(item?.id ?? ''),
    title: item?.news_title ?? item?.title ?? '',
    slug: item?.title_link ?? item?.slug ?? item?.id ?? '',
    excerpt: item?.news_sub_title ?? item?.excerpt ?? '',
    content: resolveArticleContentImages(item?.dis ?? item?.content ?? ''),
    imageUrl: resolveAdminMediaUrl(
      item?.imageUrl ?? item?.image_url ?? (item?.image ? `images/news_img/${item.image}` : null),
    ),
    status: Number(item?.status ?? 0),
    views: Number(item?.hit ?? item?.views ?? 0),
    createdAt: item?.created_at ?? item?.createdAt,
    publishedAt: item?.published_date ?? item?.publishedAt,
    isBreaking: Boolean(item?.isbreaking ?? item?.isBreaking),
    isLead: Boolean(item?.islead ?? item?.isLead),
    isTop: Boolean(item?.isTop),
    category: item?.category
      ? {
          id: String(item.category.id),
          name: item.category.cat_name ?? item.category.name ?? '',
          slug: item.category.slug ?? item.category.cat_slug ?? String(item.category.id),
        }
      : item?.cat
        ? { id: String(item.cat), name: '', slug: String(item.cat) }
        : null,
    author: item?.userModel
      ? { id: String(item.userModel.id), name: item.userModel.name }
      : item?.author
        ? { id: item.author.id ? String(item.author.id) : undefined, name: item.author.name ?? '' }
        : null,
  };
}

export async function fetchAdminNews(params: {
  perPage?: number;
  page?: number;
  search?: string;
  categoryId?: string;
  status?: number;
} = {}) {
  const q = new URLSearchParams();
  q.set('per_page', String(params.perPage ?? 100));
  if (params.page) q.set('page', String(params.page));
  if (params.search) q.set('search', params.search);
  if (params.categoryId) q.set('category_id', params.categoryId);
  if (typeof params.status === 'number') q.set('status', String(params.status));

  const payload = await request<any>(`/news?${q.toString()}`);
  const paginator = payload?.data ?? {};
  const rows = Array.isArray(paginator?.data) ? paginator.data : [];

  return {
    items: rows.map(mapAdminNews),
    pagination: paginator,
  };
}

export async function uploadNewsEditorImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('upload', file);

  const payload = await request<any>('/news/editor-upload', {
    method: 'POST',
    body: formData,
  });
  const imageUrl =
    payload?.url ??
    payload?.imageUrl ??
    payload?.image_url ??
    payload?.data?.url ??
    payload?.data?.imageUrl ??
    payload?.data?.image_url;
  const resolvedUrl = typeof imageUrl === 'string' ? resolveAdminMediaUrl(imageUrl) : null;

  if (!resolvedUrl) {
    throw new Error('The image upload did not return a usable image URL.');
  }

  return resolvedUrl;
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const [catPayload, subPayload] = await Promise.all([
    request<any>('/categories'),
    request<any>('/sub-categories'),
  ]);

  const categories = Array.isArray(catPayload?.data) ? catPayload.data : [];
  const subs = Array.isArray(subPayload?.data) ? subPayload.data : [];

  const counts: Array<readonly [string, number]> = await Promise.all(
    categories.map(async (cat: any) => {
      try {
        const payload = await request<any>(
          `/categories/${cat.id}/news?per_page=1`
        );

        return [
          String(cat.id),
          Number(payload?.data?.total ?? 0),
        ] as const;
      } catch {
        return [String(cat.id), 0] as const;
      }
    }),
  );

  const countMap = new Map<string, number>(counts);

  return [
    ...categories.map((cat: any): AdminCategory => ({
      id: String(cat.id),
      name: cat.cat_name ?? '',
      slug:
        cat.slug ??
        cat.cat_slug ??
        cat.cat_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ??
        String(cat.id),
      order: Number(cat.cat_order ?? 0),
      status: Number(cat.status ?? 0),
      postCount: Number(countMap.get(String(cat.id)) ?? 0),
      parentId: null,
      type: 'MAIN',
    })),

    ...subs.map((sub: any): AdminCategory => ({
      id: String(sub.id),
      name: sub.sub_cat_name ?? '',
      slug:
        sub.slug ??
        sub.sub_cat_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ??
        String(sub.id),
      order: Number(sub.id ?? 0),
      status: 1,
      postCount: 0,
      parentId: sub.cat_id ? String(sub.cat_id) : null,
      type: 'SUB',
    })),
  ];
}

export async function fetchAdminUsers(): Promise<any[]> {
  const users: any[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const payload = await request<any>(`/users?per_page=100&page=${page}`);
    const data = payload?.data ?? payload;
    const rows = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.users)
          ? data.users
          : [];
    users.push(...rows);
    lastPage = Number(data?.last_page ?? data?.meta?.last_page ?? payload?.meta?.last_page ?? 1);
    page += 1;
  } while (page <= lastPage);

  return users;
}

export async function createNews(payload: Record<string, unknown>) {
  return request('/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateNewsAdmin(id: string | number, payload: Record<string, unknown>) {
  return request(`/news/${encodeURIComponent(String(id))}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteNewsAdmin(id: string | number) {
  return request(`/news/${encodeURIComponent(String(id))}`, { method: 'DELETE' });
}

export async function bulkDeleteNewsAdmin(ids: string[]) {
  return request('/news/bulk-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: ids.map(Number) }),
  });
}

export async function setNewsFlag(flag: 'lead-status' | 'breaking-status' | 'scroller-status', payload: Record<string, unknown>) {
  return request(`/news/${flag}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function setNewsPublish(id: string | number, publish: boolean) {
  return request(`/news/${id}/${publish ? 'publish' : 'unpublish'}`, { method: 'POST' });
}

export async function adminRequest<T = unknown>(path: string, init: RequestInit = {}) {
  return request<T>(path, init);
}
