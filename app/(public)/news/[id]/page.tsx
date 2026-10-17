import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MediaImage from '@/components/public/MediaImage';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapNewsItem, newsSummary } from '@/lib/public-data';
import { resolveShareImageUrl } from '@/lib/urls';
import type { NewsItem } from '@/types/public';
import ArticleSocialActions from '@/components/public/ArticleSocialActions';
import { formatBengaliDateTime } from '@/lib/bengali';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://24ghontatv.com';

  try {
    const payload = await fetchLaravelPublic<any>(`news/${encodeURIComponent(id)}`, { revalidateSeconds: 60 });
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatArticleContent(value?: string | null): string {
  const content = String(value ?? '').trim();
  if (!content) return '';

  // Rich-text editor output should be rendered as HTML without preserving the
  // formatting whitespace around block tags a second time.
  if (/<(?:p|br|div|ul|ol|li|h[1-6]|blockquote|table|img|figure|hr)\b/i.test(content)) {
    return content;
  }

  // Some articles may contain plain text rather than HTML. Preserve paragraph
  // breaks and single newlines while escaping the text before injecting it.
  return content
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\r?\n/g, '<br />')}</p>`)
    .join('');
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
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-12">
        <article className="min-w-0 lg:col-span-8">
          <div className="text-sm font-bold text-red-600 mb-3">{article.category || 'সংবাদ'}</div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight text-neutral-900">{article.title}</h1>
          {article.excerpt && <p className="mt-5 text-lg md:text-xl text-neutral-500 leading-relaxed border-l-4 border-red-500 pl-4">{article.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 py-3 border-y border-neutral-200 text-sm text-neutral-500">
            {article.location && <span>{article.location}</span>}
            {article.publishedAt && <span>{formatBengaliDateTime(article.publishedAt)}</span>}
          </div>
          {article.imageUrl && <figure className="mt-6"><MediaImage src={article.imageUrl} alt={article.title} className="w-full rounded-xl object-cover" /><figcaption className="text-sm text-neutral-400 mt-2">{data?.news?.imageTitle || ''}</figcaption></figure>}

          {article.content && (
            <div
              className="prose prose-lg mt-8 max-w-full overflow-x-auto leading-relaxed text-neutral-800 [&_p]:my-4 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_img]:h-auto [&_img]:max-w-full [&_table]:max-w-full"
              dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content) }}
            />
          )}

          {tags.length > 0 && <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-neutral-200">{tags.map((tag) => <span key={tag} className="px-3 py-1.5 rounded-full bg-neutral-100 text-sm font-bold">#{tag}</span>)}</div>}

          <ArticleSocialActions title={article.title} description={article.excerpt || newsSummary(article, 30)} imageUrl={article.imageUrl} />

          <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {previousNews && previousNews.id !== article.id && <Link href={`/news/${previousNews.id}`} className="block min-w-0 rounded-xl border p-4 hover:border-red-300"><span className="text-xs text-neutral-400">পূর্ববর্তী</span><div className="mt-1 line-clamp-2 break-words font-black">{previousNews.title}</div></Link>}
            {nextNews && nextNews.id !== article.id && <Link href={`/news/${nextNews.id}`} className="block min-w-0 rounded-xl border p-4 text-right hover:border-red-300"><span className="text-xs text-neutral-400">পরবর্তী</span><div className="mt-1 line-clamp-2 break-words font-black">{nextNews.title}</div></Link>}
          </div>
        </article>

        <aside className="min-w-0 lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-6">
          <div className="flex items-center gap-3 border-b-2 border-neutral-200 pb-3 mb-5"><h2 className="text-2xl font-black">আরও সংবাদ</h2><span className="text-red-600 font-black">❯</span></div>
          <div className="space-y-5">
            {related.map((item) => <Link key={item.id} href={`/news/${item.id}`} className="group grid min-w-0 grid-cols-3 gap-3 border-b border-neutral-200 pb-4"><div className="aspect-[4/3] min-w-0 overflow-hidden rounded bg-neutral-100">{item.imageUrl && <MediaImage src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />}</div><div className="col-span-2 min-w-0"><h3 className="line-clamp-3 break-words font-bold leading-snug group-hover:text-red-600">{item.title}</h3><p className="mt-2 text-xs text-neutral-400">{item.publishedAt ? (formatBengaliDateTime(item.publishedAt) || item.publishedAt) : ''}</p></div></Link>)}
          </div>
        </aside>
      </div>
    </main>
  );
}
