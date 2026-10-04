<footer class="footer-area">
    <div class="custom-container-footer pb-3">

        <!-- Top Menu -->
        <div class="menu-area-footer">
                <div class="main-menu" style="text-align:center;">
                    <ul class="list-unstyled list-inline">
                        <li class="list-inline-item">
                            <a href="{{ route('home') }}">
                                <i class="fa fa-home" style="font-size:22px; color:#FFF;"></i>
                            </a>
                        </li>
                        @foreach ($nav_cats as $cat)
                            <li class="list-inline-item">
                                <a href="{{ route('all-category-news', $cat->id) }}">
                                    {{ $cat->cat_name }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
        </div>

        <!-- <div class="menu-area-footer">
            <div class="col-md-12" style="text-align:center;">
                <div class="main-menu">
                    <ul class="list-unstyled list-inline">
                        <li class="list-inline-item"><a href="{{ route('home') }}">প্রথম পাতা</li>
                        @foreach ($nav_cats as $cat)
                            <li class="list-inline-item">
                                <a href="{{ route('all-category-news', $cat->id) }}">{{ $cat->cat_name }}</a>
                            </li>
                        @endforeach

                    </ul>
                </div>
            </div>
        </div> -->

        <div class="container">
            <div class="row text-center text-md-start">

                <!-- Column 1 -->
                <div class="col-12 col-md-4 mt-3 border-md-end" style="border-right: solid 4px #666;">
                    <div>
                        <a href="{{ route('home') }}">
                            <img src="{{ asset('public/images/logos/logo_footer.png') }}"
                                 class="img-fluid"
                                 width="180"
                                 alt="Logo">
                        </a>
                    </div>

                    <div class="mt-2">
                        <strong>সম্পাদক ও প্রকাশক</strong>
                        <h6>আরিফ সোহেল</h6>
                        <strong>নির্বাহী সম্পাদক</strong>
                        <h6>এস এম আবুল হোসেন</h6>
                        <strong>উপ-সম্পাদক</strong>
                        <h6>সালাউদ্দিন স্বপন</h6>
                    </div>
                </div>

                <!-- Column 2 -->
                <div class="col-12 col-md-4 mt-3 border-md-end" style="border-right: solid 4px #666;">
                    <div class="mt-2">
                        <h5><strong>বার্তা বিভাগ ও বাণিজ্যিক যোগাযোগ</strong></h5>

                        <p class="mt-3 mb-2">
                            <strong>নির্বাহী প্রধান [আইটি]</strong><br>
                            এস এম মোয়াজ্জেম হোসেন
                        </p>

                        <p class="mb-2">
                            <strong>আবাসিক সম্পাদক [যুক্তরাষ্ট্র]</strong><br>
                            দর্পণ কবীর
                        </p>

                        <p class="mb-0">
                            ২৪ঘণ্টা টিভি, মানিকগঞ্জ হাউজিং (তৃতীয় তলা)<br>
                            ২১৬, শহীদ সৈয়দ নজরুল ইসলাম সরণি<br>
                            পুরানা পল্টন, ঢাকা-১০০০
                        </p>
                    </div>
                </div>

                <!-- Column 3 -->
                <div class="col-12 col-md-4 mt-3">
                    <div class="mt-2">
                        <h5><a href="#">বিজ্ঞাপন</a></h5>
                        <h5><a href="#">গোপনীয়তার নীতি</a></h5>
                        <h5><a href="#">যোগাযোগ</a></h5>
                        <h5><a href="#">আমাদের সম্পর্কে</a></h5>
                    </div>

                    <!-- Social -->
                    <div class="social-media mt-3">
                        <ul class="list-inline">

                            <li class="list-inline-item" style="padding:5px 10px; border:1px solid #666; border-radius:5px;">
                                <a href="{{ $media->facebook }}" target="_blank">
                                    <i class="fa fa-facebook"></i>
                                </a>
                            </li>

                            <li class="list-inline-item" style="padding:5px 10px; border:1px solid #666; border-radius:5px;">
                                <a href="{{ $media->twitter }}" target="_blank">
                                    <i class="fa-brands fa-x-twitter"></i>
                                </a>
                            </li>

                            <li class="list-inline-item" style="padding:5px 10px; border:1px solid #666; border-radius:5px;">
                                <a href="{{ $media->instagram }}" target="_blank">
                                    <i class="fa fa-instagram"></i>
                                </a>
                            </li>

                            <li class="list-inline-item" style="padding:5px 10px; border:1px solid #666; border-radius:5px;">
                                <a href="{{ $media->youtube }}" target="_blank">
                                    <i class="fa fa-youtube"></i>
                                </a>
                            </li>

                            <li class="list-inline-item" style="padding:5px 10px; border:1px solid #666; border-radius:5px;">
                                <a href="#" target="_blank">
                                    <i class="fa fa-linkedin"></i>
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
            <!-- Bottom -->
        <div class="col-12 text-center mt-3">
            <hr>
            <p>
                © {{ date('Y') }} | All rights reserved by বাংলাওয়েব কমিউনিকেশন্স লিমিটেড
            </p>
        </div>
    </div>

</footer>
