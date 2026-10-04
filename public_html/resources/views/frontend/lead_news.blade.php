 <div class="col-12">
     <div class="row">
         <div class="col-12 col-sm-12">
             <div style="color:red; font-size:35px; padding-bottom:15px;">
                 <img src="{{ asset('public/images/braking_img.png') }}" alt="webnews24" class="img-fluid" width="35">
                 &nbsp;
                 <b><a href="{{ route('all-videos') }}" style="color:red; font-size:35px;">লিড নিউজ</a></b>
             </div>
         </div>


     </div>
 </div>


 @php
     $leadImageName = $lead_news1->image ?? null;
     $leadImagePath = $leadImageName ? public_path('images/news_img/' . $leadImageName) : null;
     $leadImageSrc = !$leadImageName
         ? asset('public/images/no-img-bg.png')
         : (file_exists($leadImagePath)
             ? asset('public/images/news_img/' . $leadImageName)
             : rtrim(config('services.news_media_base_url', 'https://24ghontatv.com'), '/') . '/images/news_img/' . rawurlencode($leadImageName));
 @endphp

 <div class="row" style="background-color:#efebea; margin: 0 1px;" id="hide_in_mobile">
     <!--Col Section-->

     <div class="col-lg-6">
         <div style="padding:20px;">
             <div class="new-date-time">
                 @php
                     try {
                         $catID = $lead_news1->cat;
                         $cat = App\Http\Controllers\StaticLinkController::getCatByID($catID);
                         $catName = $cat->cat_name;
                     } catch (Exception $e) {
                         $catName = '';
                     }

                     try {
                         $SubcatID = $lead_news1->sub_cat;
                         $subcat = App\Http\Controllers\StaticLinkController::getSubCatByID($SubcatID);
                         $SubcatName = $subcat->sub_cat_name;
                     } catch (Exception $e) {
                         $SubcatName = '';
                     }
                 @endphp
             </div>
             <div class="" style="padding-top:10px; font-size:20px; color:{{ $lead_news1->sub_title_color }}">
                 {{ $lead_news1->news_sub_title }}
             </div>
             <a href="{{ route('news-details', [$lead_news1->id]) }}" style="font-size:50px;">
                 <div class="lead-title" style="margin-top:-10px;">
                     <h1>
                         
                             <b>{{ $lead_news1->news_title }}</b>
                         
                     </h1>
                     @php
                         $str = $lead_news1->dis;
                         $cher = 400;
                         if (mb_strlen($str, 'UTF-8') > $cher) {
                             $content = str_replace('\n', '', mb_substr(strip_tags($str), 0, $cher, 'UTF-8')) . '....';
                         } else {
                             $content = str_replace('\n', '', strip_tags($str));
                         }
                     @endphp
                     <div style="font-size:22px;">{!! $content !!}</div>
    
                     <div class="" style="padding-top:10px; font-size:16px; color:{{ $lead_news1->sub_title_color }}">
                         <a href="{{ route('news-details', [$lead_news1->id]) }}" style="color: #000">
                             বিস্তারিত পড়ুন
                         </a>
                     </div>
                 </div>
             </a>
         </div>
     </div>
     <!--/Col Section-->

     <!--Col Section-->
     <div class="col-lg-6" style="padding:0;">
         <a href="{{ route('news-details', [$lead_news1->id]) }}" style="font-size:50px;">
             <div>
                 <img class="slider-image img-fluid w-100" src="{{ $leadImageSrc }}"
                     alt="Image 1">
             </div>
         </a>
     </div>
     <!--/Col Section-->
 </div>



 <!--/For Mobile-->
 <div class="row hide" style="background-color:#efebea; margin: 0 1px;">
     <!--Col Section-->
     <div class="col-12">
         <div style="padding:20px;">
             <div class="new-date-time">

                 @php
                     try {
                         $catID = $lead_news1->cat;
                         $cat = App\Http\Controllers\StaticLinkController::getCatByID($catID);
                         $catName = $cat->cat_name;
                     } catch (Exception $e) {
                         $catName = '';
                     }

                     try {
                         $SubcatID = $lead_news1->sub_cat;
                         $subcat = App\Http\Controllers\StaticLinkController::getSubCatByID($SubcatID);
                         $SubcatName = $subcat->sub_cat_name;
                     } catch (Exception $e) {
                         $SubcatName = '';
                     }
                 @endphp
             </div>
             <a href="{{ route('news-details', [$lead_news1->id]) }}" style="font-size:26px; line-height:35px; text-align: justify;">
                 <div class="" style="padding-top:10px; font-size:20px; color:{{ $lead_news1->sub_title_color }}">
                     {{ $lead_news1->news_sub_title }}
                 </div>
             </a>
             
             <a href="{{ route('news-details', [$lead_news1->id]) }}" style="font-size:26px; line-height:35px; text-align: justify;">
                <div class="lead-title" style="margin-top:-10px;">
                 <h1>
                     
                         <b>{{ $lead_news1->news_title }}</b>
                     
                 </h1>

                 <div style="padding-bottom:10px;">
                     <img class="slider-image img-fluid w-100"
                         src="{{ $leadImageSrc }}" alt="Image 1">
                 </div>

                 @php
                     $str = $lead_news1->dis;
                     $cher = 180;
                     if (mb_strlen($str, 'UTF-8') > $cher) {
                         $content = str_replace('\n', '', mb_substr(strip_tags($str), 0, $cher, 'UTF-8')) . '....';
                     } else {
                         $content = str_replace('\n', '', strip_tags($str));
                     }
                 @endphp
                 <div style="font-size:22px; text-align: justify;">{!! $content !!}</div>

                 <div class=""
                     style="padding-top:10px; font-size:16px; color:{{ $lead_news1->sub_title_color }}">
                     বিস্তারিত পড়ুন
                 </div>
             </div>
             </a>
         </div>
     </div>
     <!--/Col Section-->

 </div>
