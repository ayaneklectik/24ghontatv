export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  imageUrl: string;
  publishedAt: string;
  author?: string;
  location?: string;
  category?: string;
  categoryId?: string;
  categorySlug?: string;
  views?: number;
  isBreaking?: boolean;
  isLead?: boolean;
  isPopular?: boolean;
  tags?: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface JustNowItem {
  id: string;
  title: string;
  url: string;
  publishedAt?: string;
}

export interface PublicSiteData {
  app?: {
    app_title?: string;
    contact?: string;
    email?: string;
    address?: string;
    logo_img?: string | null;
    logo_url?: string | null;
  } | null;
  social_media?: {
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    youtube?: string | null;
  } | null;
  footer?: {
    address?: string | null;
    contact?: string | null;
    email?: string | null;
  } | null;
  live_video?: {
    live_video_link?: string | null;
    live_title?: string | null;
    status?: number | boolean | null;
  } | null;
  breaking_ticker?: BreakingTickerSettings;
  header_appearance?: HeaderAppearanceSettings;
}

export interface BreakingTickerSettings {
  enabled: boolean;
  text: string;
  bold: boolean;
  textColor: string;
  backgroundColor: string;
  speedSeconds: number;
}

export interface HeaderAppearanceSettings {
  preset: string;
  backgroundColor: string;
  backgroundImageUrl?: string | null;
  logoImageUrl?: string | null;
  textColor: string;
  secondaryTextColor: string;
  backgroundBlur: number;
}

export interface DisplaySettings {
  breakingTicker: BreakingTickerSettings;
  headerAppearance: HeaderAppearanceSettings;
  showBengaliDate: boolean;
}

export interface PublicHomeData {
  site: PublicSiteData;
  categories: CategoryItem[];
  latest_news: NewsItem[];
  popular_news: NewsItem[];
  breaking_news: NewsItem[];
  lead_news?: NewsItem[];
  just_now: JustNowItem[];
  top_five: NewsItem[];
  videos: Array<{
    id: string;
    title: string;
    details?: string;
    link: string;
    thumbnailUrl?: string;
    embedUrl?: string | null;
    publishedAt?: string;
  }>;
  photos: Array<{
    id: string;
    title: string;
    imageUrl: string;
    thumbnailUrl?: string;
    publishedAt?: string;
  }>;
  special_section?: SpecialSectionConfig;
  ads?: {
    home: Array<{ id: string; position: number; image?: string | null; image_url?: string | null; company_link?: string | null }>;
    managed: Array<{ id: string; position: number; image?: string | null; image_url?: string | null; company_link?: string | null }>;
  };
  sections: Array<{
    category: CategoryItem;
    news: NewsItem[];
  }>;
}

export interface SpecialSectionConfig {
  isSectionActive: boolean;
  sectionTitle: string;
  layoutStyle: string;
  showBanner: boolean;
  bannerImage: string;
  bannerTargetLink: string;
  showScoreWidget: boolean;
  postRoles?: Record<string, 'main_lead' | 'sub_lead' | 'queued'>;
  posts?: NewsItem[];
}
