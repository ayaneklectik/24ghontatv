import Link from 'next/link';
import { fetchLaravelPublic } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/urls';

export default async function EPaperPage() {
  let epapers: any[] = [];

  try {
    const payload = await fetchLaravelPublic<any>('epapers?per_page=30');
    const data = payload?.data ?? {};
    epapers = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Epaper API error:', error);
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8 font-kalpurush">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[32px] font-black text-neutral-800">ই-পেপার</h1>
        <span className="text-red-600 font-black">❯</span>
      </div>
      {!epapers.length ? (
        <div className="py-16 text-center text-neutral-500">কোনো ই-পেপার পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {epapers.map((paper) => {
            const pdf = paper.pdf_url || (paper.epaper ? resolveMediaUrl(`epaper/${paper.epaper}.pdf`, '') : '');
            return (
              <article key={paper.id} className="border border-neutral-200 rounded-xl bg-white p-5">
                <div className="text-sm text-neutral-500 mb-3">{paper.pub_date}</div>
                {pdf ? <Link href={pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white font-bold hover:bg-red-700">
                  PDF খুলুন
                </Link> : (
                  <span className="inline-flex items-center rounded-lg bg-neutral-100 px-4 py-2 text-neutral-500 font-bold">PDF unavailable</span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
