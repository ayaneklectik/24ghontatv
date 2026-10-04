<style>
  .top-number{
    font-size:90px;
    padding: 15px;
  }

  .top-number-mobile{
    font-size:60px;
    padding: 5px 15px 5px 5px;
  }

  .top-text{
    font-size:20px;
    padding: 12px;
  }
</style>

<div style="margin: 35px 0; padding:10px; border:solid 5px red;" id="hide_in_mobile">
<div style="margin-top:-55px;">
  <img src="{{asset('public/images/top_5_image.png')}}" style="padding:15px 0px 0px 10px;" alt="Proval Logo" class="img-fluid" width="250">
</div>
  <div>
  <table>
      <tr>
        <td>
          <div class="top-number"><b>১</b></div>
        </td>
        <td style="border-right: solid 3px #ccc;">
          <div class="top-text">
          @php
             $news_1 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_1->news_id);
          @endphp
          <a href="{{route('news-details',[$top_news_1->news_id, $news_1->title_link])}}" style="font-size:26px; color:#000">
              {{$news_1->news_title}}
          </a>
          </div>
        </td>

        <td>
          <div class="top-number"><b>২</b></div>
        </td>
        <td style="border-right: solid 3px #ccc;">
          <div class="top-text">
          @php
             $news_2 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_2->news_id);
          @endphp
          <a href="{{route('news-details',[$top_news_2->news_id, $news_2->title_link])}}" style="font-size:26px; color:#000">
              {{$news_2->news_title}}
          </a>
          </div>
        </td>

        <td>
          <div class="top-number" style="color:red"><b>৩</b></div>
        </td>
        <td style="border-right: solid 3px #ccc;">
          <div class="top-text">
          @php
             $news_3 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_3->news_id);
          @endphp
          <a href="{{route('news-details',[$top_news_3->news_id, $news_3->title_link])}}" style="font-size:26px; color:#000">
              {{$news_3->news_title}}
          </a>
          </div>
        </td>

        <td>
          <div class="top-number"><b>৪</b></div>
        </td>
        <td style="border-right: solid 3px #ccc;">
          <div class="top-text">
          @php
             $news_4 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_4->news_id);
          @endphp
          <a href="{{route('news-details',[$top_news_4->news_id, $news_4->title_link])}}" style="font-size:26px; color:#000">
              {{$news_4->news_title}}
          </a>
          </div>
        </td>

        <td>
          <div class="top-number"><b>৫</b></div>
        </td>
        <td>
          <div class="top-text">
          @php
             $news_5 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_5->news_id);
          @endphp
          <a href="{{route('news-details',[$top_news_5->news_id, $news_5->title_link])}}" style="font-size:26px; color:#000">
              {{$news_5->news_title}}
          </a>
          </div>
        </td>
      </tr>
  </table>
</div>
</div>

<div style="margin: 35px 0; padding:10px; border:solid 5px red;" id="hide_in_desktop">
  <div style="margin-top:-55px;">
    <img src="{{asset('public/images/top_5_image.png')}}" style="padding:15px 0px 0px 10px;" alt="Proval Logo" class="img-fluid" width="180">
  </div>

  <table>
      <tr style="border-bottom: solid 2px #ccc;">
          <td>
            <div class="top-number-mobile"><b>১</b></div>
          </td>
          <td>
            <a href="{{route('news-details',[$top_news_1->news_id, $news_1->title_link])}}" style="font-size:18px; color:#000">
                {{$news_1->news_title}}
            </a>
          </td>
      </tr>
      <tr style="border-bottom: solid 2px #ccc;">
          <td>
            <div class="top-number-mobile"><b>২</b></div>
          </td>
          <td>
            <a href="{{route('news-details',[$top_news_2->news_id, $news_2->title_link])}}" style="font-size:18px; color:#000">
                {{$news_2->news_title}}
            </a>
          </td>
      </tr>
      <tr style="border-bottom: solid 2px #ccc;">
          <td>
            <div class="top-number-mobile"><b>৩</b></div>
          </td>
          <td>
            <a href="{{route('news-details',[$top_news_3->news_id, $news_3->title_link])}}" style="font-size:18px; color:#000">
                {{$news_3->news_title}}
            </a>
          </td>
      </tr>
      <tr style="border-bottom: solid 2px #ccc;">
          <td>
            <div class="top-number-mobile"><b>৪</b></div>
          </td>
          <td>
            <a href="{{route('news-details',[$top_news_4->news_id, $news_4->title_link])}}" style="font-size:18px; color:#000">
                {{$news_4->news_title}}
            </a>
          </td>
      </tr>
      <tr>
          <td>
            <div class="top-number-mobile"><b>৫</b></div>
          </td>
          <td>
            <a href="{{route('news-details',[$top_news_5->news_id, $news_5->title_link])}}" style="font-size:18px; color:#000">
                {{$news_5->news_title}}
            </a>
          </td>
      </tr>
  </table>

</div>
