<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(
            'ALTER TABLE `news_tables` MODIFY `news_sub_title` TEXT NULL'
        );
    }

    public function down(): void
    {
        if (DB::table('news_tables')->whereRaw('CHAR_LENGTH(`news_sub_title`) > 50')->exists()) {
            throw new RuntimeException(
                'Cannot shrink news_sub_title to 50 characters while longer summaries exist.'
            );
        }

        DB::statement(
            'ALTER TABLE `news_tables` MODIFY `news_sub_title` VARCHAR(50) NULL'
        );
    }
};
