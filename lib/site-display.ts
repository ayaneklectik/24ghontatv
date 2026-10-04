import type { CSSProperties } from 'react';
import type { HeaderAppearanceSettings } from '@/types/public';
import { resolveMediaUrl } from '@/lib/urls';

export const HEADER_PRESETS = [
  { value: 'classic', label: 'Classic white' },
  { value: 'eid', label: 'Eid green & gold' },
  { value: 'festive', label: 'Festive warm' },
  { value: 'midnight', label: 'Midnight blue' },
] as const;

export function resolveHeaderBackgroundUrl(value?: string | null): string | null {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;
  if (/^\/?storage\//i.test(raw)) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.LARAVEL_BASE_URL ||
      'https://24ghontatv.com';
    return new URL(raw.startsWith('/') ? raw : `/${raw}`, baseUrl).toString();
  }

  return resolveMediaUrl(raw, '') || null;
}

const presetBackgrounds: Record<string, string> = {
  eid: 'linear-gradient(115deg, #e8f5e9 0%, #fffde7 52%, #e0f2f1 100%)',
  festive: 'linear-gradient(115deg, #fff1e6 0%, #fff8e7 50%, #fce4ec 100%)',
  midnight: 'linear-gradient(115deg, #172554 0%, #312e81 55%, #581c87 100%)',
};

export function getHeaderBackgroundStyle(
  appearance: HeaderAppearanceSettings,
  imageOverride?: string | null,
): CSSProperties {
  const image = imageOverride ?? appearance.backgroundImageUrl;
  const presetBackground = presetBackgrounds[appearance.preset];
  const imageBackground = image
    ? `url(${JSON.stringify(image)})`
    : '';

  return {
    backgroundColor: appearance.backgroundColor,
    ...(presetBackground || imageBackground
      ? {
          backgroundImage: imageBackground
            ? `${presetBackground ?? 'linear-gradient(0deg, rgba(255,255,255,.16), rgba(255,255,255,.16))'}, ${imageBackground}`
            : presetBackground,
        }
      : {}),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}
