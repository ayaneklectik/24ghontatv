<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsTable extends Model
{
    use HasFactory;
    protected $fillable = [
        'news_id',
        'news_title',
        'news_sub_title',
        'title_link',
        'dis',
        'cat',
        'sub_cat',
        'extra_cat',
        'published_date',
        'islead',
        'isbreaking',
        'published_time',
        'writer_desk',
        'representative',
        'representative_loc',
        'writer_desk_show',
        'image',
        'image_title',
        'hit',
        'user',
        'status',
        'meta_keyword',
        'meta_description',
        'title_color',
        'sub_title_color',
        'imageUpload',
        'base64image',
    ];

    public function userModel()
    {
        return $this->belongsTo(User::class, 'user', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'cat', 'id');
    }
}
