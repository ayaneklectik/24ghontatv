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
    <main className="mx-auto w-full max-w-[1200px] px-4 py-7 font-kalpurush sm:px-6">
      <div className="mb-5 flex items-center gap-2.5 border-b-2 border-red-200 pb-3">
        <h1 className="text-[27px] font-black text-neutral-800 md:text-[30px]">ই-পেপার</h1>
        <span className="text-[17px] font-black text-red-600">❯</span>
      </div>
      {!epapers.length ? (
        <div className="py-16 text-center text-neutral-500">কোনো ই-পেপার পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {epapers.map((paper) => {
            const pdf = paper.pdf_url || (paper.epaper ? resolveMediaUrl(`epaper/${paper.epaper}.pdf`, '') : '');
            return (
              <article key={paper.id} className="border border-neutral-200 bg-white p-4 sm:p-5">
                <div className="mb-3 text-sm text-neutral-500">{paper.pub_date}</div>
                {pdf ? <Link href={pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-red-600 px-4 py-2 text-white font-bold transition-colors hover:bg-red-700">
                  PDF খুলুন
                </Link> : (
                  <span className="inline-flex items-center bg-neutral-100 px-4 py-2 font-bold text-neutral-500">PDF unavailable</span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
