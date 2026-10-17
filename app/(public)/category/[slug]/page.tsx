import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapCategory, mapNewsItem } from '@/lib/public-data';
import type { CategoryItem, NewsItem } from '@/types/public';
import MediaImage from '@/components/public/MediaImage';
import { formatBengaliDateTime } from '@/lib/bengali';


interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function Pagination({ current, last, basePath }: { current: number; last: number; basePath: string }) {
  if (last <= 1) return null;
  const pages = Array.from({ length: Math.min(last, 7) }, (_, i) => i + 1);
  return (
    <nav className="flex flex-wrap items-center gap-2 pt-6" aria-label="Pagination">
      {current > 1 && <Link href={`${basePath}?page=${current - 1}`} className="px-3 py-2 rounded border bg-white font-bold">আগের</Link>}
      {pages.map((page) => (
        <Link key={page} href={`${basePath}?page=${page}`} className={`px-3 py-2 rounded border font-bold ${page === current ? 'bg-red-600 text-white border-red-600' : 'bg-white'}`}>{page}</Link>
      ))}
      {current < last && <Link href={`${basePath}?page=${current + 1}`} className="px-3 py-2 rounded border bg-white font-bold">পরের</Link>}
    </nav>
  );
}

function Card({ item }: { item: NewsItem }) {
  return (
    <article className="border-b border-neutral-200 pb-6">
      <Link href={`/news/${item.id}`} className="group grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="sm:col-span-2 aspect-[16/10] overflow-hidden rounded bg-neutral-100">
          {item.imageUrl ? <MediaImage src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" /> : <div className="w-full h-full bg-neutral-200" />}
        </div>
        <div className="sm:col-span-3">
          <h2 className="text-xl md:text-2xl font-black leading-snug text-neutral-900 group-hover:text-red-600">{item.title}</h2>
          {item.excerpt && <p className="mt-2 text-sm md:text-base text-neutral-500 leading-relaxed line-clamp-3">{item.excerpt}</p>}
          <div className="mt-3 text-sm text-neutral-400">{item.publishedAt ? formatBengaliDateTime(item.publishedAt) : ''}</div>
        </div>
      </Link>
    </article>
  );
}

export default async function CategoryArchivePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  let payload: any;
  try {
    payload = await fetchLaravelPublic<any>(`categories/${encodeURIComponent(decodeURIComponent(slug))}/news?per_page=20&page=${currentPage}`);
  } catch (error) {
    console.error('Category API error:', error);
    return <main className="max-w-[1440px] mx-auto px-4 py-20 text-center font-kalpurush text-neutral-500">Laravel API সংযোগ পাওয়া যাচ্ছে না। Backend চালু করে আবার চেষ্টা করুন।</main>;
  }

  const data = payload?.data ?? {};
  const category: CategoryItem | null = data?.category ? mapCategory(data.category) : null;
  if (!category) notFound();

  const pageData = data?.news ?? {};
  const items: NewsItem[] = Array.isArray(pageData?.data) ? pageData.data.map(mapNewsItem) : [];
  const pagination = {
    current: Number(pageData?.current_page ?? currentPage),
    last: Number(pageData?.last_page ?? 1),
  };

  return (
    <main className="w-full bg-white font-kalpurush text-neutral-800">
      <div className="max-w-[1440px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8">
          <div className="flex items-center gap-3 border-b-2 border-neutral-200 pb-3 mb-6">
            <h1 className="text-3xl md:text-4xl font-black">{category.name}</h1>
            <span className="text-red-600 font-black">❯</span>
          </div>
          {data.sub_categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {data.sub_categories.map((sub: any) => (
                <Link key={sub.id} href={`/sub-category/${sub.id}`} className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-sm font-bold">{sub.name}</Link>
              ))}
            </div>
          )}
          <div className="space-y-6">
            {items.length ? items.map((item) => <Card key={item.id} item={item} />) : <div className="py-20 text-center text-neutral-500">এই বিভাগে কোনো সংবাদ পাওয়া যায়নি।</div>}
          </div>
          <Pagination current={pagination.current} last={pagination.last} basePath={`/category/${encodeURIComponent(slug)}`} />
        </section>

        <aside className="lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-6">
          <div className="border-b-2 border-neutral-200 pb-3 mb-5 flex items-center gap-3">
            <h2 className="text-2xl font-black">এই বিভাগের সারসংক্ষেপ</h2>
            <span className="text-red-600 font-black">❯</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">{category.name} বিভাগের প্রকাশিত সর্বশেষ সংবাদগুলো ডাটাবেজ থেকে সরাসরি দেখানো হচ্ছে।</p>
        </aside>
      </div>
    </main>
  );
}
