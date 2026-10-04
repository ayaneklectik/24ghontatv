@extends('frontend.master_layout')
@section('content')
@push('scripts')
<link rel="stylesheet" href="{{asset('public/public_assist/css/slider.css')}}">
@endpush
<div style="height:15px;"></div>
 <!-- News Area -->
 <section class="news-area">
        <div class="custom-container">
            <div class="row">

             <!-- Col Section -->
             <div class="col-lg-12 col-md-12">
                <div style="margin-top:15px; color:red; font-size:50px !important;">
                <img src="{{asset('public/images/cat_bar_img.png')}}" alt="webnews24" class="img-fluid" width="35">
                <b>{{$cat->cat_name}}</b>
            </div>
            </div>
            <!-- /Col Section -->

 

                 @foreach($all_cat_news as $news)
                 @php
                    $imagePath = public_path('images/news_img/thumbnail/' . $news->image);
                    $imageSrc = file_exists($imagePath) ? asset('public/images/news_img/thumbnail/' . $news->image) : asset('public/images/no-img-bg.png');
                @endphp
                    <!-- Col Section -->
                    <div class="col-lg-3 col-md-12" style="padding:20px;">
                        <div>
                          <a href="{{route('news-details',[$news->id, $news->title_link])}}">
                            <img src="{{$imageSrc}}" alt="{{$news->title_link}}" class="img-fluid custom-img-large" width="100%">
                          </a>
                        </div>
                        <div style="font-size:14px; padding-top:15px; color:{{$news->sub_title_color}}">{{$news->news_sub_title}}</div>
                        <style>
                            .title-color-all-cat{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                            .title-color-all-cat{{$loop->iteration}} a:hover{color:#E70303 !important;}
                        </style>
                        <div class="similar-new-text title-color-all-cat{{$loop->iteration}}" style="padding:0px 0 25px 0;">
                            <a href="{{route('news-details',[$news->id, $news->title_link])}}">
                                {{$news->news_title}}
                            </a>
                        </div>
                    </div>
                    <!-- /Col Section -->
                @endforeach

                <div class="col-lg-12 col-md-12" style="padding:0px 20px;">
                    <hr>
                    <div>{{ $all_cat_news->links('frontend.partials.pagination-link') }}</div>
                </div>

            </div>
        </div>
</section>
<!-- End News Area -->



@endsection