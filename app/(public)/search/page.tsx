import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapNewsItem } from '@/lib/public-data';
import type { NewsItem } from '@/types/public';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? '').trim();
  const currentPage = Math.max(Number(params.page) || 1, 1);

  if (!q) {
    return (
      <main className="mx-auto w-full max-w-[1000px] px-4 py-10 font-kalpurush sm:px-6">
        <div className="mb-5 flex items-center gap-2.5 border-b-2 border-red-200 pb-3">
          <h1 className="text-[27px] font-black md:text-[30px]">সংবাদ খুঁজুন</h1><span className="text-[17px] font-black text-red-600">❯</span>
        </div>
        <form action="/search" className="flex gap-2">
          <input name="q" placeholder="সংবাদ, শিরোনাম বা বিষয় লিখুন" className="min-w-0 flex-1 border border-neutral-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" />
          <button className="shrink-0 bg-red-600 px-6 font-bold text-white transition-colors hover:bg-red-700">খুঁজুন</button>
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
    <main className="mx-auto w-full max-w-[1100px] px-4 py-7 font-kalpurush sm:px-6">
      <div className="mb-5 flex flex-col justify-between gap-4 border-b-2 border-red-200 pb-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-[27px] font-black md:text-[30px]">সার্চ ফলাফল</h1>
          <p className="mt-1 text-sm text-neutral-500">“{q}” — মোট {Number(pageData?.total ?? results.length)}টি ফলাফল</p>
        </div>
        <form action="/search" className="flex w-full gap-2 md:w-[420px]">
          <input name="q" defaultValue={q} className="min-w-0 flex-1 border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-500" />
          <button className="shrink-0 bg-red-600 px-5 font-bold text-white hover:bg-red-700">খুঁজুন</button>
        </form>
      </div>

      <div className="space-y-6">
        {results.length ? results.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group grid grid-cols-1 gap-4 border-b border-neutral-200 pb-5 sm:grid-cols-4">
            <div className="aspect-[16/10] overflow-hidden border border-neutral-200 bg-neutral-100">
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />}
            </div>
            <div className="sm:col-span-3">
              <h2 className="text-lg font-black leading-snug transition-colors group-hover:text-red-600 md:text-xl">{item.title}</h2>
              {item.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500">{item.excerpt}</p>}
              <p className="mt-3 text-xs text-neutral-400">{item.category || 'সংবাদ'} {item.publishedAt ? `• ${item.publishedAt}` : ''}</p>
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
