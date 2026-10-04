<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveVideo extends Model
{
    use HasFactory;
    protected $fillable = [
        'live_video_link',
        'live_title',
        'status',
    ];
}
