<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopFiveNews extends Model
{
    use HasFactory;
    protected $fillable = [
        'news_id',
    ];
}
