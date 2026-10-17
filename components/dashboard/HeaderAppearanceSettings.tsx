'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, ImageUp, Save } from 'lucide-react';
import {
  fetchAdminDisplaySettings,
  updateAdminDisplaySettings,
  uploadHeaderBackground,
  uploadHeaderLogo,
  type AdminDisplaySettings,
} from '@/lib/admin-api';
import { DEFAULT_BREAKING_TICKER, DEFAULT_HEADER_APPEARANCE } from '@/lib/public-data';
import { getHeaderBackgroundStyle, HEADER_PRESETS } from '@/lib/site-display';

const defaultSettings: AdminDisplaySettings = {
  breakingTicker: DEFAULT_BREAKING_TICKER,
  headerAppearance: DEFAULT_HEADER_APPEARANCE,
  liveButton: { enabled: false, label: 'LIVE', url: '' },
  showBengaliDate: true,
};

export default function HeaderAppearanceSettings({ showBengaliDate = true }: { showBengaliDate?: boolean }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const logoFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetchAdminDisplaySettings()
      .then((result) => {
        if (active) {
          setSettings(result);
          setLoaded(true);
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Header appearance settings could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSettings((current) => ({ ...current, showBengaliDate }));
  }, [showBengaliDate]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  useEffect(() => {
    if (!selectedLogo) {
      setPreviewLogo(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedLogo);
    setPreviewLogo(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedLogo]);

  const updateLiveButton = (key: keyof AdminDisplaySettings['liveButton'], value: boolean | string) => {
    setSettings((current) => ({ ...current, liveButton: { ...current.liveButton, [key]: value } }));
    setStatus('');
  };

  const updateAppearance = <K extends keyof AdminDisplaySettings['headerAppearance']>(
    key: K,
    value: AdminDisplaySettings['headerAppearance'][K],
  ) => {
    setSettings((current) => ({
      ...current,
      headerAppearance: { ...current.headerAppearance, [key]: value },
    }));
    setStatus('');
  };

  const chooseImage = (file?: File) => {
    setError('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('The header background image must be 5 MB or smaller.');
      return;
    }
    setSelectedImage(file);
    updateAppearance('preset', 'custom');
  };

  const chooseLogo = (file?: File) => {
    setError('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP logo image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('The header logo must be 2 MB or smaller.');
      return;
    }
    setSelectedLogo(file);
    updateAppearance('preset', 'custom');
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setStatus('');

    try {
      let headerAppearance = settings.headerAppearance;
      if (selectedImage) {
        const backgroundImageUrl = await uploadHeaderBackground(selectedImage);
        headerAppearance = { ...headerAppearance, backgroundImageUrl };
      }
      if (selectedLogo) {
        const logoImageUrl = await uploadHeaderLogo(selectedLogo);
        headerAppearance = { ...headerAppearance, logoImageUrl };
      }
      const liveUrl = settings.liveButton.url.trim();
      if (settings.liveButton.enabled && !liveUrl) {
        throw new Error('Turn the LIVE button off or enter a valid video URL.');
      }
      if (liveUrl) {
        let parsedUrl: URL;
        try { parsedUrl = new URL(liveUrl); } catch { throw new Error('Enter a complete video URL starting with https://'); }
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('The LIVE URL must start with http:// or https://');
      }
      const updatedSettings = { ...settings, headerAppearance, liveButton: { ...settings.liveButton, label: settings.liveButton.label.trim() || 'LIVE', url: liveUrl }, showBengaliDate };
      await updateAdminDisplaySettings(updatedSettings);
      setSettings(updatedSettings);
      setSelectedImage(null);
      setSelectedLogo(null);
      setStatus('Header appearance saved and published.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Header appearance could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const appearance = settings.headerAppearance;
  const previewStyle = getHeaderBackgroundStyle(appearance, previewImage);
  const previewDateClass = appearance.preset === 'midnight' ? 'text-white' : 'text-gray-700';
  const previewSecondaryDateClass = appearance.preset === 'midnight' ? 'text-white/80' : 'text-gray-500';

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <ImageUp className="h-4 w-4 text-red-600" /> Logo, Date & Social Header Design
          </h2>
          <p className="mt-1 text-xs text-gray-500">Customize the header background, date colors, and logo independently from social links.</p>
        </div>
        {loading && <span role="status" className="text-xs text-gray-500">Loading…</span>}
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {status && <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{status}</p>}

      <div className="mb-5 rounded-xl border border-red-200 bg-red-50/50 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Navbar LIVE Button</h3>
            <p className="mt-1 text-xs text-gray-600">Show a red LIVE link in the public navigation and choose where it opens.</p>
          </div>
          <button type="button" role="switch" aria-checked={settings.liveButton.enabled}
            onClick={() => updateLiveButton('enabled', !settings.liveButton.enabled)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${settings.liveButton.enabled ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {settings.liveButton.enabled ? 'LIVE BUTTON ON' : 'LIVE BUTTON OFF'}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-gray-700">Button label
            <input type="text" maxLength={80} value={settings.liveButton.label}
              onChange={(event) => updateLiveButton('label', event.target.value)}
              placeholder="LIVE or BAN vs AUS / LIVE"
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-semibold text-gray-700">Live video URL
            <input type="url" value={settings.liveButton.url}
              onChange={(event) => updateLiveButton('url', event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white">
            <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-white" />
            {settings.liveButton.label.trim() || 'LIVE'}
          </span>
          <span className="text-xs text-gray-500">Preview · opens the URL in a new tab</span>
        </div>
      </div>

      <form id="header-appearance-form" onSubmit={save} className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Predefined design
            <select
              value={appearance.preset}
              onChange={(event) => updateAppearance('preset', event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {HEADER_PRESETS.map((preset) => <option key={preset.value} value={preset.value}>{preset.label}</option>)}
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-700">
            Background color
            <input
              type="color"
              value={appearance.backgroundColor}
              onChange={(event) => updateAppearance('backgroundColor', event.target.value)}
              aria-label="Header background color"
              className="h-10 w-16 cursor-pointer rounded border border-gray-300 bg-white p-1"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-700">
              Date text color
              <input
                type="color"
                value={appearance.textColor}
                onChange={(event) => updateAppearance('textColor', event.target.value)}
                aria-label="Header date text color"
                className="h-10 w-16 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-700">
              Secondary date color
              <input
                type="color"
                value={appearance.secondaryTextColor}
                onChange={(event) => updateAppearance('secondaryTextColor', event.target.value)}
                aria-label="Header secondary date text color"
                className="h-10 w-16 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">Custom background image</p>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                chooseImage(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <ImageUp className="h-4 w-4" /> Upload image
              </button>
              {(previewImage || appearance.backgroundImageUrl) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    updateAppearance('backgroundImageUrl', null);
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove image
                </button>
              )}
              <span className="text-xs text-gray-500">JPG, PNG or WebP · up to 5 MB</span>
            </div>
            {appearance.backgroundImageUrl && !previewImage && (
              <p className="mt-2 truncate text-xs text-gray-500">Current image: {appearance.backgroundImageUrl}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">Header logo</p>
            <input
              ref={logoFileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                chooseLogo(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => logoFileInput.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <ImageUp className="h-4 w-4" /> Upload logo
              </button>
              {(selectedLogo || appearance.logoImageUrl) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLogo(null);
                    updateAppearance('logoImageUrl', null);
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Use site default
                </button>
              )}
              <span className="text-xs text-gray-500">PNG, JPG or WebP · up to 2 MB</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Transparent PNG or WebP is recommended. Choose a logo image no larger than 2000 × 1000 pixels.</p>
            {appearance.logoImageUrl && !previewLogo && (
              <p className="mt-2 truncate text-xs text-gray-500">Custom logo is currently active.</p>
            )}
          </div>

          <label className="block text-sm font-semibold text-gray-700">
            Background image blur <span className="font-normal text-gray-500">({appearance.backgroundBlur}px)</span>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={appearance.backgroundBlur}
              onChange={(event) => updateAppearance('backgroundBlur', Number(event.target.value))}
              aria-label="Header background image blur"
              className="mt-3 block w-full accent-red-600"
            />
            <span className="mt-1 flex justify-between text-xs font-normal text-gray-400"><span>Sharp</span><span>More blur</span></span>
          </label>

          <button type="submit" disabled={loading || !loaded || saving} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save and publish'}
          </button>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800"><Eye className="h-4 w-4" /> Live preview</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="relative isolate min-h-28 overflow-hidden" style={{ backgroundColor: appearance.backgroundColor }}>
              <div aria-hidden="true" className="absolute inset-0 scale-110" style={{ ...previewStyle, filter: `blur(${appearance.backgroundBlur}px)` }} />
              <div className="relative z-10 grid min-h-28 grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4">
                <div className={`text-xs font-bold ${previewDateClass}`} style={{ color: appearance.textColor }}>শনিবার, ৩ অক্টোবর ২০২৬<br /><span className={`font-normal ${previewSecondaryDateClass}`} style={{ color: appearance.secondaryTextColor }}>১৮ আশ্বিন ১৪৩৩</span></div>
                <img src={previewLogo ?? appearance.logoImageUrl ?? '/logo.png'} alt="Site logo preview" className="h-12 w-36 object-contain" />
                <div className="flex justify-end gap-1.5" aria-label="Social media preview">
                  {['f', '▶', '𝕏', '◎'].map((icon) => <span key={icon} className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white">{icon}</span>)}
                </div>
              </div>
            </div>
            <div className="h-1 border-t border-red-600 bg-white" />
          </div>
          <p className="mt-2 text-xs text-gray-500">Preview the selected logo and background together before publishing.</p>
        </div>
      </form>
    </section>
  );
}
