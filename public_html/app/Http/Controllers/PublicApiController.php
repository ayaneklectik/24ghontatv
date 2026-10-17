<?php

namespace App\Http\Controllers;

use App\Models\App_setting;
use App\Models\Category;
use App\Models\FooterContent;
use App\Models\LiveVideo;
use App\Models\NewsFamily;
use App\Models\NewsJustNow;
use App\Models\NewsTable;
use App\Models\Photo;
use App\Models\SocialMedia;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PublicApiController extends Controller
{
    public function home(): JsonResponse
    {
        $categories = Category::query()
            ->where('status', 1)
            ->orderBy('cat_order')
            ->get();

        $news = NewsTable::query()
            ->where('status', 1)
            ->with(['category', 'userModel'])
            ->orderByDesc('id')
            ->limit(60)
            ->get();

        $popularNews = NewsTable::query()
            ->where('status', 1)
            ->with(['category', 'userModel'])
            ->orderByDesc('hit')
            ->orderByDesc('id')
            ->limit(20)
            ->get();

        $mapNews = fn (Collection $items) => $items
            ->map(fn (NewsTable $item) => $this->newsItem($item))
            ->values();

        return response()->json([
            'data' => [
                'site' => [
                    'app' => App_setting::query()->find(1),
                    'social_media' => SocialMedia::query()->find(1),
                    'footer' => FooterContent::query()->find(1),
                    'live_video' => LiveVideo::query()->find(1),
                ],
                'categories' => $categories,
                'latest_news' => $mapNews($news->take(20)),
                'breaking_news' => $mapNews($news->where('isbreaking', 1)->take(20)),
                'popular_news' => $mapNews($popularNews),
                'lead_news' => $mapNews($news->where('islead', 1)->take(10)),
                'top_five' => [],
                'just_now' => NewsJustNow::query()
                    ->where('status', 1)
                    ->orderByDesc('id')
                    ->limit(10)
                    ->get()
                    ->map(fn (NewsJustNow $item) => [
                        'id' => (string) $item->id,
                        'title' => $item->news_title,
                        'url' => $item->news_url,
                        'published_date' => $item->published_date,
                    ]),
                'videos' => Video::query()
                    ->where('status', 1)
                    ->orderByDesc('id')
                    ->limit(10)
                    ->get(),
                'photos' => Photo::query()
                    ->orderByDesc('id')
                    ->limit(12)
                    ->get(),
                'sections' => $categories->map(fn (Category $category) => [
                    'category' => $category,
                    'news' => $mapNews($news
                        ->where('cat', $category->id)
                        ->take(10)),
                ])->filter(fn (array $section) => $section['news']->isNotEmpty())->values(),
            ],
        ]);
    }

    public function showNews(Request $request, int $id): JsonResponse
    {
        $news = NewsTable::query()
            ->where('status', 1)
            ->with(['category', 'userModel'])
            ->findOrFail($id);

        if ($request->boolean('track_view')) {
            NewsTable::query()->whereKey($news->id)->increment('hit');
            $news->refresh();
        }

        $relatedNews = NewsTable::query()
            ->where('status', 1)
            ->where('cat', $news->cat)
            ->whereKeyNot($news->id)
            ->with(['category', 'userModel'])
            ->orderByDesc('id')
            ->limit(6)
            ->get();

        $nextNews = NewsTable::query()
            ->where('status', 1)
            ->where('id', '>', $news->id)
            ->orderBy('id')
            ->first();

        $previousNews = NewsTable::query()
            ->where('status', 1)
            ->where('id', '<', $news->id)
            ->orderByDesc('id')
            ->first();

        return response()->json([
            'data' => [
                'news' => $this->newsItem($news, true),
                'related_news' => $relatedNews->map(fn (NewsTable $item) => $this->newsItem($item))->values(),
                'next_news' => $nextNews ? $this->newsItem($nextNews) : null,
                'previous_news' => $previousNews ? $this->newsItem($previousNews) : null,
            ],
        ]);
    }

    private function newsItem(NewsTable $news, bool $includeContent = false): array
    {
        $contentSummary = html_entity_decode(
            strip_tags((string) $news->dis),
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        );
        $contentSummary = trim(preg_replace('/\s+/u', ' ', $contentSummary) ?? '');
        $excerpt = $news->news_sub_title ?: Str::words($contentSummary, 30);

        return [
            'id' => (string) $news->id,
            'news_id' => $news->news_id,
            'title' => $news->news_title,
            'news_title' => $news->news_title,
            'slug' => $news->title_link,
            'title_link' => $news->title_link,
            'excerpt' => $excerpt,
            'news_sub_title' => $excerpt,
            'content' => $includeContent ? $news->dis : null,
            'dis' => $includeContent ? $news->dis : null,
            'image_url' => $news->image ? 'images/news_img/' . $news->image : null,
            'image_title' => $news->image_title,
            'published_date' => $news->published_date,
            'published_time' => $news->published_time,
            'author' => $news->userModel?->name,
            'representative_loc' => $news->representative_loc,
            'category' => $news->category ? [
                'id' => $news->category->id,
                'name' => $news->category->cat_name,
                'cat_name' => $news->category->cat_name,
                'slug' => $news->category->cat_name,
            ] : null,
            'cat' => $news->cat,
            'hit' => $news->hit,
            'isbreaking' => $news->isbreaking,
            'islead' => $news->islead,
            'meta_keyword' => $news->meta_keyword,
        ];
    }
}
