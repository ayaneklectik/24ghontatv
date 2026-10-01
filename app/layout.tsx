```tsx
import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: '২৪ঘণ্টা | অনলাইন সংবাদ পোর্টাল',
    template: '%s | ২৪ঘণ্টা',
  },
  description: 'সর্বশেষ বাংলা সংবাদ ও বিশ্লেষণ',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white text-neutral-800">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```
