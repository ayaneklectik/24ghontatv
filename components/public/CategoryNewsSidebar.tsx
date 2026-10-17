import Link from 'next/link';
import { fetchLaravelHome } from '@/lib/public-api';
import { mapHome } from '@/lib/public-data';
import type { NewsItem } from '@/types/public';
import MediaImage from '@/components/public/MediaImage';

function StoryList({ title, items }: { title: string; items: NewsItem[] }) {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫'];
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 border-b-2 border-neutral-200 pb-3 mb-4">
        <h2 className="text-xl md:text-2xl font-black text-neutral-900">{title}</h2>
        <span className="font-black text-red-600" aria-hidden="true">❯</span>
      </div>
      {items.length ? (
        <ol className="space-y-4">
          {items.slice(0, 5).map((item, index) => (
            <li key={item.id} className="border-b border-neutral-100 pb-4 last:border-0">
              <Link href={`/news/${item.id}`} className="group grid grid-cols-[96px_minmax(0,1fr)] gap-3 items-start">
                <div className="relative aspect-[4/3] overflow-hidden rounded bg-neutral-100">
                  <MediaImage src={item.imageUrl} alt={item.title} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform" />
                </div>
                <div className="flex gap-2">
                  <span className="text-lg font-black text-red-600 leading-tight">{bengaliDigits[index + 1]}.</span>
                  <h3 className="text-sm md:text-base font-bold leading-snug text-neutral-800 group-hover:text-red-600 transition-colors">{item.title}</h3>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-neutral-500">এই মুহূর্তে কোনো সংবাদ পাওয়া যায়নি।</p>
      )}
    </section>
  );
}

export default async function CategoryNewsSidebar() {
  try {
    const home = mapHome(await fetchLaravelHome());
    return (
      <aside className="lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-6" aria-label="সর্বশেষ ও সর্বাধিক পঠিত সংবাদ">
        <StoryList title="সর্বশেষ সংবাদ" items={home.latest_news} />
        <StoryList title="সর্বাধিক পঠিত" items={home.popular_news} />
      </aside>
    );
  } catch (error) {
    console.error('Category news sidebar API error:', error);
    return (
      <aside className="lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-6" aria-label="সর্বশেষ ও সর্বাধিক পঠিত সংবাদ">
        <StoryList title="সর্বশেষ সংবাদ" items={[]} />
        <StoryList title="সর্বাধিক পঠিত" items={[]} />
      </aside>
    );
  }
}
