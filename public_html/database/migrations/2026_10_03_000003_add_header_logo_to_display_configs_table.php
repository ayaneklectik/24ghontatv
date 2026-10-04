<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->string('header_logo_image')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->dropColumn('header_logo_image');
        });
    }
};
