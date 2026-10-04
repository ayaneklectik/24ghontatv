<?php

use App\Http\Controllers\Api\AdApiController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\EPaperApiController;
use App\Http\Controllers\Api\GalleryApiController;
use App\Http\Controllers\Api\NewsApiController;
use App\Http\Controllers\Api\NewsFamilyApiController;
use App\Http\Controllers\Api\OthersApiController;
use App\Http\Controllers\Api\PublicApiController;
use App\Http\Controllers\Api\SpecialSectionApiController;
use App\Http\Controllers\Api\SectionApiController;
use App\Http\Controllers\Api\TopFiveApiController;
use App\Http\Controllers\Api\VideoApiController;
use App\Http\Controllers\DisplayConfigController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'status' => true,
        'message' => '24Ghonta TV API is working',
    ]);
});

Route::prefix('v1')->group(function () {

    // =========================================================
    // PUBLIC API
    // =========================================================

    Route::get('/home', [PublicApiController::class, 'home']);
    Route::get('/site', [PublicApiController::class, 'site']);
    Route::get('/special-section', [PublicApiController::class, 'specialSection']);
    Route::get('/live-video', [PublicApiController::class, 'liveVideo']);

    Route::get('/news', [PublicApiController::class, 'newsList']);

    Route::get('/news/{id}', [PublicApiController::class, 'news'])
        ->whereNumber('id');

    Route::get('/categories', function () {
        return response()->json([
            'status' => true,
            'data' => App\Models\Category::query()
                ->where('status', 1)
                ->orderBy('cat_order')
                ->orderBy('id')
                ->get()
                ->map(fn ($category) => [
                    'id' => (string) $category->id,
                    'name' => $category->cat_name,
                    'cat_name' => $category->cat_name,
                    'slug' => $category->cat_name,
                    'cat_slug' => $category->cat_name,
                    'order' => (int) $category->cat_order,
                ])
                ->values(),
        ]);
    });

    Route::get('/categories/{identifier}', [
        PublicApiController::class,
        'category',
    ]);

    Route::get('/categories/{identifier}/news', [
        PublicApiController::class,
        'category',
    ]);

    Route::get('/sub-categories/{id}/news', [
        PublicApiController::class,
        'subCategory',
    ]);

    Route::get('/search', [
        PublicApiController::class,
        'search',
    ]);

    Route::get('/search/news', [
        PublicApiController::class,
        'search',
    ]);

    Route::get('/epapers', [
        PublicApiController::class,
        'epapers',
    ]);

    Route::get('/videos', [
        PublicApiController::class,
        'videos',
    ]);

    Route::get('/videos/{id}', [
        PublicApiController::class,
        'videos',
    ]);

    Route::get('/photos', [
        PublicApiController::class,
        'photos',
    ]);

    Route::get('/photos/{id}', [
        PublicApiController::class,
        'photos',
    ]);

    Route::get('/family', [
        PublicApiController::class,
        'family',
    ]);

    Route::get('/default-page', [
        PublicApiController::class,
        'defaultPage',
    ]);

    Route::post('/feedback', [
        PublicApiController::class,
        'feedback',
    ])->middleware('throttle:20,1');

    Route::get('/t20', [
        PublicApiController::class,
        't20',
    ]);

    // =========================================================
    // SITE DISPLAY SETTINGS
    // =========================================================

    Route::get('/site-display-settings', [
        DisplayConfigController::class,
        'show',
    ]);

    // =========================================================
    // ADMIN - DISPLAY SETTINGS
    // =========================================================

    Route::middleware([
        'auth:sanctum',
        'admin.only',
    ])->prefix('admin')->group(function () {

        // Site Display Settings
        Route::get('/site-display-settings', [
            DisplayConfigController::class,
            'show',
        ]);

        Route::put('/site-display-settings', [
            DisplayConfigController::class,
            'update',
        ]);

        Route::post('/site-display-settings/background-image', [
            DisplayConfigController::class,
            'uploadBackgroundImage',
        ]);

        Route::post('/site-display-settings/logo-image', [
            DisplayConfigController::class,
            'uploadLogoImage',
        ]);
    });
});


