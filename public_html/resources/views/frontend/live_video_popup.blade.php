<div id="live-overlay" class="live-overlay"></div>

<div id="overlay1" class="overlay1" onclick="closePopup()"></div>

<div id="popup" class="popup-container">
  <span class="close-btn" onclick="closePopup()"><i class="fa fa-times" style="color:red; font-size: 22px; padding:8px;"></i></span>
  @if(empty($video_link->live_video_link))

  <div style="text-align:center; font-size: 22px; padding:50px 40px; border: solid 1px red;">
  আপনার সময় আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ ।
  আমরা আন্তরিকভাবে দুঃখিত লাইভটি এখনো শুরু হয়নি । খুব শীঘ্রই শুরু হবে ধৈর্য সহকারে অপেক্ষা করুন প্রয়োজনে কিছুক্ষণ পর আবার চেষ্টা করুন ।ধন্যবাদ 
  </div>


  @else
  <!-- YouTube Video Embed -->
  <div style="text-align:center; font-size:22px;"><b>{{$video_link->live_title}}</b></div>
  <div class="video-container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/{{$video_link->live_video_link}}?autoplay=1&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer;  clipboard-write; encrypted-media;" allowfullscreen></iframe>
  </div>

  @endif
  <h2><i class="fa fa-dot-circle-o" style="color:red; font-size: 19px;"></i>&nbsp;<span style="color:red"><b>Live</b> </span><img src="{{asset('public/images/logos/logo.png')}}" alt="webnews24" class="img-fluid" width="80"></h2>
 </div>

