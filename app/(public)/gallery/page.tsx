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
    <main className="mx-auto w-full max-w-[1440px] px-4 py-7 font-kalpurush sm:px-6">
      <div className="mb-5 flex items-center gap-2.5 border-b-2 border-red-200 pb-3">
        <h1 className="text-[27px] font-black md:text-[30px]">ফটো গ্যালারি</h1><span className="text-[17px] font-black text-red-600">❯</span>
      </div>
      {photos.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo: any) => (
            <Link key={photo.id} href={`/gallery/${photo.id}`} className="group overflow-hidden border border-neutral-200 bg-white">
              <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.title || 'Photo'} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
              </div>
              <div className="p-3"><h2 className="line-clamp-2 text-base font-black leading-snug group-hover:text-red-600">{photo.title || 'ফটো গ্যালারি'}</h2><p className="mt-1.5 text-xs text-neutral-400">{photo.publishedAt || ''}</p></div>
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
