@extends('frontend.master_layout')
@section('content')
@push('scripts')
<link rel="stylesheet" href="{{asset('public/public_assist/css/slider.css')}}">
@endpush
    <!-- News Area -->
    <section class="news-area" style="margin-top: 30px; margin-bottom: 30px;  padding-bottom: 20px;">
        <div class="custom-container">
            <div class="row">

                <!-- Col Section -->
                <div class="col-lg-12 col-md-12">
                     <img src="{{asset('public/images/world-cup-banner-home.png')}}" alt="provat" class="img-fluid" width="100%">
                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-lg-8 col-md-12">
                     <div class="row">
                        @foreach($cat_lead_news_1 as $news)
                        <div class="col-8">
                            <div style="border-right: solid 2px #9D9D9D; padding-right:20px;">
                            <div>
                            <a href="">
                                <img class="slider-image" src="{{ asset('public/images/news_img/'. $news->image) }}" alt="">
                            </a>
                            </div>
                            
                            <div style="padding :15px; background-color:#efebea; height:130px;">
                            <a href="{{route('news-details',[$news->id])}}" style="font-size:25px; color:#000;">
                            <b>{{$news->news_title}}</b>
                            </a>
                            </div>

                        </div>
                        </div>
                        @endforeach

                        <div class="col-4">
                            <div style="border-right: solid 1px #666; padding-right: 10px;">
                            @foreach($cat_lead_news_2 as $news)
                            @php 
                                $news_sl = $loop->iteration;
                                if($news_sl == 2){
                                $bottom_border = "";
                                }else{
                                $bottom_border = "border-bottom: solid 2px #9D9D9D;";
                                }
                            @endphp
                                    <style>
                                        .title-color-news{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                                        .title-color-news{{$loop->iteration}} a:hover{color:#E70303 !important;}
                                    </style>
                                <!--Border start-->
                                <div style="{{$bottom_border}} padding-bottom:15px; margin-bottom:15px;">
                                <table>
                                <tr>
                                    <td>
                                    <a href="">
                                        <img class="slider-image" src="{{ asset('public/images/news_img/thumbnail/'. $news->image) }}" alt="" style="width:240px;">
                                    </a>
                                    <div class="title-color-news{{$loop->iteration}}" style="padding-top:5px;">
                                        <a href="{{route('news-details',[$news->id])}}" style="font-size:22px;">
                                        <b>{{$news->news_title}}</b>
                                        </a>
                                    </div>
                                    </td>
                                  
                                </tr>
                                </table>
                                </div>
                                <!--Close Border start-->
                                @endforeach
                            </div>
                            </div>

                            <div class="col-lg-12"><hr></div>

                            @foreach($cat_lead_news_3 as $news3)
                            @php 
                                $news_sl = $loop->iteration;
                                if($news_sl == 2){
                                $bottom_border1 = "";
                                }else{
                                $bottom_border1 = "border-right: solid 2px #9D9D9D;";
                                }
                            @endphp

                            <style>
                                 .title-color-news{{$loop->iteration}} a{color:{{$news3->title_color}} !important;}
                                .title-color-news{{$loop->iteration}} a:hover{color:#E70303 !important;}
                            </style>
                            <div class="col-lg-4">
                                <div style="{{$bottom_border1}} padding-right:20px;">
                                    <div>
                                    <a href="">
                                        <img class="slider-image" src="{{ asset('public/images/news_img/thumbnail/'. $news3->image) }}" alt="">
                                    </a>
                                    </div>

                                        <style>
                                            .title-color-news{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                                            .title-color-news{{$loop->iteration}} a:hover{color:#E70303 !important;}
                                        </style>

                                    <div class="new-title-container">
                                        <div class="new-sub-title" style="color:{{$news->sub_title_color}} !important;">
                                            <b>{{$news3->news_sub_title}}</b>
                                        </div>
                                        <div class="new-title title-color-news{{$loop->iteration}}">
                                            <a href="" >
                                            <b>{{$news3->news_title}}</b>
                                            </a>
                                        </div>
                                        </div>

                                    </div>
                                </div>

                                @endforeach
                                <div class="col-lg-12"><hr></div>

                                <div class="col-12">
                                        <div style="border-right: solid 1px #666; padding-right: 10px;">
                                    @foreach($cat_lead_news_4 as $news)
                                    @php 
                                        $news_sl = $loop->iteration;
                                        if($news_sl == 3){
                                        $bottom_border = "";
                                        }else{
                                        $bottom_border = "border-bottom: solid 2px #9D9D9D;";
                                        }
                                    @endphp
                                            <style>
                                                .title-color-news{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                                                .title-color-news{{$loop->iteration}} a:hover{color:#E70303 !important;}
                                            </style>
                                        <!--Border start-->
                                        <div style="{{$bottom_border}} padding-bottom:15px; margin-bottom:15px;">
                                        <table>
                                        <tr>
                                            <td>
                                            <a href="">
                                                <img class="slider-image" src="{{ asset('public/images/news_img/thumbnail/'. $news->image) }}" alt="" style="width:160px;">
                                            </a>
                                            </td>
                                            <td style="padding:10px; background-color:#EFEBEA; width:100%">
                                            <div>
                                            <div class="title-color-news{{$loop->iteration}}" style="padding-top:5px;">
                                                <a href="{{route('news-details',[$news->id])}}" style="font-size:22px;">
                                                <b>{{$news->news_title}}</b>
                                                </a>
                                            </div>
                                            </div>
                                            </td>
                                        </tr>
                                        </table>
                                        </div>
                                        <!--Close Border start-->
                                        @endforeach
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

                    <div style="padding: 10px; margin: 15px 0; background-color:#1C1C1C; color:#FFF; font-size:22px;"><b>এই বিভাগের র্সবাধিক জনপ্রিয়</b></div>
                    <div style="padding-right: 10px;">
                                    @foreach($populer as $news)
                                    @php 
                                        $news_sl = $loop->iteration;
                                        if($news_sl == 20){
                                        $bottom_border = "";
                                        }else{
                                        $bottom_border = "border-bottom: solid 2px #9D9D9D;";
                                        }
                                    @endphp
                                            <style>
                                                .title-color-news{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                                                .title-color-news{{$loop->iteration}} a:hover{color:#E70303 !important;}
                                            </style>
                                        <!--Border start-->
                                        <div style="{{$bottom_border}} padding-bottom:15px; margin-bottom:15px;">
                                        <table>
                                        <tr>
                                            <td>
                                            <a href="">
                                                <img class="slider-image" src="{{ asset('public/images/news_img/thumbnail/'. $news->image) }}" alt="" style="width:120px;">
                                            </a>
                                            </td>
                                            <td style="padding:10px; background-color:#EFEBEA; width:100%">
                                            <div>
                                            <div class="title-color-news{{$loop->iteration}}" style="padding-top:5px;">
                                                <a href="{{route('news-details',[$news->id])}}" style="font-size:22px;">
                                                <b>{{$news->news_title}}</b>
                                                </a>
                                            </div>
                                            </div>
                                            </td>
                                        </tr>
                                        </table>
                                        </div>
                                        <!--Close Border start-->
                                        @endforeach
                                    </div>
                </div>
                <!-- /Col Section -->

            </div>
        </div>

    </section>



@endsection