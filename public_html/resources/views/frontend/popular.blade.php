<div class="tab-widget" style="padding-top:25px;">
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#recent">সর্বশেষ</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#popular">সর্বাধিক পঠিত</a>
            </li>

            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#popular1">নির্বাচিত</a>
            </li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
            <div class="tab-pane fade show active" id="recent" role="tabpanel">

            <div style="padding:0 0 0px 10px; border-left: solid 3px #ED1C29; font-size: 20px; margin-bottom:10px">
            এই বিভাগের সর্বশেষ সংবাদ
            </div>
            @foreach($more_news as $news)
                <div class="row">
                    <div class="col-4">
                        <a href="">
                            <img src="{{asset('public/images/news_img/thumbnail/'.$news->image)}}" alt="webnews24" class="img-fluid">
                        </a>
                    </div>
                    <div class="col-8 tab-content-text">
                        <p><a href="">{{$news->news_title}}</a></p>
                    </div>
                </div>
                <div style="margin-top:15px;"><hr></div>

            </div>
            @endforeach


            <div class="tab-pane fade" id="popular" role="tabpanel">
       
                <div class="pop-item d-flex">
                    <div class="pop-img">
                        <a href="">
                          <img src="" width="100" alt="">
                        </a>
                    </div>
                    <div class="img-content">
                        <p><a href="">ffffffffffff</a></p>
                        <div style="font-size:11px; color:#727272;">
                        <span><i class="fa fa-eye"></i>&nbsp;
                
                        </span>&nbsp;&nbsp;
                        <span><i class="fa fa-calendar"></i>&nbsp;</span>
                      </div>
                    </div>
                </div>

          

            </div>

            <div class="tab-pane fade" id="popular1" role="tabpanel">
       
                <div class="pop-item d-flex">
                    <div class="pop-img">
                        <a href="">
                          <img src="" width="100" alt="">
                        </a>
                    </div>
                    <div class="img-content">
                        <p><a href="">ffffffffffff</a></p>
                        <div style="font-size:11px; color:#727272;">
                        <span><i class="fa fa-eye"></i>&nbsp;
                
                        </span>&nbsp;&nbsp;
                        <span><i class="fa fa-calendar"></i>&nbsp;</span>
                      </div>
                    </div>
                </div>

          

            </div>

        </div>
    </div>