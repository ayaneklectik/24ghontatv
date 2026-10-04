
@extends('admin.master_layout')

@section('content')

    @push('scripts')
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <style>
            table th {
                border: solid 1px #818181;
                background-color: #002D3E;
                color: #FFF;
            }

            div.dataTables_filter,
            div.dataTables_length {
                display: inline-block;
                margin-left: 1em;
                float: right;
            }
        </style>
    @endpush

    <section class="content">
        <div class="card">
            <div class="card-body">

                {{-- Page Header --}}
                <div class="row">
                    <div class="col-6">
                        <h4 class="card-title" style="color:#CE185B; font-size:25px;">
                            <i class="fa fa-newspaper"></i>
                            &nbsp;&nbsp;
                            <b>Manage Top Five News</b>
                        </h4>
                    </div>

                    <div class="col-4" style="text-align:right;"></div>

                    <div class="col-2" style="text-align:right;"></div>
                </div>

                <div style="
                    height:5px;
                    border-top:solid 1px #EBEBEB;
                    margin-bottom:5px;
                    margin-top:10px;
                "></div>

                {{-- News Table --}}
                <div class="row">
                    <div class="col-md-12">

                        <div class="table-responsive" style="margin-top:0px; padding-bottom:30px;">

                            <table class="table table-striped" id="example1">

                                <thead style="
                                    background-image: linear-gradient(
                                        to top,
                                        #e70a3a,
                                        #d80934,
                                        #c9082e,
                                        #ba0728,
                                        #ac0623
                                    );
                                    background-color:#CE185B;
                                    color:#FFF;
                                ">
                                    <tr>
                                        <th>SL</th>
                                        <th>Published</th>
                                        <th>Headline</th>
                                        <th>View</th>
                                        <th style="text-align:center;">isLead</th>
                                        <th style="text-align:center;">isScrolled</th>
                                        <th>Status</th>
                                        <th style="text-align:center;">Image</th>
                                        <th style="text-align:right;">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    @forelse ($top_news as $key => $t_news)

                                        @php
                                            /*
                                             * Get news
                                             */
                                            $news = App\Http\Controllers\StaticLinkController::getNewsByID(
                                                $t_news->news_id
                                            );

                                            /*
                                             * Default values
                                             */
                                            $cat_name = '';
                                            $subcat_name = '';
                                            $user_name = '';
                                            $user_type = '';

                                            /*
                                             * Get category/subcategory/user only
                                             * when news exists.
                                             */
                                            if ($news) {

                                                $cat = App\Http\Controllers\StaticLinkController::getCatByID(
                                                    $news->cat
                                                );

                                                $cat_name = $cat?->cat_name ?? '';

                                                $subcat = App\Http\Controllers\StaticLinkController::getSubCatByID(
                                                    $news->sub_cat
                                                );

                                                $subcat_name = $subcat?->sub_cat_name ?? '';

                                                $user = App\Http\Controllers\StaticLinkController::getUser(
                                                    $news->user
                                                );

                                                $user_name = $user?->name ?? '';
                                                $user_type = $user?->user_type ?? '';
                                            }

                                            /*
                                             * News image
                                             */
                                            $imageSrc = asset('public/images/no-img-bg.png');

                                            if ($news && !empty($news->image)) {

                                                $imagePath = public_path(
                                                    'images/news_img/thumbnail/' . $news->image
                                                );

                                                if (file_exists($imagePath)) {
                                                    $imageSrc = asset(
                                                        'public/images/news_img/thumbnail/' . $news->image
                                                    );
                                                }
                                            }
                                        @endphp

                                        <tr>

                                            {{-- SL --}}
                                            <td>
                                                {{ $key + 1 }}
                                            </td>

                                            {{-- Published Date --}}
                                            <td>
                                                @if ($news)

                                                    {{ $news->published_date ?? '' }}

                                                    @if (!empty($news->published_time))
                                                        <div>
                                                            {{ $news->published_time }}
                                                        </div>
                                                    @endif

                                                @else

                                                    <span class="text-danger">
                                                        News not found
                                                    </span>

                                                @endif
                                            </td>

                                            {{-- Headline --}}
                                            <td>

                                                @if ($news)

                                                    <div style="color:#CE185B; font-size:13px;">
                                                        <a href=""
                                                           target="_blank"
                                                           style="color:#CE185B; font-size:13px;">
                                                            <b>
                                                                {{ $news->news_title ?? 'No headline' }}
                                                            </b>
                                                        </a>
                                                    </div>

                                                    <div style="
                                                        padding-top:5px;
                                                        font-size:14px;
                                                    ">
                                                        {{ $cat_name }}

                                                        @if ($cat_name && $subcat_name)
                                                            &nbsp;>&nbsp;
                                                        @endif

                                                        {{ $subcat_name }}
                                                    </div>

                                                @else

                                                    <span class="text-danger">
                                                        This news has been deleted or does not exist.
                                                    </span>

                                                @endif

                                            </td>

                                            {{-- View / Hit --}}
                                            <td>
                                                @if ($news)
                                                    <div style="color:#002D3E;">
                                                        <b>{{ $news->hit ?? 0 }}</b>
                                                    </div>
                                                @else
                                                    <span>0</span>
                                                @endif
                                            </td>

                                            {{-- isLead --}}
                                            <td style="text-align:center;">
                                                @if ($news)
                                                    {{ $news->isLead ?? 0 }}
                                                @else
                                                    -
                                                @endif
                                            </td>

                                            {{-- isScrolled --}}
                                            <td style="text-align:center;">
                                                @if ($news)
                                                    {{ $news->isScrolled ?? 0 }}
                                                @else
                                                    -
                                                @endif
                                            </td>

                                            {{-- Status --}}
                                            <td>

                                                @if ($news)

                                                    @if (optional(auth()->user())->user_type == 'Admin')

                                                        @if ($news->status == 1)
                                                            <a href=""
                                                               class="btn btn-success btn-sm">
                                                                Published
                                                            </a>
                                                        @else
                                                            <a href=""
                                                               class="btn btn-danger btn-sm">
                                                                NotPublished
                                                            </a>
                                                        @endif

                                                    @else

                                                        @if ($news->status == 1)
                                                            <span class="btn btn-success btn-sm">
                                                                Published
                                                            </span>
                                                        @else
                                                            <span class="btn btn-danger btn-sm">
                                                                In review
                                                            </span>
                                                        @endif

                                                    @endif

                                                @else

                                                    <span class="btn btn-secondary btn-sm">
                                                        News Missing
                                                    </span>

                                                @endif

                                            </td>

                                            {{-- Image --}}
                                            <td style="text-align:center;">

                                                <img
                                                    src="{{ $imageSrc }}"
                                                    alt="News image"
                                                    width="80"
                                                    loading="lazy"
                                                >

                                            </td>

                                            {{-- Actions --}}
                                            <td style="text-align:right;">

                                                <div>
                                                    <a href="{{ route('top-five-news-page', $t_news->id) }}"
                                                       class="btn btn-info btn-sm">
                                                        Update
                                                    </a>
                                                </div>

                                            </td>

                                        </tr>

                                    @empty

                                        <tr>
                                            <td colspan="9" class="text-center">
                                                No Top Five News Found
                                            </td>
                                        </tr>

                                    @endforelse

                                </tbody>

                            </table>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>

    @push('js_scripts')
        <script type="text/javascript">
            function confirmation() {
                return confirm('Are you sure you want to Delete this?');
            }
        </script>
    @endpush

@endsection

