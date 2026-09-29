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
    <main className="max-w-[1440px] mx-auto px-4 py-8 font-kalpurush">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[32px] font-black text-neutral-800">
          ভিডিও
        </h1>

        <span className="text-red-600 font-black">❯</span>
      </div>

      {!videos.length ? (
        <div className="py-16 text-center text-neutral-500">
          কোনো ভিডিও পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <article
              key={video.id}
              className="border border-neutral-200 rounded-xl overflow-hidden bg-white"
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl shadow-lg">▶</span>
                    </div>
                  </a>
                );
              })()}

              <div className="p-4">
                <h2 className="font-bold text-lg text-neutral-800 line-clamp-2">
                  {video.video_title ?? video.title ?? ''}
                </h2>

                <p className="text-xs text-neutral-500 mt-2">
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