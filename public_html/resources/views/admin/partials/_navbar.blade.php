<nav class="main-header navbar navbar-expand navbar-white navbar-light">
  <!-- Left navbar links -->
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
    </li>
    <li class="nav-item d-none d-sm-inline-block">
      <a href="" class="nav-link" style="font-size:20px; margin-top:-7px;"><b>{{$title}}</b></a>
    </li>

  </ul>

  <!-- Right navbar links -->
  <ul class="navbar-nav ml-auto">
  @if (optional(auth()->user())->user_type == "Admin")
     @php 
        $total_unpublishNews = App\Http\Controllers\StaticLinkController::total_unpublishNews();
     @endphp 
        <!-- Messages Dropdown Menu -->
        <li class="nav-item dropdown" style="margin-top:-2px;">
        <a class="nav-link" data-toggle="dropdown" href="#">
          InReview <i class="far fa-newspaper"></i>
          @if($total_unpublishNews>0)
          <span class="badge badge-danger navbar-badge" style="margin-top:-5px;">{{$total_unpublishNews}}</span>
          @endif
        </a>
        @php 
          try{
            $unPubNews = App\Http\Controllers\StaticLinkController::get_unpublishNews();
          }catch(Exception $e){
            $unPubNews = [];
          }
        @endphp 
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" >

          @foreach($unPubNews as $unPubNews_1)
          @php
            try{
                  $user_id = $unPubNews_1->user;
                  $user = App\Http\Controllers\StaticLinkController::getUser($user_id);
                  $user_name = $user->name;
                  $user_type = $user->user_type;
            }catch(Exception $e){
                  $user_name = "";
                  $user_type = "";
            }
            @endphp
          <a href="{{route('news-details-admin',[$unPubNews_1->id, $unPubNews_1->title_link])}}" target="blank" class="dropdown-item">
            <!-- Message Start -->
            <div class="media">
              <div class="media-body">
                <div class="" style="width:250px; overflow:hidden; color:#E2126E">
                  {{$unPubNews_1->news_title}}
                </div>
                <p class="text-sm">{{$user_name}}, {{$user_type}}</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> {{$unPubNews_1->created_at}}</p>
              </div>
            </div>
            <!-- Message End -->
          </a>
          <div class="dropdown-divider"></div>
          @endforeach

         
          <div class="dropdown-divider"></div>
          <a href="{{route('get-all-inreview-news')}}" class="dropdown-item dropdown-footer">See All In Review News</a>
        </div>
      </li>
    @endif
    <li class="nav-item dropdown" style="margin-top:4px;">
      <a href="{{route('home')}}" target="_blank"  style="color:#666;">
        <i class="fa fa-globe "></i>
      </a>
    </li>

    <!-- Notifications Dropdown Menu -->

    <li class="nav-item">
      <a class="nav-link" data-widget="fullscreen" href="#" role="button">
        <i class="fas fa-expand-arrows-alt"></i>
      </a>
    </li>

    <li class="nav-item dropdown">
      <a class="nav-link" data-toggle="dropdown" href="#">
        <div class="">{{ optional(auth()->user())->name }}&nbsp;&nbsp;
          <img src="{{ asset(optional(auth()->user())->photo ? 'public/images/user_image/thumbnail/' . optional(auth()->user())->photo : 'images/male.jpg') }}" width="26" class="img-circle elevation-1" alt="User Image">
        </div>
      </a>
      <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <span class="dropdown-item dropdown-header">
          <div><b>{{ optional(auth()->user())->name }}</b></div>
          <div>{{ optional(auth())->user()->email }}</div>
        </span>
        <div class="dropdown-divider"></div>
        @if (optional(auth()->user())->user_type == "Admin")
          <a href="{{route('app-setting')}}" class="dropdown-item" style="text-align:right;">
             App Settings &nbsp;&nbsp;&nbsp;
          </a>
          <div class="dropdown-divider"></div>
        @endif

        @if (optional(auth()->user())->user_type == "Admin")
        <a href="{{route('user-profile', optional(auth()->user())->id )}}" class="dropdown-item" style="text-align:right;">
          User Profile &nbsp;&nbsp;&nbsp;
        </a>
        <div class="dropdown-divider"></div>
          <a href="{{route('manage-users')}}" class="dropdown-item" style="text-align:right;">
             Manage User &nbsp;&nbsp;&nbsp;
          </a>
          <div class="dropdown-divider"></div>

          <a href="{{route('users_log')}}" class="dropdown-item" style="text-align:right;">
             User Logs &nbsp;&nbsp;&nbsp;
          </a>
          <div class="dropdown-divider"></div>
        @endif
        <a href="{{route('logout')}}" class="dropdown-item" style="text-align:right; color:#DC3545;">
           <b>Logout</b> <i class="fa fa-sign-out"></i>&nbsp;&nbsp;&nbsp;
        </a>

      </div>
    </li>

   

  </ul>
</nav>
<!-- /.navbar -->
