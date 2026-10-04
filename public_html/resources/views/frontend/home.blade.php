@extends('frontend.master_layout')

@section('content')
    @include('frontend.partials.breaking_news')
 @push('scripts')
    <link rel="stylesheet" href="{{asset('public/public_assist/css/slider.css')}}">
    <link rel="stylesheet" href="{{asset('public/public_assist/youtube_popup.css')}}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"></script>
    <style>
    .video_image {
        position: relative;
        overflow: hidden; 
    }

    .play_icon {
        position: absolute;
        top: 46%;
        left: 15%;
        width: 55px;
        height: 40px;
        background-image: url({{ asset('public/images/play_icon.png') }}); /* Provide path to your play icon */
        background-size: cover;
        cursor: pointer;
        opacity:0.7;
        transition: color 0.3s ease; /* Transition for color change */
    }

    .play_icon:hover {
        color: red; /* Change color on hover */
    }

    </style>
    @endpush
    <!-- News Area -->
    <section class="news-area">
        <div class="custom-container" style="margin-top:15px;">
            <div class="row">
                <!--<div class="col-12">-->
                <!--    <a href="/all-category-news/27" target="_blank" style="text-decoration:none;display:block;">-->
                <!--        <div style="width:100%;text-align:center;">-->
                <!--            <img -->
                <!--                src="{{ asset('public/images/Election-Top-Banner.jpg') }}" -->
                <!--                alt="রয়াদশ জাতীয় সংসদ নির্বাচন ২০২৬"-->
                <!--                style="width:100%;max-height:160px;object-fit:cover;"-->
                <!--            >-->
                <!--        </div>-->
                    
                        <!-- Countdown -->
                <!--        <div style="display:flex;justify-content:center;gap:15px;margin:20px 0;">-->
                    
                            <!-- Days -->
                <!--            <div style="text-align:center;">-->
                <!--                <div id="days"-->
                <!--                     style="background:#0b9444;color:#fff; width: 60px;-->
                <!--                            font-size:22px;font-weight:bold;-->
                <!--                            padding:10px 18px;border-radius:4px;">-->
                <!--                    00-->
                <!--                </div>-->
                <!--                <div style="margin-top:5px;font-size:14px;color:#000;">দিন</div>-->
                <!--            </div>-->
                    
                            <!-- Hours -->
                <!--            <div style="text-align:center;">-->
                <!--                <div id="hours"-->
                <!--                     style="background:#0b9444;color:#fff;width: 60px;-->
                <!--                            font-size:22px;font-weight:bold;-->
                <!--                            padding:10px 18px;border-radius:4px;">-->
                <!--                    00-->
                <!--                </div>-->
                <!--                <div style="margin-top:5px;font-size:14px;color:#000;">ঘন্টা</div>-->
                <!--            </div>-->
                    
                            <!-- Minutes -->
                <!--            <div style="text-align:center;">-->
                <!--                <div id="minutes"-->
                <!--                     style="background:#0b9444;color:#fff;width: 60px;-->
                <!--                            font-size:22px;font-weight:bold;-->
                <!--                            padding:10px 18px;border-radius:4px;">-->
                <!--                    00-->
                <!--                </div>-->
                <!--                <div style="margin-top:5px;font-size:14px;color:#000;">মিনিট</div>-->
                <!--            </div>-->
                    
                            <!-- Seconds -->
                <!--            <div style="text-align:center;">-->
                <!--                <div id="seconds"-->
                <!--                     style="background:#0b9444;color:#fff;width: 60px;-->
                <!--                            font-size:22px;font-weight:bold;-->
                <!--                            padding:10px 18px;border-radius:4px;">-->
                <!--                    00-->
                <!--                </div>-->
                <!--                <div style="margin-top:5px;font-size:14px;color:#000;">সেকেন্ড</div>-->
                <!--            </div>-->
                    
                <!--        </div>-->
                <!--    </a>-->
                <!--</div>-->
                <!-- Col Section -->
                <div class="col-12">
                    @if( App\Http\Controllers\StaticLinkController::getNewsByID($top_news_1->news_id))
                    @include('frontend.top_five_new')
                    @endif
                </div>
                <!-- /Col Section -->

                <!-- Col Section -->
                <div class="col-12">
                    @include('frontend.lead_news')
                </div>
                <!-- /Col Section -->

            </div>
        </div>
    </section>
    <!-- End News Area -->

    @include('frontend.news.lead_bottom')
    @include('frontend.news.news')

    <!-- Gallery -->
    <section class="gallery-area" style="margin-bottom:30px;">
        <div class="custom-container">
            <div class="row">
                @include('frontend.gallery')
            </div>
        </div>
    </section>
    <!-- Gallery End -->

    <div id="youtubelightbox" class="parent">
        <div class="centeredchild">
            <div class="videowrapper">
                <div id="playerdiv"></div>
            </div>
        </div>
    </div>
    
  <script>
//     // Convert English digits to Bangla
//     function toBangla(num) {
//         const map = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
//         return num.toString().split('').map(n => map[n]).join('');
//     }

//     // 🗳️ Official Election Date
//     // 12 February 2026 (Morning 8 AM – adjust if needed)
//     const targetDate = new Date("2026-02-12T07:30:00").getTime();

//     setInterval(() => {
//         const now = new Date().getTime();
//         const diff = targetDate - now;

//         if (diff <= 0) {
//             document.getElementById('box-0').innerText = '০';
//             document.getElementById('box-1').innerText = '০';
//             document.getElementById('box-2').innerText = '০';
//             document.getElementById('box-3').innerText = '০';
//             return;
//         }

//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((diff / (1000 * 60)) % 60);
//         const seconds = Math.floor((diff / 1000) % 60);

//         document.getElementById('days').innerText = toBangla(days);
//         document.getElementById('hours').innerText = toBangla(hours);
//         document.getElementById('minutes').innerText = toBangla(minutes);
//         document.getElementById('seconds').innerText = toBangla(seconds);

//     }, 1000);
 </script>
@endsection

@push('scripts')
    <!-- OG Image Meta -->
    <meta property="og:image" content="{{ asset('public/images/logos/banner1.jpg') }}" />
    <meta property="og:image:secure_url" content="{{ asset('public/images/logos/banner1.jpg') }}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="315" />
    <meta property="og:image:alt" content="দৈনিক 24 ঘন্টা" />

    <!-- Styles and Scripts -->
    <link rel="stylesheet" href="{{ asset('public/public_assist/css/slider.css') }}">
    <link rel="stylesheet" href="{{ asset('public/public_assist/youtube_popup.css') }}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"></script>
    <script src="{{ asset('public/public_assist/youtube_popup.js') }}"></script>

    <style>
        .video_image {
            position: relative;
            overflow: hidden;
        }

        .play_icon {
            position: absolute;
            top: 40%;
            left: 5%;
            width: 55px;
            height: 40px;
            background-image: url('{{ asset('public/images/play_icon.png') }}');
            background-size: cover;
            cursor: pointer;
            transition: color 0.3s ease;
        }

        .play_icon:hover {
            color: red;
        }
    </style>
    
    
@endpush
