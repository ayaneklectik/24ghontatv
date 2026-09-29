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
    <main className="max-w-[1200px] mx-auto px-4 py-8 font-kalpurush">
      <h1 className="text-[32px] font-black text-neutral-800 mb-6">আমাদের পরিবার</h1>
      {!members.length ? (
        <div className="py-16 text-center text-neutral-500">তথ্য পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <article key={member.id} className="border border-neutral-200 rounded-xl bg-white p-5">
              {member.photo && (
                <img
                  src={resolveMediaUrl(member.image_url || member.photo && `images/news_family/${member.photo}`)}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border mb-4"
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
