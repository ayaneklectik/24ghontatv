import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';

interface PageProps { searchParams: Promise<{ page?: string }> }

export default async function GalleryPage({ searchParams }: PageProps) {
  const { page = '1' } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);
  let payload: any;
  try {
    payload = await fetchLaravelPublic<any>(`photos?per_page=24&page=${currentPage}`);
  } catch (error) {
    console.error('Gallery API error:', error);
    return <main className="py-20 text-center font-kalpurush text-neutral-500">Laravel API সংযোগ পাওয়া যাচ্ছে না।</main>;
  }
  const pageData = payload?.data ?? {};
  const photos = Array.isArray(pageData?.data) ? pageData.data : [];
  const last = Number(pageData?.last_page ?? 1);
  const current = Number(pageData?.current_page ?? currentPage);

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-8 font-kalpurush">
      <div className="flex items-center gap-3 border-b-2 border-neutral-200 pb-3 mb-6">
        <h1 className="text-3xl md:text-4xl font-black">ফটো গ্যালারি</h1><span className="text-red-600 font-black">❯</span>
      </div>
      {photos.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo: any) => (
            <Link key={photo.id} href={`/gallery/${photo.id}`} className="group border border-neutral-200 rounded-xl overflow-hidden bg-white">
              <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.title || 'Photo'} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
              </div>
              <div className="p-4"><h2 className="text-lg md:text-xl font-black leading-snug group-hover:text-red-600 line-clamp-2">{photo.title || 'ফটো গ্যালারি'}</h2><p className="text-sm text-neutral-400 mt-2">{photo.publishedAt || ''}</p></div>
            </Link>
          ))}
        </div>
      ) : <div className="py-20 text-center text-neutral-500">কোনো ছবি পাওয়া যায়নি।</div>}
      {last > 1 && (
        <div className="flex flex-wrap gap-2 pt-8">
          {current > 1 && <Link href={`/gallery?page=${current - 1}`} className="px-3 py-2 border rounded font-bold">আগের</Link>}
          {Array.from({ length: Math.min(last, 7) }, (_, i) => i + 1).map((p) => <Link key={p} href={`/gallery?page=${p}`} className={`px-3 py-2 border rounded font-bold ${p === current ? 'bg-red-600 text-white border-red-600' : ''}`}>{p}</Link>)}
          {current < last && <Link href={`/gallery?page=${current + 1}`} className="px-3 py-2 border rounded font-bold">পরের</Link>}
        </div>
      )}
    </main>
  );
}
