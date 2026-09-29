import type {
  CategoryItem,
  NewsItem,
  PublicHomeData,
  PublicSiteData,
} from '@/types/public';
import {
  resolveExternalUrl,
  resolveMediaUrl,
  resolveVideoUrl,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from '@/lib/urls';

export const PLACEHOLDER_IMAGE = '/images/placeholder-news.svg';

export function absoluteUrl(url?: string | null): string {
  return resolveMediaUrl(url, PLACEHOLDER_IMAGE);
}

export function mapNewsItem(item: any): NewsItem {
  const image = item?.image_url ?? item?.imageUrl ?? item?.image ?? item?.featuredImg;
  const imagePath = image && !String(image).includes('/')
    ? `images/news_img/${image}`
    : image;

  return {
    id: String(item?.id ?? item?.news_id ?? ''),
    title: item?.title ?? item?.news_title ?? '',
    slug: String(item?.slug ?? item?.title_link ?? item?.id ?? ''),
    excerpt: item?.excerpt ?? item?.news_sub_title ?? '',
    content: item?.content ?? item?.dis ?? '',
    imageUrl: absoluteUrl(imagePath),
    publishedAt: item?.publishedAt ?? [item?.published_date, item?.published_time].filter(Boolean).join(' '),
    author: item?.author ?? item?.userModel?.name ?? item?.user_model?.name ?? item?.user?.name ?? undefined,
    location: item?.location ?? item?.representative_loc ?? undefined,
    category: item?.category?.name ?? item?.category?.cat_name ?? item?.categoryName ?? undefined,
    categoryId: item?.categoryId ? String(item.categoryId) : item?.cat ? String(item.cat) : item?.category?.id ? String(item.category.id) : undefined,
    categorySlug: item?.categorySlug ?? item?.category?.slug ?? item?.category?.cat_slug ?? item?.category?.cat_name ?? undefined,
    views: Number(item?.views ?? item?.hit ?? 0),
    isBreaking: Boolean(item?.isBreaking ?? item?.isbreaking),
    isLead: Boolean(item?.isLead ?? item?.islead),
    isPopular: Boolean(item?.isPopular),
    tags: Array.isArray(item?.tags)
      ? item.tags.map((tag: unknown) => String(tag)).filter(Boolean)
      : typeof item?.meta_keyword === 'string'
        ? item.meta_keyword.split(',').map((x: string) => x.trim()).filter(Boolean)
        : [],
  };
}

export function mapCategory(item: any): CategoryItem {
  return {
    id: String(item?.id ?? ''),
    name: item?.name ?? item?.cat_name ?? '',
    slug: item?.slug ?? item?.cat_slug ?? item?.cat_name ?? String(item?.id ?? ''),
    order: Number(item?.order ?? item?.cat_order ?? 0),
  };
}

function mapSite(data: any): PublicSiteData {
  const site = data?.site ?? data ?? {};
  const app = site?.app ?? {};
  const social = site?.social_media ?? site?.media ?? {};
  const footer = site?.footer ?? {};
  const live = site?.live_video ?? site?.video_link ?? null;

  return {
    app: {
      ...app,
      logo_url: app?.logo_url
        ? absoluteUrl(app.logo_url)
        : app?.logo_img
          ? absoluteUrl(`images/logos/${app.logo_img}`)
          : null,
    },
    social_media: social,
    footer,
    live_video: live
      ? {
          ...live,
          live_video_link: resolveVideoUrl(live?.live_video_link),
        }
      : null,
  };
}

export function mapHome(payload: any): PublicHomeData {
  const data = payload?.data ?? payload ?? {};

  return {
    site: mapSite(data),
    categories: Array.isArray(data?.categories) ? data.categories.map(mapCategory) : [],
    latest_news: Array.isArray(data?.latest_news) ? data.latest_news.map(mapNewsItem) : [],
    popular_news: Array.isArray(data?.popular_news) ? data.popular_news.map(mapNewsItem) : [],
    breaking_news: Array.isArray(data?.breaking_news) ? data.breaking_news.map(mapNewsItem) : [],
    just_now: Array.isArray(data?.just_now)
      ? data.just_now.map((x: any) => ({
          id: String(x?.id ?? ''),
          title: x?.title ?? x?.news_title ?? '',
          url: resolveExternalUrl(x?.url ?? x?.news_url) ?? (x?.id ? `/news/${x.id}` : '/'),
          publishedAt: x?.publishedAt ?? x?.published_date,
        }))
      : [],
    top_five: Array.isArray(data?.top_five) ? data.top_five.map(mapNewsItem) : [],
    videos: Array.isArray(data?.videos)
      ? data.videos.map((x: any) => {
          const link = resolveVideoUrl(x?.video_url ?? x?.video_link ?? x?.link);
          return {
            id: String(x?.id ?? ''),
            title: x?.title ?? x?.video_title ?? '',
            details: x?.details ?? x?.video_details ?? '',
            link: link ?? '/video/archive',
            thumbnailUrl: resolveMediaUrl(x?.thumbnail_url ?? x?.thumbnailUrl, youtubeThumbnailUrl(link) ?? PLACEHOLDER_IMAGE),
            embedUrl: youtubeEmbedUrl(link),
            publishedAt: x?.publishedAt ?? x?.pub_date,
          };
        })
      : [],
    special_section: data?.special_section ? {
      isSectionActive: Boolean(data.special_section.isSectionActive),
      sectionTitle: data.special_section.sectionTitle ?? '',
      layoutStyle: data.special_section.layoutStyle ?? 'classic_split',
      showBanner: Boolean(data.special_section.showBanner),
      bannerImage: absoluteUrl(data.special_section.bannerImage),
      bannerTargetLink: resolveExternalUrl(data.special_section.bannerTargetLink) ?? '',
      showScoreWidget: Boolean(data.special_section.showScoreWidget),
      postRoles: data.special_section.postRoles ?? {},
      posts: Array.isArray(data.special_section.posts) ? data.special_section.posts.map(mapNewsItem) : [],
    } : undefined,
    ads: data?.ads ? {
      home: Array.isArray(data.ads.home)
        ? data.ads.home.map((x: any) => ({
            ...x,
            image_url: x?.image_url ? absoluteUrl(x.image_url) : null,
            company_link: resolveExternalUrl(x?.company_link),
          }))
        : [],
      managed: Array.isArray(data.ads.managed)
        ? data.ads.managed.map((x: any) => ({
            ...x,
            image_url: x?.image_url ? absoluteUrl(x.image_url) : null,
            company_link: resolveExternalUrl(x?.company_link),
          }))
        : [],
    } : undefined,
    photos: Array.isArray(data?.photos)
      ? data.photos.map((x: any) => ({
          id: String(x?.id ?? ''),
          title: x?.title ?? x?.photo_details ?? '',
          imageUrl: absoluteUrl(x?.imageUrl ?? x?.image_url ?? x?.photo),
          thumbnailUrl: absoluteUrl(x?.thumbnailUrl ?? x?.thumbnail_url ?? x?.photo),
          publishedAt: x?.publishedAt ?? x?.cdate,
        }))
      : [],
    sections: Array.isArray(data?.sections)
      ? data.sections
          .map((section: any) => ({
            category: mapCategory(section?.category),
            news: Array.isArray(section?.news) ? section.news.map(mapNewsItem) : [],
          }))
          .filter((section: any) => section.category.name && section.news.length > 0)
      : [],
  };
}

export function findSection(home: PublicHomeData, ...names: string[]): NewsItem[] {
  const lower = names.map((x) => x.toLowerCase());
  const match = home.sections.find((section) => {
    const name = section.category.name.toLowerCase();
    const slug = section.category.slug.toLowerCase();
    return lower.includes(name) || lower.includes(slug);
  });
  return match?.news ?? [];
}

export function formatTime(value?: string | null): string {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('bn-BD', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
}
