import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MediaImage from '@/components/public/MediaImage';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapNewsItem, newsSummary } from '@/lib/public-data';
import { resolveShareImageUrl } from '@/lib/urls';
import type { NewsItem } from '@/types/public';
import ArticleSocialActions from '@/components/public/ArticleSocialActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://24ghontatv.com';

  try {
    const payload = await fetchLaravelPublic<any>(`news/${encodeURIComponent(id)}`);
    const news = payload?.data?.news;
    const article = mapNewsItem(news);
    if (!article.id) return {};

    const description = article.excerpt || newsSummary(article, 30);
    const articleUrl = new URL(`/news/${encodeURIComponent(id)}`, siteUrl).toString();
    const shareImageUrl = resolveShareImageUrl(article.imageUrl);
    const imageUrl = shareImageUrl ? new URL(shareImageUrl, siteUrl).toString() : undefined;
    const hasImage = Boolean(imageUrl);
    const images = imageUrl ? [{ url: imageUrl, alt: article.title }] : undefined;

    return {
      title: article.title,
      description,
      alternates: { canonical: articleUrl },
      openGraph: {
        title: article.title,
        description,
        url: articleUrl,
        siteName: '২৪ঘণ্টা',
        type: 'article',
        images,
      },
      twitter: {
        card: hasImage ? 'summary_large_image' : 'summary',
        title: article.title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error('News metadata API error:', error);
    return {};
  }
}

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
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-7 px-4 py-7 sm:px-6 lg:grid-cols-12">
        <article className="min-w-0 lg:col-span-8">
          <div className="mb-2 text-xs font-black text-red-600">{article.category || 'সংবাদ'}</div>
          <h1 className="text-[28px] font-black leading-[1.2] text-neutral-900 sm:text-[34px] lg:text-[40px]">{article.title}</h1>
          {article.excerpt && <p className="mt-4 border-l-2 border-red-600 pl-4 text-base leading-relaxed text-neutral-600 md:text-lg">{article.excerpt}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-neutral-200 py-3 text-xs text-neutral-500 sm:text-sm">
            <span className="font-bold text-neutral-800">{article.author || 'বার্তা কক্ষ'}</span>
            {article.location && <span>{article.location}</span>}
            {article.publishedAt && <span>{article.publishedAt}</span>}
            <span>দেখেছেন {article.views ?? 0} বার</span>
          </div>
          <ArticleSocialActions title={article.title} description={article.excerpt || newsSummary(article, 30)} imageUrl={article.imageUrl} />
          {article.imageUrl && <figure className="mt-5"><MediaImage src={article.imageUrl} alt={article.title} className="max-h-[680px] w-full border border-neutral-200 object-contain" /><figcaption className="mt-2 text-xs text-neutral-400">{data?.news?.imageTitle || ''}</figcaption></figure>}

          {article.content && (
            <div
              className="prose prose-lg mt-7 max-w-full overflow-x-auto whitespace-pre-wrap leading-[1.9] text-neutral-800 [&_a]:text-red-700 [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:font-black [&_h3]:font-bold [&_img]:mx-auto [&_img]:h-auto [&_img]:max-w-full [&_p]:mb-5 [&_table]:max-w-full"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}

          {tags.length > 0 && <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-neutral-200">{tags.map((tag) => <span key={tag} className="px-3 py-1.5 rounded-full bg-neutral-100 text-sm font-bold">#{tag}</span>)}</div>}

          <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            {previousNews && previousNews.id !== article.id && <Link href={`/news/${previousNews.id}`} className="block min-w-0 border border-neutral-200 p-4 transition-colors hover:border-red-300"><span className="text-xs text-neutral-400">পূর্ববর্তী</span><div className="mt-1 line-clamp-2 break-words font-black">{previousNews.title}</div></Link>}
            {nextNews && nextNews.id !== article.id && <Link href={`/news/${nextNews.id}`} className="block min-w-0 border border-neutral-200 p-4 text-right transition-colors hover:border-red-300"><span className="text-xs text-neutral-400">পরবর্তী</span><div className="mt-1 line-clamp-2 break-words font-black">{nextNews.title}</div></Link>}
          </div>
        </article>

        <aside className="min-w-0 lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-6">
          <div className="mb-4 flex items-center gap-2 border-b-2 border-red-200 pb-3"><h2 className="text-xl font-black">আরও সংবাদ</h2><span className="text-red-600 font-black">❯</span></div>
          <div className="space-y-5">
            {related.map((item) => <Link key={item.id} href={`/news/${item.id}`} className="group grid min-w-0 grid-cols-3 gap-3 border-b border-neutral-200 pb-4"><div className="aspect-[4/3] min-w-0 overflow-hidden border border-neutral-200 bg-neutral-100">{item.imageUrl && <MediaImage src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />}</div><div className="col-span-2 min-w-0"><h3 className="line-clamp-3 break-words text-sm font-bold leading-snug group-hover:text-red-600">{item.title}</h3><p className="mt-2 text-xs text-neutral-400">{item.publishedAt || ''}</p></div></Link>)}
          </div>
        </aside>
      </div>
    </main>
  );
}
