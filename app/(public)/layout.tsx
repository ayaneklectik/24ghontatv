import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchLaravelHome, fetchLaravelPublic } from '@/lib/public-api';
import { DEFAULT_BREAKING_TICKER, DEFAULT_HEADER_APPEARANCE, mapDisplaySettings, mapHome } from '@/lib/public-data';
import type { PublicHomeData } from '@/types/public';
import { PublicSocialProvider } from '@/components/public/ArticleSocialActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let home: PublicHomeData = {
    site: {}, categories: [], latest_news: [], popular_news: [], breaking_news: [], just_now: [], top_five: [], videos: [], photos: [], sections: [],
  };
  let displaySettings = {
    breakingTicker: DEFAULT_BREAKING_TICKER,
    headerAppearance: DEFAULT_HEADER_APPEARANCE,
    showBengaliDate: true,
  };

  const [homeResult, displaySettingsResult] = await Promise.allSettled([
    fetchLaravelHome(),
    fetchLaravelPublic<any>('site-display-settings', { timeoutMs: 2_000 }),
  ]);

  if (homeResult.status === 'fulfilled') {
    home = mapHome(homeResult.value);
  } else {
    console.error('Public layout API error:', homeResult.reason);
  }

  if (displaySettingsResult.status === 'fulfilled') {
    displaySettings = mapDisplaySettings(displaySettingsResult.value);
  } else {
    console.error('Public display settings API error:', displaySettingsResult.reason);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-800 flex flex-col">
      <Header
        site={home.site}
        categories={home.categories}
        breakingNews={home.breaking_news}
        justNow={home.just_now}
        breakingTicker={displaySettings.breakingTicker}
        headerAppearance={displaySettings.headerAppearance}
        showBengaliDate={displaySettings.showBengaliDate}
      />
      <PublicSocialProvider social={home.site.social_media ?? {}}>
        <main className="w-full flex-grow clear-both block">{children}</main>
      </PublicSocialProvider>
      <Footer site={home.site} />
    </div>
  );
}
