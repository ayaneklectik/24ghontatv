export type FrontendCategory = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

export type FrontendNewsPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  categoryId: string | number;
  subCategoryId?: string | number;
  featuredImage?: string;
  imageCaption?: string;
  isBreaking?: boolean;
  isLead?: boolean;
  isTopNews?: boolean;
  isSpecial?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: 'DRAFT' | 'PUBLISHED';
};

async function parseResponse<T = unknown>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as any)?.message ||
      (payload as any)?.error ||
      'Request failed.';
    throw new Error(message);
  }

  return payload as T;
}

export async function fetchCategories(): Promise<FrontendCategory[]> {
  const response = await fetch('/api/categories', { cache: 'no-store' });
  return parseResponse<FrontendCategory[]>(response);
}

export async function fetchNews(params?: {
  category?: string;
  status?: string;
  limit?: number;
  page?: number;
}) {
  const search = new URLSearchParams();

  if (params?.category) search.set('category_id', params.category);
  if (params?.status) search.set('status', params.status === 'PUBLISHED' ? '1' : '0');
  if (params?.limit) search.set('per_page', String(params.limit));
  if (params?.page) search.set('page', String(params.page));

  const query = search.toString();
  const response = await fetch(`/api/news${query ? `?${query}` : ''}`, {
    cache: 'no-store',
  });

  return parseResponse(response);
}

export async function createNewsArticle(data: FrontendNewsPayload, imageFile?: File | null) {
  const payload = {
    news_title: data.title,
    news_sub_title: data.excerpt ?? '',
    dis: data.content ?? '',
    cat: Number(data.categoryId),
    sub_cat: data.subCategoryId ? Number(data.subCategoryId) : null,
    published_date: new Date().toISOString().slice(0, 10),
    islead: Boolean(data.isLead),
    isbreaking: Boolean(data.isBreaking),
    image_title: data.imageCaption ?? '',
    meta_keyword: Array.isArray(data.tags) ? data.tags.join(', ') : '',
    meta_dis: data.metaDescription ?? '',
    status: data.status === 'PUBLISHED',
  };

  let body: BodyInit;
  let headers: HeadersInit | undefined;

  if (imageFile) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (value !== null && value !== undefined) {
        formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
      }
    }
    formData.append('imageUpload', imageFile);
    body = formData;
  } else {
    body = JSON.stringify(payload);
    headers = { 'Content-Type': 'application/json' };
  }

  const response = await fetch('/api/admin/news', {
    method: 'POST',
    headers,
    body,
  });

  const created = await parseResponse<any>(response);

  // The legacy Laravel create endpoint publishes admin-created news by default.
  // For an explicit draft action, immediately transition it back to status=0.
  if (data.status === 'DRAFT' && created?.data?.id) {
    const draftResponse = await fetch(`/api/admin/news/${created.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, status: false }),
    });

    return parseResponse(draftResponse);
  }

  return created;
}

export async function fetchSiteSettings() {
  const response = await fetch('/api/settings', { cache: 'no-store' });
  return parseResponse(response);
}

export async function deleteNews(id: string | number) {
  const response = await fetch(`/api/news/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });
  return parseResponse(response);
}

export async function updateNews(id: string | number, data: Record<string, unknown> | FormData) {
  const isMultipart = data instanceof FormData;
  if (isMultipart) data.set('_method', 'PUT');
  const response = await fetch(`/api/admin/news/${encodeURIComponent(String(id))}`, {
    method: isMultipart ? 'POST' : 'PUT',
    headers: isMultipart ? undefined : { 'Content-Type': 'application/json' },
    body: isMultipart ? data : JSON.stringify(data),
  });
  return parseResponse(response);
}
