import Link from 'next/link';
import { notFound } from 'next/navigation';
import MediaImage from '@/components/public/MediaImage';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapNewsItem } from '@/lib/public-data';
import type { NewsItem } from '@/types/public';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps { params: Promise<{ id: string }> }

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  let payload: any;
  try {
    payload = await fetchLaravelPublic<any>(`news/${encodeURIComponent(id)}?track_view=1`);
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('not found')) notFound();
    console.error('News detail API error:', error);
    return <main className="py-20 text-center font-kalpurush text-neutral-500">Laravel API সংযোগ পাওয়া যাচ্ছে না।</main>;
  }

  const data = payload?.data ?? {};
  const article: NewsItem = mapNewsItem(data?.news);
  if (!article?.id) notFound();
  const related: NewsItem[] = Array.isArray(data?.related_news) ? data.related_news.map(mapNewsItem) : [];
  const nextNews = data?.next_news ? mapNewsItem(data.next_news) : null;
  const previousNews = data?.previous_news ? mapNewsItem(data.previous_news) : null;
  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <main className="w-full bg-white font-kalpurush text-neutral-800">
      <div className="max-w-[1440px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-8">
          <div className="text-sm font-bold text-red-600 mb-3">{article.category || 'সংবাদ'}</div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight text-neutral-900">{article.title}</h1>
          {article.excerpt && <p className="mt-5 text-lg md:text-xl text-neutral-500 leading-relaxed border-l-4 border-red-500 pl-4">{article.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 py-3 border-y border-neutral-200 text-sm text-neutral-500">
            <span className="font-bold text-neutral-800">{article.author || 'বার্তা কক্ষ'}</span>
            {article.location && <span>{article.location}</span>}
            {article.publishedAt && <span>{article.publishedAt}</span>}
            <span>দেখেছেন {article.views ?? 0} বার</span>
          </div>
          {article.imageUrl && <figure className="mt-6"><MediaImage src={article.imageUrl} alt={article.title} className="w-full rounded-xl object-cover" /><figcaption className="text-sm text-neutral-400 mt-2">{data?.news?.imageTitle || ''}</figcaption></figure>}

          {article.content && (
            <div className="prose prose-lg max-w-none mt-8 leading-relaxed text-neutral-800" dangerouslySetInnerHTML={{ __html: article.content }} />
          )}

          {tags.length > 0 && <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-neutral-200">{tags.map((tag) => <span key={tag} className="px-3 py-1.5 rounded-full bg-neutral-100 text-sm font-bold">#{tag}</span>)}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {previousNews && previousNews.id !== article.id && <Link href={`/news/${previousNews.id}`} className="border rounded-xl p-4 hover:border-red-300"><span className="text-xs text-neutral-400">পূর্ববর্তী</span><div className="font-black mt-1 line-clamp-2">{previousNews.title}</div></Link>}
            {nextNews && nextNews.id !== article.id && <Link href={`/news/${nextNews.id}`} className="border rounded-xl p-4 hover:border-red-300 text-right"><span className="text-xs text-neutral-400">পরবর্তী</span><div className="font-black mt-1 line-clamp-2">{nextNews.title}</div></Link>}
          </div>
        </article>

        <aside className="lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-6">
          <div className="flex items-center gap-3 border-b-2 border-neutral-200 pb-3 mb-5"><h2 className="text-2xl font-black">আরও সংবাদ</h2><span className="text-red-600 font-black">❯</span></div>
          <div className="space-y-5">
            {related.map((item) => <Link key={item.id} href={`/news/${item.id}`} className="group grid grid-cols-3 gap-3 border-b border-neutral-200 pb-4"><div className="aspect-[4/3] bg-neutral-100 rounded overflow-hidden">{item.imageUrl && <MediaImage src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}</div><div className="col-span-2"><h3 className="font-bold leading-snug group-hover:text-red-600 line-clamp-3">{item.title}</h3><p className="text-xs text-neutral-400 mt-2">{item.publishedAt || ''}</p></div></Link>)}
          </div>
        </aside>
      </div>
    </main>
  );
}
