import { fetchLaravelPublic } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/urls';

export default async function FamilyPage() {
  let members: any[] = [];
  try {
    const payload = await fetchLaravelPublic<any>('family');
    members = Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    console.error('Family API error:', error);
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-7 font-kalpurush sm:px-6">
      <div className="mb-5 flex items-center gap-2.5 border-b-2 border-red-200 pb-3">
        <h1 className="text-[27px] font-black text-neutral-800 md:text-[30px]">আমাদের পরিবার</h1>
        <span className="text-[17px] font-black text-red-600">❯</span>
      </div>
      {!members.length ? (
        <div className="py-16 text-center text-neutral-500">তথ্য পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article key={member.id} className="border border-neutral-200 bg-white p-4 sm:p-5">
              {member.photo && (
                <img
                  src={resolveMediaUrl(member.image_url || member.photo && `images/news_family/${member.photo}`)}
                  alt={member.name}
                  className="mb-4 h-24 w-24 rounded-full border border-neutral-200 object-cover"
                />
              )}
              <h2 className="text-xl font-black text-neutral-800">{member.name}</h2>
              <p className="text-sm text-red-600 font-bold mt-1">{member.position ?? ''}</p>
              <p className="text-sm text-neutral-600 mt-2">{member.address ?? ''}</p>
              <p className="text-sm text-neutral-600 mt-1">{member.contact ?? ''}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
