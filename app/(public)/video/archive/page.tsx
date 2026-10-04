import { fetchLaravelPublic } from '@/lib/public-api';
import { resolveVideoUrl, youtubeThumbnailUrl, resolveMediaUrl } from '@/lib/urls';

export default async function VideoArchivePage() {
  let videos: any[] = [];

  try {
    const videoPayload = await fetchLaravelPublic<any>(
      'videos?per_page=48'
    );

    const paginated = videoPayload?.data ?? {};

    videos = Array.isArray(paginated?.data)
      ? paginated.data
      : Array.isArray(paginated)
        ? paginated
        : [];
  } catch (error) {
    console.error('Video archive API error:', error);
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-7 font-kalpurush sm:px-6">
      <div className="mb-5 flex items-center gap-2.5 border-b-2 border-red-200 pb-3">
        <h1 className="text-[27px] font-black text-neutral-800 md:text-[30px]">
          ভিডিও
        </h1>

        <span className="text-[17px] font-black text-red-600">❯</span>
      </div>

      {!videos.length ? (
        <div className="py-16 text-center text-neutral-500">
          কোনো ভিডিও পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <article
              key={video.id}
              className="overflow-hidden border border-neutral-200 bg-white"
            >
              {(() => {
                const link = resolveVideoUrl(video.video_url ?? video.video_link ?? video.link);
                const thumbnail = video.thumbnail_url ?? video.thumbnailUrl ?? youtubeThumbnailUrl(link);
                return (
                  <a
                    href={link ?? '/video/archive'}
                    target={link ? '_blank' : undefined}
                    rel={link ? 'noopener noreferrer' : undefined}
                    className="block aspect-video bg-neutral-100 relative overflow-hidden"
                  >
                    <img
                      src={thumbnail ? resolveMediaUrl(thumbnail, '/images/placeholder-news.svg') : '/images/placeholder-news.svg'}
                      alt={video.video_title ?? video.title ?? 'ভিডিও'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl text-white">▶</span>
                    </div>
                  </a>
                );
              })()}

              <div className="p-3">
                <h2 className="line-clamp-2 text-base font-bold text-neutral-800">
                  {video.video_title ?? video.title ?? ''}
                </h2>

                <p className="mt-1.5 text-xs text-neutral-500">
                  {video.pub_date ??
                    video.publishedAt ??
                    ''}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}