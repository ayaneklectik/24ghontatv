<?php
namespace App\Http\Controllers;

use App\Models\AdManager;
use App\Models\App_setting;
use App\Models\Category;
use App\Models\Home_cat_ad;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AdController extends Controller
{
    // public function AdManager(){
    //     $data['title']= "AD Manager";
    //     $data['app']= App_setting::find(1);
    //     $data['ads']= AdManager::all();
    //     $data['cats']= Category::select('*')->where('cat_order', '!=', 1 )->orderBy('cat_order', 'ASC')->get();
    //     $data['cat_ads']= Home_cat_ad::all();
    //     return view('admin.ads.ad_manager', $data);
    // }

    /**
     * Advertisement manager page.
     */
    public function AdManager()
    {
        $data = [
            'title'   => 'AD Manager',

            'app'     => App_setting::query()
                ->select([
                    'id',
                    'app_title',
                    'contact',
                    'email',
                    'address',
                    'logo_img',
                    // এখানে আপনার প্রয়োজনীয় app_settings columns দিন
                ])
                ->find(1),

            'ads'     => AdManager::query()
                ->select([
                    'id',
                    'ad_position',
                    'ad_image',
                    'company_link',
                    'status',
                ])
                ->orderBy('id')
                ->get(),

            'cats'    => Category::query()
                ->select([
                    'id',
                    'cat_name',
                    'cat_short_dis',
                    'status',
                    'cat_order',
                ])
                ->where('cat_order', '!=', 1)
                ->orderBy('cat_order')
                ->get(),

            'cat_ads' => Home_cat_ad::query()
                ->select([
                    'id',
                    'status',
                    'ad_position',
                    'ad_image',
                    'company_link',
                ])
                ->orderBy('ad_position')
                ->orderBy('id')
                ->get(),
        ];

        return view('admin.ads.ad_manager', $data);
    }

    // public function AdStatusUpdate(Request $request){
    //     $status = $request->input('status');
    //     $id = $request->input('id');
    //     //return response()->json(['message' => $id]);
    //     try {
    //     $news = AdManager:: select('*')->where('id', $id)->first();
    //     $news->update([
    //       "status" => $status,
    //     ]);
    //     } catch(Exception $e){
    //       $this->setErrorMsg($e->getMessage());
    //       return redirect()->back();
    //     }

    //   }

    /**
     * Update main advertisement status.
     */
    public function AdStatusUpdate(Request $request): RedirectResponse | JsonResponse
    {
        $validated = $request->validate([
            'id'     => ['required', 'integer', 'exists:ad_managers,id'],
            'status' => ['required', 'boolean'],
        ]);

        try {
            $updated = AdManager::query()
                ->whereKey($validated['id'])
                ->update([
                    'status' => $validated['status'],
                ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Advertisement status updated successfully.',
                    'updated' => (bool) $updated,
                ]);
            }

            return redirect()
                ->route('ad-manager')
                ->with('message', 'Advertisement status updated successfully.')
                ->with('msg_type', 'success');

        } catch (Throwable $e) {
            report($e);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to update advertisement status.',
                ], 500);
            }

            return back()
                ->with('message', 'Unable to update advertisement status.')
                ->with('msg_type', 'error');
        }
    }

    // public function UpdateAd($id, Request $request){
    //   $imageName = $request->input('ad_image');
    //   try {
    //   if(!empty($request->ad_image_file)){
    //       $file = $request->file('ad_image_file');
    //       $extenstion = $file->getClientOriginalExtension();
    //       $request->ad_image_file->move(public_path('images/ad/'), $imageName.".".$extenstion);

    //       $news = AdManager:: select('*')->where('id', $id)->first();
    //       $news->update([
    //         "ad_image" => $imageName.".".$extenstion,
    //         "company_link" => trim($request->input('company_link'))
    //       ]);

    //       return redirect()->route('ad-manager')
    //       ->with('massage', 'Update Successfully')
    //       ->with('msg_type', 'success');
    //     }else{
    //       $news = AdManager:: select('*')->where('id', $id)->first();
    //       $news->update([
    //         "company_link" => trim($request->input('company_link'))
    //       ]);

    //       return redirect()->route('ad-manager')
    //       ->with('massage', 'Update Successfully')
    //       ->with('msg_type', 'success');
    //     }

    //   } catch(Exception $e){
    //       $this->setErrorMsg($e->getMessage());
    //       return redirect()->back();
    //     }
    // }

    /**
     * Update advertisement.
     */
    public function UpdateAd(Request $request, int $id): RedirectResponse
    {
        $ad = AdManager::query()->findOrFail($id);

        $validated = $request->validate([
            'ad_image'      => [
                'nullable',
                'string',
                'max:150',
                'regex:/^[a-zA-Z0-9_-]+$/',
            ],

            'ad_image_file' => [
                'nullable',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'company_link'  => [
                'nullable',
                'url:http,https',
                'max:4096',
            ],
        ]);

        try {
            DB::transaction(function () use ($request, $validated, $ad) {

                $updateData = [
                    'company_link' => isset($validated['company_link'])
                        ? trim($validated['company_link'])
                        : null,
                ];

                if ($request->hasFile('ad_image_file')) {

                    $file = $request->file('ad_image_file');

                    $extension = strtolower(
                        $file->getClientOriginalExtension()
                    );

                    $filename = 'ad-' . $ad->id . '-' . uniqid() . '.' . $extension;

                    $path = $file->storeAs(
                        'ads',
                        $filename,
                        'public'
                    );

                    // Delete old image
                    if (! empty($ad->ad_image)) {
                        $this->deleteAdImage($ad->ad_image);
                    }

                    $updateData['ad_image'] = $filename;
                }

                $ad->update($updateData);
            });

            return redirect()
                ->route('ad-manager')
                ->with('message', 'Advertisement updated successfully.')
                ->with('msg_type', 'success');

        } catch (Throwable $e) {

            report($e);

            return back()
                ->withInput()
                ->with('message', 'Unable to update advertisement.')
                ->with('msg_type', 'error');
        }
    }

    // public function insertCatAd(Request $request){
    //   $cat_ad = Home_cat_ad::all();
    //   $imageName = "cat-ad-image-". $cat_ad->count()+1;
    //   try {
    //   if(!empty($request->ad_cat_image_file)){
    //     $file = $request->file('ad_cat_image_file');
    //       $extenstion = $file->getClientOriginalExtension();
    //       $request->ad_cat_image_file->move(public_path('images/ad/'), $imageName.".".$extenstion);

    //       Home_cat_ad::create([
    //         'status' => 1,
    //         'ad_position' => $request->input('cat_order'),
    //         'ad_image' => $imageName.".".$extenstion,
    //         "company_link" => trim($request->input('company_link'))
    //       ]);

    //       return redirect()->route('ad-manager')
    //       ->with('massage', 'Create Successfully')
    //       ->with('msg_type', 'success');
    //     }else{
    //       return redirect()->route('ad-manager')
    //       ->with('massage', 'Not uploaded')
    //       ->with('msg_type', 'error');

    //     }

    //   } catch(Exception $e){
    //       $this->setErrorMsg($e->getMessage());
    //       return redirect()->back();
    //     }
    // }

    /**
     * Create category advertisement.
     */
    public function insertCatAd(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cat_order'         => [
                'required',
                'integer',
            ],

            'ad_cat_image_file' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'company_link'      => [
                'nullable',
                'url:http,https',
                'max:4096',
            ],
        ]);

        try {

            $file = $request->file('ad_cat_image_file');

            $extension = strtolower(
                $file->getClientOriginalExtension()
            );

            $ad = Home_cat_ad::create([
                'status'       => 1,
                'ad_position'  => $validated['cat_order'],
                'ad_image'     => null,
                'company_link' => isset($validated['company_link'])
                    ? trim($validated['company_link'])
                    : null,
            ]);

            $filename = 'cat-ad-' . $ad->id . '-' . uniqid() . '.' . $extension;

            $file->storeAs(
                'ads/category',
                $filename,
                'public'
            );

            $ad->update([
                'ad_image' => $filename,
            ]);

            return redirect()
                ->route('ad-manager')
                ->with('message', 'Category advertisement created successfully.')
                ->with('msg_type', 'success');

        } catch (Throwable $e) {

            report($e);

            return back()
                ->withInput()
                ->with('message', 'Unable to create category advertisement.')
                ->with('msg_type', 'error');
        }
    }

    // public function CatAdStatusUpdate(Request $request)
    // {
    //     $status = $request->input('status');
    //     $id     = $request->input('id');
    //     //return response()->json(['message' => $id]);
    //     try {
    //         $news = Home_cat_ad::select('*')->where('id', $id)->first();
    //         $news->update([
    //             "status" => $status,
    //         ]);
    //     } catch (Exception $e) {
    //         $this->setErrorMsg($e->getMessage());
    //         return redirect()->back();
    //     }

    // }

     /**
     * Update category advertisement status.
     */
    public function CatAdStatusUpdate(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'id' => [
                'required',
                'integer',
                'exists:home_cat_ads,id',
            ],

            'status' => [
                'required',
                'boolean',
            ],
        ]);

        try {

            $updated = Home_cat_ad::query()
                ->whereKey($validated['id'])
                ->update([
                    'status' => $validated['status'],
                ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Category advertisement status updated successfully.',
                    'updated' => (bool) $updated,
                ]);
            }

            return redirect()
                ->route('ad-manager')
                ->with('message', 'Category advertisement status updated successfully.')
                ->with('msg_type', 'success');

        } catch (Throwable $e) {

            report($e);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to update advertisement status.',
                ], 500);
            }

            return back()
                ->with('message', 'Unable to update advertisement status.')
                ->with('msg_type', 'error');
        }
    }

    // public function CatAdDelete($id)
    // {
    //     try {
    //         $ad = Home_cat_ad::select('*')->where('id', $id)->first();
    //         $ad->delete();

    //         return redirect()->route('ad-manager')
    //             ->with('massage', 'Delete Successfully')
    //             ->with('msg_type', 'error');
    //     } catch (Exception $e) {
    //         $this->setErrorMsg($e->getMessage());
    //         return redirect()->back();
    //     }

    // }

        /**
     * Delete category advertisement.
     */
    public function CatAdDelete(int $id): RedirectResponse
    {
        try {

            $ad = Home_cat_ad::query()->findOrFail($id);

            if (!empty($ad->ad_image)) {
                $this->deleteAdImage($ad->ad_image);
            }

            $ad->delete();

            return redirect()
                ->route('ad-manager')
                ->with('message', 'Category advertisement deleted successfully.')
                ->with('msg_type', 'success');

        } catch (Throwable $e) {

            report($e);

            return back()
                ->with('message', 'Unable to delete advertisement.')
                ->with('msg_type', 'error');
        }
    }

    // public function FbPostAd(Request $request)
    // {
    //     if (! empty($request->fb_ad)) {
    //         try {
    //             $file       = $request->file('fb_ad');
    //             $extenstion = $file->getClientOriginalExtension();
    //             $request->fb_ad->move(public_path('images/logos/'), "wm_logo.png");

    //             return redirect()->route('ad-manager')
    //                 ->with('massage', 'Update Successfully')
    //                 ->with('msg_type', 'success');
    //         } catch (Exception $e) {
    //             $this->setErrorMsg($e->getMessage());
    //             return redirect()->back();
    //         }
    //     } else {
    //         return redirect()->route('ad-manager')
    //             ->with('massage', 'image not Uploaded')
    //             ->with('msg_type', 'error');
    //     }
    // }

     /**
     * Update Facebook post advertisement/logo.
     */
    public function FbPostAd(Request $request): RedirectResponse
    {
        $request->validate([
            'fb_ad' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);

        try {

            $file = $request->file('fb_ad');

            $file->storeAs(
                'logos',
                'wm_logo.png',
                'public'
            );

            return redirect()
                ->route('ad-manager')
                ->with('message', 'Facebook advertisement image updated successfully.')
                ->with('msg_type', 'success');

        } catch (Throwable $e) {

            report($e);

            return back()
                ->with('message', 'Unable to upload image.')
                ->with('msg_type', 'error');
        }
    }

         /**
     * Delete advertisement image from public disk.
     */
    private function deleteAdImage(?string $filename): void
    {
        if (empty($filename)) {
            return;
        }

        // New storage location
        Storage::disk('public')->delete([
            'ads/' . $filename,
            'ads/category/' . $filename,
        ]);

        // Remove old images from public/images/ad if they still exist.
        $oldPath = public_path('images/ad/' . $filename);

        if (is_file($oldPath)) {
            @unlink($oldPath);
        }
    }
}
