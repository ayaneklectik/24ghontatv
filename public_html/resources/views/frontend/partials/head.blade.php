<title>{{ $app->app_title }}</title>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />

<meta name="description"
    content="24hghonta is the Most Popular Bangla Newspaper. It covers Breaking News, Politics, Economies, National, International, Live Sports, Entertainment, Lifestyle, Tech, Education, Photo, Video, BD News &amp; More. Stay with us for get more Latest News.">
<meta name="keywords"
    content="popular bangla newspaper, daily news paper, breaking news, current news, online bangla newspaper, online paper, all bangla news paper, bd news, bangladeshi potrika, bangladeshi news portal, all bangla newspaper, bangla news, bd newspaper,
bangla news 24, live sports, polities, entertainment, lifestyle, country news" />
<meta name="viewport" content="width=device-width, initial-scale=1">

@yield('meta_tags')

@stack('scripts')

<!-- Favicon -->
<!--<link rel="shortcut icon" href="{{ asset('public/images/logos/favicon.png') }}" type="image/x-icon">-->
<!--<link rel="icon" href="{{ asset('public/images/logos/favicon.png') }}" type="image/x-icon">-->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,600,700,900" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">

<!-- Breaking News -->
<link rel="stylesheet" href="{{ asset('public/public_assist/breaking-news-ticker/breaking-news-ticker.css') }}">

<!-- Bootstrap -->
<link rel="stylesheet" href="{{ asset('public/public_assist/css/assets/bootstrap.min.css') }}">

<!-- Fontawesome Icon -->
<link rel="stylesheet" href="{{ asset('public/public_assist/css/assets/font-awesome.min.css') }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<!-- Animate Css -->
<link rel="stylesheet" href="{{ asset('public/public_assist/css/assets/animate.css') }}">

<!-- Owl Slider -->
<link rel="stylesheet" href="{{ asset('public/public_assist/css/assets/owl.carousel.min.css') }}">

<!-- Magnific PopUp -->
<link rel="stylesheet" href="{{ asset('public/public_assist/css/assets/magnific-popup.css') }}">

<!-- Custom Style -->
<link rel="stylesheet" href="{{ asset('public/public_assist/css/assets/normalize.css') }}">
<link rel="stylesheet" href="{{ asset('public/public_assist/css/style.css') }}">
<link rel="stylesheet" href="{{ asset('public/public_assist/css/menu_footer.css') }}">
<link rel="stylesheet" href="{{ asset('public/public_assist/css/custom.css') }}">
<link rel="stylesheet" href="{{ asset('public/public_assist/css/assets/responsive.css') }}">

<link rel="stylesheet" href="{{ asset('public/public_assist/datepiker/picker.css') }}">
<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>

<link rel="stylesheet" href="{{ asset('public/public_assist/up_arrow.css') }}">
<link rel="stylesheet" href="{{ asset('public/public_assist/css/live_video.css') }}">

<link rel="stylesheet" href="{{ asset('public/public_assist/drawer_menu/tinyDrawer.css') }}">

<script type='text/javascript'
    src='https://platform-api.sharethis.com/js/sharethis.js#property=65b3f9dadce46a00126a9b75&product=sop'
    async='async'></script>



<style>
    #myLink {
        color: black;
    }

    #myLink:hover {
        color: red;
    }

    .sticky {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 9999;
    }

    .sticky+.content {
        padding-top: 30px;
    }

    @media only screen and (max-width: 720px) {
        .sticky {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 9999;
        }

        .sticky+.content {
            padding-top: 60px;
        }
    }

    .aro_dekhun {
        font-size: 12px;
        line-height: 40px;
        color: #e70303;
    }

    .aro_dekhun_plus {
        font-size: 14px;
        line-height: 40px;
        color: #e70303;
    }
</style>
