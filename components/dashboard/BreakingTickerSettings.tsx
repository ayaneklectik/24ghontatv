'use client';

import { useEffect, useState } from 'react';
import { fetchAdminDisplaySettings, updateAdminDisplaySettings, type AdminDisplaySettings } from '@/lib/admin-api';
import { DEFAULT_BREAKING_TICKER, DEFAULT_HEADER_APPEARANCE } from '@/lib/public-data';

const defaults: AdminDisplaySettings = {
  breakingTicker: DEFAULT_BREAKING_TICKER,
  headerAppearance: DEFAULT_HEADER_APPEARANCE,
};

export default function BreakingTickerSettings() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    let active = true;
    fetchAdminDisplaySettings()
      .then((result) => {
        if (!active) return;
        setSettings(result);
        setLoaded(true);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Breaking News settings could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateTicker = <K extends keyof AdminDisplaySettings['breakingTicker']>(
    key: K,
    value: AdminDisplaySettings['breakingTicker'][K],
  ) => {
    setSettings((current) => ({
      ...current,
      breakingTicker: { ...current.breakingTicker, [key]: value },
    }));
    setStatus('');
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loaded) return;

    setSaving(true);
    setError('');
    setStatus('');
    try {
      await updateAdminDisplaySettings(settings);
      setStatus('Breaking News ticker settings saved and published.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Breaking News settings could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const ticker = settings.breakingTicker;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Breaking News</h1>
        <p className="mt-1 text-sm text-gray-500">Edit the ticker text, colors, and scrolling speed. Changes publish across the public site.</p>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {status && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{status}</div>}
      {loading && <p role="status" className="text-sm text-gray-500">Loading saved ticker settings…</p>}

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={save} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-900">Ticker status</h2>
              <p className="mt-1 text-xs text-gray-500">When disabled, the existing article ticker remains unchanged.</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={ticker.enabled}
                onChange={(event) => updateTicker('enabled', event.target.checked)}
                className="h-4 w-4 accent-red-600"
              />
              Enabled
            </label>
          </div>

          <label className="block text-sm font-semibold text-gray-700">
            Breaking News text
            <textarea
              value={ticker.text}
              onChange={(event) => updateTicker('text', event.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Type the breaking news headline or announcement…"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal focus:border-red-500 focus:outline-none"
            />
            <span className="mt-1 block text-right text-xs font-normal text-gray-400">{ticker.text.length}/500</span>
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Text style
            <select
              value={ticker.bold ? 'bold' : 'normal'}
              onChange={(event) => updateTicker('bold', event.target.value === 'bold')}
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="bold">Bold</option>
              <option value="normal">Normal</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm font-semibold text-gray-700">
              Text color
              <input
                type="color"
                value={ticker.textColor}
                onChange={(event) => updateTicker('textColor', event.target.value)}
                aria-label="Ticker text color"
                className="h-9 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm font-semibold text-gray-700">
              Background color
              <input
                type="color"
                value={ticker.backgroundColor}
                onChange={(event) => updateTicker('backgroundColor', event.target.value)}
                aria-label="Ticker background color"
                className="h-9 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-gray-700">
            Scroll speed <span className="font-normal text-gray-500">({ticker.speedSeconds} seconds per loop)</span>
            <input
              type="range"
              min={10}
              max={120}
              step={1}
              value={ticker.speedSeconds}
              onChange={(event) => updateTicker('speedSeconds', Number(event.target.value))}
              className="mt-3 block w-full accent-red-600"
              aria-label="Ticker scroll speed"
            />
            <span className="mt-1 flex justify-between text-xs font-normal text-gray-400"><span>Faster</span><span>Slower</span></span>
          </label>

          <button type="submit" disabled={loading || !loaded || saving} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Saving…' : 'Save and publish'}
          </button>
        </form>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div>
            <h2 className="font-bold text-gray-900">Live preview</h2>
            <p className="mt-1 text-xs text-gray-500">This preview follows the public ticker colors and speed.</p>
          </div>
          {ticker.enabled && ticker.text.trim() ? (
            <div className="flex h-12 items-center overflow-hidden rounded" style={{ backgroundColor: ticker.backgroundColor, color: ticker.textColor }}>
              <span className="z-10 h-full shrink-0 px-3 py-3 text-xs font-black">ব্রেকিং নিউজ</span>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className={`animate-breaking-ticker flex w-max whitespace-nowrap text-sm ${ticker.bold ? 'font-bold' : 'font-normal'}`} style={{ animationDuration: `${ticker.speedSeconds}s` }}>
                  <span className="pr-16">{ticker.text}</span>
                  <span aria-hidden="true" className="pr-16">{ticker.text}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center text-sm text-gray-500">
              {ticker.enabled ? 'Enter ticker text to see the preview.' : 'Breaking News ticker is currently off.'}
            </div>
          )}
          <p className="text-xs leading-relaxed text-gray-500">The ticker moves continuously from right to left beneath the main navigation.</p>
        </section>
      </div>
    </div>
  );
}
