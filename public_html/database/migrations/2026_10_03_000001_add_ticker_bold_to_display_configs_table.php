<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->boolean('ticker_bold')->default(true)->after('ticker_text');
        });
    }

    public function down(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->dropColumn('ticker_bold');
        });
    }
};
