
function TopFive({ recent, popular }: { recent: NewsItem[]; popular: NewsItem[] }) {
  const [tab, setTab] = useState<"recent" | "popular">("recent");
  const list = tab === "recent" ? recent : popular;
  const lead = list[0];

  if (!lead) return null;

  return (
    <section className="mt-8 w-full bg-[#fff8d9] font-kalpurush">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[30px] font-black leading-none sm:text-[32px]">
              <span className="text-red-600">২৪</span>
              <span className="text-neutral-700">ঘণ্টার শীর্ষ সংবাদ</span>
            </h2>
            <span className="-translate-y-1 text-[20px] font-black text-red-600">
              ❯
            </span>
          </div>

          <div className="flex items-center gap-5">
            {(["recent", "popular"] as const).map((key) => {
              const active = tab === key;

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setTab(key)}
                  className={`border-b-2 pb-2 text-[19px] font-black transition-colors ${
                    active
                      ? "border-red-600 text-neutral-700"
                      : "border-transparent text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  {key === "recent" ? "সাম্প্রতিক" : "জনপ্রিয়"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:border-r lg:border-neutral-200 lg:pr-8">
            <HeadlineCard item={lead} large />
          </div>

          <div className="divide-y divide-neutral-200 lg:col-span-4">
            {list.slice(1, 6).map((item, index) => (
              <Link
                key={item.id}
                href={newsHref(item)}
                className="group grid grid-cols-[40px_96px_1fr] gap-3 py-4 first:pt-0 last:pb-0"
              >
                <span className="text-[30px] font-black leading-none text-neutral-300 group-hover:text-red-600">
                  {toBengaliDigits(index + 2)}
                </span>

                <div className="aspect-[4/3] overflow-hidden rounded bg-neutral-100">
                  <ImageWithFallback
                    src={imageSrc(item)}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div>
                  <h3 className="line-clamp-3 text-[16px] font-bold leading-snug text-neutral-700 transition-colors group-hover:text-red-600 sm:text-[18px]">
                    {item.title}
                  </h3>

                  {item.publishedAt && (
                    <p className="mt-2 text-xs font-medium text-neutral-400">
                      {item.publishedAt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-b-4 border-neutral-300" />
      </div>
    </section>
  );
}
