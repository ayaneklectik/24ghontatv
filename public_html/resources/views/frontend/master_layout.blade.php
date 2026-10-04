<html class="no-js" lang="bn-BD ">

<head>
    @include('frontend.partials.head')
</head>

<body>
    <div id="fb-root"></div>

    @include('frontend.partials.side_nav')

    <!-- Top Bar -->
    @include('frontend.partials.calender')

    <!-- End Top Bar -->

    <!-- Menu -->
    @include('frontend.partials._header_menu')

    @yield('content')

    @include('frontend.partials._footer')

    @include('frontend.live_video_popup')


    @include('frontend.partials.scripts')


    @stack('js_scripts')

</body>

</html>
