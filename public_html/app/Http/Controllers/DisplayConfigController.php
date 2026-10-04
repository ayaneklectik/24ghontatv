<?php

namespace App\Http\Controllers;

use App\Models\DisplayConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DisplayConfigController extends Controller
{
    public function show(): JsonResponse
    {
        $config = DisplayConfig::query()->first();
        $data = array_merge(DisplayConfig::defaults(), $config?->only(array_keys(DisplayConfig::defaults())) ?? []);

        return response()->json([
            'data' => $this->toContract($data),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'showBengaliDate' => ['sometimes', 'boolean'],
            'breakingTicker' => ['required', 'array:enabled,text,bold,textColor,backgroundColor,speedSeconds'],
            'breakingTicker.enabled' => ['required', 'boolean'],
            'breakingTicker.text' => ['required', 'string', 'max:500'],
            'breakingTicker.bold' => ['required', 'boolean'],
            'breakingTicker.textColor' => ['required', 'string', 'regex:/\A#[0-9A-Fa-f]{6}\z/'],
            'breakingTicker.backgroundColor' => ['required', 'string', 'regex:/\A#[0-9A-Fa-f]{6}\z/'],
            'breakingTicker.speedSeconds' => ['required', 'integer', 'min:10', 'max:200'],
            'headerAppearance' => ['required', 'array:preset,backgroundColor,backgroundImageUrl,logoImageUrl,textColor,secondaryTextColor,backgroundBlur'],
            'headerAppearance.preset' => ['required', 'string', 'in:default,classic,eid,festive,midnight,custom,modern'],
            'headerAppearance.backgroundColor' => ['required', 'string', 'regex:/\A#[0-9A-Fa-f]{6}\z/'],
            'headerAppearance.backgroundImageUrl' => ['sometimes', 'nullable', 'string'],
            'headerAppearance.logoImageUrl' => ['sometimes', 'nullable', 'string'],
            'headerAppearance.textColor' => ['required', 'string', 'regex:/\A#[0-9A-Fa-f]{6}\z/'],
            'headerAppearance.secondaryTextColor' => ['required', 'string', 'regex:/\A#[0-9A-Fa-f]{6}\z/'],
            'headerAppearance.backgroundBlur' => ['required', 'integer', 'min:0', 'max:10'],
        ]);

        $config = DisplayConfig::query()->first();
        $attributes = array_merge(DisplayConfig::defaults(), $config?->only(array_keys(DisplayConfig::defaults())) ?? []);
        $attributes = array_merge(
            $attributes,
            $this->fromContract($validated, (bool) $attributes['show_bengali_date'])
        );
        $imageToDelete = null;
        $logoToDelete = null;

        if (array_key_exists('backgroundImageUrl', $validated['headerAppearance'])
            && $validated['headerAppearance']['backgroundImageUrl'] === null) {
            $imageToDelete = $attributes['header_background_image'];
            $attributes['header_background_image'] = null;
        }

        if (array_key_exists('logoImageUrl', $validated['headerAppearance'])
            && $validated['headerAppearance']['logoImageUrl'] === null) {
            $logoToDelete = $attributes['header_logo_image'];
            $attributes['header_logo_image'] = null;
        }

        if ($config) {
            $config->update($attributes);
        } else {
            $config = DisplayConfig::query()->create($attributes);
        }

        if ($imageToDelete) {
            Storage::disk('public')->delete($imageToDelete);
        }
        if ($logoToDelete) {
            Storage::disk('public')->delete($logoToDelete);
        }

        $data = array_merge(DisplayConfig::defaults(), $config->only(array_keys(DisplayConfig::defaults())));

        return response()->json([
            'message' => 'Display configuration updated.',
            'data' => $this->toContract($data),
        ]);
    }

    public function uploadBackgroundImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'background_image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $newImage = $validated['background_image']->store('header-backgrounds', 'public');
        if ($newImage === false) {
            return response()->json(['message' => 'Unable to save the header background image.'], 500);
        }

        $config = DisplayConfig::query()->first();
        $attributes = array_merge(DisplayConfig::defaults(), $config?->only(array_keys(DisplayConfig::defaults())) ?? []);
        $oldImage = $attributes['header_background_image'];
        $attributes['header_background_image'] = $newImage;

        if ($config) {
            $config->update(['header_background_image' => $newImage]);
        } else {
            $config = DisplayConfig::query()->create($attributes);
        }

        if ($oldImage && $oldImage !== $newImage) {
            Storage::disk('public')->delete($oldImage);
        }

        return response()->json([
            'data' => [
                'backgroundImageUrl' => Storage::disk('public')->url($newImage),
            ],
        ]);
    }

    public function uploadLogoImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'logo_image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048', 'dimensions:max_width=2000,max_height=1000'],
        ]);

        $newLogo = $validated['logo_image']->store('header-logos', 'public');
        if ($newLogo === false) {
            return response()->json(['message' => 'Unable to save the header logo image.'], 500);
        }

        $config = DisplayConfig::query()->first();
        $attributes = array_merge(DisplayConfig::defaults(), $config?->only(array_keys(DisplayConfig::defaults())) ?? []);
        $oldLogo = $attributes['header_logo_image'];
        $attributes['header_logo_image'] = $newLogo;

        if ($config) {
            $config->update(['header_logo_image' => $newLogo]);
        } else {
            $config = DisplayConfig::query()->create($attributes);
        }

        if ($oldLogo && $oldLogo !== $newLogo) {
            Storage::disk('public')->delete($oldLogo);
        }

        return response()->json([
            'data' => [
                'logoImageUrl' => Storage::disk('public')->url($newLogo),
            ],
        ]);
    }

    private function toContract(array $data): array
    {
        return [
            'showBengaliDate' => $data['show_bengali_date'],
            'breakingTicker' => [
                'enabled' => $data['ticker_enabled'],
                'text' => $data['ticker_text'],
                'bold' => $data['ticker_bold'],
                'textColor' => $data['ticker_text_color'],
                'backgroundColor' => $data['ticker_background_color'],
                'speedSeconds' => $data['ticker_speed'],
            ],
            'headerAppearance' => [
                'preset' => $data['header_design'],
                'backgroundColor' => $data['header_background_color'],
                'backgroundImageUrl' => $data['header_background_image']
                    ? Storage::disk('public')->url($data['header_background_image'])
                    : null,
                'logoImageUrl' => $data['header_logo_image']
                    ? Storage::disk('public')->url($data['header_logo_image'])
                    : null,
                'textColor' => $data['header_text_color'],
                'secondaryTextColor' => $data['header_secondary_text_color'],
                'backgroundBlur' => $data['header_background_blur'],
            ],
        ];
    }

    private function fromContract(array $validated, bool $currentShowBengaliDate): array
    {
        return [
            'show_bengali_date' => $validated['showBengaliDate'] ?? $currentShowBengaliDate,
            'ticker_enabled' => $validated['breakingTicker']['enabled'],
            'ticker_text' => $validated['breakingTicker']['text'],
            'ticker_bold' => $validated['breakingTicker']['bold'],
            'ticker_text_color' => $validated['breakingTicker']['textColor'],
            'ticker_background_color' => $validated['breakingTicker']['backgroundColor'],
            'ticker_speed' => $validated['breakingTicker']['speedSeconds'],
            'header_design' => $validated['headerAppearance']['preset'],
            'header_background_color' => $validated['headerAppearance']['backgroundColor'],
            'header_text_color' => $validated['headerAppearance']['textColor'],
            'header_secondary_text_color' => $validated['headerAppearance']['secondaryTextColor'],
            'header_background_blur' => $validated['headerAppearance']['backgroundBlur'],
        ];
    }
}
