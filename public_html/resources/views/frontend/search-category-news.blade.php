@extends('frontend.master_layout')
@section('content')
    @push('scripts')
        <link rel="stylesheet" href="{{ asset('public/public_assist/css/slider.css') }}">
    @endpush
    <!-- News Area -->
    <form action="" method="GET">
        <div class="container mt-3">
            <div class="row">
                <div class="col-12">
                    <div class="input-group shadow">
                        <input type="text" name="search" value="{{request()->get('search','')}}" class="form-control form-control-lg p-3" placeholder="যা খুঁজতে চান" required >
                        <button class="btn btn-primary btn-lg px-4" type="submit">
                            <i class="bi bi-search"></i> খুঁজুন
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    
    
    <section class="news-area" style="margin-top: 30px; margin-bottom: 30px;  padding-bottom: 20px;">
        <div class="custom-container">
            <div class="row">

                <!-- Col Section -->
                <div class="col-lg-12 col-md-12">
                    <div style="margin-top:15px; color:red; font-size:50px !important;">
                        <img src="{{ asset('public/images/cat_bar_img.png') }}" alt="webnews24" class="img-fluid"
                            width="35">
                        <b>{{ $cat->cat_name }}</b>
                    </div>
                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-lg-8 col-md-12">
                    <div class="row">
                        @foreach ($cat_lead_news_1 as $news)
                            <div class="col-lg-8 col-md-12">
                                <a href="{{ route('news-details', [$news->id]) }}">
                                    <div style="border-right: solid 2px #9D9D9D; padding-right:20px;">
                                        <div>
                                            
                                                <img class="slider-image img-fluid w-100"
                                                    src="{{ asset('public/images/news_img/' . $news->image) }}"
                                                    alt="{{ $news->news_title }}">
                                            
                                        </div>
    
                                        <div style="padding :15px; background-color:#efebea; height:130px;">
                                                <b>{{ $news->news_title }}</b>
                                        </div>
    
                                    </div>
                                </a>
                            </div>
                        @endforeach

                        <div class="col-lg-4 col-md-12">
                            <div style="border-right: solid 1px #666; padding-right: 10px;">
                                @foreach ($cat_lead_news_2 as $news)
                                    @php
                                        $news_sl = $loop->iteration;
                                        if ($news_sl == 2) {
                                            $bottom_border = '';
                                        } else {
                                            $bottom_border = 'border-bottom: solid 2px #9D9D9D;';
                                        }
                                    @endphp
                                    <style>
                                        .title-color-news{{ $loop->iteration }} a {
                                            color: {{ $news->title_color }} !important;
                                        }

                                        .title-color-news{{ $loop->iteration }} a:hover {
                                            color: #E70303 !important;
                                        }
                                    </style>
                                    <!--Border start-->
                                    <a href="{{ route('news-details', [$news->id]) }}">
                                        <div style="{{ $bottom_border }} padding-bottom:15px; margin-bottom:15px;">
                                            <table class="w-100">
                                                <tr>
                                                    <td>
                                                        
                                                            <img class="slider-image img-fluid w-100"
                                                                src="{{ asset('public/images/news_img/thumbnail/' . $news->image) }}"
                                                                alt="{{ $news->news_title }}">
                                                        
                                                        <div class="title-color-news{{ $loop->iteration }}"
                                                            style="padding-top:5px;">
                                                                <b>{{ $news->news_title }}</b>
                                                        </div>
                                                    </td>
    
                                                </tr>
                                            </table>
                                        </div>
                                    </a>
                                    <!--Close Border start-->
                                @endforeach
                            </div>
                        </div>

                        <div class="col-lg-12">
                            <hr>
                        </div>

                        @foreach ($cat_lead_news_3 as $news3)
                            @php
                                $news_sl = $loop->iteration;
                                if ($news_sl == 2) {
                                    $bottom_border1 = '';
                                } else {
                                    $bottom_border1 = 'border-right: solid 2px #9D9D9D;';
                                }
                            @endphp

                            <style>
                                .title-color-news{{ $loop->iteration }} a {
                                    color: {{ $news3->title_color }} !important;
                                }

                                .title-color-news{{ $loop->iteration }} a:hover {
                                    color: #E70303 !important;
                                }
                            </style>
                            <div class="col-lg-4">
                                 <a href="{{ route('news-details', [$news3->id]) }}">
                                    <div style="{{ $bottom_border1 }};border-right: solid 1px #666; padding-right:20px;">
                                        <div>
                                           
                                                <img class="slider-image img-fluid w-100"
                                                    src="{{ asset('public/images/news_img/thumbnail/' . $news3->image) }}"
                                                    alt="">
                                            
                                        </div>
    
                                        <style>
                                            .title-color-news{{ $loop->iteration }} a {
                                                color: {{ $news->title_color }} !important;
                                            }
    
                                            .title-color-news{{ $loop->iteration }} a:hover {
                                                color: #E70303 !important;
                                            }
                                        </style>
    
                                        <div class="new-title-container">
                                            <div class="new-sub-title" style="color:{{ $news->sub_title_color }} !important;">
                                                <b>{{ $news3->news_sub_title }}</b>
                                            </div>
                                            <div class="new-title title-color-news{{ $loop->iteration }}">
                                               
                                                    <b>{{ $news3->news_title }}</b>
                                            </div>
                                        </div>
    
                                    </div>
                                </a>
                            </div>
                        @endforeach
                        <div class="col-lg-12">
                            <hr>
                        </div>

                        <div class="col-12">
                            <div style="border-right: solid 1px #666; padding-right: 10px;">
                                @forelse ($all_cat_news as $news)
                                    @php
                                        $news_sl = $loop->iteration;
                                        if ($news_sl == 3) {
                                            $bottom_border = '';
                                        } else {
                                            $bottom_border = 'border-bottom: solid 2px #9D9D9D;';
                                        }
                                    @endphp
                                    <style>
                                        .title-color-news{{ $loop->iteration }} a {
                                            color: {{ $news->title_color }} !important;
                                        }

                                        .title-color-news{{ $loop->iteration }} a:hover {
                                            color: #E70303 !important;
                                        }
                                    </style>
                                    <!--Border start-->
                                    <a href="{{ route('news-details', [$news->id]) }}" style="font-size:22px;">
                                        <div style="{{ $bottom_border }} padding-bottom:15px; margin-bottom:15px;">
                                            <table>
                                                <tr>
                                                    <td>
                                                        
                                                            <img class="slider-image "
                                                                src="{{ asset('public/images/news_img/thumbnail/' . $news->image) }}"
                                                                alt="" style="width:160px;">
                                                        
                                                    </td>
                                                    <td style="padding:10px; background-color:#EFEBEA; width:100%">
                                                        <div>
                                                            <div class="title-color-news{{ $loop->iteration }}"
                                                                style="padding-top:5px;">
                                                                
                                                                    <b>{{ $news->news_title }}</b>
                                                                
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </a>
                                    @empty
                                    <h3 class="text-center">No news found</h3>
                                    <!--Close Border start-->
                                @endforelse
                            </div>
                            <div style="display:flex;justify-content:center;padding-bottom:10px;">
                                {{$all_cat_news->appends($_GET)->links()}}
                            </div>
                        </div>


                    </div>
                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-lg-4 col-md-12">
                    <div>
                        <img class="slider-image" src="{{ asset('public/images/for_ad.png') }}" alt="">
                    </div>

                    <div style="padding: 10px; margin: 15px 0; background-color:#1C1C1C; color:#FFF; font-size:22px;"><b>এই
                            বিভাগের র্সবাধিক জনপ্রিয়</b></div>
                    <div style="padding-right: 10px;">
                        @foreach ($populer as $news)
                            @php
                                $news_sl = $loop->iteration;
                                if ($news_sl == 20) {
                                    $bottom_border = '';
                                } else {
                                    $bottom_border = 'border-bottom: solid 2px #9D9D9D;';
                                }
                            @endphp
                            <style>
                                .title-color-news{{ $loop->iteration }} a {
                                    color: {{ $news->title_color }} !important;
                                }

                                .title-color-news{{ $loop->iteration }} a:hover {
                                    color: #E70303 !important;
                                }
                            </style>
                            <!--Border start-->
                            <a href="{{ route('news-details', [$news->id]) }}" style="font-size:22px;">
                                <div style="{{ $bottom_border }} padding-bottom:15px; margin-bottom:15px;">
                                    <table>
                                        <tr>
                                            <td>
                                                    <img class="slider-image"
                                                        src="{{ asset('public/images/news_img/thumbnail/' . $news->image) }}"
                                                        alt="" style="width:120px;">
                                            </td>
                                            <td style="padding:10px; background-color:#EFEBEA; width:100%">
                                                <div>
                                                    <div class="title-color-news{{ $loop->iteration }}"
                                                        style="padding-top:5px;">
                                                            <b>{{ $news->news_title }}</b>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </a>
                            <!--Close Border start-->
                        @endforeach
                    </div>
                </div>
                <!-- /Col Section -->

            </div>
        </div>

    </section>
@endsection
