import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';
import MediaImage from '@/components/public/MediaImage';
import { mapNewsItem } from '@/lib/public-data';
import type { NewsItem } from '@/types/public';

export default async function SubCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let title = 'সাব-ক্যাটাগরি';
  let news: NewsItem[] = [];

  try {
    const payload = await fetchLaravelPublic<any>(`sub-categories/${encodeURIComponent(id)}/news?per_page=28`);
    const data = payload?.data ?? {};
    title = data?.sub_category?.name ?? title;
    const rows = data?.news?.data;
    news = Array.isArray(rows) ? rows.map(mapNewsItem) : [];
  } catch (error) {
    console.error('Sub-category API error:', error);
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-7 font-kalpurush sm:px-6">
      <div className="mb-5 flex items-center gap-2.5 border-b-2 border-red-200 pb-3">
        <h1 className="text-[27px] font-black text-neutral-800 md:text-[30px]">{title}</h1>
        <span className="text-[17px] font-black text-red-600">❯</span>
      </div>
      {!news.length ? (
        <div className="py-16 text-center text-neutral-500">কোনো সংবাদ পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group overflow-hidden border border-neutral-200 bg-white">
              <div className="aspect-[16/10] bg-neutral-100">
                <MediaImage src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform" />
              </div>
              <div className="p-3">
                <h2 className="line-clamp-3 text-base font-bold text-neutral-800 transition-colors group-hover:text-red-600">{item.title}</h2>
                <p className="mt-1.5 text-xs text-neutral-500">{item.publishedAt ?? ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
