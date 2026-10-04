import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/urls';

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let photo: any = null;

  try {
    const photoPayload = await fetchLaravelPublic<any>(
      `photos/${encodeURIComponent(id)}`
    );

    photo = photoPayload?.data ?? photoPayload ?? null;
  } catch (error) {
    console.error('Gallery detail API error:', error);
  }

  if (!photo) {
    return (
      <main className="max-w-[1000px] mx-auto px-4 py-16 text-center font-kalpurush">
        <h1 className="text-3xl font-black text-neutral-800 mb-4">
          ছবিটি পাওয়া যায়নি
        </h1>

        <Link
          href="/gallery"
          className="text-red-600 font-bold hover:underline"
        >
          গ্যালারিতে ফিরুন
        </Link>
      </main>
    );
  }

  const image = resolveMediaUrl(
    photo.imageUrl ?? photo.image_url ?? (photo.photo ? `images/photo_gallery/${photo.photo}` : null)
  );

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-7 font-kalpurush sm:px-6">
      <Link
        href="/gallery"
        className="text-sm font-bold text-red-600 hover:underline"
      >
        ← গ্যালারিতে ফিরুন
      </Link>

      <div className="mt-5 overflow-hidden border border-neutral-200 bg-white">
        <img
          src={image}
          alt={photo.title ?? photo.photo_details ?? 'ছবি'}
          className="w-full max-h-[760px] object-contain bg-neutral-100"
        />

        <div className="p-4 sm:p-5">
          <h1 className="text-xl font-black text-neutral-800 md:text-2xl">
            {photo.title ?? photo.photo_details ?? ''}
          </h1>

          {photo.publishedAt && (
            <p className="text-sm text-neutral-500 mt-2">
              {photo.publishedAt}
            </p>
          )}

          {photo.photo_details && (
            <p className="mt-4 text-neutral-600 leading-7">
              {photo.photo_details}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}