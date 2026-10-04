<style>
    div.scroll {
        margin: 4px, 4px;
        padding-right: 10px;
        height: 350px;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>

<!-- News Area -->
<section class="news-area" style="margin-top: 30px; margin-bottom: 30px; padding-top: 30px;  padding-bottom: 20px;"
    id="hide_in_mobile">
    <div class="custom-container" style="border-bottom: solid 2px #9D9D9D;">
        <div class="row">
            @foreach ($lead_news2 as $news)
                
                <div class="col-lg-4">
                    <a href="{{ route('news-details', [$news->id]) }}">
                        <div style="border-right: solid 2px #9D9D9D; padding-right:20px;">
                            <div>
                                
                                    <img class="slider-image img-fluid w-100"
                                        src="{{ asset('public/images/news_img/' . $news->image) }}" alt="">
                                
                            </div>
    
                            <div style="padding :15px; background-color:#efebea; height:130px;">
                                
                                    <b>{{ $news->news_title }}</b>
                            </div>
    
                        </div>
                     </a>
                </div>
               
            @endforeach

            <div class="col-lg-4">
                <div style="border-right: solid 1px #666; padding-right: 10px;">
                    @foreach ($lead_news3 as $news)
                        @php
                            $news_sl = $loop->iteration;
                            if ($news_sl == 3) {
                                $bottom_border = '';
                            } else {
                                $bottom_border = 'border-bottom: solid 2px #9D9D9D;';
                            }
                        @endphp
                        <style>
                            .title-color-news{{ $loop->iteration }} a {
                                color: {{ $news->title_color }} !important;
                            }

                            .title-color-news{{ $loop->iteration }} a:hover {
                                color: #E70303 !important;
                            }
                        </style>
                        <!--Border start-->
                        <div style="{{ $bottom_border }} padding-bottom:15px; margin-bottom:15px;">
                            <table>
                                <tr>
                                    <td>
                                        <a href="{{ route('news-details', [$news->id]) }}">
                                            <img class="slider-image img-fluid w-100"
                                                src="{{ asset('public/images/news_img/thumbnail/' . $news->image) }}"
                                                alt="" style="width:160px;">
                                        </a>
                                    </td>
                                    <td style="padding:10px; background-color:#EFEBEA; width:100%">
                                        <div>
                                            <div class="title-color-news{{ $loop->iteration }}"
                                                style="padding-top:5px;">
                                                <a href="{{ route('news-details', [$news->id]) }}"
                                                    style="font-size:22px;">
                                                    <b>{{ $news->news_title }}</b>
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

            <div class="col-lg-4">

                <div style="color:red; font-size:30px; padding-bottom:15px;">
                    <img src="{{ asset('public/images/braking_img.png') }}" alt="webnews24" class="img-fluid"
                        width="30">
                    &nbsp;
                    <b>সাম্প্রতিক সংবাদ</b>
                </div>
                <div class="scroll">
                    @foreach ($latestNews as $news)
                        @php
                            $sl = $loop->iteration;
                            if ($sl == 5) {
                                $bottom_border = '';
                            } else {
                                $bottom_border = 'border-bottom: solid 2px #9D9D9D;';
                            }
                        @endphp
                        <div style="{{ $bottom_border }} font-size:22px; padding-bottom:10px; margin-bottom:10px;">
                            <a href="{{ route('news-details', [$news->id]) }}"
                                style="font-size:22px; color:#000; text-align: justify;">
                                <div>{{ $news->news_title }}</div>
                            </a>
                        </div>
                    @endforeach
                </div>

            </div>

        </div>
    </div>

</section>

<!-- News Area for Mobile -->
<section class="news-area hide" style="margin-top: 30px; margin-bottom: 30px; padding-top: 30px;  padding-bottom: 20px;"
    id="hide_in_desktop">
    <div class="custom-container" style="border-bottom: solid 2px #9D9D9D;">
        <div class="row">
            @foreach ($lead_news2 as $news)
                <div class="col-lg-12">
                    <div>
                        <div>
                            <a href="">
                                <img class="slider-image img-fluid w-100"
                                    src="{{ asset('public/images/news_img/' . $news->image) }}" alt="">
                            </a>
                        </div>

                        <div style="padding :15px; background-color:#efebea; height:130px;">
                            <a href="{{ route('news-details', [$news->id]) }}" style="font-size:27px; color:#000;">
                                <b>{{ $news->news_title }}</b>
                            </a>
                        </div>

                    </div>
                </div>
            @endforeach

            <div class="col-lg-12">
                <div>
                    @foreach ($lead_news3 as $news)
                        @php
                            $news_sl = $loop->iteration;
                            if ($news_sl == 3) {
                                $bottom_border = '';
                            } else {
                                $bottom_border = 'border-bottom: solid 2px #9D9D9D;';
                            }
                        @endphp
                        <style>
                            .title-color-news{{ $loop->iteration }} a {
                                color: {{ $news->title_color }} !important;
                            }

                            .title-color-news{{ $loop->iteration }} a:hover {
                                color: #E70303 !important;
                            }
                        </style>
                        <!--Border start-->
                        <div style="{{ $bottom_border }} padding-bottom:15px; margin-bottom:15px;">
                            <table>
                                <tr>
                                    <td>
                                        <a href="">
                                            <img class="slider-image"
                                                src="{{ asset('public/images/news_img/thumbnail/' . $news->image) }}"
                                                alt="" style="width:160px;">
                                        </a>
                                    </td>
                                    <td style="padding:10px; width:100%">
                                        <div>
                                            <div class="title-color-news{{ $loop->iteration }}"
                                                style="padding-top:5px;">
                                                <a href="{{ route('news-details', [$news->id]) }}"
                                                    style="font-size:22px;">
                                                    <b>{{ $news->news_title }}</b>
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

            <div class="col-12">

                <div style="color:red; font-size:30px; padding-bottom:15px;">
                    <img src="{{ asset('public/images/braking_img.png') }}" alt="webnews24" class="img-fluid"
                        width="30">
                    &nbsp;
                    <b>সাম্প্রতিক সংবাদ</b>
                </div>
                <div class="scroll">
                    @foreach ($latestNews as $news)
                        @php
                            $sl = $loop->iteration;
                            if ($sl == 5) {
                                $bottom_border = '';
                            } else {
                                $bottom_border = 'border-bottom: solid 2px #9D9D9D;';
                            }
                        @endphp
                        <div style="{{ $bottom_border }} font-size:20px; padding-bottom:10px; margin-bottom:10px;">
                            <a href="{{ route('news-details', [$news->id]) }}" style="font-size:27px; color:#000;">
                                <div>{{ $news->news_title }}</div>
                            </a>
                        </div>
                    @endforeach
                </div>

            </div>

        </div>
    </div>

</section>
