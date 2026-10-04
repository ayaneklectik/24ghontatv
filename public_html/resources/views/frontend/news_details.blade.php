@extends('frontend.master_layout')
@section('content')

@php
    $newsImageName = $news->image ?? null;
    $newsImagePath = $newsImageName ? public_path('images/news_img/' . $newsImageName) : null;
    $newsImageSrc = !$newsImageName
        ? asset('public/images/no-img-bg.png')
        : (file_exists($newsImagePath)
            ? asset('public/images/news_img/' . $newsImageName)
            : 'https://api.24ghontatv.com/images/news_img/' . rawurlencode($newsImageName));
@endphp

@section('meta_tags')
    <meta property="og:title" content="{{ $news->news_title }}" />
    <meta property="og:description" content="24hghonta is the Most Popular Bangla Newspaper. It covers Breaking News, Politics, Economies, National, International, Live Sports, Entertainment, Lifestyle, Tech, Education, Photo, Video, BD News &amp; More. Stay with us for get more Latest News."/>
    <meta property="og:image" content="{{ $newsImageSrc }}" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:type" content="article" />
@endsection


@push('scripts')

    <link rel="stylesheet" href="{{asset('public_assist/css/slider.css')}}">
    <script src="https://apis.google.com/js/platform.js"></script>
