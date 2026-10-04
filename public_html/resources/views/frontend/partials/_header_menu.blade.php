
<style>
/* Sticky Header */
.head-bar {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
}

/* Logo animation */
#logo-image {
    transition: all 0.3s ease;
    max-height: 70px;
}

.head-bar.sticky #logo-image {
    max-height: 50px;
}

/* Proper row alignment */
.header-row {
    min-height: 80px;
    align-items: center;
}

/* Social fix */
.social-media ul {
    padding: 0;
    margin: 0;
}

.social-media ul li {
    padding: 5px 8px;
    border: 1px solid #CCC;
    border-radius: 5px;
}


</style>


<!-- ================= HEADER ================= -->
<div class="custom-container-top">
    <div class="row header-row">

        <!-- Logo -->
        <div class="col-6 col-lg-2 col-sm-4">
            <div class="head-bar">
                <a href="{{ route('home') }}">
                    <img id="logo-image"
                         src="{{ asset('public/images/logos/logofinal.png') }}"
                         class="img-fluid">
                </a>
            </div>
        </div>

        <!-- Date -->
        <div class="col-lg-4 d-lg-block col-sm-6">
            <div style="font-size:20px;">
                @include('frontend.partials.c_date')
            </div>
        </div>

        <!-- Live -->
        <!-- <div class="col-6 col-lg-2 text-end">
            @if ($video_link->status == 1)
                <a onclick="openPopup()">
                    <img src="{{ asset('public/images/live_img.png') }}" style="max-height:60px;">
                </a>
            @else
                <img src="{{ asset('public/images/no_live_img.png') }}" style="max-height:60px;">
            @endif
        </div> -->

        <!-- Social -->
        <div class="col-lg-5 d-none d-lg-flex justify-content-end align-items-center">
            <div class="social-media">
                <ul class="list-inline mb-0">

                    <li class="list-inline-item">
                        <a href="#"><i class="fa fa-facebook"></i></a>
                    </li>

                    <li class="list-inline-item">
                        <img src="{{ asset('public/images/x_logo.jpg') }}" width="18">
                    </li>

                    <li class="list-inline-item">
                        <i class="fa fa-instagram"></i>
                    </li>

                    <li class="list-inline-item">
                        <i class="fa fa-youtube"></i>
                    </li>

                </ul>
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


            <!-- <div class="col-12" id="hide_in_mobile">
                <div class="main-menu">
                    <ul style="display: flex; flex-wrap: wrap; gap: 2px; list-style: none; padding: 0; margin: 0;">
                        <li class="list-inline-item">
                            <a href="{{ route('home') }}" style="text-decoration: none; padding: 2px 5px; display: block; white-space: nowrap;">
                                <i class="fa fa-home" style="font-size:22px;"></i>
                            </a>
                        </li>
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
            </div> -->

            <div class="col-12" id="hide_in_mobile">
                <div class="main-menu">
                    <ul class="menu-list">
                        
                        {{-- Home --}}
                        <li class="menu-item">
                            <a href="{{ route('home') }}">
                                <i class="fa fa-home"></i>
                            </a>
                        </li>

                        {{-- Main Categories --}}
                        @foreach ([$nav_cats, $remaining_categories] as $categoryGroup)
                            @foreach ($categoryGroup as $cat)
                                <li class="menu-item">
                                    <a href="{{ route('all-category-news', $cat->id) }}">
                                        {{ $cat->cat_name }}
                                    </a>
                                </li>
                            @endforeach
                        @endforeach

                        {{-- Search --}}
                        <li class="menu-item">
                            <a href="{{ route('search-all-category-news') }}" target="_blank">
                                <i class="fa fa-search"></i>&nbsp;খুঁজুন
                            </a>
                        </li>

                        {{-- Show All --}}
                        <li class="menu-item">
                            <a href="javascript:void(0)" onclick="showOverlay()">
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


