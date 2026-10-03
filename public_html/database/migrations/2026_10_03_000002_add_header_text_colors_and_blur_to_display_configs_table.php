<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->string('header_text_color', 7)->default('#1F2937');
            $table->string('header_secondary_text_color', 7)->default('#6B7280');
            $table->unsignedTinyInteger('header_background_blur')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->dropColumn([
                'header_text_color',
                'header_secondary_text_color',
                'header_background_blur',
            ]);
        });
    }
};
