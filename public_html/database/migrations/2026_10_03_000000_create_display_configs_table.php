<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('display_configs', function (Blueprint $table) {
            $table->id();
            $table->boolean('ticker_enabled')->default(false);
            $table->string('ticker_text', 500)->default('');
            $table->string('ticker_text_color', 7)->default('#FFFFFF');
            $table->string('ticker_background_color', 7)->default('#D90000');
            $table->unsignedSmallInteger('ticker_speed')->default(60);
            $table->string('header_design', 32)->default('default');
            $table->string('header_background_color', 7)->default('#FFFFFF');
            $table->string('header_background_image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('display_configs');
    }
};
