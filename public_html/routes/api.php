<?php

use App\Http\Controllers\DisplayConfigController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PublicApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/home', [PublicApiController::class, 'home']);
    Route::get('/news/{id}', [PublicApiController::class, 'showNews'])->whereNumber('id');
    Route::get('/site-display-settings', [DisplayConfigController::class, 'show']);

    Route::middleware(['auth:sanctum', 'admin.only'])->prefix('admin')->group(function () {
        Route::put('/news/{id}', [NewsController::class, 'UpdateNews'])->whereNumber('id');
        Route::get('/site-display-settings', [DisplayConfigController::class, 'show']);
        Route::put('/site-display-settings', [DisplayConfigController::class, 'update']);
        Route::post('/site-display-settings/background-image', [DisplayConfigController::class, 'uploadBackgroundImage']);
        Route::POST('/site-display-settings/logo-image', [DisplayConfigController::class, 'uploadLogoImage']);
    });
});
