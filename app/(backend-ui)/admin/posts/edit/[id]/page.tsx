'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { adminRequest, mapAdminNews, type AdminNews } from '@/lib/admin-api';
import { fetchCategories, updateNews, type FrontendCategory } from '@/lib/api';
import { retryAlternateMediaHost } from '@/lib/urls';

type EditableNews = AdminNews & {
  publishedDate: string;
  subCategoryId: string;
};

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id);
  const router = useRouter();
  const [post, setPost] = useState<EditableNews | null>(null);
  const [preservedFields, setPreservedFields] = useState<Record<string, unknown>>({});
  const [categories, setCategories] = useState<FrontendCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [status, setStatus] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[360px] p-4 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    let active = true;

    async function loadPost() {
      setLoading(true);
      setError(null);
      try {
        const [response, categoryItems] = await Promise.all([
          adminRequest<any>(`/news/${encodeURIComponent(id)}`),
          fetchCategories(),
        ]);
        if (!active) return;

        const item = response?.data?.data ?? response?.data ?? response;
        const mapped = mapAdminNews(item);
        if (!mapped.id) throw new Error('The requested article could not be found.');

        const loadedPost: EditableNews = {
          ...mapped,
          publishedDate: formatDate(item?.published_date ?? item?.publishedAt ?? item?.created_at ?? mapped.createdAt),
          subCategoryId: item?.sub_cat ? String(item.sub_cat) : '',
        };
        setPost(loadedPost);
        setPreservedFields({
          extra_cat: Array.isArray(item?.extra_cat)
            ? item.extra_cat.map(Number)
            : String(item?.extra_cat ?? '').split(',').filter(Boolean).map(Number),
          writer_desk: item?.writer_desk ?? null,
          representative: item?.representative ?? '',
          representative_loc: item?.representative_loc ?? '',
          writer_desk_show: Boolean(item?.writer_desk_show),
          image_title: item?.image_title ?? '',
          meta_keyword: item?.meta_keyword ?? '',
          meta_dis: item?.meta_dis ?? item?.meta_description ?? '',
          title_color: item?.title_color ?? '',
          sub_title_color: item?.sub_title_color ?? '',
        });
        setImageCaption(item?.image_title ?? '');
        setCategories(categoryItems);
        setCategoryId(mapped.category?.id ?? (item?.cat ? String(item.cat) : ''));
        setSubCategoryId(loadedPost.subCategoryId);
        setPublishedDate(loadedPost.publishedDate);
        setStatus(mapped.status === 1);
        setIsLead(Boolean(mapped.isLead));
        setIsBreaking(Boolean(mapped.isBreaking));
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Could not load this article.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPost();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (post && editor) editor.commands.setContent(post.content ?? '');
  }, [post?.id, editor]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const mainCategories = categories.filter((category) => !category.parentId);
  const subCategories = categories.filter((category) => category.parentId === categoryId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!post || !editor) return;
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        ...preservedFields,
        news_title: post.title.trim(),
        news_sub_title: post.excerpt ?? '',
        dis: editor.getHTML(),
        cat: Number(categoryId),
        sub_cat: subCategoryId ? Number(subCategoryId) : null,
        published_date: publishedDate,
        islead: isLead,
        isbreaking: isBreaking,
        status,
        image_title: imageCaption,
      };
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (value === null || value === undefined) continue;
        if (Array.isArray(value)) {
          value.forEach((item, index) => formData.append(`${key}[${index}]`, String(item)));
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
      if (selectedImage) formData.append('imageUpload', selectedImage);
      await updateNews(id, formData);
      router.push('/admin/posts');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this article.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Edit Article</h1>
          <p className="mt-1 text-xs text-gray-500">Article #{id}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || saving || !post}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading article...</div>
      ) : post ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">Headline</label>
                <input
                  id="title"
                  required
                  value={post.title}
                  onChange={(event) => setPost({ ...post, title: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-3 text-lg font-semibold focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-gray-700">Summary</label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={post.excerpt ?? ''}
                  onChange={(event) => setPost({ ...post, excerpt: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none"
                />
              </div>
            </section>
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">Article Content</div>
              {editor && <EditorContent editor={editor} />}
            </section>
          </div>

          <aside className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-800">Featured Image</h2>
              {imagePreview || post.imageUrl ? (
                <img
                  src={imagePreview ?? post.imageUrl ?? undefined}
                  alt={post.title}
                  onError={(event) => retryAlternateMediaHost(event.currentTarget)}
                  className="aspect-video w-full rounded-lg border border-gray-200 bg-gray-50 object-contain"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                  No image currently assigned
                </div>
              )}
              <label htmlFor="featured-image" className="block text-sm font-medium text-gray-700">Choose replacement image</label>
              <input
                id="featured-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedImage(file);
                  setImagePreview(file ? URL.createObjectURL(file) : null);
                }}
                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
              />
              {selectedImage && (
                <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                  <span className="truncate">{selectedImage.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="shrink-0 text-red-600 hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
              )}
              <div>
                <label htmlFor="image-caption" className="mb-1 block text-sm font-medium text-gray-700">Image caption</label>
                <input
                  id="image-caption"
                  value={imageCaption}
                  onChange={(event) => setImageCaption(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                />
              </div>
            </section>
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setSubCategoryId('');
                }}
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
              >
                <option value="">Select category</option>
                {mainCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            {subCategories.length > 0 && (
              <div>
                <label htmlFor="subcategory" className="mb-1 block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  id="subcategory"
                  value={subCategoryId}
                  onChange={(event) => setSubCategoryId(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
                >
                  <option value="">No subcategory</option>
                  {subCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="published-date" className="mb-1 block text-sm font-medium text-gray-700">Publication Date</label>
              <input
                id="published-date"
                type="date"
                required
                value={publishedDate}
                onChange={(event) => setPublishedDate(event.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={status} onChange={(event) => setStatus(event.target.checked)} className="accent-red-600" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={isLead} onChange={(event) => setIsLead(event.target.checked)} className="accent-red-600" />
              Lead news
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={isBreaking} onChange={(event) => setIsBreaking(event.target.checked)} className="accent-red-600" />
              Breaking news
            </label>
          </aside>
        </div>
      ) : null}
    </form>
  );
}