'use client';

import { useEffect } from 'react';
import { useTitle } from '@/context/TitleContext';
import BreakingTickerSettings from '@/components/dashboard/BreakingTickerSettings';

export default function BreakingNewsManagerPage() {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle('Breaking News');
  }, [setTitle]);

  return <BreakingTickerSettings />;
}