// =============================================================
// ADMIN API
// =============================================================

Route::middleware('auth:sanctum')
    ->prefix('v1/admin')
    ->group(function () {

        Route::get('/special-section', [
            SpecialSectionApiController::class,
            'show',
        ]);

        Route::post('/special-section', [
            SpecialSectionApiController::class,
            'update',
        ]);
    });


// =============================================================
// ADMIN AUTHENTICATION + MANAGEMENT
// =============================================================

Route::prefix('v1/admin')->group(function () {

    // Login does NOT require authentication
    Route::post('/login', [
        AuthApiController::class,
        'login',
    ]);

    Route::middleware('auth:sanctum')->group(function () {

        // ---------------------------------------------------------
        // Authentication
        // ---------------------------------------------------------

        Route::post('/logout', [
            AuthApiController::class,
            'logout',
        ]);

        Route::post('/logout-all', [
            AuthApiController::class,
            'logoutAll',
        ]);

        Route::get('/me', [
            AuthApiController::class,
            'me',
        ]);

        // ---------------------------------------------------------
        // Dashboard
        // ---------------------------------------------------------

        Route::middleware('api.permission:auth_only')->get(
            '/dashboard',
            [DashboardApiController::class, 'index']
        );

        // ---------------------------------------------------------
        // Users
        // ---------------------------------------------------------

        Route::middleware('api.permission:user_manage_status')->group(function () {

            Route::get('/users', [
                AuthApiController::class,
                'users',
            ]);

            Route::get('/users/{id}', [
                AuthApiController::class,
                'showUser',
            ]);

            Route::post('/users', [
                AuthApiController::class,
                'createUser',
            ]);

            Route::get('/users-logs', [
                AuthApiController::class,
                'logs',
            ]);
        });

        Route::middleware('api.permission:user_edit_status')->group(function () {

            Route::put('/users/{id}', [
                AuthApiController::class,
                'updateUser',
            ]);

            Route::patch('/users/{id}/status', [
                AuthApiController::class,
                'status',
            ]);

            Route::put('/users/{id}/password', [
                AuthApiController::class,
                'updatePassword',
            ]);
        });

        Route::delete('/users/{id}', [
            AuthApiController::class,
            'deleteUser',
        ])->middleware('api.permission:user_delete_status');


        // ---------------------------------------------------------
        // News
        // ---------------------------------------------------------

        Route::middleware('api.permission:add_news_status')->group(function () {

            Route::post('/news', [
                NewsApiController::class,
                'store',
            ]);

            Route::post('/news/editor-upload', [
                NewsApiController::class,
                'editorUpload',
            ]);

            Route::post('/just-now', [
                NewsApiController::class,
                'justNowStore',
            ]);
        });

        Route::middleware('api.permission:manage_news_status')->group(function () {

            Route::get('/news', [
                NewsApiController::class,
                'index',
            ]);

            Route::get('/news/review', [
                NewsApiController::class,
                'review',
            ]);

            Route::get('/news/meta', [
                NewsApiController::class,
                'meta',
            ]);

            Route::get('/news/sub-categories/{categoryId}', [
                NewsApiController::class,
                'subCategories',
            ]);

            Route::get('/news/{id}', [
                NewsApiController::class,
                'show',
            ]);

            Route::put('/news/{id}', [
                NewsApiController::class,
                'update',
            ]);

            Route::delete('/news/{id}', [
                NewsApiController::class,
                'destroy',
            ]);

            Route::post('/news/bulk-delete', [
                NewsApiController::class,
                'bulkDelete',
            ]);

            Route::post('/news/{id}/publish', [
                NewsApiController::class,
                'publish',
            ]);

            Route::post('/news/{id}/unpublish', [
                NewsApiController::class,
                'unpublish',
            ]);

            Route::patch('/news/lead-status', [
                NewsApiController::class,
                'leadStatus',
            ]);

            Route::patch('/news/breaking-status', [
                NewsApiController::class,
                'breakingStatus',
            ]);

            Route::patch('/news/scroller-status', [
                NewsApiController::class,
                'scrollerStatus',
            ]);

            Route::get('/just-now', [
                NewsApiController::class,
                'justNowIndex',
            ]);

            Route::patch('/just-now/status', [
                NewsApiController::class,
                'justNowStatus',
            ]);

            Route::delete('/just-now/{id}', [
                NewsApiController::class,
                'justNowDelete',
            ]);
        });


        // ---------------------------------------------------------
        // Categories
        // ---------------------------------------------------------

        Route::middleware('api.permission:category_status')->group(function () {

            Route::get('/categories', [
                CategoryApiController::class,
                'index',
            ]);

            Route::get('/categories/{id}', [
                CategoryApiController::class,
                'show',
            ]);

            Route::post('/categories', [
                CategoryApiController::class,
                'store',
            ]);

            Route::put('/categories/{id}', [
                CategoryApiController::class,
                'update',
            ]);

            Route::patch('/categories/status', [
                CategoryApiController::class,
                'status',
            ]);

            Route::post('/categories/order', [
                CategoryApiController::class,
                'order',
            ]);

            Route::delete('/categories/{id}', [
                CategoryApiController::class,
                'destroy',
            ]);

            Route::get('/sub-categories', [
                CategoryApiController::class,
                'subCategories',
            ]);

            Route::get('/sub-categories/{id}', [
                CategoryApiController::class,
                'subCategory',
            ]);

            Route::post('/sub-categories', [
                CategoryApiController::class,
                'storeSubCategory',
            ]);

            Route::put('/sub-categories/{id}', [
                CategoryApiController::class,
                'updateSubCategory',
            ]);

            Route::delete('/sub-categories/{id}', [
                CategoryApiController::class,
                'deleteSubCategory',
            ]);
        });


        // ---------------------------------------------------------
        // Ads
        // ---------------------------------------------------------

        Route::middleware('api.permission:ad_manager_status')->group(function () {

            Route::get('/ads', [
                AdApiController::class,
                'index',
            ]);

            Route::patch('/ads/status', [
                AdApiController::class,
                'status',
            ]);

            Route::put('/ads/{id}', [
                AdApiController::class,
                'update',
            ]);

            Route::post('/ads/category', [
                AdApiController::class,
                'createCategoryAd',
            ]);

            Route::patch('/ads/category/status', [
                AdApiController::class,
                'categoryStatus',
            ]);

            Route::delete('/ads/category/{id}', [
                AdApiController::class,
                'deleteCategoryAd',
            ]);

            Route::post('/ads/watermark', [
                AdApiController::class,
                'watermark',
            ]);
        });


        // ---------------------------------------------------------
        // E-Paper
        // ---------------------------------------------------------

        Route::middleware('api.permission:e_paper_status')->group(function () {

            Route::get('/epapers', [
                EPaperApiController::class,
                'index',
            ]);

            Route::post('/epapers', [
                EPaperApiController::class,
                'store',
            ]);

            Route::delete('/epapers/{id}', [
                EPaperApiController::class,
                'destroy',
            ]);
        });


        // ---------------------------------------------------------
        // Gallery / Photos
        // ---------------------------------------------------------

        Route::middleware('api.permission:photo_status')->group(function () {

            Route::get('/photos', [
                GalleryApiController::class,
                'index',
            ]);

            Route::get('/photos/{id}', [
                GalleryApiController::class,
                'show',
            ]);

            Route::post('/photos', [
                GalleryApiController::class,
                'store',
            ]);

            Route::put('/photos/{id}', [
                GalleryApiController::class,
                'update',
            ]);

            Route::delete('/photos/{id}', [
                GalleryApiController::class,
                'destroy',
            ]);
        });


        // ---------------------------------------------------------
        // Video
        // ---------------------------------------------------------

        Route::middleware('api.permission:video_status')->group(function () {

            Route::get('/videos', [
                VideoApiController::class,
                'index',
            ]);

            Route::get('/videos/{id}', [
                VideoApiController::class,
                'show',
            ]);

            Route::post('/videos', [
                VideoApiController::class,
                'store',
            ]);

            Route::put('/videos/{id}', [
                VideoApiController::class,
                'update',
            ]);

            Route::delete('/videos/{id}', [
                VideoApiController::class,
                'destroy',
            ]);
        });


        // ---------------------------------------------------------
        // Live Video
        // ---------------------------------------------------------

        Route::middleware('api.permission:live_status')->group(function () {

            Route::get('/live-video', [
                VideoApiController::class,
                'liveShow',
            ]);

            Route::put('/live-video', [
                VideoApiController::class,
                'liveUpdate',
            ]);

            Route::patch('/live-video/status', [
                VideoApiController::class,
                'liveStatus',
            ]);
        });


        // ---------------------------------------------------------
        // News Family
        // ---------------------------------------------------------

        Route::middleware('api.permission:manage_news_status')->group(function () {

            Route::get('/news-family', [
                NewsFamilyApiController::class,
                'index',
            ]);

            Route::get('/news-family/{id}', [
                NewsFamilyApiController::class,
                'show',
            ]);

            Route::post('/news-family', [
                NewsFamilyApiController::class,
                'store',
            ]);

            Route::put('/news-family/{id}', [
                NewsFamilyApiController::class,
                'update',
            ]);

            Route::patch('/news-family/status', [
                NewsFamilyApiController::class,
                'status',
            ]);

            Route::delete('/news-family/{id}', [
                NewsFamilyApiController::class,
                'destroy',
            ]);

            Route::get('/top-five', [
                TopFiveApiController::class,
                'index',
            ]);

            Route::get('/top-five/{slotId}/news', [
                TopFiveApiController::class,
                'news',
            ]);

            Route::put('/top-five/{id}', [
                TopFiveApiController::class,
                'update',
            ]);

            Route::patch('/top-five/scroller-status', [
                TopFiveApiController::class,
                'scrollerStatus',
            ]);
        });


        // ---------------------------------------------------------
        // Site Settings / Writer Desk
        // ---------------------------------------------------------

        Route::middleware('api.permission:footer_status')->group(function () {

            Route::get('/app-settings', [
                OthersApiController::class,
                'appSettings',
            ]);

            Route::put('/app-settings', [
                OthersApiController::class,
                'updateAppSettings',
            ]);

            Route::get('/social-media', [
                OthersApiController::class,
                'socialMedia',
            ]);

            Route::put('/social-media', [
                OthersApiController::class,
                'updateSocialMedia',
            ]);

            Route::get('/footer', [
                OthersApiController::class,
                'footer',
            ]);

            Route::put('/footer', [
                OthersApiController::class,
                'updateFooter',
            ]);

            Route::get('/writer-desks', [
                OthersApiController::class,
                'writerDesks',
            ]);

            Route::post('/writer-desks', [
                OthersApiController::class,
                'createWriterDesk',
            ]);

            Route::put('/writer-desks/{id}', [
                OthersApiController::class,
                'updateWriterDesk',
            ]);

            Route::delete('/writer-desks/{id}', [
                OthersApiController::class,
                'deleteWriterDesk',
            ]);

            Route::get('/reporters', [
                OthersApiController::class,
                'reporters',
            ]);
        });


        // ---------------------------------------------------------
        // Sections
        // ---------------------------------------------------------

        Route::middleware('api.permission:auth_only')->group(function () {

            Route::get('/sections/category/{catId}/lead', [
                SectionApiController::class,
                'categoryLead',
            ]);

            Route::get('/sections/category/{catId}/sub-news', [
                SectionApiController::class,
                'categorySubNews',
            ]);

            Route::get('/sections/sub-lead', [
                SectionApiController::class,
                'subLead',
            ]);
        });
    });
});