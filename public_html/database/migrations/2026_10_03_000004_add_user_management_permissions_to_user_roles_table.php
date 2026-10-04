<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_roles', function (Blueprint $table) {
            if (!Schema::hasColumn('user_roles', 'user_edit_status')) {
                $table->tinyInteger('user_edit_status')->default(0);
            }
            if (!Schema::hasColumn('user_roles', 'user_delete_status')) {
                $table->tinyInteger('user_delete_status')->default(0);
            }
        });

        DB::table('user_roles')
            ->join('users', 'users.id', '=', 'user_roles.user_id')
            ->update([
                'user_roles.user_edit_status' => DB::raw('users.user_edit_status'),
                'user_roles.user_delete_status' => DB::raw('users.user_delete_status'),
            ]);
    }

    public function down(): void
    {
        $columns = array_values(array_filter(
            ['user_edit_status', 'user_delete_status'],
            fn (string $column): bool => Schema::hasColumn('user_roles', $column),
        ));

        if ($columns) {
            Schema::table('user_roles', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};
