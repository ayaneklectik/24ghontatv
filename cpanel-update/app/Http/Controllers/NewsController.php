<?php
namespace App\Http\Controllers;

use App\Models\App_setting;
use App\Models\Category;
use App\Models\HideNewsScroller;
use App\Models\NewsJustNow;
use App\Models\NewsTable;
use App\Models\SubCategory;
use App\Models\TopFiveNews;
use App\Models\WriterDesk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Throwable;

class NewsController extends Controller
{

    /**
     * News bulk delete.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array', 'min:1', 'max:500'],
            'ids.*' => ['required', 'integer', 'distinct'],
        ]);

        try {
            $newsList = NewsTable::query()
                ->select([
                    'id',
                    'image',
                ])
                ->whereIn('id', $validated['ids'])
                ->get();

            if ($newsList->isEmpty()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'No news found.',
                ], 404);
            }

            foreach ($newsList as $news) {
                $this->deleteNewsImages($news->image);
            }

            NewsTable::query()
                ->whereIn('id', $newsList->pluck('id'))
                ->delete();

            return response()->json([
                'status'  => true,
                'message' => $newsList->count() . ' news deleted successfully.',
            ]);

        } catch (Throwable $e) {

            report($e);

            return response()->json([
                'status'  => false,
                'message' => 'Unable to delete news.',
            ], 500);
        }
    }

    /**
     * Add news form.
     */
    public function AddNewNews()
    {
        $data = [
            'title' => 'News',

            'app'   => App_setting::query()->find(1),

            'cats'  => Category::query()
                ->select([
                    'id',
                    'cat_name',
                    'cat_short_dis',
                    'ad_cat_image_file',
                    'status',
                    'cat_order',
                ])
                ->orderBy('cat_order')
                ->get(),

            'desks' => WriterDesk::query()
                ->select([
                    'id',
                    'writer_desk',
                ])
                ->get(),
        ];

        return view('admin.news.add_new_news', $data);
    }


        /**
     * Load sub categories.
     */
    public function LoadSubCatAjax(int $id)
    {
        $data['subcats'] = SubCategory::query()
            ->select([
                'id',
                'cat_id',
                'sub_cat_name',
            ])
            ->where('cat_id', $id)
            ->orderBy('id')
            ->get();

        return view('admin.news.load_sub_cat_ajax', $data);
    }


