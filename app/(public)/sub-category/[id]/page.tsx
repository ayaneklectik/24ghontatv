import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';
import MediaImage from '@/components/public/MediaImage';
import { formatBengaliDateTime } from '@/lib/bengali';
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
    <main className="max-w-[1440px] mx-auto px-4 py-8 font-kalpurush">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[32px] font-black text-neutral-800">{title}</h1>
        <span className="text-red-600 font-black">❯</span>
      </div>
      {!news.length ? (
        <div className="py-16 text-center text-neutral-500">কোনো সংবাদ পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group border border-neutral-200 rounded-xl overflow-hidden bg-white">
              <div className="aspect-[16/10] bg-neutral-100">
                <MediaImage src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform" />
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg text-neutral-800 group-hover:text-red-600 transition-colors">{item.title}</h2>
                <p className="text-xs text-neutral-500 mt-2">{item.publishedAt ? formatBengaliDateTime(item.publishedAt) : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
