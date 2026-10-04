@extends('frontend.master_layout')
@section('content')
@push('scripts')
<link rel="stylesheet" href="{{asset('public/public_assist/css/slider.css')}}">
<link rel="stylesheet" href="{{asset('public/public_assist/youtube_popup.css')}}">
<style>
        .video_image {
        position: relative;
        overflow: hidden;
    }

    .play_icon {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px; /* Adjust size as needed */
        height: 80px; /* Adjust size as needed */
        background-image: url({{ asset('images/play_icon.png') }}); /* Provide path to your play icon */
        background-size: cover;
        cursor: pointer;
        transition: color 0.3s ease; /* Transition for color change */
    }

    .play_icon:hover {
        color: red; /* Change color on hover */
    }

    </style>
@endpush
<div style="height:15px;"></div>
 <!-- News Area -->
 <section class="news-area">
        <div class="custom-container">
            <div class="row">
 
                <!-- Col Section -->
                <div class="col-lg-12 col-md-12">
                <div style="padding:0 0 0px 10px; border-left: solid 4px #ED1C29; font-size: 25px; margin-bottom:10px; margin-top:20px;">
                        <b>ভিডিও</b>
                </div>

                <div class="row" style="padding-top:20px;">

                @foreach ($videos as $video)
                <div class="col-lg-3 col-md-12">
                        <div style="padding-top:20px;">
                                <div class="">
                                <a href="https://www.youtube.com/watch?v={{$video->video_link}}" class="video_lightbox">
                                    <img src="http://i.ytimg.com/vi/{{$video->video_link}}/mqdefault.jpg" width="100%">
                                    <div class="play_icon"></div>
                                </a>
                                </div>
                                <div style="font-size:14px; padding-top:10px;"><a href="#">{{$video->video_title}} </a></div>
                            </div>
                    </div>
                @endforeach
                <div class="col-lg-12 col-md-12" style="padding:0px 20px;">
                    <hr>
                    <div>{{ $videos->links('frontend.partials.pagination-link') }}</div>
                </div>
                    
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
                       <a href="{{route('news-details',[$news->id])}}">
                        <img src="{{$imageSrc}}" alt="{{$news->title_link}}" class="img-fluid custom-img-large" width="100%">
                       </a>
                    </div>
                    <style>
                        .title-color-epaper{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                        .title-color-epaper{{$loop->iteration}} a:hover{color:#E70303 !important;}
                    </style>
                    <div style="font-size:16px; padding-top:15px; color:{{$news->sub_title_color}}">{{$news->news_sub_title}}</div>
                    <div class="similar-new-text title-color-epaper{{$loop->iteration}} " >
                        <a href="{{route('news-details',[$news->id])}}">{{$news->news_title}}</a>
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