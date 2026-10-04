<!-- Menu Area -->
<section class="" id="">
    <div class="custom-container-top">
        <div class="row">

            <div class="col-md-12 hide" id="hide_in_mobile" style="height:10px;"></div>
            <div class="col-lg-2 col-md-12" id="hide_in_mobile">
                <div id="" style="padding:0px 10px 10px 0px;">
                    <a href="{{ route('home') }}">
                        <img src="{{ asset('public/images/logos/logofinal.png') }}" class="img-fluid w-100">
                    </a>
                </div>
            </div>

            <div class="col-lg-3 col-md-12 " id="hide_in_mobile">
                <div style="padding-top:40px; font-size:20px;">
                    @include('frontend.partials.c_date')
                </div>
            </div>


            <div class="col-lg-2 col-md-12" id="hide_in_mobile">
                <div id="" style="padding:20px 10px 10px 0px; text-align: right">
                    @if ($video_link->status == 1)
                        <div id="blink" style="padding:10px 10px 10px 0px;">
                            @if (!empty($video_link->live_video_link))
                                <a onclick="openPopup()" style="cursor: pointer;">
                                    <img src="{{ asset('public/images/live_img.png') }}" alt="webnews24"
                                        class="img-fluid" width="100">
                                </a>
                            @else
                                <a onclick="openPopup()" style="cursor: pointer;">
                                    <img src="{{ asset('public/images/live_img.png') }}" alt="webnews24"
                                        class="img-fluid" width="100">
                                </a>
                            @endif
                        </div>
                    @else
                        <img src="{{ asset('public/images/no_live_img.png') }}" alt="webnews24" class="img-fluid"
                            width="130">
                    @endif
                </div>
            </div>

            <div class="col-lg-4 col-md-12" id="hide_in_mobile">
                <div style="text-align:right;">
                    <!--<a href="{{ route('t20-category') }}">
                <img src="{{ asset('public/images/top_right_img.png') }}" style="padding:5px 0px 0px 10px;" alt="Proval Logo" class="img-fluid" width="350">
            </a>-->
                </div>
                <div class="social-media" style="text-align:right; padding-top:25px;">
                    <ul class="list-inline">

                        <li class="list-inline-item"
                            style="padding:5px 10px; border: solid 1px #CCC; border-radius: 5px;">
                            <a href="https://www.facebook.com/profile.php?id=61573135707166" target="blank"><i
                                    class="fa fa-facebook"></i></a>
                        </li>
                        <li class="list-inline-item"
                            style="padding:5px 10px; border: solid 1px #CCC; border-radius: 5px;">
                            <a href="https://x.com/24ghontatv" target="blank"> <img
                                    src="{{ asset('public/images/x_logo.jpg') }}" alt="logo" width="20"></a>
                        </li>
                        <li class="list-inline-item"
                            style="padding:5px 10px; border: solid 1px #CCC; border-radius: 5px;">
                            <a href="https://www.instagram.com/24ghontatv" target="blank"><i
                                    class="fa fa-instagram"></i></a>
                        </li>
                        <li class="list-inline-item"
                            style="padding:5px 10px; border: solid 1px #CCC; border-radius: 5px;">
                            <a href="https://www.youtube.com/@24ghontatv" target="blank"><i
                                    class="fa fa-youtube"></i></a>
                        </li>

                    </ul>
                </div>
            </div>
        </div>

    </div>
</section>
<!-- End Menu Area -->
