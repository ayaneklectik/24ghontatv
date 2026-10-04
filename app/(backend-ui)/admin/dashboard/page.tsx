'use client';
import { useEffect } from 'react';
import { useTitle } from '@/context/TitleContext';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);

  return (
    <div className="p-8">
      <DashboardContent />
    </div>
  );
}