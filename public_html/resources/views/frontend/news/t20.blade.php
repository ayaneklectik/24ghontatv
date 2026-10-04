
    <section class="news-area" style="margin-top: 30px; margin-bottom: 30px; padding-top: 30px;  padding-bottom: 20px;">
        <div class="custom-container">
            <div class="row" style="border-bottom: solid 2px #9D9D9D; padding-bottom:20px;">
              <div class="col-12 col-sm-12">
                <div style="color:red; font-size:35px; padding-bottom:15px;">
                <a href="{{route('all-category-news', 23)}}" style="color:red; font-size:35px;">
                  <img src="{{asset('public/images/world-cup-banner.jpg')}}" alt="webnews24" class="img-fluid" width="100%">
                </a>
                </div>
              </div>

              @php
                  $cat_id = 23;
                  $newsByCat = App\Http\Controllers\StaticLinkController::first_CatLeadNews($cat_id);

                  if($newsByCat != null) {
                      if($newsByCat->image != NULL || $newsByCat->news_title != NULL){
                          $imagePath = public_path('images/news_img/'. $newsByCat->image);
                          $imageSrc = file_exists($imagePath) ? asset('public/images/news_img/' . $newsByCat->image) : asset('public/images/no-img-bg.png');
                          $newsTitle = $newsByCat->news_title;
                          $news_id = $newsByCat->id;
                          $news_link = $newsByCat->title_link;
                      } else {
                          $imageSrc =  asset('public/images/no-img-bg.png');
                          $newsTitle = "";
                          $news_id = "";
                          $news_link = "";
                      }
                  } else {
                      $imageSrc = asset('public/images/no-img-bg.png');
                      $newsTitle = "";
                      $news_id = "";
                      $news_link = "";
                  }
              @endphp



              <div class="col-6 col-sm-6">
                <div style="border-right: solid 2px #9D9D9D; padding-right:20px;">
                <div>
                  <a href="{{route('news-details',[$news_id, $news_link])}}">
                      <img class="slider-image" src="{{$imageSrc}}" alt="">
                  </a>
                </div>

                <div style="font-size:30px; padding :15px; background-color:#efebea; height:140px;">
                  <b><a href="{{route('news-details',[$news_id, $news_link])}}" style="font-size:30px; color:#000">{{$newsTitle}}</a></b>
                </div>
              </div>
              </div>

              <div class="col-6 col-sm-6">
              @php
                   try{
                     $cat_id = 23;
                      $catNewsSecondLead = App\Http\Controllers\StaticLinkController::second_CatLeadNews($cat_id);
                   }catch(Exception $e){
                       $catNewsSecondLead = [];
                   }
              @endphp
                <!--Border start-->
                @foreach($catNewsSecondLead as $news)
                    @php
                
                      if($news != null) {
                      if($news->image != NULL || $news->news_title != NULL){
                          $imagePath = public_path('images/news_img/'. $news->image);
                          $imageSrc = file_exists($imagePath) ? asset('public/images/news_img/' . $news->image) : asset('public/images/no-img-bg.png');
                          $newsTitle = $news->news_title;
                          $news_id = $news->id;
                          $news_link = $news->title_link;
                      } else {
                          $imageSrc =  asset('public/images/no-img-bg.png');
                          $newsTitle = "";
                          $news_id = "";
                          $news_link = "";
                      }
                  } else {
                      // Handle the case when no news article is found for the given category
                      $imageSrc = asset('public/images/no-img-bg.png');
                      $newsTitle = "";
                      $news_id = "";
                      $news_link = "";
                  }    

                  $news_sl = $loop->iteration;
                    if($news_sl == 3){
                      $bottom_border = "";
                    }else{
                      $bottom_border = "border-bottom: solid 2px #9D9D9D;";
                    }
                   @endphp
                <div style="{{$bottom_border}} padding-bottom:15px; margin-bottom:15px;">
                      <style>
                        .title-color-news{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                        .title-color-news{{$loop->iteration}} a:hover{color:#E70303 !important;}
                    </style>
                <table>
                  <tr>
                    <td>
                    <a href="{{route('news-details',[$news_id, $news_link])}}">
                          <img class="slider-image" src="{{$imageSrc}}" alt="" style="width:250px;">
                      </a>
                    </td>
                    <td class="new-title-container" style="width:100%">
                    <div>
                      <div class="new-sub-title" style="color:{{$news->sub_title_color}} !important;">
                        <b>{{$news->news_sub_title}}</b>
                      </div>
                      <div class="new-title title-color-news{{$loop->iteration}}">
                      <a href="{{route('news-details',[$news_id, $news_link])}}" >
                        <b>{{$news->news_title}}</b>
                       </a>
                      </div>
                    </div>
                    </td>
                  </tr>
                </table>
                </div>
                @endforeach
                <!--Close Border start-->

              </div>


              <div class="col-lg-12" style="border-bottom: solid 2px #9D9D9D; height:2px; margin: 0 0 30px 0;"></div>

              <!--Column start-->
              @php
                   try{
                     $cat_id = 23;
                      $catNewsThirdLead = App\Http\Controllers\StaticLinkController::third_CatLeadNews($cat_id);
                   }catch(Exception $e){
                       $catNewsThirdLead = [];
                   }
              @endphp

              @foreach($catNewsThirdLead as $news3)
                        @php
                          if($news3 != null) {
                      if($news3->image != NULL || $news3->news_title != NULL){
                          $imagePath = public_path('images/news_img/'. $news3->image);
                          $imageSrc = file_exists($imagePath) ? asset('public/images/news_img/' . $news3->image) : asset('public/images/no-img-bg.png');
                          $newsTitle = $news3->news_title;
                          $news_id = $news3->id;
                          $news_link = $news3->title_link;
                      } else {
                          $imageSrc =  asset('public/images/no-img-bg.png');
                          $newsTitle = "";
                          $news_id = "";
                          $news_link = "";
                      }
                  } else {
                      // Handle the case when no news article is found for the given category
                      $imageSrc = asset('public/images/no-img-bg.png');
                      $newsTitle = "";
                      $news_id = "";
                      $news_link = "";
                  } 
                       
                  $news_sl1 = $loop->iteration;
                  if($news_sl1 == 4){
                      $bottom_border1 = "";
                    }else{
                      $bottom_border1 = "border-right: solid 2px #9D9D9D;";
                    }

                @endphp
              <div class="col-lg-3">
              <div style="{{$bottom_border1}} padding-right:20px;">
                <div>
                  <a href="{{route('news-details',[$news_id, $news_link])}}">
                    <img class="slider-image" src="{{$imageSrc}}" alt="">
                  </a>
                </div>

                    <style>
                        .title-color-news{{$loop->iteration}} a{color:{{$news->title_color}} !important;}
                        .title-color-news{{$loop->iteration}} a:hover{color:#E70303 !important;}
                    </style>

                   <div class="new-title-container">
                      <div class="new-sub-title" style="color:{{$news->sub_title_color}} !important;">
                          <b>{{$news3->news_sub_title}}</b>
                      </div>
                      <div class="new-title title-color-news{{$loop->iteration}}">
                        <a href="{{route('news-details',[$news_id, $news_link])}}" >
                           <b>{{$news3->news_title}}</b>
                        </a>
                      </div>
                    </div>

                </div>
              </div>

              @endforeach
               <!--Close Column start-->

            </div>
        </div>

    </section>