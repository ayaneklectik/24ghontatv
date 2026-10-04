<?php

namespace App\Providers;

use App\Models\App_setting;
use App\Models\Category;
use App\Models\FooterContent;
use App\Models\HideNewsScroller;
use App\Models\LiveVideo;
use App\Models\NewsJustNow;
use App\Models\NewsTable;
use App\Models\Photo;
use App\Models\SocialMedia;
use App\Models\TopFiveNews;
use App\Models\Video;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Paginator::useBootstrap();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $app = App_setting::find(1);
        $media = SocialMedia::find(1);
        $footer = FooterContent::find(1);
        $video_link = LiveVideo::where('id', 1)->first();
        $just_now = NewsJustNow::where('status', 1)->get();
        $braking_news = NewsTable::where(['isbreaking' => 1, 'status' => 1])->limit(10)->orderBy('created_at', 'desc')->get();
        $lead_news1 = NewsTable::where(['islead' => 1, 'status' => 1])->orderBy('id', 'desc')->first();

        $lead_news_max_id = NewsTable::where(['islead' => 1, 'status' => 1])->orderBy('id', 'desc')->first();
        $lead_news2 = NewsTable::where(['islead' => 1, 'status' => 1])
            ->where('id', '!=', optional($lead_news_max_id)->id)->orderBy('id', 'desc')->limit(1)->get();

        $lead_news3 = NewsTable::where(['islead' => 1, 'status' => 1])->orderBy('id', 'desc')->offset(2)->limit(3)->get();
        $cat_home = Category::where('status', 1)->orderBy('cat_order', 'ASC')->limit(10)->get();
        $nav_cats = Category::where('status', 1)->orderBy('cat_order', 'ASC')->limit(10)->get();
        $remaining_categories = Category::where('status', 1)->orderBy('cat_order', 'ASC')->offset(10)->limit(PHP_INT_MAX)->get();
        $cat_section1 = Category::where('cat_order', 1)->first();
        $video_lead = Video::where('status', 1)->orderBy('id', 'desc')->first();
        $videos = Video::where('status', 1)->orderBy('created_at', 'desc')->limit(4)->get();
        $videos_bottom = Video::where('status', 1)->orderBy('id', 'desc')->offset(5)->limit(4)->get();
        $slider_photos = Photo::orderBy('created_at', 'DESC')->limit(10)->get();
        $photos = Photo::orderBy('created_at', 'DESC')->limit(4)->get();
        $scroller = HideNewsScroller::where('id', 1)->first();
        $cats = Category::where('status', 1)->orderBy('cat_order', 'ASC')->get();
        $latestNews = NewsTable::where('status', 1)->limit(15)->orderBy('created_at', 'DESC')->get();

        $top_news_1 = TopFiveNews::where('id', 1)->first();
        $top_news_2 = TopFiveNews::where('id', 2)->first();
        $top_news_3 = TopFiveNews::where('id', 3)->first();
        $top_news_4 = TopFiveNews::where('id', 4)->first();
        $top_news_5 = TopFiveNews::where('id', 5)->first();

        View::share([
            'app' => $app,
            'media' => $media,
            'footer' => $footer,
            'video_link' => $video_link,
            'just_now' => $just_now,
            'braking_news' => $braking_news,
            'lead_news1' => $lead_news1,
            'lead_news2' => $lead_news2,
            'lead_news3' => $lead_news3,
            'cat_home' => $cat_home,
            'nav_cats' => $nav_cats,
            'remaining_categories' => $remaining_categories,
            'cat_section1' => $cat_section1,
            'video_lead' => $video_lead,
            'videos' => $videos,
            'videos_bottom' => $videos_bottom,
            'slider_photos' => $slider_photos,
            'photos' => $photos,
            'scroller' => $scroller,
            'cats' => $cats,
            'latestNews' => $latestNews,
            'top_news_1' => $top_news_1,
            'top_news_2' => $top_news_2,
            'top_news_3' => $top_news_3,
            'top_news_4' => $top_news_4,
            'top_news_5' => $top_news_5,
        ]);
    }
}
