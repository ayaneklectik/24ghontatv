<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_log extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'user_ip',
        'browser',
        'device_name',
        'os',
        'created_at',
    ];

    // Reletions 3
 public function user() {
     return $this->belongsTo(User::class,  'user_id', 'id');
 }
}
