<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdManager extends Model
{
    use HasFactory;
    protected $fillable = [
        'ad_position',
        'ad_image',
        'ad_image_file',
        'status',
        'company_link',
        'cat_order',
    ];
}
