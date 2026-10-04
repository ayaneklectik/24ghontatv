@if($scroller->status == 1)
 <!-- News Area -->
 <section class="news-area"  style="margin-top:10px; background-color:#EFEBEA; padding-bottom: 0  !important;"  id="hide_in_mobile">
        <div class="custom-container-menu">
            <div class="row" style="padding:0px 15px;">

                <div class="breaking-news-ticker" id="breakingNews">
                    <div class="bn-label">
                      <b>সর্বশেষ</b>&nbsp;
                      <img src="{{asset('public/images/braking_img.png')}}" alt="webnews24" class="img-fluid" width="30">
                    </div>
                    <div class="bn-news ml-4">
                        <ul>
                          @foreach($braking_news as $news)
                            <li>
                                <a href="{{route('news-details',[$news->id])}}"><b>{{$news->news_title}}</b></a>
                                &nbsp; &nbsp;
                            </li>
                            @endforeach
                        </ul>
                    </div>
                    <div class="bn-controls">
                        <button><span class="bn-arrow bn-prev"></span></button>
                        <button><span class="bn-action"></span></button>
                        <button><span class="bn-arrow bn-next"></span></button>
                    </div>
                </div>

            </div>
        </div>
</section>
<!-- End News Area -->
@endif
