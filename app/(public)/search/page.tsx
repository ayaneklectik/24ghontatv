import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapNewsItem } from '@/lib/public-data';
import type { NewsItem } from '@/types/public';
import { formatBengaliDateTime } from '@/lib/bengali';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? '').trim();
  const currentPage = Math.max(Number(params.page) || 1, 1);

  if (!q) {
    return (
      <main className="max-w-[1000px] mx-auto px-4 py-16 font-kalpurush">
        <h1 className="text-3xl md:text-4xl font-black mb-6">সংবাদ খুঁজুন</h1>
        <form action="/search" className="flex gap-2">
          <input name="q" placeholder="সংবাদ, শিরোনাম বা বিষয় লিখুন" className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200" />
          <button className="px-6 rounded-lg bg-red-600 text-white font-bold">খুঁজুন</button>
        </form>
      </main>
    );
  }

  let payload: any;
  try {
    payload = await fetchLaravelPublic<any>(`search?q=${encodeURIComponent(q)}&per_page=20&page=${currentPage}`);
  } catch (error) {
    console.error('Search API error:', error);
    return <main className="py-20 text-center font-kalpurush text-neutral-500">Laravel API সংযোগ পাওয়া যাচ্ছে না।</main>;
  }

  const pageData = payload?.data?.news ?? {};
  const results: NewsItem[] = Array.isArray(pageData?.data) ? pageData.data.map(mapNewsItem) : [];
  const current = Number(pageData?.current_page ?? currentPage);
  const last = Number(pageData?.last_page ?? 1);

  return (
    <main className="max-w-[1100px] mx-auto px-4 py-8 font-kalpurush">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">সার্চ ফলাফল</h1>
          <p className="text-neutral-500 mt-1">“{q}” — মোট {Number(pageData?.total ?? results.length)}টি ফলাফল</p>
        </div>
        <form action="/search" className="flex gap-2 w-full md:w-[420px]">
          <input name="q" defaultValue={q} className="flex-1 border rounded-lg px-4 py-2.5" />
          <button className="px-5 rounded-lg bg-red-600 text-white font-bold">খুঁজুন</button>
        </form>
      </div>

      <div className="space-y-6">
        {results.length ? results.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group grid grid-cols-1 sm:grid-cols-4 gap-4 border-b border-neutral-200 pb-6">
            <div className="aspect-[16/10] rounded overflow-hidden bg-neutral-100">
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />}
            </div>
            <div className="sm:col-span-3">
              <h2 className="text-xl md:text-2xl font-black leading-snug group-hover:text-red-600">{item.title}</h2>
              {item.excerpt && <p className="mt-2 text-neutral-500 leading-relaxed line-clamp-3">{item.excerpt}</p>}
              <p className="mt-3 text-sm text-neutral-400">{item.category || 'সংবাদ'} {item.publishedAt ? `• ${formatBengaliDateTime(item.publishedAt) || item.publishedAt}` : ''}</p>
            </div>
          </Link>
        )) : <div className="py-20 text-center text-neutral-500">কোনো ফলাফল পাওয়া যায়নি।</div>}
      </div>

      {last > 1 && (
        <div className="flex flex-wrap gap-2 pt-7">
          {current > 1 && <Link href={`/search?q=${encodeURIComponent(q)}&page=${current - 1}`} className="px-3 py-2 border rounded font-bold">আগের</Link>}
          {Array.from({ length: Math.min(last, 7) }, (_, i) => i + 1).map((page) => (
            <Link key={page} href={`/search?q=${encodeURIComponent(q)}&page=${page}`} className={`px-3 py-2 border rounded font-bold ${page === current ? 'bg-red-600 text-white border-red-600' : ''}`}>{page}</Link>
          ))}
          {current < last && <Link href={`/search?q=${encodeURIComponent(q)}&page=${current + 1}`} className="px-3 py-2 border rounded font-bold">পরের</Link>}
        </div>
      )}
    </main>
  );
}
