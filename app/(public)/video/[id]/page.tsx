import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';
import { resolveVideoUrl, youtubeEmbedUrl, youtubeThumbnailUrl } from '@/lib/urls';

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let video: any = null;

  try {
    const payload = await fetchLaravelPublic<any>(`videos/${encodeURIComponent(id)}`);
    video = payload?.data ?? null;
  } catch (error) {
    console.error('Video detail API error:', error);
  }

  if (!video) {
    return (
      <main className="max-w-[1000px] mx-auto px-4 py-16 text-center font-kalpurush">
        <h1 className="text-3xl font-black text-neutral-800 mb-4">ভিডিওটি পাওয়া যায়নি</h1>
        <Link href="/video/archive" className="text-red-600 font-bold hover:underline">ভিডিও আর্কাইভে ফিরুন</Link>
      </main>
    );
  }

  const link = resolveVideoUrl(video.video_url ?? video.video_link ?? video.link);
  const embed = youtubeEmbedUrl(link);
  const thumbnail = video.thumbnail_url ?? youtubeThumbnailUrl(link);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-7 font-kalpurush sm:px-6">
      <Link href="/video/archive" className="text-sm font-bold text-red-600 hover:underline">← ভিডিও আর্কাইভে ফিরুন</Link>

      <article className="mt-5 overflow-hidden border border-neutral-200 bg-white">
        <div className="aspect-video bg-black">
          {embed ? (
            <iframe
              src={embed}
              title={video.video_title ?? video.title ?? 'ভিডিও'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : thumbnail ? (
            <a href={link ?? '/video/archive'} target={link ? '_blank' : undefined} rel={link ? 'noopener noreferrer' : undefined} className="block w-full h-full relative">
              <img src={thumbnail} alt={video.video_title ?? video.title ?? 'ভিডিও'} className="w-full h-full object-contain" />
              <span className="absolute inset-0 flex items-center justify-center text-white text-6xl bg-black/20">▶</span>
            </a>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl">▶</div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h1 className="text-xl font-black text-neutral-800 md:text-2xl">{video.video_title ?? video.title ?? ''}</h1>
          {(video.pub_date ?? video.publishedAt) && <p className="mt-2 text-xs text-neutral-500">{video.pub_date ?? video.publishedAt}</p>}
          {(video.video_details ?? video.details) && <div className="mt-4 text-neutral-600 leading-7">{video.video_details ?? video.details}</div>}
          {link && !embed && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex mt-5 rounded-lg bg-red-600 px-4 py-2 text-white font-bold">ভিডিও খুলুন</a>
          )}
        </div>
      </article>
    </main>
  );
}
