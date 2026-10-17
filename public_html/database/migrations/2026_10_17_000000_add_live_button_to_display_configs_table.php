<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->boolean('live_button_enabled')->default(false);
            $table->string('live_button_label', 80)->default('LIVE');
            $table->text('live_button_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('display_configs', function (Blueprint $table) {
            $table->dropColumn(['live_button_enabled', 'live_button_label', 'live_button_url']);
        });
    }
};
