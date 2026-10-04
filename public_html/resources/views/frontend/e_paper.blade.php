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
                <div style="padding:0 0 0px 10px; border-left: solid 4px #ED1C29; font-size: 25px; margin-bottom:10px; margin-top:20px;">
                        <b>ই-পেপার</b>
                </div>

                <div class="row" style="padding-top:20px;">

                @foreach ($epapers as $epaper)
                @php
                    $imagePath2 = public_path('epaper/thumb/' . $epaper->epaper .'.jpg');
                    $imageSrc2 = file_exists($imagePath2) ? asset('public/epaper/thumb/' . $epaper->epaper.'.jpg') : asset('public/images/no-img-bg.png');
                @endphp
                    <div class="col-3">
                        <a href="{{asset('public/epaper/'.$epaper->epaper.'.pdf')}}" target='blank'>
                            <img src="{{$imageSrc2}}" alt="webnews24" class="img-fluid custom-img-thumb" width="100%" style="border: solid 1px #8C8C8C;">
                        </a>
                        <div style="text-align:center;">ই-পেপার</div>
                        @php 
                            $bangla_date = App\Http\Controllers\StaticLinkController::getBanglaDate($epaper->pub_date);
                        @endphp
                        <div style="font-size:14px; padding: 2px 0 7px 0; text-align:center;"><i class="fa fa-calendar"></i>&nbsp;{{$bangla_date}}</div>
                    </div>
                @endforeach
                  
                <div class="col-lg-12 col-md-12" style="padding:0px 20px;">
                    <hr>
                    <div>{{ $epapers->links('frontend.partials.pagination-link') }}</div>
                </div>    
                </div>


                   
                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-lg-12 col-md-12">
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
                    $imagePath1 = public_path('images/news_img/thumbnail/' . $news->image);
                    $imageSrc1 = file_exists($imagePath1) ? asset('public/images/news_img/thumbnail/' . $news->image) : asset('public/images/no-img-bg.png');
                @endphp
                 <div class="col-lg-3 col-md-12" style="padding:20px;">
                    <div>
                       <a href="{{route('news-details',[$news->id, $news->title_link])}}">
                        <img src="{{$imageSrc1}}" alt="{{$news->title_link}}" class="img-fluid custom-img-large" width="100%">
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



@endsection