'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye, ExternalLink, FileCheck2, FileText, FolderTree, UserRound, X } from 'lucide-react';
import { fetchAdminNews, type AdminNews } from '@/lib/admin-api';
import MediaImage from '@/components/public/MediaImage';
import { PLACEHOLDER_IMAGE } from '@/lib/public-data';

type ActivityData = {
  articles: AdminNews[];
  total: number | null;
  drafts: number | null;
  published: number | null;
};

type ArticleDialog = {
  article: AdminNews;
  view: 'choice' | 'performance';
} | null;

function getLocalDateInputValue(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function getArticleDate(article: AdminNews) {
  const value = article.publishedAt || article.createdAt;
  if (!value) return '';
  const datePart = value.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  if (datePart) return datePart;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : getLocalDateInputValue(date);
}

function formatDate(value?: string) {
  if (!value) return 'তারিখ পাওয়া যায়নি';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? '—'
    : new Intl.NumberFormat('bn-BD').format(value);
}

function getTotal(pagination: any, items: AdminNews[]): number | null {
  const value = Number(pagination?.total);
  return Number.isFinite(value) ? value : items.length;
}

export default function DashboardContent() {
  const today = useMemo(() => getLocalDateInputValue(new Date()), []);
  const weekAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return getLocalDateInputValue(date);
  }, []);
  const [fromDate, setFromDate] = useState(weekAgo);
  const [toDate, setToDate] = useState(today);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState<ArticleDialog>(null);

  useEffect(() => {
    if (!fromDate || !toDate || fromDate > toDate) {
      setActivity(null);
      setLoading(false);
      setError('');
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    const load = async () => {
      const results = await Promise.allSettled([
        fetchAdminNews({ perPage: 100, page: 1, fromDate, toDate }),
        fetchAdminNews({ perPage: 1, page: 1, status: 0, fromDate, toDate }),
        fetchAdminNews({ perPage: 1, page: 1, status: 1, fromDate, toDate }),
      ]);

      if (!active) return;

      const [articlesResult, draftsResult, publishedResult] = results;
      if (articlesResult.status === 'rejected') {
        setActivity(null);
        setError(articlesResult.reason instanceof Error
          ? articlesResult.reason.message
          : 'নির্বাচিত সময়ের সংবাদ লোড করা যায়নি।');
        setLoading(false);
        return;
      }

      const articles = articlesResult.value.items.filter((article: AdminNews) => {
        const date = getArticleDate(article);
        return date && date >= fromDate && date <= toDate;
      });
      const total = getTotal(articlesResult.value.pagination, articlesResult.value.items);
      const draftTotal = draftsResult.status === 'fulfilled'
        ? getTotal(draftsResult.value.pagination, draftsResult.value.items)
        : null;
      const publishedTotal = publishedResult.status === 'fulfilled'
        ? getTotal(publishedResult.value.pagination, publishedResult.value.items)
        : null;
      const statusErrors = [
        draftsResult.status === 'rejected' ? 'খসড়ার সংখ্যা লোড করা যায়নি।' : '',
        publishedResult.status === 'rejected' ? 'প্রকাশিত সংবাদ সংখ্যা লোড করা যায়নি।' : '',
      ].filter(Boolean);

      setActivity({
        articles,
        total,
        drafts: draftTotal,
        published: publishedTotal,
      });
      setError(statusErrors.join(' '));
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, [fromDate, toDate]);

  useEffect(() => {
    if (!dialog) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialog(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [dialog]);

  const byAuthor = useMemo(() => {
    const authors = new Map<string, { name: string; count: number }>();
    activity?.articles.forEach((article) => {
      const name = article.author?.name?.trim() || 'বার্তা কক্ষ';
      const current = authors.get(name) ?? { name, count: 0 };
      current.count += 1;
      authors.set(name, current);
    });
    return [...authors.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [activity]);

  const byCategory = useMemo(() => {
    const categories = new Map<string, number>();
    activity?.articles.forEach((article) => {
      const name = article.category?.name?.trim() || 'ক্যাটাগরি অনির্দিষ্ট';
      categories.set(name, (categories.get(name) ?? 0) + 1);
    });
    return [...categories.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [activity]);

  const viewsInLoadedArticles = activity?.articles.reduce((sum, article) => sum + article.views, 0) ?? null;
  const cards = [
    { label: 'এই সময়ে মোট সংবাদ', value: activity?.total ?? null, icon: FileText, tone: 'border-sky-200 bg-sky-50 text-sky-800' },
    { label: 'প্রকাশিত সংবাদ', value: activity?.published ?? null, icon: FileCheck2, tone: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    { label: 'খসড়া সংবাদ', value: activity?.drafts ?? null, icon: FileText, tone: 'border-amber-200 bg-amber-50 text-amber-800' },
    { label: 'দৃশ্যমান সংবাদে মোট ভিউ', value: viewsInLoadedArticles, icon: Eye, tone: 'border-violet-200 bg-violet-50 text-violet-800' },
  ];

  const invalidRange = Boolean(fromDate && toDate && fromDate > toDate);

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-2xl font-bold text-neutral-900">24ghontatv Site Overview:</h1>
        <p className="mt-1 text-sm text-neutral-500">তারিখের পরিসর বেছে সংবাদ, প্রকাশনা ও সম্পাদকীয় কার্যক্রম দেখুন।</p>
      </header>

      <section className="flex flex-wrap items-end gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <label className="grid gap-1 text-sm font-semibold text-neutral-700">
          শুরুর তারিখ
          <input
            type="date"
            value={fromDate}
            max={today}
            onChange={(event) => setFromDate(event.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 font-normal"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-neutral-700">
          শেষ তারিখ
          <input
            type="date"
            value={toDate}
            max={today}
            min={fromDate || undefined}
            onChange={(event) => setToDate(event.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 font-normal"
          />
        </label>
        <div className="pb-2 text-sm text-neutral-500">
          {loading ? 'তথ্য আপডেট হচ্ছে…' : activity ? `${formatDate(fromDate)} — ${formatDate(toDate)}` : ''}
        </div>
      </section>

      {invalidRange && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">শেষ তারিখ শুরুর তারিখের আগে হতে পারে না।</p>}
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="নির্বাচিত সময়ের পরিসংখ্যান">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className={`rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md ${tone}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold opacity-80">{label}</p>
              <span className="rounded-lg bg-white/70 p-2"><Icon className="h-4 w-4" /></span>
            </div>
            <p className="mt-3 text-3xl font-bold">{loading ? '…' : formatNumber(value)}</p>
          </article>
        ))}
      </section>

      <p className="-mt-4 text-xs text-neutral-500">
        ভিউগুলো নির্বাচিত সময়ের সংবাদগুলোর বর্তমান মোট (lifetime) ভিউ। তালিকা ও লেখক/ক্যাটাগরির হিসাব সর্বোচ্চ ১০০টি সাম্প্রতিক মিলের ওপর।
      </p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 p-5">
            <div>
              <h2 className="font-bold text-neutral-900">সাম্প্রতিক সংবাদ</h2>
              <p className="mt-1 text-xs text-neutral-500">সংবাদে চাপ দিলে বিস্তারিত বা পারফরম্যান্স বেছে নিন।</p>
            </div>
            <Link href="/admin/posts" className="text-sm font-semibold text-red-600 hover:underline">সব সংবাদ দেখুন</Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {activity?.articles.slice(0, 8).map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => setDialog({ article, view: 'choice' })}
                className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-sky-50/70 sm:px-5"
                aria-label={`${article.title}: Go to news or See performance`}
              >
                <MediaImage
                  src={article.imageUrl || PLACEHOLDER_IMAGE}
                  alt={article.title}
                  className="h-16 w-24 shrink-0 rounded-md bg-neutral-100 object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block line-clamp-2 text-sm font-semibold text-neutral-800">{article.title}</span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    {article.author?.name || 'বার্তা কক্ষ'} · {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                </span>
                <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-sky-700 sm:flex">
                  <Eye className="h-4 w-4" /> {formatNumber(article.views)}
                </span>
              </button>
            ))}
            {!loading && activity?.articles.length === 0 && (
              <p className="p-8 text-center text-sm text-neutral-500">এই তারিখের পরিসরে কোনো সংবাদ পাওয়া যায়নি।</p>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-bold text-neutral-900"><UserRound className="h-4 w-4 text-indigo-600" /> লেখক কার্যক্রম</h2>
            <div className="mt-3 divide-y divide-neutral-100">
              {byAuthor.map((author) => (
                <div key={author.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="truncate text-neutral-700">{author.name}</span>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">{formatNumber(author.count)} সংবাদ</span>
                </div>
              ))}
              {!loading && byAuthor.length === 0 && <p className="py-3 text-sm text-neutral-500">লেখকের তথ্য নেই।</p>}
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-bold text-neutral-900"><FolderTree className="h-4 w-4 text-teal-600" /> ক্যাটাগরি কার্যক্রম</h2>
            <div className="mt-3 divide-y divide-neutral-100">
              {byCategory.map(([name, count]) => (
                <div key={name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="truncate text-neutral-700">{name}</span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">{formatNumber(count)} সংবাদ</span>
                </div>
              ))}
              {!loading && byCategory.length === 0 && <p className="py-3 text-sm text-neutral-500">ক্যাটাগরির তথ্য নেই।</p>}
            </div>
          </section>
        </div>
      </div>

      {dialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialog(null);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="dashboard-article-title" className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 p-5">
              <div>
                <p className="text-xs font-bold text-red-600">{dialog.article.category?.name || 'সংবাদ'}</p>
                <h2 id="dashboard-article-title" className="mt-1 text-lg font-bold text-neutral-900">{dialog.article.title}</h2>
              </div>
              <button type="button" onClick={() => setDialog(null)} aria-label="বন্ধ করুন" className="rounded p-1 text-neutral-500 hover:bg-neutral-100"><X className="h-5 w-5" /></button>
            </div>
            <MediaImage
              src={dialog.article.imageUrl || PLACEHOLDER_IMAGE}
              alt={dialog.article.title}
              className="max-h-56 w-full bg-neutral-100 object-cover"
            />
            {dialog.view === 'choice' ? (
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <Link href={`/news/${encodeURIComponent(dialog.article.id)}`} className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">
                  <ExternalLink className="h-4 w-4" /> Go to news
                </Link>
                <button type="button" onClick={() => setDialog({ ...dialog, view: 'performance' })} className="flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-800 hover:bg-violet-100">
                  <Eye className="h-4 w-4" /> See performance
                </button>
              </div>
            ) : (
              <div className="space-y-3 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-violet-50 p-4"><p className="text-xs font-semibold text-violet-700">মোট ভিউ</p><p className="mt-1 text-2xl font-bold text-violet-900">{formatNumber(dialog.article.views)}</p></div>
                  <div className="rounded-lg bg-emerald-50 p-4"><p className="text-xs font-semibold text-emerald-700">প্রকাশনা অবস্থা</p><p className="mt-1 text-base font-bold text-emerald-900">{dialog.article.status ? 'প্রকাশিত' : 'খসড়া'}</p></div>
                </div>
                <p className="text-sm text-neutral-600">লেখক: {dialog.article.author?.name || 'বার্তা কক্ষ'}</p>
                <p className="text-sm text-neutral-600">প্রকাশ / তৈরি: {formatDate(dialog.article.publishedAt || dialog.article.createdAt)}</p>
                <p className="text-xs text-neutral-500">API-তে বর্তমানে নিবন্ধের মোট ভিউ পাওয়া যাচ্ছে; নির্দিষ্ট সময়ের ভিউ অ্যানালিটিক্স উপলভ্য নয়।</p>
                <div className="flex flex-wrap justify-between gap-2 pt-2">
                  <button type="button" onClick={() => setDialog({ ...dialog, view: 'choice' })} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">পেছনে যান</button>
                  <Link href={`/news/${encodeURIComponent(dialog.article.id)}`} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"><ExternalLink className="h-4 w-4" /> Go to news</Link>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/posts/new" className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">নতুন সংবাদ লিখুন</Link>
        <Link href="/admin/posts/drafts" className="rounded border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">খসড়া পর্যালোচনা</Link>
        <Link href="/admin/categories" className="rounded border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">ক্যাটাগরি পরিচালনা</Link>
      </div>
    </div>
  );
}
