import type {
  CategoryItem,
  NewsItem,
  PublicHomeData,
  PublicSiteData,
  BreakingTickerSettings,
  HeaderAppearanceSettings,
} from '@/types/public';
import {
  resolveExternalUrl,
  resolveArticleContentImages,
  resolveMediaUrl,
  resolveVideoUrl,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from '@/lib/urls';
import { resolveHeaderBackgroundUrl } from '@/lib/site-display';

export const PLACEHOLDER_IMAGE = '/images/placeholder-news.svg';

export const DEFAULT_BREAKING_TICKER: BreakingTickerSettings = {
  enabled: false,
  text: '',
  bold: true,
  textColor: '#ffffff',
  backgroundColor: '#dc2626',
  speedSeconds: 25,
};

export const DEFAULT_HEADER_APPEARANCE: HeaderAppearanceSettings = {
  preset: 'classic',
  backgroundColor: '#ffffff',
  backgroundImageUrl: null,
  logoImageUrl: null,
  textColor: '#1f2937',
  secondaryTextColor: '#6b7280',
  backgroundBlur: 0,
};

const htmlEntities: Record<string, string> = {
  amp: '&', apos: "'", quot: '"', nbsp: ' ', lt: '<', gt: '>',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…', copy: '©', reg: '®', trade: '™',
  middot: '·', bull: '•', euro: '€', pound: '£', yen: '¥', deg: '°',
};

export function decodeHtmlEntities(value?: string | null): string {
  let decoded = String(value ?? '');

  for (let pass = 0; pass < 3; pass += 1) {
    const next = decoded.replace(/&(#x[\da-f]+|#\d+|[a-z][a-z\d]+);/gi, (entity, code: string) => {
      if (code[0] === '#') {
        const numeric = code[1]?.toLowerCase() === 'x'
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
        return Number.isFinite(numeric) && numeric > 0 && numeric <= 0x10ffff
          ? String.fromCodePoint(numeric)
          : entity;
      }

      return htmlEntities[code.toLowerCase()] ?? entity;
    });
    if (next === decoded) break;
    decoded = next;
  }

  return decoded;
}

export function absoluteUrl(url?: string | null): string {
  return resolveMediaUrl(url, PLACEHOLDER_IMAGE);
}

export function newsSummary(item: { excerpt?: string | null; content?: string | null }, wordLimit = 20): string {
  const source = item.excerpt?.trim() || item.content?.trim() || '';
  const plainText = decodeHtmlEntities(source).replace(/<[^>]*>/g, ' ');
  const words = plainText.split(/\s+/).filter(Boolean);

  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(' ')}...`
    : words.join(' ');
}

export function mapNewsItem(item: any): NewsItem {
  const image = [item?.image_url, item?.imageUrl, item?.image, item?.featuredImg]
    .find((value) => typeof value === 'string' && value.trim());
  const imagePath = image && !String(image).includes('/')
    ? `images/news_img/${image}`
    : image;

  return {
    id: String(item?.id ?? item?.news_id ?? ''),
    title: decodeHtmlEntities(item?.title ?? item?.news_title ?? ''),
    slug: String(item?.slug ?? item?.title_link ?? item?.id ?? ''),
    excerpt: decodeHtmlEntities(item?.excerpt ?? item?.news_sub_title ?? ''),
    content: resolveArticleContentImages(item?.content ?? item?.dis ?? ''),
    imageUrl: absoluteUrl(imagePath),
    publishedAt: item?.publishedAt ?? [item?.published_date, item?.published_time].filter(Boolean).join(' '),
    author: decodeHtmlEntities(item?.author ?? item?.userModel?.name ?? item?.user_model?.name ?? item?.user?.name ?? '') || undefined,
    location: decodeHtmlEntities(item?.location ?? item?.representative_loc ?? '') || undefined,
    category: decodeHtmlEntities(item?.category?.name ?? item?.category?.cat_name ?? item?.categoryName ?? '') || undefined,
    categoryId: item?.categoryId ? String(item.categoryId) : item?.cat ? String(item.cat) : item?.category?.id ? String(item.category.id) : undefined,
    categorySlug: item?.categorySlug ?? item?.category?.slug ?? item?.category?.cat_slug ?? item?.category?.cat_name ?? undefined,
    views: Number(item?.views ?? item?.hit ?? 0),
    isBreaking: Boolean(item?.isBreaking ?? item?.isbreaking),
    isLead: Boolean(item?.isLead ?? item?.islead),
    isPopular: Boolean(item?.isPopular),
    tags: Array.isArray(item?.tags)
      ? item.tags.map((tag: unknown) => decodeHtmlEntities(String(tag))).filter(Boolean)
      : typeof item?.meta_keyword === 'string'
        ? item.meta_keyword.split(',').map((x: string) => x.trim()).filter(Boolean)
        : [],
  };
}

export function mapCategory(item: any): CategoryItem {
  return {
    id: String(item?.id ?? ''),
    name: decodeHtmlEntities(item?.name ?? item?.cat_name ?? ''),
    slug: item?.slug ?? item?.cat_slug ?? item?.cat_name ?? String(item?.id ?? ''),
    order: Number(item?.order ?? item?.cat_order ?? 0),
  };
}

export function mapDisplaySettings(payload: any): {
  breakingTicker: BreakingTickerSettings;
  headerAppearance: HeaderAppearanceSettings;
} {
  const settings = payload?.data ?? payload ?? {};
  const ticker = settings?.breakingTicker ?? settings?.breaking_ticker ?? {};
  const header = settings?.headerAppearance ?? settings?.header_appearance ?? {};
  const headerPreset = header?.preset === 'default' ? 'classic' : header?.preset;
  const validColor = (value: unknown, fallback: string) =>
    typeof value === 'string' && /^#[\da-f]{6}$/i.test(value) ? value : fallback;
  const speedSeconds = Number(ticker?.speedSeconds ?? ticker?.speed_seconds);
  const backgroundBlur = Number(header?.backgroundBlur ?? header?.background_blur);

  return {
    breakingTicker: {
      enabled: Boolean(ticker?.enabled),
      text: typeof ticker?.text === 'string' ? ticker.text : '',
      bold: ticker?.bold === undefined ? DEFAULT_BREAKING_TICKER.bold : Boolean(ticker.bold),
      textColor: validColor(ticker?.textColor ?? ticker?.text_color, DEFAULT_BREAKING_TICKER.textColor),
      backgroundColor: validColor(ticker?.backgroundColor ?? ticker?.background_color, DEFAULT_BREAKING_TICKER.backgroundColor),
      speedSeconds: Number.isFinite(speedSeconds) ? Math.min(200, Math.max(10, speedSeconds)) : DEFAULT_BREAKING_TICKER.speedSeconds,
    },
    headerAppearance: {
      preset: typeof headerPreset === 'string' ? headerPreset : DEFAULT_HEADER_APPEARANCE.preset,
      backgroundColor: validColor(header?.backgroundColor ?? header?.background_color, DEFAULT_HEADER_APPEARANCE.backgroundColor),
      backgroundImageUrl: resolveHeaderBackgroundUrl(header?.backgroundImageUrl ?? header?.background_image_url),
      logoImageUrl: resolveHeaderBackgroundUrl(header?.logoImageUrl ?? header?.logo_image_url),
      textColor: validColor(header?.textColor ?? header?.text_color, DEFAULT_HEADER_APPEARANCE.textColor),
      secondaryTextColor: validColor(header?.secondaryTextColor ?? header?.secondary_text_color, DEFAULT_HEADER_APPEARANCE.secondaryTextColor),
      backgroundBlur: Number.isFinite(backgroundBlur) ? Math.min(10, Math.max(0, backgroundBlur)) : DEFAULT_HEADER_APPEARANCE.backgroundBlur,
    },
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
          title: decodeHtmlEntities(x?.title ?? x?.news_title ?? ''),
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
            title: decodeHtmlEntities(x?.title ?? x?.video_title ?? ''),
            details: decodeHtmlEntities(x?.details ?? x?.video_details ?? ''),
            link: link ?? '/video/archive',
            thumbnailUrl: resolveMediaUrl(x?.thumbnail_url ?? x?.thumbnailUrl, youtubeThumbnailUrl(link) ?? PLACEHOLDER_IMAGE),
            embedUrl: youtubeEmbedUrl(link),
            publishedAt: x?.publishedAt ?? x?.pub_date,
          };
        })
      : [],
    special_section: data?.special_section ? {
      isSectionActive: Boolean(data.special_section.isSectionActive),
      sectionTitle: decodeHtmlEntities(data.special_section.sectionTitle ?? ''),
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
          title: decodeHtmlEntities(x?.title ?? x?.photo_details ?? ''),
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
