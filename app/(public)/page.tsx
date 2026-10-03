import { fetchLaravelHome } from '@/lib/public-api';
import { mapHome } from '@/lib/public-data';
import DynamicHome from '@/components/DynamicHome';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  try {
    const home = mapHome(await fetchLaravelHome());
    return <DynamicHome home={home} />;
  } catch (error) {
    console.error('Home API error:', error);
    return <main className="py-20 text-center font-kalpurush text-neutral-500">সংবাদ তথ্য পাওয়া যাচ্ছে না। Laravel API এবং ডাটাবেস সংযোগ যাচাই করুন।</main>;
  }
}