    /**
     * Insert news.
     */
    public function insertNews(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'news_title' => [
                'required',
                'string',
                'max:500',
            ],

            'news_sub_title' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'dis' => [
                'nullable',
                'string',
            ],

            'cat' => [
                'required',
                'integer',
            ],

            'sub_cat' => [
                'nullable',
                'integer',
            ],

            'extra_cat' => [
                'nullable',
                'array',
            ],

            'extra_cat.*' => [
                'integer',
            ],

            'published_date' => [
                'required',
                'date',
            ],

            'writer_desk' => [
                'nullable',
                'integer',
            ],

            'representative' => [
                'nullable',
                'string',
                'max:255',
            ],

            'representative_loc' => [
                'nullable',
                'string',
                'max:255',
            ],

            'writer_desk_show' => [
                'nullable',
                'boolean',
            ],

            'islead' => [
                'nullable',
                'boolean',
            ],

            'isbreaking' => [
                'nullable',
                'boolean',
            ],

            'status' => [
                'nullable',
                'boolean',
            ],

            'image_title' => [
                'nullable',
                'string',
                'max:500',
            ],

            'meta_keyword' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'meta_description' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'title_color' => [
                'nullable',
                'string',
                'max:50',
            ],

            'sub_title_color' => [
                'nullable',
                'string',
                'max:50',
            ],

            'imageUpload' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'base64image' => [
                'nullable',
                'string',
            ],
        ]);

        try {

            $publishedDate = Carbon::parse(
                $validated['published_date']
            );

            /*
             * Do not allow future publication date.
             */
            if ($publishedDate->isFuture()) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Published Date is not correct.',
                    ], 422);
                }

                return back()
                    ->withInput()
                    ->with('massage', 'Published Date is not correct.')
                    ->with('msg_type', 'error');
            }

            $user = auth()->user();

            /*
             * Existing application logic:
             * Admin = 1
             * Other users = 0
             */
            $newsStatus = $user?->user_type === 'Admin' ? 1 : 0;

            /*
             * Generate unique image filename.
             */
            $newsImage = 'webnews24_' . Str::uuid() . '.jpg';

            /*
             * Process image.
             */
            if ($request->hasFile('imageUpload')) {

                $this->processNewsImage(
                    $request,
                    $newsImage
                );
            }

            /*
             * Generate title slug.
             */
            $titleLink = Str::slug(
                $validated['news_title']
            );

            /*
             * If Bengali/non-Latin title produces empty slug.
             */
            if (empty($titleLink)) {
                $titleLink = 'news-' . time();
            }

            $data = [
                'news_id' => random_int(100000, 999999999),
                'news_title' => trim($validated['news_title']),
                'news_sub_title' => isset($validated['news_sub_title'])
                    ? trim($validated['news_sub_title'])
                    : null,

                'title_link' => $titleLink,
                'dis' => $validated['dis'] ?? null,
                'cat' => $validated['cat'],
                'sub_cat' => $validated['sub_cat'] ?? null,
                'extra_cat' => !empty($validated['extra_cat'])
                    ? implode(',', $validated['extra_cat'])
                    : null,
                'islead' => $validated['islead'] ?? 0,
                'isbreaking' => $validated['isbreaking'] ?? 0,
                'published_date' => $publishedDate->format('Y-m-d'),
                'published_time' => now()->format('h:i:s A'),
                'writer_desk' => $validated['writer_desk'] ?? null,
                'representative' => $validated['representative'] ?? null,
                'representative_loc' => $validated['representative_loc'] ?? null,
                'writer_desk_show' => !empty($validated['writer_desk_show']) ? '1' : '0',
                'hit' => 0,
                'user' => $user?->id,
                'image' => $newsImage,
                'image_title' => isset($validated['image_title'])
                    ? trim($validated['image_title'])
                    : null,
                'status' => $newsStatus,
                'meta_keyword' => $validated['meta_keyword'] ?? null,
                'meta_description' => $validated['meta_description'] ?? null,
                'title_color' => $validated['title_color'] ?? null,
                'sub_title_color' => $validated['sub_title_color'] ?? null,
            ];

            $news = NewsTable::query()->create($data);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'News created successfully.',
                    'data' => [
                        'id' => (string) $news->id,
                    ],
                ], 201);
            }

            return redirect()
                ->route('add-new-news')
                ->with('massage', 'Submit Successfully')
                ->with('msg_type', 'success');

        } catch (Throwable $e) {

            report($e);
            /*
             * Remove uploaded files if database insertion fails.
             */
            if (isset($newsImage)) {
                $this->deleteNewsImages($newsImage);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unable to create news.',
                ], 500);
            }

            return back()
                ->withInput()
                ->with('massage', 'Unable to submit news.')
                ->with('msg_type', 'error');
        }
    }

    /**
     * CKEditor 5 media upload.
     */
    public function uploadEditorImage_ck5(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'upload' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        try {

            $file = $request->file('upload');

            $extension = strtolower(
                $file->getClientOriginalExtension()
            );

            $fileName = 'webnews24_' .
                Str::uuid() .
                '.' .
                $extension;

            $file->move(
                public_path('images/media'),
                $fileName
            );

            return response()->json([
                'fileName' => $fileName,
                'uploaded' => 1,
                'url' => asset(
                    'images/media/' . $fileName
                ),
            ]);

        } catch (Throwable $e) {

            report($e);

            return response()->json([
                'uploaded' => 0,
                'error' => [
                    'message' => 'Unable to upload image.',
                ],
            ], 500);
        }
    }


    /**
     * CKEditor 4 media upload.
     */
    public function uploadEditorImage_ck4(Request $request)
    {
        $validated = $request->validate([
            'upload' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        try {

            $file = $request->file('upload');

            $extension = strtolower(
                $file->getClientOriginalExtension()
            );

            $fileName = 'webnews24_' .
                Str::uuid() .
                '.' .
                $extension;

            $file->move(
                public_path('images/media'),
                $fileName
            );

            $functionNumber = (int) $request->input(
                'CKEditorFuncNum'
            );

            $url = asset(
                'images/media/' . $fileName
            );

            $message = 'Upload Successfully';

            /*
             * Escape values before inserting into JavaScript.
             */
            $safeUrl = htmlspecialchars(
                $url,
                ENT_QUOTES,
                'UTF-8'
            );

            $safeMessage = htmlspecialchars(
                $message,
                ENT_QUOTES,
                'UTF-8'
            );

            return response(
                "<script>
                    window.parent.CKEDITOR.tools.callFunction(
                        {$functionNumber},
                        '{$safeUrl}',
                        '{$safeMessage}'
                    );
                </script>"
            )->header(
                'Content-Type',
                'text/html; charset=utf-8'
            );

        } catch (Throwable $e) {

            report($e);

            return response(
                'Unable to upload image.',
                500
            );
        }
    }

     /**
     * All news.
     */
    public function AllNews(Request $request)
    {
        $data = [
            'title' => 'News',

            'app' => App_setting::query()->find(1),

            'user' => auth()->user(),

            'scroller' => HideNewsScroller::query()
                ->find(1),

            'categories' => Category::query()
                ->select([
                    'id',
                    'cat_name',
                    'cat_order',
                ])
                ->orderBy('cat_order')
                ->get(),
        ];

        /*
         * IMPORTANT:
         * Filters must be applied BEFORE paginate().
         */
        $newsQuery = NewsTable::query()
            ->latest('created_at');

        /*
         * Category filter.
         */
        if ($request->filled('category_id')) {
            $newsQuery->where(
                'category_id',
                $request->integer('category_id')
            );
        }

        /*
         * Date filter.
         */
        if (
            $request->filled('from_date') &&
            $request->filled('to_date')
        ) {
            $fromDate = Carbon::parse(
                $request->input('from_date')
            )->startOfDay();

            $toDate = Carbon::parse(
                $request->input('to_date')
            )->endOfDay();

            $newsQuery->whereBetween(
                'created_at',
                [$fromDate, $toDate]
            );
        }

        $data['all_news'] = $newsQuery
            ->paginate(25)
            ->withQueryString();

        return view(
            'admin.news.all_news',
            $data
        );
    }

    /**
     * News waiting for review.
     */
    public function getAllInReviewNews()
    {
        $data = [
            'title' => 'News',

            'app' => App_setting::query()->find(1),

            'all_news' => NewsTable::query()
                ->where('status', 0)
                ->latest('created_at')
                ->paginate(25),

            'user' => auth()->user(),

            'scroller' => HideNewsScroller::query()
                ->find(1),
        ];

        return view(
            'admin.news.all_news',
            $data
        );
    }

      /**
     * Edit news form.
     */
    public function NewsEditForm(int $id)
    {
        $data = [
            'title' => 'News',

            'app' => App_setting::query()->find(1),

            'news' => NewsTable::query()
                ->findOrFail($id),

            'cats' => Category::query()
                ->select([
                    'id',
                    'cat_name',
                    'cat_order',
                ])
                ->orderBy('cat_order')
                ->get(),

            'desks' => WriterDesk::query()
                ->select([
                    'id',
                    'writer_desk',
                ])
                ->get(),
        ];

        return view(
            'admin.news.edit_news_form',
            $data
        );
    }


    /**
     * Show news to an authenticated admin, including unpublished articles.
     */
    public function showAdminNews(int $id): JsonResponse
    {
        $news = NewsTable::query()
            ->with(['category', 'userModel'])
            ->findOrFail($id);

        return response()->json([
            'data' => $news,
        ]);
    }

    /**
     * Update news.
     */
    public function UpdateNews(
        int $id,
        Request $request
    ): JsonResponse|RedirectResponse {

        $news = NewsTable::query()
            ->findOrFail($id);

        $validated = $request->validate([
            'news_title' => [
                'required',
                'string',
                'max:500',
            ],

            'news_sub_title' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'dis' => [
                'nullable',
                'string',
            ],

            'cat' => [
                'required',
                'integer',
            ],

            'sub_cat' => [
                'nullable',
                'integer',
            ],

            'extra_cat' => [
                'nullable',
                'array',
            ],

            'extra_cat.*' => [
                'integer',
            ],

            'published_date' => [
                'required',
                'date',
            ],

            'writer_desk' => [
                'nullable',
                'integer',
            ],

            'representative' => [
                'nullable',
                'string',
                'max:255',
            ],

            'representative_loc' => [
                'nullable',
                'string',
                'max:255',
            ],

            'writer_desk_show' => [
                'nullable',
                'boolean',
            ],

            'islead' => [
                'nullable',
                'boolean',
            ],

            'isbreaking' => [
                'nullable',
                'boolean',
            ],

            'status' => [
                'nullable',
                'boolean',
            ],

            'image_title' => [
                'nullable',
                'string',
                'max:500',
            ],

            'meta_keyword' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'meta_dis' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'title_color' => [
                'nullable',
                'string',
                'max:50',
            ],

            'sub_title_color' => [
                'nullable',
                'string',
                'max:50',
            ],

            'imageUpload' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'base64image' => [
                'nullable',
                'string',
            ],
        ]);

        $oldImage = $news->image;
        $newImage = null;

        try {

            $titleLink = Str::slug(
                $validated['news_title']
            );

            if (empty($titleLink)) {
                $titleLink = 'news-' . $news->id;
            }

            $data = [
                'news_title' => trim(
                    $validated['news_title']
                ),

                'news_sub_title' =>
                    isset($validated['news_sub_title'])
                        ? trim($validated['news_sub_title'])
                        : null,

                'title_link' => $titleLink,

                'dis' => $validated['dis'] ?? null,

                'cat' => $validated['cat'],

                'sub_cat' => $validated['sub_cat'] ?? null,

                'extra_cat' =>
                    !empty($validated['extra_cat'])
                        ? implode(',', $validated['extra_cat'])
                        : null,

                'islead' => $validated['islead'] ?? 0,

                'isbreaking' => $validated['isbreaking'] ?? 0,

                'published_date' => Carbon::parse(
                    $validated['published_date']
                )->format('Y-m-d'),

                'writer_desk' =>
                    $validated['writer_desk'] ?? null,

                'representative' =>
                    $validated['representative'] ?? null,

                'representative_loc' =>
                    $validated['representative_loc'] ?? null,

                'writer_desk_show' =>
                    !empty($validated['writer_desk_show'])
                        ? '1'
                        : '0',

                'user' => auth()->id(),

                'image_title' =>
                    isset($validated['image_title'])
                        ? trim($validated['image_title'])
                        : null,

                'status' =>
                    $validated['status'] ?? $news->status,

                'meta_keyword' =>
                    $validated['meta_keyword'] ?? null,

                'meta_description' =>
                    $validated['meta_dis'] ?? null,

                'title_color' =>
                    $validated['title_color'] ?? null,

                'sub_title_color' =>
                    $validated['sub_title_color'] ?? null,
            ];

            /*
             * New image uploaded.
             */
            if ($request->hasFile('imageUpload')) {

                $newImage = 'webnews24_' .
                    Str::uuid() .
                    '.jpg';

                $this->processNewsImage(
                    $request,
                    $newImage
                );

                $data['image'] = $newImage;
            }

            $news->update($data);

            /*
             * Delete old image only after successful DB update.
             */
            if (
                $newImage &&
                $oldImage &&
                $oldImage !== $newImage
            ) {
                $this->deleteNewsImages($oldImage);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'News updated successfully.',
                    'data' => [
                        'id' => (string) $news->id,
                    ],
                ]);
            }

            return redirect()
                ->route(
                    'news-edit-form',
                    $news->id
                )
                ->with(
                    'massage',
                    'Update Successfully'
                )
                ->with(
                    'msg_type',
                    'success'
                );

        } catch (Throwable $e) {

            report($e);

            if ($newImage) {
                $this->deleteNewsImages($newImage);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unable to update news.',
                ], 500);
            }

            return back()
                ->withInput()
                ->with(
                    'massage',
                    'Unable to update news.'
                )
                ->with(
                    'msg_type',
                    'error'
                );
        }
    }


    /**
     * Delete news.
     */
    public function DeleteNews(int $id): RedirectResponse
    {
        try {

            $news = NewsTable::query()
                ->select([
                    'id',
                    'image',
                ])
                ->findOrFail($id);

            /*
             * Do not delete Top 5 news.
             */
            $isTopFive = TopFiveNews::query()
                ->where('news_id', $id)
                ->exists();

            if ($isTopFive) {
                return redirect()
                    ->route('all-news')
                    ->with(
                        'massage',
                        'This news is in the top 5. Remove top 5 news first then Delete.'
                    )
                    ->with(
                        'msg_type',
                        'error'
                    );
            }

            $image = $news->image;

            $news->delete();

            /*
             * Delete files after DB delete.
             */
            $this->deleteNewsImages($image);

            return redirect()
                ->route('all-news')
                ->with(
                    'massage',
                    'Delete Successfully'
                )
                ->with(
                    'msg_type',
                    'success'
                );

        } catch (Throwable $e) {

            report($e);

            return back()
                ->with(
                    'massage',
                    'Unable to delete news.'
                )
                ->with(
                    'msg_type',
                    'error'
                );
        }
    }


    /**
     * All Just Now news.
     */
    public function AllJustNowNews()
    {
        $data = [
            'title' => 'News',

            'app' => App_setting::query()->find(1),

            'all_news' => NewsJustNow::query()
                ->latest('id')
                ->get(),
        ];

        return view(
            'admin.news.all_just_now_news',
            $data
        );
    }


    /**
     * Add Just Now news form.
     */
    public function AddJustNowNews()
    {
        return view(
            'admin.news.add_just_now_news',
            [
                'title' => 'News',
                'app' => App_setting::query()->find(1),
            ]
        );
    }


    /**
     * Insert Just Now news.
     */
    public function insertJustNowNews(
        Request $request
    ): RedirectResponse {

        $validated = $request->validate([
            'news_header' => [
                'required',
                'string',
                'max:500',
            ],

            'news_url' => [
                'required',
                'url:http,https',
                'max:2048',
            ],

            'status' => [
                'nullable',
                'boolean',
            ],
        ]);

        try {

            NewsJustNow::query()->create([
                'news_title' =>
                    trim($validated['news_header']),

                'news_url' =>
                    trim($validated['news_url']),

                'published_date' =>
                    now()->format('d-m-Y'),

                'user' => auth()->id(),

                'status' =>
                    $validated['status'] ?? 0,
            ]);

            return redirect()
                ->route('add-just-now-news')
                ->with(
                    'massage',
                    'Added Successfully'
                )
                ->with(
                    'msg_type',
                    'success'
                );

        } catch (Throwable $e) {

            report($e);

            return back()
                ->withInput()
                ->with(
                    'massage',
                    'Unable to add news.'
                )
                ->with(
                    'msg_type',
                    'error'
                );
        }
    }


     /**
     * Just Now news status update.
     */
    public function JustNowNewsStatusUpdate(
        Request $request
    ): JsonResponse {

        $validated = $request->validate([
            'id' => [
                'required',
                'integer',
                'exists:news_just_nows,id',
            ],

            'status' => [
                'required',
                'boolean',
            ],
        ]);

        try {

            NewsJustNow::query()
                ->whereKey($validated['id'])
                ->update([
                    'status' => $validated['status'],
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Status updated successfully.',
            ]);

        } catch (Throwable $e) {

            report($e);

            return response()->json([
                'status' => false,
                'message' => 'Unable to update status.',
            ], 500);
        }
    }


    /**
     * Lead status update.
     */
    public function isLeadStatusUpdate(
        Request $request
    ): JsonResponse {

        $validated = $request->validate([
            'id' => [
                'required',
                'integer',
                'exists:news_tables,id',
            ],

            'status' => [
                'required',
                'boolean',
            ],
        ]);

        try {

            NewsTable::query()
                ->whereKey($validated['id'])
                ->update([
                    'islead' => $validated['status'],
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Lead status updated successfully.',
            ]);

        } catch (Throwable $e) {

            report($e);

            return response()->json([
                'status' => false,
                'message' => 'Unable to update lead status.',
            ], 500);
        }
    }


     /**
     * Breaking/scroll status update.
     */
    public function isScrollStatusUpdate(
        Request $request
    ): JsonResponse {

        $validated = $request->validate([
            'id' => [
                'required',
                'integer',
                'exists:news_tables,id',
            ],

            'status' => [
                'required',
                'boolean',
            ],
        ]);

        try {

            NewsTable::query()
                ->whereKey($validated['id'])
                ->update([
                    'isbreaking' => $validated['status'],
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Breaking status updated successfully.',
            ]);

        } catch (Throwable $e) {

            report($e);

            return response()->json([
                'status' => false,
                'message' => 'Unable to update breaking status.',
            ], 500);
        }
    }


     /**
     * Delete Just Now news.
     */
    public function DeleteJustNowNews(
        int $id
    ): RedirectResponse {

        try {

            NewsJustNow::query()
                ->findOrFail($id)
                ->delete();

            return redirect()
                ->route('all-just-now-news')
                ->with(
                    'massage',
                    'Delete Successfully'
                )
                ->with(
                    'msg_type',
                    'success'
                );

        } catch (Throwable $e) {

            report($e);

            return back()
                ->with(
                    'massage',
                    'Unable to delete news.'
                )
                ->with(
                    'msg_type',
                    'error'
                );
        }
    }


     /**
     * Publish news.
     *
     * Existing application logic preserved:
     * status = 0
     */
    public function NewsPublish(
        int $id
    ): RedirectResponse {

        try {

            NewsTable::query()
                ->whereKey($id)
                ->update([
                    'status' => 0,
                ]);

            return redirect()
                ->route('all-news')
                ->with(
                    'massage',
                    'Status Updated'
                )
                ->with(
                    'msg_type',
                    'success'
                );

        } catch (Throwable $e) {

            report($e);

            return back()
                ->with(
                    'massage',
                    'Unable to update status.'
                )
                ->with(
                    'msg_type',
                    'error'
                );
        }
    }


    /**
     * Unpublish news.
     *
     * Existing application logic preserved:
     * status = 1
     */
    public function NewsUnPublish(
        int $id
    ): RedirectResponse {

        try {

            NewsTable::query()
                ->whereKey($id)
                ->update([
                    'status' => 1,
                ]);

            return redirect()
                ->route('all-news')
                ->with(
                    'massage',
                    'Status Updated'
                )
                ->with(
                    'msg_type',
                    'success'
                );

        } catch (Throwable $e) {

            report($e);

            return back()
                ->with(
                    'massage',
                    'Unable to update status.'
                )
                ->with(
                    'msg_type',
                    'error'
                );
        }
    }

    /**
     * News scroller status update.
     */
    public function NewsScrollerStatusUpdate(
        Request $request
    ): JsonResponse {

        $validated = $request->validate([
            'id' => [
                'required',
                'integer',
                'exists:hide_news_scrollers,id',
            ],

            'status' => [
                'required',
                'boolean',
            ],
        ]);

        try {

            HideNewsScroller::query()
                ->whereKey($validated['id'])
                ->update([
                    'status' => $validated['status'],
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Scroller status updated successfully.',
            ]);

        } catch (Throwable $e) {

            report($e);

            return response()->json([
                'status' => false,
                'message' => 'Unable to update scroller status.',
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Private Helper Methods
    |--------------------------------------------------------------------------
    */


    /**
     * Process news image.
     */
    private function processNewsImage(
        Request $request,
        string $filename
    ): void {

        $folderPath = public_path(
            'images/news_img'
        );

        $thumbnailPath = public_path(
            'images/news_img/thumbnail'
        );

        $watermarkPath = public_path(
            'images/news_img/water_mark'
        );

        $this->ensureDirectory(
            $folderPath
        );

        $this->ensureDirectory(
            $thumbnailPath
        );

        $this->ensureDirectory(
            $watermarkPath
        );

        /*
         * Base64 cropped image.
         */
        if ($request->filled('base64image')) {

            $base64 = $request->input(
                'base64image'
            );

            if (
                !preg_match(
                    '/^data:image\/(\w+);base64,/',
                    $base64,
                    $matches
                )
            ) {
                throw new \RuntimeException(
                    'Invalid image data.'
                );
            }

            $base64Data = substr(
                $base64,
                strpos($base64, ',') + 1
            );

            $imageData = base64_decode(
                $base64Data,
                true
            );

            if ($imageData === false) {
                throw new \RuntimeException(
                    'Unable to decode image.'
                );
            }

            file_put_contents(
                $folderPath . '/' . $filename,
                $imageData
            );

        } elseif ($request->hasFile('imageUpload')) {

            /*
             * Direct uploaded file.
             */
            $request
                ->file('imageUpload')
                ->move(
                    $folderPath,
                    $filename
                );
        } else {
            return;
        }

        $originalPath =
            $folderPath . '/' . $filename;

        /*
         * Thumbnail.
         */
        Image::make($originalPath)
            ->resize(
                200,
                200,
                function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                }
            )
            ->save(
                $thumbnailPath . '/' . $filename,
                85
            );

        /*
         * Watermark image.
         */
        $watermark =
            public_path(
                'images/logos/wm_logo.png'
            );

        $image = Image::make(
            $originalPath
        );

        if (File::exists($watermark)) {
            $image->insert(
                $watermark,
                'bottom'
            );
        }

        $image
            ->resize(
                600,
                400,
                function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                }
            )
            ->save(
                $watermarkPath . '/' . $filename,
                85
            );
    }


    /**
     * Delete all images related to news.
     */
    private function deleteNewsImages(
        ?string $filename
    ): void {

        if (empty($filename)) {
            return;
        }

        $paths = [
            public_path(
                'images/news_img/' . $filename
            ),

            public_path(
                'images/news_img/thumbnail/' . $filename
            ),

            public_path(
                'images/news_img/water_mark/' . $filename
            ),
        ];

        foreach ($paths as $path) {

            if (File::exists($path)) {
                File::delete($path);
            }
        }
    }


    /**
     * Create directory if it does not exist.
     */
    private function ensureDirectory(
        string $path
    ): void {

        if (!File::isDirectory($path)) {
            File::makeDirectory(
                $path,
                0755,
                true
            );
        }
    }
}
