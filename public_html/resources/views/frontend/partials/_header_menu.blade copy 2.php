<style>
    .head-bar {
        position: -webkit-sticky;
        /* For Safari */
        position: sticky;
        top: 0;
        z-index: 1000;
        /* Ensure it stays on top */
        background-color: white;
        /* Or any background color to match your site */
    }

    #logo-image {
        transition: width 0.3s ease, padding 0.3s ease;
    }

    .head-bar.sticky #logo-image {
        width: 100px;
        /* Adjust the size as needed */
        padding: 5px 0px 0px 5px;
        /* Adjust the padding as needed */
        margin-top: -10px;
    }
</style>
<div class="container hide">
    <div class="row hide">
        <div class="col-6">
            <div class="head-bar" style="text-align:left;">
                <div style="padding:0px 10px 10px 0px; background-color:#FFF;">
                    <a href="{{ route('home') }}">
                        <img id="logo-image" src="{{ asset('public/images/logos/logo.png') }}"
                            style="padding:15px 0px 0px 10px;" alt="Proval Logo" class="img-fluid" width="140">
                    </a>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div id="" style="padding:20px 10px 10px 0px; text-align: right">
                @if ($video_link->status == 1)
                    <div id="blink" style="padding:10px 10px 10px 0px;">
                        @if (!empty($video_link->live_video_link))
                            <a onclick="openPopup()" style="cursor: pointer;">
                                <img src="{{ asset('public/images/live_img.png') }}" alt="webnews24" class="img-fluid"
                                    width="100">
                            </a>
                        @else
                            <a onclick="openPopup()" style="cursor: pointer;">
                                <img src="{{ asset('public/images/live_img.png') }}" alt="webnews24" class="img-fluid"
                                    width="100">
                            </a>
                        @endif
                    </div>
                @else
                    <img src="{{ asset('public/images/no_live_img.png') }}" alt="webnews24" class="img-fluid"
                        width="130">
                @endif
            </div>
        </div>
    </div>
</div>



<!-- Menu Area -->
<section class="top-nav" id="navbar" style="border-top:solid 1px red; border-bottom:solid 1px red">
    <div class="custom-container-top">
        <div class="row">
            <div class="col-1 hide" id="hide_in_desktop">
                <div style="padding-top:15px; color:#999; cursor: pointer;">
                    <a onclick="tinyDrawerOpen(event)">
                        <i class="fa fa-bars" style="font-size:28px;"></i>
                    </a>
                </div>
            </div>

            <div class="col-11 hide">
                <div class="social-media" style="text-align:right;">
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


            <!--<div class="col-12" id="hide_in_mobile">-->
            <!--    <div class="main-menu">-->
            <!--        <ul class="list-inline">-->
            <!--            @foreach ($nav_cats as $cat)-->
            <!--                <li class="list-inline-item"><a href="{{ route('all-category-news', $cat->id) }}">-->
            <!--                        &nbsp;{{ $cat->cat_name }}</a>-->
            <!--                </li>-->
            <!--            @endforeach-->
            <!--            <li class="list-inline-item dropdown">-->
            <!--                <a href="">-->
            <!--                    <i class="fa fa-angle-double-right"></i>-->
            <!--                </a>-->
            <!--                <ul class="dropdown-content list-unstyled">-->
            <!--                    @foreach ($remaining_categories as $cat)-->
            <!--                        <li><a href="{{ route('all-category-news', $cat->id) }}">{{ $cat->cat_name }}</a>-->
            <!--                        </li>-->
            <!--                    @endforeach-->

            <!--                </ul>-->
            <!--            </li>-->
            <!--            <li class="list-inline-item"><a onclick="showOverlay()"><i class="fa fa-list"></i>&nbsp;সব</a>-->
            <!--            </li>-->
            <!--        </ul>-->
            <!--    </div>-->
            <!--</div>-->

            <div class="col-12" id="hide_in_mobile">
                <div class="main-menu">
                    <ul style="display: flex; flex-wrap: wrap; gap: 2px; list-style: none; padding: 0; margin: 0;">
                        
                        @foreach ($nav_cats as $cat)
                            <li>
                                <a href="{{ route('all-category-news', $cat->id) }}" 
                                   style="text-decoration: none; padding: 2px 5px; display: block; white-space: nowrap;">
                                    {{ $cat->cat_name }}
                                </a>
                            </li>
                        @endforeach
            
                        @foreach ($remaining_categories as $cat)
                            <li>
                                <a href="{{ route('all-category-news', $cat->id) }}" 
                                   style="text-decoration: none; padding: 2px 5px; display: block; white-space: nowrap;">
                                    {{ $cat->cat_name }}
                                </a>
                            </li>
                        @endforeach
            
                        <li>
                            <a href={{route('search-all-category-news')}} target="_blank" 
                               style="text-decoration: none; padding: 2px 5px; display: block; white-space: nowrap;">
                                <i class="fa fa-search"></i>&nbsp;খুঁজুন
                            </a>
                        </li>
                        <li>
                            <a onclick="showOverlay()" 
                               style="text-decoration: none; padding: 2px 5px; display: block; white-space: nowrap;">
                                <i class="fa fa-list"></i>&nbsp;সব
                            </a>
                        </li>
                    </ul>
                </div>
            </div>



        </div>
    </div>
</section>
<!-- End Menu Area -->


<!-- Overlay container -->
<div id="overlay" onclick="closeOverlay()">
    <!-- Modal content -->
    <div id="modalContent">
        <section class="menu-area" id="navbar">
            <div class="custom-container">
                <div class="row" style="margin:5px 0px;">
                    <div class="col-md-10" style="margin-top:-15px;">
                        <a href="{{ route('home') }}">
                            <img src="{{ asset('public/images/logos/logo.png') }}" alt="Provat" class="img-fluid"
                                width="90">
                        </a>
                    </div>

                    <div class="col-md-2" style="margin-top:-30px;">
                        <a onclick="closeOverlay()">
                            <div style="font-size:20px; color:#000; padding-top: 20px; cursor:pointer;">&times; Close
                            </div>
                        </a>
                    </div>
                    @foreach ($cats as $cat)
                        <div class="col-md-12">
                            <div style="height:2px; border-bottom:solid 1px #E7E7E7;"></div>
                            <div class="row" style="margin-top:-10px;">
                                <div class="col-2">
                                    <a href="">
                                        <div style="font-size:18px; color:#000; padding-top: 20px;">
                                            <b>{{ $cat->cat_name }}</b>
                                        </div>
                                    </a>
                                </div>
                                @php
                                    try {
                                        $cat_id = $cat->id;
                                        $subcats = App\Http\Controllers\StaticLinkController::getAllSubCatByCatID(
                                            $cat_id,
                                        );
                                    } catch (Exception $e) {
                                        $subcats = [];
                                    }
                                @endphp

                                <table>
                                    <tr>
                                        @foreach ($subcats as $subcat)
                                            <td>
                                                <a href="">
                                                    <div style="font-size:18px; color:#000; padding-top: 20px;">
                                                        &nbsp;&nbsp;&nbsp;
                                                        {{ $subcat->sub_cat_name }}&nbsp;&nbsp;&nbsp;
                                                    </div>
                                                </a>
                                            </td>
                                        @endforeach
                                    </tr>
                                </table>

                            </div>

                        </div>
                    @endforeach


                </div>
            </div>
        </section>
    </div>
</div>

<script>
    window.addEventListener('scroll', function() {
        var header = document.getElementById('hide_in_desktop');
        if (window.scrollY > 50) { // Adjust the value as needed
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
</script>
