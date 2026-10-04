<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisplayConfig extends Model
{
    protected $fillable = [
        'ticker_enabled',
        'ticker_text',
        'ticker_bold',
        'ticker_text_color',
        'ticker_background_color',
        'ticker_speed',
        'header_design',
        'header_background_color',
        'header_background_image',
        'header_logo_image',
        'header_text_color',
        'header_secondary_text_color',
        'header_background_blur',
        'show_bengali_date',
    ];

    protected $casts = [
        'ticker_enabled' => 'boolean',
        'ticker_bold' => 'boolean',
        'ticker_speed' => 'integer',
        'header_background_blur' => 'integer',
        'show_bengali_date' => 'boolean',
    ];

    public static function defaults(): array
    {
        return [
            'ticker_enabled' => false,
            'ticker_text' => '',
            'ticker_bold' => true,
            'ticker_text_color' => '#FFFFFF',
            'ticker_background_color' => '#D90000',
            'ticker_speed' => 60,
            'header_design' => 'default',
            'header_background_color' => '#FFFFFF',
            'header_background_image' => null,
            'header_logo_image' => null,
            'header_text_color' => '#1F2937',
            'header_secondary_text_color' => '#6B7280',
            'header_background_blur' => 0,
            'show_bengali_date' => true,
        ];
    }
}
