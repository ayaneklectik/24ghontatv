<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'add_news_status',
        'manage_news_status',
        'category_status',
        'just_nows_status',
        'video_status',
        'photo_status',
        'ad_manager_status',
        'e_paper_status',
        'live_status',
        'user_manage_status',
        'footer_status',
        'user_edit_status',
        'user_delete_status',
    ];
}
