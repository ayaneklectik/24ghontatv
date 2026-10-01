import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchLaravelPublic } from '@/lib/public-api';
import { mapHome } from '@/lib/public-data';
import type { PublicHomeData } from '@/types/public';
import { PublicSocialProvider } from '@/components/public/ArticleSocialActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let home: PublicHomeData = {
    site: {}, categories: [], latest_news: [], popular_news: [], breaking_news: [], just_now: [], top_five: [], videos: [], photos: [], sections: [],
  };

  try {
    home = mapHome(await fetchLaravelPublic<any>('home'));
  } catch (error) {
    console.error('Public layout API error:', error);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-800 flex flex-col">
      <Header site={home.site} categories={home.categories} breakingNews={home.breaking_news} justNow={home.just_now} />
      <PublicSocialProvider social={home.site.social_media ?? {}}>
        <main className="w-full flex-grow clear-both block">{children}</main>
      </PublicSocialProvider>
      <Footer site={home.site} />
    </div>
  );
}
