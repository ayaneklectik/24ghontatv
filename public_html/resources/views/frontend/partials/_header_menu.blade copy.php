<style>
/* Sticky Header */
.head-bar {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
}

#logo-image {
    transition: all 0.3s ease;
}

.head-bar.sticky #logo-image {
    width: 100px;
    padding: 5px;
    margin-top: -10px;
}

/* Responsive hide */
@media (max-width: 768px) {
    #hide_in_mobile { display: none !important; }
}
@media (min-width: 769px) {
    #hide_in_desktop { display: none !important; }
}

/* Menu */
.main-menu ul {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.main-menu ul li a {
    display: block;
    padding: 4px 6px;
    white-space: nowrap;
    text-decoration: none;
}

/* Social */
.social-media ul {
    padding: 0;
    margin: 0;
}

.social-media ul li {
    padding: 5px 10px;
    border: 1px solid #CCC;
    border-radius: 5px;
}

/* Overlay */
#overlay {
    display: none;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
}

#modalContent {
    background: #fff;
    margin: 30px auto;
    padding: 20px;
    width: 95%;
    max-width: 1200px;
}
</style>


<!-- ================= HEADER ================= -->
<div class="container">
    <div class="row align-items-center">

        <!-- Logo -->
        <div class="col-6 col-lg-2">
            <div class="head-bar">
                <a href="{{ route('home') }}">
                    <img id="logo-image"
                         src="{{ asset('public/images/logos/logofinal.png') }}"
                         class="img-fluid">
                </a>
            </div>
        </div>

        <!-- Date -->
        <div class="col-lg-3 d-none d-lg-block">
            <div style="padding-top:30px; font-size:18px;">
                @include('frontend.partials.c_date')
            </div>
        </div>

        <!-- Live -->
        <div class="col-6 col-lg-2 text-end">
            @if ($video_link->status == 1)
                <a onclick="openPopup()" style="cursor:pointer;">
                    <img src="{{ asset('public/images/live_img.png') }}" width="90">
                </a>
            @else
                <img src="{{ asset('public/images/no_live_img.png') }}" width="110">
            @endif
        </div>

        <!-- Social (Desktop only) -->
        <div class="col-lg-5 d-none d-lg-block text-end">
            <div class="social-media mt-3">
                <ul class="list-inline">

                    <li class="list-inline-item">
                        <a href="https://www.facebook.com/profile.php?id=61573135707166" target="_blank">
                            <i class="fa fa-facebook"></i>
                        </a>
                    </li>

                    <li class="list-inline-item">
                        <a href="https://x.com/24ghontatv" target="_blank">
                            <img src="{{ asset('public/images/x_logo.jpg') }}" width="18">
                        </a>
                    </li>

                    <li class="list-inline-item">
                        <a href="https://www.instagram.com/24ghontatv" target="_blank">
                            <i class="fa fa-instagram"></i>
                        </a>
                    </li>

                    <li class="list-inline-item">
                        <a href="https://www.youtube.com/@24ghontatv" target="_blank">
                            <i class="fa fa-youtube"></i>
                        </a>
                    </li>

                </ul>
            </div>
        </div>

    </div>
</div>


<!-- ================= MENU ================= -->
<section class="top-nav" style="border-top:1px solid red; border-bottom:1px solid red;">
    <div class="custom-container-top">
        <div class="row align-items-center">

            <!-- Mobile Menu Button -->
            <div class="col-2 d-lg-none">
                <a onclick="tinyDrawerOpen(event)">
                    <i class="fa fa-bars" style="font-size:28px;"></i>
                </a>
            </div>

            <!-- Mobile Social -->
            <div class="col-10 text-end d-lg-none">
                <div class="social-media">
                    <ul class="list-inline">
                        <li class="list-inline-item">
                            <a href="https://www.facebook.com/profile.php?id=61573135707166">
                                <i class="fa fa-facebook"></i>
                            </a>
                        </li>
                        <li class="list-inline-item">
                            <a href="https://x.com/24ghontatv">
                                <img src="{{ asset('public/images/x_logo.jpg') }}" width="18">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Menu -->
            <div class="col-12 mt-2">
                <div class="main-menu">
                    <ul>

                        @foreach ($nav_cats as $cat)
                            <li>
                                <a href="{{ route('all-category-news', $cat->id) }}">
                                    {{ $cat->cat_name }}
                                </a>
                            </li>
                        @endforeach

                        @foreach ($remaining_categories as $cat)
                            <li>
                                <a href="{{ route('all-category-news', $cat->id) }}">
                                    {{ $cat->cat_name }}
                                </a>
                            </li>
                        @endforeach

                        <li>
                            <a href="{{ route('search-all-category-news') }}">
                                <i class="fa fa-search"></i> খুঁজুন
                            </a>
                        </li>

                        <li>
                            <a onclick="showOverlay()">
                                <i class="fa fa-list"></i> সব
                            </a>
                        </li>

                    </ul>
                </div>
            </div>

        </div>
    </div>
</section>


<!-- ================= OVERLAY ================= -->
<div id="overlay" onclick="closeOverlay()">
    <div id="modalContent" onclick="event.stopPropagation()">

        <div class="d-flex justify-content-between mb-3">
            <img src="{{ asset('public/images/logos/logo.png') }}" width="90">
            <span onclick="closeOverlay()" style="cursor:pointer;">&times; Close</span>
        </div>

        @foreach ($cats as $cat)
            <div><strong>{{ $cat->cat_name }}</strong></div>

            @php
                try {
                    $subcats = App\Http\Controllers\StaticLinkController::getAllSubCatByCatID($cat->id);
                } catch (Exception $e) {
                    $subcats = [];
                }
            @endphp

            <div>
                @foreach ($subcats as $subcat)
                    <a href="#" style="margin-right:10px;">
                        {{ $subcat->sub_cat_name }}
                    </a>
                @endforeach
            </div>

            <hr>
        @endforeach

    </div>
</div>


<!-- ================= JS ================= -->
<script>
function showOverlay() {
    document.getElementById('overlay').style.display = 'block';
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

window.addEventListener('scroll', function() {
    var header = document.querySelector('.head-bar');
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});
</script>