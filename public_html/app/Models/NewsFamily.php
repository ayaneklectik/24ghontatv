<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsFamily extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'contact',
        'address',
        'position',
        'photo',
        'status',
    ];
}
