<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsJustNow extends Model
{
    use HasFactory;
    protected $fillable = [
        'news_title',
        'news_url',
        'published_date',
        'user',
        'status',
    ];
}
