import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapCategory, mapNewsItem } from '@/lib/public-data';
import type { CategoryItem, NewsItem } from '@/types/public';
import MediaImage from '@/components/public/MediaImage';

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
    <article className="border-b border-neutral-200 pb-5">
      <Link href={`/news/${item.id}`} className="group grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="aspect-[16/10] overflow-hidden border border-neutral-200 bg-neutral-100 sm:col-span-2">
          {item.imageUrl ? <MediaImage src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" /> : <div className="w-full h-full bg-neutral-200" />}
        </div>
        <div className="sm:col-span-3 sm:py-1">
          {item.category && <p className="mb-1 text-xs font-bold text-red-600">{item.category}</p>}
          <h2 className="text-lg font-black leading-snug text-neutral-900 transition-colors group-hover:text-red-600 md:text-xl">{item.title}</h2>
          {item.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500 md:text-[15px]">{item.excerpt}</p>}
          <div className="mt-3 text-xs text-neutral-400">{item.author || 'বার্তা কক্ষ'} {item.publishedAt ? `• ${item.publishedAt}` : ''}</div>
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
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-7 px-4 py-7 sm:px-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="mb-5 flex items-center gap-2.5 border-b-2 border-red-200 pb-3">
            <h1 className="text-[27px] font-black leading-none md:text-[30px]">{category.name}</h1>
            <span className="-translate-y-0.5 text-[17px] font-black text-red-600">❯</span>
          </div>
          {data.sub_categories?.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
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
          <div className="mb-4 flex items-center gap-2 border-b-2 border-red-200 pb-3">
            <h2 className="text-xl font-black">এই বিভাগের সারসংক্ষেপ</h2>
            <span className="text-red-600 font-black">❯</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">{category.name} বিভাগের প্রকাশিত সর্বশেষ সংবাদগুলো ডাটাবেজ থেকে সরাসরি দেখানো হচ্ছে।</p>
        </aside>
      </div>
    </main>
  );
}
