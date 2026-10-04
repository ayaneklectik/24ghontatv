<?php

namespace App\Http\Controllers;

use App\Mail\FeedbackMail;
use App\Models\App_setting;
use App\Models\Category;
use App\Models\Epaper;
use App\Models\FooterContent;
use App\Models\LiveVideo;
use App\Models\NewsFamily;
use App\Models\NewsJustNow;
use App\Models\NewsTable;
use App\Models\Photo;
use App\Models\SocialMedia;
use App\Models\SubCategory;
use App\Models\User;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;

class PublicController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Cache TTL
    |--------------------------------------------------------------------------
    |
    | Seconds
    |
    */

    private const CACHE_30_SECONDS = 30;
    private const CACHE_1_MINUTE   = 60;
    private const CACHE_5_MINUTES  = 300;
    private const CACHE_30_MINUTES = 1800;
    private const CACHE_1_HOUR     = 3600;


    /*
    |--------------------------------------------------------------------------
    | Cache Helper
    |--------------------------------------------------------------------------
    |
    | Compatible with File, Database, Redis and other Laravel cache stores.
    |
    */

    private function cached(
        string $key,
        int $ttl,
        callable $callback
    ) {
        return Cache::remember(
            $key,
            $ttl,
            $callback
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Common Website Data
    |--------------------------------------------------------------------------
    */

    private function commonData(bool $withJustNow = false): array
    {
        /*
        |--------------------------------------------------------------------------
        | Load all categories only once
        |--------------------------------------------------------------------------
        */

        $categories = $this->cached(
            'public:categories',
            self::CACHE_30_MINUTES,
            function () {
                return Category::query()
                    ->where('status', 1)
                    ->orderBy('cat_order', 'asc')
                    ->get();
            }
        );

        $data = [
            /*
            |--------------------------------------------------------------------------
            | Site Settings
            |--------------------------------------------------------------------------
            */

            'app' => $this->cached(
                'public:app',
                self::CACHE_1_HOUR,
                fn () => App_setting::find(1)
            ),

            'media' => $this->cached(
                'public:media',
                self::CACHE_1_HOUR,
                fn () => SocialMedia::find(1)
            ),

            'footer' => $this->cached(
                'public:footer',
                self::CACHE_1_HOUR,
                fn () => FooterContent::find(1)
            ),

            'video_link' => $this->cached(
                'public:live-video',
                self::CACHE_1_MINUTE,
                fn () => LiveVideo::find(1)
            ),

            /*
            |--------------------------------------------------------------------------
            | Categories
            |--------------------------------------------------------------------------
            */

            'cats' => $categories,

            'nav_cats' => $categories
                ->take(10)
                ->values(),

            'remaining_categories' => $categories
                ->skip(10)
                ->values(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Just Now News
        |--------------------------------------------------------------------------
        */

        if ($withJustNow) {
            $data['just_now'] = $this->cached(
                'public:just-now',
                self::CACHE_30_SECONDS,
                function () {
                    return NewsJustNow::query()
                        ->where('status', 1)
                        ->orderByDesc('id')
                        ->get();
                }
            );
        }

        return $data;
    }


    /*
    |--------------------------------------------------------------------------
    | Cached Category
    |--------------------------------------------------------------------------
    */

    private function getCategory(?int $id): ?Category
    {
        if (!$id) {
            return null;
        }

        return $this->cached(
            "public:category:{$id}",
            self::CACHE_30_MINUTES,
            fn () => Category::find($id)
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Cached Sub Category
    |--------------------------------------------------------------------------
    */

    private function getSubCategory(?int $id): ?SubCategory
    {
        if (!$id) {
            return null;
        }

        return $this->cached(
            "public:subcategory:{$id}",
            self::CACHE_30_MINUTES,
            fn () => SubCategory::find($id)
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Cached Category Sub Categories
    |--------------------------------------------------------------------------
    */

    private function getSubCategories(int $categoryId): Collection
    {
        return $this->cached(
            "public:category:{$categoryId}:subcategories",
            self::CACHE_30_MINUTES,
            function () use ($categoryId) {
                return SubCategory::query()
                    ->where('cat_id', $categoryId)
                    ->get();
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Cached User
    |--------------------------------------------------------------------------
    */

    private function getUser(?int $id): ?User
    {
        if (!$id) {
            return null;
        }

        return $this->cached(
            "public:user:{$id}",
            self::CACHE_1_HOUR,
            fn () => User::find($id)
        );
    }


    /*
    |--------------------------------------------------------------------------
    | More News
    |--------------------------------------------------------------------------
    */

    private function getMoreNews(
        int $categoryId,
        ?int $excludeId = null,
        int $limit = 6
    ): Collection {
        $cacheKey = 'public:more-news:' . $categoryId . ':' .
            ($excludeId ?? 0) . ':' . $limit;

        return $this->cached(
            $cacheKey,
            self::CACHE_30_SECONDS,
            function () use (
                $categoryId,
                $excludeId,
                $limit
            ) {
                return NewsTable::query()
                    ->where('status', 1)
                    ->where('cat', $categoryId)
                    ->when(
                        $excludeId,
                        fn ($query) => $query->where(
                            'id',
                            '!=',
                            $excludeId
                        )
                    )
                    ->orderByDesc('created_at')
                    ->limit($limit)
                    ->get();
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Category News Blocks
    |--------------------------------------------------------------------------
    |
    | One database query instead of multiple random queries.
    |
    */

    private function categoryBlocks(
        int $categoryId,
        ?int $subCategoryId = null
    ): array {
        $cacheKey = $subCategoryId
            ? "public:category-blocks:{$categoryId}:{$subCategoryId}"
            : "public:category-blocks:{$categoryId}";

        return $this->cached(
            $cacheKey,
            self::CACHE_30_SECONDS,
            function () use (
                $categoryId,
                $subCategoryId
            ) {
                $query = NewsTable::query()
                    ->where('status', 1)
                    ->where('cat', $categoryId);

                if ($subCategoryId !== null) {
                    $query->where(
                        'sub_cat',
                        $subCategoryId
                    );
                }

                $news = $query
                    ->orderByDesc('id')
                    ->limit(20)
                    ->get();

                return [
                    'cat_lead_news_1' => $news
                        ->slice(0, 1)
                        ->values(),

                    'cat_lead_news_2' => $news
                        ->slice(1, 2)
                        ->values(),

                    'cat_lead_news_3' => $news
                        ->slice(3, 3)
                        ->values(),

                    'cat_lead_news_4' => $news
                        ->slice(6, 10)
                        ->values(),

                    'populer' => $news
                        ->take(20)
                        ->values(),
                ];
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Public Home
    |--------------------------------------------------------------------------
    */

    public function PublicHome(): View
    {
        return view('frontend.home');
    }


    /*
    |--------------------------------------------------------------------------
    | News Details
    |--------------------------------------------------------------------------
    */

    public function NewsDetails($id)
    {
        /*
        |--------------------------------------------------------------------------
        | Get Published News
        |--------------------------------------------------------------------------
        */

        $news = NewsTable::query()
            ->where('id', $id)
            ->where('status', 1)
            ->first();

        if (!$news) {
            return redirect()->route('page-not-found');
        }

        /*
        |--------------------------------------------------------------------------
        | Atomic Hit Counter
        |--------------------------------------------------------------------------
        */

        NewsTable::query()
            ->where('id', $news->id)
            ->increment('hit');

        /*
        |--------------------------------------------------------------------------
        | Common Data
        |--------------------------------------------------------------------------
        */

        $data = $this->commonData(true);

        $data['news'] = $news;

        /*
        |--------------------------------------------------------------------------
        | Category
        |--------------------------------------------------------------------------
        */

        $data['cat'] = $this->getCategory(
            $news->cat
        );

        /*
        |--------------------------------------------------------------------------
        | Sub Category
        |--------------------------------------------------------------------------
        */

        $data['sub_cat'] = $this->getSubCategory(
            $news->sub_cat
        );

        /*
        |--------------------------------------------------------------------------
        | Extra Category
        |--------------------------------------------------------------------------
        */

        $data['extra_cats'] = $this->getCategory(
            $news->extra_cat
        );

        /*
        |--------------------------------------------------------------------------
        | Category Sub Categories
        |--------------------------------------------------------------------------
        */

        $data['sub_cats'] = $news->cat
            ? $this->getSubCategories($news->cat)
            : collect();

        /*
        |--------------------------------------------------------------------------
        | More News
        |--------------------------------------------------------------------------
        */

        $data['more_news'] = $this->getMoreNews(
            $news->cat,
            $news->id,
            6
        );

        /*
        |--------------------------------------------------------------------------
        | User
        |--------------------------------------------------------------------------
        */

        $data['user'] = $this->getUser(
            $news->user
        );

        /*
        |--------------------------------------------------------------------------
        | Next News
        |--------------------------------------------------------------------------
        */

        $nextNews = NewsTable::query()
            ->where('status', 1)
            ->where('id', '>', $news->id)
            ->orderBy('id', 'asc')
            ->first();

        if (!$nextNews) {
            $nextNews = $news;
        }

        $data['nextNews'] = $nextNews;
        $data['nextNewsLink'] = $nextNews->title_link;

        /*
        |--------------------------------------------------------------------------
        | Previous News
        |--------------------------------------------------------------------------
        */

        $previousNews = NewsTable::query()
            ->where('status', 1)
            ->where('id', '<', $news->id)
            ->orderBy('id', 'desc')
            ->first();

        if (!$previousNews) {
            $previousNews = $news;
        }

        $data['previousNews'] = $previousNews;
        $data['previousNewsLink'] =
            $previousNews->title_link;

        return view(
            'frontend.news_details',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | News Details - Admin
    |--------------------------------------------------------------------------
    */

    public function NewsDetailsAdmin($id, $link)
    {
        $news = NewsTable::find($id);

        if (!$news) {
            return redirect()->route('page-not-found');
        }

        $data = $this->commonData(true);

        $data['news'] = $news;

        $data['cat'] = $this->getCategory(
            $news->cat
        );

        $data['sub_cat'] = $this->getSubCategory(
            $news->sub_cat
        );

        $data['extra_cats'] = $this->getCategory(
            $news->extra_cat
        );

        $data['sub_cats'] = $news->cat
            ? $this->getSubCategories($news->cat)
            : collect();

        /*
        |--------------------------------------------------------------------------
        | More News
        |--------------------------------------------------------------------------
        */

        $data['more_news'] = $this->getMoreNews(
            $news->cat,
            null,
            6
        );

        $data['user'] = $this->getUser(
            $news->user
        );

        /*
        |--------------------------------------------------------------------------
        | Next News
        |--------------------------------------------------------------------------
        */

        $nextNews = NewsTable::query()
            ->where('id', '>', $news->id)
            ->orderBy('id', 'asc')
            ->first();

        if (!$nextNews) {
            $nextNews = $news;
        }

        $data['nextNews'] = $nextNews;
        $data['nextNewsLink'] =
            $nextNews->title_link;

        /*
        |--------------------------------------------------------------------------
        | Previous News
        |--------------------------------------------------------------------------
        */

        $previousNews = NewsTable::query()
            ->where('id', '<', $news->id)
            ->orderBy('id', 'desc')
            ->first();

        if (!$previousNews) {
            $previousNews = $news;
        }

        $data['previousNews'] = $previousNews;
        $data['previousNewsLink'] =
            $previousNews->title_link;

        return view(
            'frontend.news_details',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | All Category News
    |--------------------------------------------------------------------------
    */

    public function AllCategoryNews($id)
    {
        $categoryId = (int) $id;

        $category = $this->getCategory(
            $categoryId
        );

        if (!$category) {
            return redirect()->route('page-not-found');
        }

        $data = $this->commonData();

        /*
        |--------------------------------------------------------------------------
        | Paginated Category News
        |--------------------------------------------------------------------------
        */

        $data['all_cat_news'] = NewsTable::query()
            ->where('cat', $categoryId)
            ->where('status', 1)
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $data['cat'] = $category;

        $data['sub_cats'] =
            $this->getSubCategories($categoryId);

        /*
        |--------------------------------------------------------------------------
        | Lead / Popular News
        |--------------------------------------------------------------------------
        */

        $data = array_merge(
            $data,
            $this->categoryBlocks($categoryId)
        );

        return view(
            'frontend.all_category_news',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Search News
    |--------------------------------------------------------------------------
    */

    public function searchNews(Request $request)
    {
        $searchText = trim(
            $request->string('search')->toString()
        );

        $data = $this->commonData();

        /*
        |--------------------------------------------------------------------------
        | Main Search Result
        |--------------------------------------------------------------------------
        */

        $data['all_cat_news'] = NewsTable::query()
            ->where('status', 1)
            ->when(
                $searchText !== '',
                function ($query) use ($searchText) {
                    $query->where(
                        'news_title',
                        'like',
                        '%' . $searchText . '%'
                    );
                }
            )
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | First Category
        |--------------------------------------------------------------------------
        */

        $data['cat'] = $this->cached(
            'public:first-category',
            self::CACHE_30_MINUTES,
            function () {
                return Category::query()
                    ->where('status', 1)
                    ->orderBy('cat_order', 'asc')
                    ->first();
            }
        );

        /*
        |--------------------------------------------------------------------------
        | All Sub Categories
        |--------------------------------------------------------------------------
        */

        $data['sub_cats'] = $this->cached(
            'public:all-subcategories',
            self::CACHE_30_MINUTES,
            function () {
                return SubCategory::all();
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Search Blocks
        |--------------------------------------------------------------------------
        |
        | One query only.
        |
        */

        $searchBlocks = NewsTable::query()
            ->where('status', 1)
            ->when(
                $searchText !== '',
                function ($query) use ($searchText) {
                    $query->where(
                        'news_title',
                        'like',
                        '%' . $searchText . '%'
                    );
                }
            )
            ->orderByDesc('id')
            ->limit(20)
            ->get();

        $data['cat_lead_news_1'] =
            $searchBlocks->slice(0, 1)->values();

        $data['cat_lead_news_2'] =
            $searchBlocks->slice(1, 2)->values();

        $data['cat_lead_news_3'] =
            $searchBlocks->slice(3, 3)->values();

        $data['cat_lead_news_4'] =
            $searchBlocks->slice(6, 10)->values();

        $data['populer'] =
            $searchBlocks->take(20)->values();

        return view(
            'frontend.search-category-news',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | All Sub Category News
    |--------------------------------------------------------------------------
    */

    public function AllSubCategoryNews($id)
    {
        $subCategoryId = (int) $id;

        $subCategory = $this->getSubCategory(
            $subCategoryId
        );

        if (!$subCategory) {
            return redirect()->route('page-not-found');
        }

        $data = $this->commonData(true);

        /*
        |--------------------------------------------------------------------------
        | News
        |--------------------------------------------------------------------------
        */

        $data['all_cat_news'] = NewsTable::query()
            ->where('sub_cat', $subCategoryId)
            ->where('status', 1)
            ->orderByDesc('created_at')
            ->paginate(28)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Category
        |--------------------------------------------------------------------------
        */

        $data['cat'] = $this->getCategory(
            $subCategory->cat_id
        );

        $data['sub_cat'] = $subCategory;

        /*
        |--------------------------------------------------------------------------
        | Other Sub Categories
        |--------------------------------------------------------------------------
        */

        $data['sub_cats'] =
            $this->getSubCategories(
                $subCategory->cat_id
            );

        return view(
            'frontend.all_sub_category_news',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | E-Paper
    |--------------------------------------------------------------------------
    */

    public function Epaper()
    {
        $data = $this->commonData(true);

        $data['epapers'] = Epaper::query()
            ->orderByDesc('pub_date')
            ->paginate(20)
            ->withQueryString();

        $data['more_news'] = $this->cached(
            'public:epaper:more-news',
            self::CACHE_30_SECONDS,
            function () {
                return NewsTable::query()
                    ->where('status', 1)
                    ->orderByDesc('created_at')
                    ->limit(8)
                    ->get();
            }
        );

        return view(
            'frontend.e_paper',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | All Videos
    |--------------------------------------------------------------------------
    */

    public function AllVideos()
    {
        $data = $this->commonData(true);

        $data['videos'] = Video::query()
            ->orderByDesc('created_at')
            ->paginate(24)
            ->withQueryString();

        $data['more_news'] = $this->cached(
            'public:videos:more-news',
            self::CACHE_30_SECONDS,
            function () {
                return NewsTable::query()
                    ->where('status', 1)
                    ->orderByDesc('created_at')
                    ->limit(8)
                    ->get();
            }
        );

        return view(
            'frontend.all_videos',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | All Photos
    |--------------------------------------------------------------------------
    */

    public function AllPhotos()
    {
        $data = $this->commonData(true);

        /*
        |--------------------------------------------------------------------------
        | Paginate Photos
        |--------------------------------------------------------------------------
        */

        $data['photos'] = Photo::query()
            ->orderByDesc('created_at')
            ->paginate(24)
            ->withQueryString();

        $data['more_news'] = $this->cached(
            'public:photos:more-news',
            self::CACHE_30_SECONDS,
            function () {
                return NewsTable::query()
                    ->where('status', 1)
                    ->orderByDesc('created_at')
                    ->limit(8)
                    ->get();
            }
        );

        return view(
            'frontend.all_photos',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Our Family
    |--------------------------------------------------------------------------
    */

    public function OurFamily()
    {
        $data = $this->commonData(true);

        $data['members'] = $this->cached(
            'public:family',
            self::CACHE_5_MINUTES,
            function () {
                return NewsFamily::query()
                    ->orderByDesc('created_at')
                    ->get();
            }
        );

        $data['more_news'] = $this->cached(
            'public:family:more-news',
            self::CACHE_30_SECONDS,
            function () {
                return NewsTable::query()
                    ->where('status', 1)
                    ->orderByDesc('created_at')
                    ->limit(8)
                    ->get();
            }
        );

        return view(
            'frontend.our_family',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Default Page
    |--------------------------------------------------------------------------
    */

    public function DefaultPage()
    {
        $data = $this->commonData(true);

        $data['more_news'] = $this->cached(
            'public:default:more-news',
            self::CACHE_30_SECONDS,
            function () {
                return NewsTable::query()
                    ->where('status', 1)
                    ->orderByDesc('created_at')
                    ->limit(8)
                    ->get();
            }
        );

        return view(
            'frontend.default_page',
            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Send Feedback
    |--------------------------------------------------------------------------
    */

    public function SendFeedback(
        Request $request
    ): RedirectResponse {

        $validated = $request->validate([
            'subject' => [
                'required',
                'string',
                'max:255',
            ],

            'message' => [
                'required',
                'string',
                'max:10000',
            ],

            'user_name' => [
                'required',
                'string',
                'max:100',
            ],

            'user_last_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'gender' => [
                'nullable',
                'string',
                'max:30',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'city' => [
                'nullable',
                'string',
                'max:100',
            ],

            'country' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        Mail::to('weurobdnews@gmail.com')->send(
            new FeedbackMail(
                $validated['subject'],
                $validated['message'],
                $validated['user_name'],
                $validated['user_last_name'] ?? '',
                $validated['gender'] ?? '',
                $validated['email'],
                $validated['city'] ?? '',
                $validated['country'] ?? ''
            )
        );

        return redirect()
            ->route('home')
            ->with(
                'massage',
                'Send Your Feedback Successfully'
            )
            ->with(
                'msg_type',
                'success'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | T20 Category
    |--------------------------------------------------------------------------
    */

    public function t20_category()
    {
        $categoryId = 12;
        $subCategoryId = 40;

        $data = $this->commonData();

        /*
        |--------------------------------------------------------------------------
        | T20 News
        |--------------------------------------------------------------------------
        */

        $data['all_cat_news'] = NewsTable::query()
            ->where('cat', $categoryId)
            ->where('sub_cat', $subCategoryId)
            ->where('status', 1)
            ->orderByDesc('created_at')
            ->paginate(28)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Category
        |--------------------------------------------------------------------------
        */

        $data['cat'] =
            $this->getCategory($categoryId);

        /*
        |--------------------------------------------------------------------------
        | Sub Categories
        |--------------------------------------------------------------------------
        */

        $data['sub_cats'] =
            $this->getSubCategories($categoryId);

        /*
        |--------------------------------------------------------------------------
        | Lead / Popular News
        |--------------------------------------------------------------------------
        */

        $data = array_merge(
            $data,
            $this->categoryBlocks(
                $categoryId,
                $subCategoryId
            )
        );

        return view(
            'frontend.news.t20_category_news',
            $data
        );
    }
}