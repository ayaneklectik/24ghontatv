import { fetchLaravelPublic } from '@/lib/public-api';
import { mapHome, mapNewsItem } from '@/lib/public-data';
import DynamicHome from '@/components/DynamicHome';
import type { NewsItem, PublicHomeData } from '@/types/public';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fillLeadSummaries(home: PublicHomeData): Promise<void> {
  const specialPosts = home.special_section?.posts ?? [];
  const specialRoles = home.special_section?.postRoles ?? {};
  const candidates = [
    home.latest_news.find((item) => item.isLead) || home.top_five[0] || home.latest_news[0],
    home.latest_news[0] || home.top_five[0],
    home.popular_news[0] || home.top_five[0],
    ...home.sections.map((section) => section.news[0]),
    specialPosts.find((item) => specialRoles[item.id] === 'main_lead') || specialPosts[0],
  ].filter((item): item is NewsItem => Boolean(item?.id));
  const uniqueCandidates = [...new Map(candidates.map((item) => [item.id, item])).values()]
    .filter((item) => !item.excerpt?.trim() && !item.content?.trim());

  const details = await Promise.all(uniqueCandidates.map(async (item) => {
    try {
      const payload = await fetchLaravelPublic<any>(`news/${encodeURIComponent(item.id)}`);
      const article = payload?.data?.news ?? payload?.news ?? payload?.data ?? payload;
      const detail = mapNewsItem(article);
      return [item.id, { excerpt: detail.excerpt, content: detail.content }] as const;
    } catch {
      return null;
    }
  }));
  const summaries = new Map(details.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)));
  const applySummaries = (items: NewsItem[]) => items.map((item) => {
    const summary = summaries.get(item.id);
    return summary ? { ...item, ...summary } : item;
  });

  home.latest_news = applySummaries(home.latest_news);
  home.popular_news = applySummaries(home.popular_news);
  home.top_five = applySummaries(home.top_five);
  home.sections = home.sections.map((section) => ({
    ...section,
    news: applySummaries(section.news),
  }));

  if (home.special_section?.posts) {
    home.special_section.posts = applySummaries(home.special_section.posts);
  }
}

export default async function HomePage() {
  try {
    const home = mapHome(await fetchLaravelPublic<any>('home'));
    await fillLeadSummaries(home);
    return <DynamicHome home={home} />;
  } catch (error) {
    console.error('Home API error:', error);
    return <main className="py-20 text-center font-kalpurush text-neutral-500">ডাটাবেস/API সংযোগ পাওয়া যাচ্ছে না। Laravel API চালু আছে কি না যাচাই করুন।</main>;
  }
}
