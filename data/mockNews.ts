export interface NewsItem {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  author?: string;
}

export const LEAD_NEWS: NewsItem[] = [
  {
    id: 'lead-1',
    title: 'জাতীয় নির্বাচনে নতুন ডিজিটাল পদ্ধতির প্রবর্তন',
    excerpt: 'নির্বাচন কমিশন নতুন ডিজিটাল ভোটিং ব্যবস্থার বিষয়ে বিস্তারিত আলোচনা করেছে...',
    category: 'জাতীয়',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9',
    publishedAt: '১০ মিনিট আগে',
  },
  {
    id: 'lead-2',
    title: 'আন্তর্জাতিক বাজারে জ্বালানি তেলের দাম হ্রাস',
    category: 'আন্তর্জাতিক',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
    publishedAt: '২৫ মিনিট আগে',
  },
];

export const NATIONAL_NEWS: NewsItem[] = [
  {
    id: 'nat-1',
    title: 'রাজধানীতে নতুন মেট্রোরেল রুটের অনুমোদন',
    category: 'জাতীয়',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    publishedAt: '১ ঘণ্টা আগে',
  },
  {
    id: 'nat-2',
    title: 'কৃষি খাতে আধুনিক প্রযুক্তির ব্যবহারে সাফল্য',
    category: 'কৃষি',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854',
    publishedAt: '২ ঘণ্টা আগে',
  },
];

export const LEAD_HERO: NewsItem = {
  id: 'lead-hero',
  title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে? কারণ পোকাদের ভাগ্যই আগুনে পুড়ে মরা',
  excerpt: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না। চামড়ার টাকাটা আমাদের দান করুন। আমরা এতিম বাচ্চাদের জন্য একটা স্কুল বানাতে যাচ্ছি। সকলেই বললেন, তোমরা খুব ভাল উদ্যোগ নিয়েছ...',
  imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1000&auto=format&fit=crop&q=80',
  category: 'বিশেষ সংবাদ',
  publishedAt: 'আজ',
};

export const LEAD_BOTTOM: NewsItem[] = [
  {
    id: 'bottom-lead-1',
    title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?',
    excerpt: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না...',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&sig=1',
    category: 'বিশেষ সংবাদ',
    publishedAt: 'আজ',
  },
  {
    id: 'bottom-lead-2',
    title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?',
    excerpt: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না...',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&sig=2',
    category: 'বিশেষ সংবাদ',
    publishedAt: 'আজ',
  },
  {
    id: 'bottom-lead-3',
    title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?',
    excerpt: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না...',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&sig=3',
    category: 'বিশেষ সংবাদ',
    publishedAt: 'আজ',
  },
  {
    id: 'bottom-lead-4',
    title: 'জ্বলন্ত আগুনে যে পোকারা ঝাঁপ দিয়ে মরে তাতে কি আগুনের অপরাধ আছে?',
    excerpt: 'কোরবানির ঈদ আসন্ন। আমরা শিক্ষকদের বাড়ি বাড়ি গিয়ে বলব, আপনারা এই ঈদে তো কোরবানি দিবেন না...',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&sig=4',
    category: 'বিশেষ সংবাদ',
    publishedAt: 'আজ',
  },
];