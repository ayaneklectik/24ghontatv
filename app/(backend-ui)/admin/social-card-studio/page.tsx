'use client';

import { Suspense } from 'react';
import SocialCardStudio from './Studio';

export default function SocialCardStudioPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading social card studio…</div>}>
      <SocialCardStudio />
    </Suspense>
  );
}
