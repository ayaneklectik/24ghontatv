@extends('frontend.master_layout')
@section('content')
@push('scripts')
<link rel="stylesheet" href="{{asset('public/public_assist/css/slider.css')}}">
<link href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"></script>


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
        background-image: url({{ asset('public/images/play_icon.png') }}); /* Provide path to your play icon */
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
                        <b>ওয়েব নিউজ পরিবার</b>
                </div>

                <div class="row" style="padding-top:20px;">

                @foreach ($members as $member)
                @if($member->status == 1)
                <div class="col-lg-3 col-md-12">
                    <div class="">
                        <div class="family-img">
                            <a href="{{ asset('public/images/news_family/' . $member->photo) }}" data-lightbox="gallery">
                                <img src="{{ asset('public/images/news_family/thumbnail/' . $member->photo) }}" width="100%">
                            </a>
                        </div>
                        <div style="font-size:14px; padding-top:0px; text-align:center;"><a href="#"><b>{{$member->name}}</b></a></div>
                        <div style="font-size:14px; padding-top:5px; text-align:center;"><a href="#">{{$member->position}}</a></div>
                    </div>
                </div>
                @endif
                @endforeach
                  
                    
                </div>


                   
                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-lg-12 col-md-12" style="padding-top:100px;">
                    <hr>
                </div>
                <!-- /Col Section -->

       


          
            </div>
        </div>
</section>
<!-- End News Area -->



@endsection