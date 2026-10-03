const DEFAULT_MEDIA_FALLBACK = '/images/placeholder-news.svg';
const DEFAULT_MEDIA_BASE_URL = 'https://24ghontatv.com';
const LEGACY_MEDIA_HOST = '24ghontatv.com';
const LEGACY_MEDIA_BASE_URL = 'https://24ghontatv.com/public';
const API_MEDIA_BASE_URL = 'https://api.24ghontatv.com';
const API_MEDIA_PATH = /^images\/(?:media|news_img|user_image)\//i;

function legacyPublicMediaUrl(path: string, suffix = ''): string {
  return `${LEGACY_MEDIA_BASE_URL}${path.startsWith('/') ? path : `/${path}`}${suffix}`;
}

function apiMediaUrl(path: string, suffix = ''): string {
  return `${API_MEDIA_BASE_URL}${path.startsWith('/') ? path : `/${path}`}${suffix}`;
}

export function alternateMediaUrl(value: string): string | null {
  try {
    const url = new URL(value, 'https://24ghontatv.com');
    const path = url.pathname.replace(/^\/public(?=\/images\/)/i, '');
    if (!path.startsWith('/images/')) return null;

    if (url.hostname === 'api.24ghontatv.com' || url.hostname === 'dev.24ghontatv.com') {
      return legacyPublicMediaUrl(path, url.search + url.hash);
    }
    if (url.hostname === LEGACY_MEDIA_HOST || url.hostname === 'www.24ghontatv.com') {
      return apiMediaUrl(path, url.search + url.hash);
    }
  } catch {
    return null;
  }

  return null;
}

export function resolveShareImageUrl(value?: string | null): string | null {
  if (!value || value.includes('/images/placeholder-news.svg')) return null;
  const resolved = resolveMediaUrl(value, '');
  if (!resolved) return null;
  return resolved;
}

export function retryAlternateMediaHost(
  image: HTMLImageElement,
  fallback = DEFAULT_MEDIA_FALLBACK,
): void {
  if (image.dataset.alternateMediaTried !== 'true') {
    const alternate = alternateMediaUrl(image.currentSrc || image.src);
    if (alternate) {
      image.dataset.alternateMediaTried = 'true';
      image.src = alternate;
      return;
    }
  }

  if (image.dataset.mediaFallbackTried !== 'true' && image.src !== fallback) {
    image.dataset.mediaFallbackTried = 'true';
    image.src = fallback;
  }
}

function cleanPath(value: string): string {
  return value
    .trim()
    .replace(/^\/+/, '')
    .replace(/^public\//i, '');
}

function mediaBaseUrl(): string {
  const configuredBase =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
    process.env.LARAVEL_BASE_URL;
  let base = configuredBase || DEFAULT_MEDIA_BASE_URL;

  if (configuredBase) {
    try {
      const hostname = new URL(configuredBase).hostname;
      if (hostname === 'api.24ghontatv.com' || hostname === 'dev.24ghontatv.com') {
        base = DEFAULT_MEDIA_BASE_URL;
      }
    } catch {
      base = DEFAULT_MEDIA_BASE_URL;
    }
  }

  if (process.env.NODE_ENV === 'production' && configuredBase) {
    try {
      const hostname = new URL(configuredBase).hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        base = DEFAULT_MEDIA_BASE_URL;
      }
    } catch {
      base = DEFAULT_MEDIA_BASE_URL;
    }
  }

  return `${base.replace(/\/+$/, '')}/public`;
}

export function resolveMediaUrl(
  value?: string | null,
  fallback = DEFAULT_MEDIA_FALLBACK,
): string {
  if (!value) return fallback;
  const raw = String(value).trim();

  if (/^(https?:|\/\/)/i.test(raw)) {
    try {
      const parsed = new URL(raw.startsWith('//') ? `https:${raw}` : raw);
      const rewriteHosts = new Set([
        'api.24ghontatv.com',
        'dev.24ghontatv.com',
        '24ghontatv.com',
        'www.24ghontatv.com',
      ]);
      if (rewriteHosts.has(parsed.hostname)) {
        const path = cleanPath(parsed.pathname);
        if (API_MEDIA_PATH.test(path)) {
          return apiMediaUrl(path, parsed.search + parsed.hash);
        }
        const base = mediaBaseUrl();
        return base ? `${base}/${path}` : `/${path}`;
      }
    } catch {
      return raw;
    }

    return raw.startsWith('//') ? `https:${raw}` : raw;
  }

  if (/^(data:|blob:)/i.test(raw)) return raw;

  const path = cleanPath(raw);
  if (API_MEDIA_PATH.test(path)) {
    return apiMediaUrl(path);
  }
  const base = mediaBaseUrl();

  return base ? `${base}/${path}` : `/${path}`;
}

export function resolveArticleContentImages(content?: string | null): string {
  const trustedHosts = new Set([
    'api.24ghontatv.com',
    LEGACY_MEDIA_HOST,
    'www.24ghontatv.com',
    'dev.24ghontatv.com',
  ]);

  return String(content ?? '').replace(
    /(<img\b[^>]*?\bsrc\s*=\s*)(["'])(.*?)\2/gi,
    (attribute, prefix: string, quote: string, source: string) => {
      try {
        const url = new URL(source, `https://${LEGACY_MEDIA_HOST}`);
        const path = url.pathname.replace(/^\/public(?=\/images\/media\/)/i, '');
        if (!trustedHosts.has(url.hostname) || !path.toLowerCase().startsWith('/images/media/')) {
          return attribute;
        }

        return `${prefix}${quote}${apiMediaUrl(path, url.search + url.hash)}${quote}`;
      } catch {
        return attribute;
      }
    },
  );
}

export function resolveExternalUrl(value?: string | null): string | null {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw || raw === '#') return null;
  if (/^(https?:|mailto:|tel:|data:|blob:)/i.test(raw)) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('/')) return raw;
  return `https://${raw}`;
}

export function extractYouTubeId(value?: string | null): string | null {
  if (!value) return null;
  const raw = String(value).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith('www.') ? `https://${raw}` : raw);
    if (url.hostname === 'youtu.be') {
      return url.pathname.replace(/^\//, '').slice(0, 11) || null;
    }
    if (url.hostname.endsWith('youtube.com')) {
      if (url.searchParams.get('v')) return url.searchParams.get('v');
      const parts = url.pathname.split('/').filter(Boolean);
      const marker = parts.findIndex((part) => ['embed', 'shorts', 'live', 'v'].includes(part));
      if (marker >= 0 && parts[marker + 1]) return parts[marker + 1].slice(0, 11);
    }
  } catch {
    return null;
  }

  return null;
}

export function resolveVideoUrl(value?: string | null): string | null {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const youtubeId = extractYouTubeId(raw);
  if (youtubeId && /^[A-Za-z0-9_-]{11}$/.test(youtubeId)) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  return resolveExternalUrl(raw);
}

export function youtubeEmbedUrl(value?: string | null): string | null {
  const id = extractYouTubeId(value);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

export function youtubeThumbnailUrl(value?: string | null): string | null {
  const id = extractYouTubeId(value);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
