<section class="news-area" style="margin-top: 30px; margin-bottom: 30px; padding-top: 30px;" id="hide_in_mobile">
        <div class="custom-container">
            <div class="row" style="border-bottom: solid 2px #9D9D9D;">

                <div class="col-md-12" style="padding-top:10px;">
                    <div class="row">
                          <div class="col-6 col-sm-6">
                            <div style="color:red; font-size:35px; padding-bottom:15px;">
                              <img src="{{asset('public/images/braking_img.png')}}" alt="webnews24" class="img-fluid" width="35">
                              &nbsp;
                            <b><a href="{{route('all-videos')}}"  style="color:red; font-size:35px;">ভিডিও</a></b>
                            </div>
                        </div>
                        <div class="col-6 col-sm-6">
                            <div style="text-align:right;">
                                <a href="{{route('all-videos')}}"  class="aro_dekhun_plus">
                                    <i class="fa fa-plus"></i>&nbsp;আরো ভিডিও দেখুন
                                </a>
                            </div>
                        </div>

                    </div>


                    <div class="row" style="padding-top:10px; padding-bottom:15px;">
              
                        <div class="col-lg-6 col-md-12">
                            <div style="padding-right:15px;">
                                <div class="">
                                <a href="https://www.youtube.com/watch?v={{$video_lead->video_link}}" class="video_lightbox">
                                    <img src="http://i.ytimg.com/vi/{{$video_lead->video_link}}/mqdefault.jpg" width="100%" height="440">
                                    <div class="play_icon"></div>
                                </a>
                                </div>
                                <div style="padding:10px 15px; background-color:#EFEBEA; height:130px; margin-bottom:25px;">
                                  <div style="font-size:22px; padding-top:5px;">
                                  <a href="https://www.youtube.com/watch?v={{$video_lead->video_link}}" class="video_lightbox"  style="font-size:32px; color:#000;">
                                    <b>{{$video_lead->video_title}}</b>
                                    </a>
                                  </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6 col-md-12">
                            <div class="row">
                            @foreach($videos as $video)
                                 <div class="col-lg-6 col-md-12">
                                    <div style="padding-right:15px;">
                                        <div class="">
                                        <a href="https://www.youtube.com/watch?v={{$video->video_link}}" class="video_lightbox">
                                            <img src="http://i.ytimg.com/vi/{{$video->video_link}}/mqdefault.jpg" width="100%">
                                            <div class="play_icon"></div>
                                        </a>
                                        </div>
                                        <div style="padding:10px 15px; background-color:#EFEBEA; height:130px; margin-bottom:25px;">
                                        <div style="font-size:22px; padding-top:5px;">
                                        <a href="https://www.youtube.com/watch?v={{$video->video_link}}" class="video_lightbox"  style="font-size:22px; color:#000;">
                                            <b>{{$video->video_title}}</b>
                                            </a>
                                        </div>
                                        </div>
                                    </div>
                                 </div>
                                 @endforeach
                            </div>

                        </div>

                        @foreach($videos_bottom as $video)
                                 <div class="col-lg-3 col-md-12">
                                    <div style="padding-right:15px;">
                                        <div class="">
                                        <a href="https://www.youtube.com/watch?v={{$video->video_link}}" class="video_lightbox">
                                            <img src="http://i.ytimg.com/vi/{{$video->video_link}}/mqdefault.jpg" width="100%">
                                            <div class="play_icon"></div>
                                        </a>
                                        </div>
                                        <div style="padding:10px 15px; background-color:#EFEBEA; height:130px; margin-bottom:25px;">
                                        <div style="font-size:22px; padding-top:5px;">
                                        <a href="https://www.youtube.com/watch?v={{$video->video_link}}" class="video_lightbox"  style="font-size:22px; color:#000;">
                                            <b>{{$video->video_title}}</b>
                                            </a>
                                        </div>
                                        </div>
                                    </div>
                                 </div>
                                 @endforeach
                

                    </div>
                </div>

            </div>

        </div>
     </section>

<!-- ---------------------- for Mobile ------------------------- -->

     <section class="news-area" style="margin-top: 30px; margin-bottom: 30px; padding-top: 30px;" id="hide_in_desktop">
        <div class="custom-container">
            <div class="row" style="border-bottom: solid 2px #9D9D9D;">

                <div class="col-md-12" style="padding-top:10px;">
                    <div class="row">
                          <div class="col-6 col-sm-6">
                            <div style="color:red; font-size:35px; padding-bottom:15px;">
                              <img src="{{asset('public/images/braking_img.png')}}" alt="webnews24" class="img-fluid" width="35">
                              &nbsp;
                            <b><a href="{{route('all-videos')}}"  style="color:red; font-size:35px;">ভিডিও</a></b>
                            </div>
                        </div>
                        <div class="col-6 col-sm-6">
                            <div style="text-align:right;">
                                <a href="{{route('all-videos')}}"  class="aro_dekhun_plus">
                                    <i class="fa fa-plus"></i>&nbsp;আরো ভিডিও দেখুন
                                </a>
                            </div>
                        </div>

                    </div>


                    <div class="row" style="padding-top:10px; padding-bottom:15px;">
                    @foreach($videos as $video)
                    @php 
                      $vdo_sl = $loop->iteration;
                      if($vdo_sl == 4){
                        $bottom_border_vdo = "";
                      }elseif($vdo_sl == 8){
                        $bottom_border_vdo = "";
                      }else{
                        $bottom_border_vdo = "border-right: solid 2px #9D9D9D;";
                      }
                    @endphp 
                        <div class="col-lg-3 col-md-12">
                            <div style="{{$bottom_border_vdo}} padding-right:15px;">
                                <div class="">
                                <a href="https://www.youtube.com/watch?v={{$video->video_link}}" class="video_lightbox">
                                    <img src="http://i.ytimg.com/vi/{{$video->video_link}}/mqdefault.jpg" width="100%">
                                    <div class="play_icon"></div>
                                </a>
                                </div>
                                <div style="padding:10px 15px; background-color:#EFEBEA; height:130px; margin-bottom:25px;">
                                  <div style="font-size:22px; padding-top:5px;">
                                  <a href="https://www.youtube.com/watch?v={{$video->video_link}}" class="video_lightbox"  style="font-size:22px; color:#000;">
                                    <b>{{$video->video_title}}</b>
                                    </a>
                                  </div>
                                </div>
                            </div>
                        </div>
                    @endforeach

                    </div>
                </div>

            </div>

        </div>
     </section>