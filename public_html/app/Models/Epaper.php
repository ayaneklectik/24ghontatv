<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Epaper extends Model
{
    use HasFactory;
    protected $fillable = [
        'pub_date',
        'epaper',
    ];
}
