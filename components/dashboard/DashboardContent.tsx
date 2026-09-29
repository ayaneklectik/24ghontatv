'use client';

import { useEffect, useState } from 'react';
import MetricsChart from './MetricsChart';
import PerformanceSection from './PerformanceSection';
import { fetchAdminNews } from '@/lib/admin-api';

interface DashboardStats {
  total_news: number;
  todays_news: number | string;
  total_hit: number | string;
  users: number;
  unpublished_news: number | string;
}

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
        if (response.ok) {
          const payload = await response.json();
          const data = payload?.data?.data ?? payload?.data ?? payload;
          if (typeof data?.total_news === 'number') {
            if (active) setStats(data);
            return;
          }
        }

        const [allNews, drafts] = await Promise.all([
          fetchAdminNews({ perPage: 1, page: 1 }),
          fetchAdminNews({ perPage: 1, page: 1, status: 0 }),
        ]);
        if (!active) return;
        setStats({
          total_news: Number(allNews.pagination?.total ?? allNews.items.length),
          todays_news: '—',
          total_hit: '—',
          users: 0,
          unpublished_news: Number(drafts.pagination?.total ?? drafts.items.length),
        });
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Dashboard data could not be loaded.');
      }
    };

    void loadStats();

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: 'Total Posts', value: stats?.total_news ?? '—' },
    { label: "Today's Posts", value: stats?.todays_news ?? '—' },
    { label: 'Pending Review', value: stats?.unpublished_news ?? '—' },
  ];

  return (
    <div className="space-y-8">
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-black/40">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-black/80">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MetricsChart />
        </div>
        <div className="lg:col-span-1">
          <PerformanceSection />
        </div>
      </div>
    </div>
  );
}
