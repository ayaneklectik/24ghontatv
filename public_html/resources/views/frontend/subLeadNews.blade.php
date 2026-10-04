@php
                      
    try{
        $cat_id = $cat_section1->id;
        $newsSubLead = App\Http\Controllers\NewsSectionController::getSection_SubLead();
    }catch(Exception $e){
        $newsSubLead = [];
    }
                              
@endphp

    @foreach($newsSubLead as $SubLead)
        <div style="padding:15px 0;">
            <div class="lead-bottom-title" style="padding-top: 10px;">
              <a href="{{route('news-details',[$SubLead->id, $SubLead->title_link])}}">
                <img class="slider-image" src="{{asset('public/images/news_img/'.$SubLead->image)}}" alt="{{$SubLead->title_link}}">
              </a>
            </div>
            <div class="" style="padding-top:5px; font-size:15px; color:{{$SubLead->sub_title_color}}">
                 {{$SubLead->news_sub_title}}
           </div>
           <style>
            .title-color-sublead{{$loop->iteration}} a{color:{{$SubLead->title_color}} !important;}
            .title-color-sublead{{$loop->iteration}} a:hover{color:#E70303 !important;}
           </style>
            <div class="lead-bottom-title title-color-sublead{{$loop->iteration}}">
                <a href="{{route('news-details',[$SubLead->id, $SubLead->title_link])}}">
                    {{$SubLead->news_title}}
                </a>
            </div>
        </div>
    @endforeach