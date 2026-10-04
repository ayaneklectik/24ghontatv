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
                    <div style="padding:0 0 0px 10px; font-size: 35px; margin-bottom:10px; margin-top:20px; text-align:center;">
                            <b>৪০৪ - পেইজ খজে পাওয়া যায়নি !</b>
                    </div>

                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-lg-12 col-md-12" style="padding-top:100px;">
                    <hr>
                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-lg-12 col-md-12">
                    <div style="padding:0 0 0px 10px; border-left: solid 3px #ED1C29; font-size: 25px; margin-bottom:10px">
                        <b>আরও পড়ুন</b>
                    </div>
                </div>
                <!-- /Col Section -->

                 <!-- Col Section -->
                 @foreach($more_news as $news)
                 @php
                    $imagePath = public_path('images/news_img/thumbnail/' . $news->image);
                    $imageSrc = file_exists($imagePath) ? asset('public/images/news_img/thumbnail/' . $news->image) : asset('public/images/no-img-bg.png');
                @endphp
                 <div class="col-lg-3 col-md-12" style="padding:20px;">
                    <div>
                       <a href="{{route('news-details',[$news->id, $news->title_link])}}">
                        <img src="{{$imageSrc}}" alt="{{$news->title_link}}" class="img-fluid custom-img-large" width="100%">
                       </a>
                    </div>
                    <style>
                        .title-color-epaper{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                        .title-color-epaper{{$loop->iteration}} a:hover{color:#E70303 !important;}
                    </style>
                    <div style="font-size:16px; padding-top:15px; color:{{$news->sub_title_color}}">{{$news->news_sub_title}}</div>
                    <div class="similar-new-text title-color-epaper{{$loop->iteration}} " >
                        <a href="{{route('news-details',[$news->id, $news->title_link])}}">{{$news->news_title}}</a>
                    </div>
                </div>
                @endforeach
                <!-- /Col Section -->

          
            </div>
        </div>
</section>
<!-- End News Area -->

<div id="youtubelightbox" class="parent">
	<div class="centeredchild">
		<div class="videowrapper">
		<div id="playerdiv"></div>
		</div>
	</div>
</div>

<script src="{{asset('public_assist/youtube_popup.js')}}"></script>

@endsection