@endpush

    <div style="height:15px;"></div>
    <!-- News Area -->
    <section class="news-area">
        <div class="container">
            <div class="row">
                <!-- Col Section -->
                <div class="col-lg-12 col-md-12">
                    <div class="new-category">
                        @php
                            try {
                                $sub_cat_id1 = $news->sub_cat;

                                $sub_cat = App\Http\Controllers\StaticLinkController::getSubCatByID($sub_cat_id1);
                                $sub_cat_name1 = ' - ' . $sub_cat->sub_cat_name;
                                $sub_cat_id1 = $sub_cat->id;
                            } catch (Exception $e) {
                                $sub_cat_name1 = '';
                                $sub_cat_id1 = 0;
                            }

                            try {
                                $cat_id_extra = $news->extra_cat;
                                $extra_cat = App\Http\Controllers\StaticLinkController::getCatByID($cat_id_extra);
                                $extra_cat_name = ' - ' . $extra_cat->cat_name;
                            } catch (Exception $e) {
                                $extra_cat_name = '';
                            }
                        @endphp
                        <div id="hide_in_mobile" class="hide">
                            <img src="{{ asset('public/images/braking_img.png') }}" alt="webnews24" class="img-fluid"
                                width="35">&nbsp;&nbsp;
                            <a href="{{ route('all-category-news', $news->cat) }}">{{ $cat->cat_name }}</a>
                            <a href="{{ route('all-sub-category-news', $sub_cat_id1) }}">{{ $sub_cat_name1 }}</a>
                            <a>{{ $extra_cat_name }}</a>
                        </div>
                        <div id="hide_in_desktop ">
                            <img src="{{ asset('public/images/braking_img.png') }}" alt="webnews24" class="img-fluid"
                                width="30">&nbsp;&nbsp;
                            <a href="{{ route('all-category-news', $news->cat) }}"
                                style="font-size:20px;">{{ $cat->cat_name }}</a>
                            <a href="{{ route('all-sub-category-news', $sub_cat_id1) }}"
                                style="font-size:20px;">{{ $sub_cat_name1 }}</a>
                            <a style="font-size:20px;">{{ $extra_cat_name }}</a>
                        </div>

                    </div>
                </div>
                <!-- /Col Section -->
                @php
                    try {
                        $cdate = $news->published_date;
                        $bangla_date = App\Http\Controllers\StaticLinkController::getBanglaDate($cdate);
                    } catch (Exception $e) {
                        $bangla_date = '';
                    }
                @endphp


                <!-- Col Section -->
                <div class="col-lg-12 col-md-12">
                    <div class="" style="padding-top:20px; color:{{ $news->sub_title_color }}">
                        {{ $news->news_sub_title }}
                    </div>

                    <div class="new-title-details" style="margin-top:-8px;">
                        <h4 style="color:{{ $news->title_color }}!important;"><b>{{ $news->news_title }}</b></h4>
                    </div>

                    @php
                        $banglaTime = $news->published_time;
                        try {
                            $enHr = substr($banglaTime, 0, -9);
                            $enMin = substr($banglaTime, 3, -6);
                            $enAmPm = substr($banglaTime, 9, -1);
                            if ($enAmPm == 'P') {
                                $bangla_AmPm = 'পিএম';
                            } else {
                                $bangla_AmPm = 'এএম';
                            }

                            $bangla_hr = App\Http\Controllers\StaticLinkController::getBanglaNumber($enHr);
                            $bangla_min = App\Http\Controllers\StaticLinkController::getBanglaNumber($enMin);
                        } catch (Exception $e) {
                            $bangla_hr = '';
                            $bangla_min = '';
                            $bangla_AmPm = '';
                        }
                    @endphp
                    <div class="row">
                        <div class="col-lg-6 col-md-12">
                            <div style="font-size:18px; padding-top:5px;"><b>প্রকাশিত</b> - {{ $bangla_date }} &nbsp; <i
                                    class="fa fa-clock-o" aria-hidden="true"></i> {{ $bangla_hr }}:{{ $bangla_min }}
                                {{ $bangla_AmPm }}</div>
                        </div>
                        <div class="col-lg-6 col-md-12">
                            <div style="padding:0px 0 0px 0;">
                                <div class="sharethis-inline-share-buttons"></div>
                            </div>
                        </div>
                    </div>


                    <div style="padding-top:15px;">
                        <img src="{{ $newsImageSrc }}" alt="webnews24" class="img-fluid custom-img-large" width="100%">
                    </div>
                    @if (!empty($news->image_title))
                        <div style="font-size:14px; padding-top:6px; border-bottom: solid 1px #DFDFDF; text-align:center;">
                            <em>{{ $news->image_title }}</em>
                        </div>
                    @endif

                    <div style="height:30px;"></div>
                    @if (!empty($news->writer_desk))
                        <div style="font-size:18px; border-bottom: solid 1px #474747;"> <b>{{ $news->writer_desk }}</b>
                        </div>
                    @endif

                    @if (!empty($news->representative))
                        <div style="font-size:18px; border-bottom: solid 1px #474747;"> <b>{{ $news->representative }}</b>
                            @if (!empty($news->representative_loc))
                                , {{ $news->representative_loc }}
                            @endif
                        </div>
                    @endif

                    <div class="news-details-text" style="margin-top:-15px;">
                        <p>{!! $news->dis !!}</p>
                    </div>

                    <div class="row">
                        <div class="col-lg-6 col-md-12">
                            <div style="padding-top:15px; font-size:18px;">ফেসবুক পেইজে লাইক দিয়ে সঙ্গে থাকুন</div>
                            <div class="fb-like" style="text-align:center;"
                                data-href="https://www.facebook.com/webnewsfrance/" data-width="" data-layout=""
                                data-action="" data-size="" data-share="false"></div>
                        </div>
                        <div class="col-lg-6 col-md-12">
                            <div style="padding-top:15px; font-size:18px; text-align:center;">ওয়েব নিউজ ইউটিউব চ্যানেলে
                                সাবস্ক্রাইব করুন </div>
                            <div style="padding-top:8px; text-align:center;">
                                <div class="g-ytsubscribe" data-channelid="UCkI6vPHcRHJCOsfj4ffr51A" data-layout="full"
                                    data-count="default"></div>
                            </div>
                        </div>
                    </div>



                    <div class="" style="padding-top:20px;">
                        @php
                            $ad_position4 = 'under_news_details_page_ad';
                            try {
                                $ad4 = App\Http\Controllers\StaticLinkController::getADPosition($ad_position4);
                                $status_ad4 = $ad4->status;
                                $ad_image4 = $ad4->ad_image;
                            } catch (Exception $e) {
                                $status_ad4 = 0;
                                $ad_image4 = '';
                            }
                        @endphp

                        @if ($status_ad4 == 1)
                            <a href="{{ $ad4->company_link }}" target="blank">
                                <img style="width: 100%;" src="{{ asset('public/images/ad/' . $ad_image4) }}"
                                    alt="">
                            </a>
                        @else
                            <img style="width: 100%;" src="{{ asset('public/images/ad/for_ad_image.png') }}"
                                alt="">
                        @endif
                    </div>

                    <div class="row" style="margin-top:20px;">
                        <div class="col-lg-6 col-md-12" style="">
                            <div class="share-txt">
                                <i class="fa fa-share" aria-hidden="true"></i>
                                &nbsp;&nbsp;<b>সংবাদটি শেয়ার করুন</b>
                            </div>

                            <div style="padding:15px 0 40px 0;">
                                <div class="sharethis-inline-share-buttons"></div>
                            </div>
                        </div>

                        <div class="col-lg-6  col-md-12" style="">

                            <div class="comment-txt">
                                <a id="toggleDrawer" style="cursor:pointer; font-size:20px;">
                                    <div class="row">
                                        <div class="col-4" style="text-align:left;">
                                            <img src="{{ asset('public/images/box.png') }}" alt=""
                                                width="30">
                                        </div>
                                        <div class="col-8">
                                            <b>আপনার মতামত জানান</b>
                                        </div>
                                    </div>
                                </a>
                            </div>

                        </div>
                    </div>

                    <div class="row" style="padding-top:20px;">
                        <div class="col-6">
                            <div class="next-news-btn">
                                <a href="{{ route('news-details', [$previousNews, $previousNewsLink]) }}">
                                    <i class="fa fa-angle-double-left"></i>
                                    &nbsp;&nbsp;<b>আগের নিউজ</b>
                                </a>
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="prev-news-btn">
                                <a href="{{ route('news-details', [$nextNews, $nextNewsLink]) }}">
                                    <b>পরের নিউজ</b>&nbsp;&nbsp;
                                    <i class="fa fa-angle-double-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <hr>
                    </div>

                    <div style="padding:0 0 0px 10px; border-left: solid 3px #ED1C29; font-size: 25px; margin-bottom:10px">
                        <b>আরও পড়ুন</b>
                    </div>

                    <div class="row">
                        <!-- Col Section -->
                        @foreach ($more_news as $news)
                            @php
                                $imagePath1 = public_path('images/news_img/thumbnail/' . $news->image);
                                $imageSrc1 = file_exists($imagePath1)
                                    ? asset('public/images/news_img/thumbnail/' . $news->image)
                                    : asset('public/images/no-img-bg.png');
                            @endphp
                            <div class="col-lg-4 col-md-12" style="padding:20px;">
                                <div>
                                    <a href="{{ route('news-details', [$news->id]) }}">
                                        <img src="{{ $imageSrc1 }}" alt="{{ $news->title_link }}"
                                            class="img-fluid custom-img-large" width="100%">
                                    </a>
                                </div>
                                <style>
                                    .title-color-epaper{{ $loop->iteration }} a {
                                        color: {{ $news->title_color }} !important;
                                    }

                                    .title-color-epaper{{ $loop->iteration }} a:hover {
                                        color: #E70303 !important;
                                    }
                                </style>
                                <div style="font-size:16px; padding-top:15px; color:{{ $news->sub_title_color }}">
                                    {{ $news->news_sub_title }}</div>
                                <div class="similar-new-text title-color-epaper{{ $loop->iteration }} ">
                                    <a href="{{ route('news-details', [$news->id]) }}">{{ $news->news_title }}</a>
                                </div>
                            </div>
                        @endforeach
                        <!-- /Col Section -->
                    </div>

                </div>
                <!-- /Col Section -->


            </div>
        </div>
    </section>
    <!-- End News Area -->



@endsection
