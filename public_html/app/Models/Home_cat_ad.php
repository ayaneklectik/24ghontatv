<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Home_cat_ad extends Model
{
    use HasFactory;
    protected $fillable = [
        'status',
        'ad_position',
        'ad_image_file',
        'ad_image',
        'company_link',
        'cat_order',
    ];
}
