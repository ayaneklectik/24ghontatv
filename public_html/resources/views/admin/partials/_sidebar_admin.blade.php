@php 
  $user_id = optional(auth()->user())->id;
  $user_permission = App\Http\Controllers\StaticLinkController::getUser_permission($user_id); 
@endphp

<aside class="main-sidebar sidebar-dark-primary elevation-4" style="background-color:#E2E2E2 !important">
  <!-- Brand Logo -->
  <a href="{{route('dashboard')}}" class="brand-link">
    <img src="{{asset('public/images/logos/logo.png')}}" width="125"  alt="User Image" style="padding-left:15px;">

  </a>

  <!-- Sidebar -->
  <div class="sidebar">
    <!-- SidebarSearch Form -->
    <div class="form-inline" style="padding-top:8px;">
 
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" style="padding-bottom:40px; color:#000">
        <li class="nav-item">
          <a href="{{ route('dashboard') }}" class="nav-link"  style="color:#000">
            <i class="nav-icon fas fa-tachometer-alt"></i>
            <p>Dashboard</p>
          </a>
        </li>

        @if($user_permission->add_news_status == 1)
        <li class="nav-item">
          <a href="{{route('add-new-news')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fas fa-plus"></i>
            <p>Add New News</p>
          </a>
        </li>
        @endif

        @if($user_permission->manage_news_status == 1)
        <li class="nav-item">
          <a href="{{route('all-news')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fas fa-list"></i>
            <p>Manage All News</p>
          </a>
        </li>
        @endif

        @if($user_permission->category_status == 1)
        <li class="nav-item">
          <a href="{{route('all-category')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fas fa-sitemap"></i>
            <p>News Category</p>
          </a>
        </li>
        @endif

   
        <li class="nav-item">
          <a href="{{route('top-five-news')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fas fa-newspaper"></i>
            <p>Top Five News</p>
          </a>
        </li>
  

        @if($user_permission->video_status == 1)
        <li class="nav-item">
          <a href="{{route('all-video')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fa fa-video"></i>
            <p>Video Gallery</p>
          </a>
        </li>
        @endif

        @if($user_permission->photo_status == 1)
        <li class="nav-item">
          <a href="{{route('all-gallery-photo')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fas fa-image"></i>
            <p>Photo Gallery</p>
          </a>
        </li>
        @endif
        
        @if($user_permission->ad_manager_status == 1)
        <li class="nav-item">
          <a href="{{route('ad-manager')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fas fa-bullhorn"></i>
            <p>AD Manager</p>
          </a>
        </li>
        @endif


        @if($user_permission->live_status == 1)
        <li class="nav-item">
          <a href="{{route('live-video-link')}}" class="nav-link" style="color:#000">
            <i class="nav-icon fas fa-dot-circle"></i>
            <p>Live Video</p>
          </a>
        </li>
        @endif

        @if($user_permission->user_manage_status == 1)
        <li class="nav-item">
         <a href="" class="nav-link" style="color:#000">
           <i class="nav-icon fas fa-user"></i>
           <p>User Manage<i class="fas fa-angle-left right"></i></p>
         </a>
         <ul class="nav nav-treeview">

           <li class="nav-item">
             <a href="{{route('manage-users')}}" class="nav-link" style="color:#FFF">
               <i class="fa fa-angle-double-right nav-icon"></i>
               <p>All Users</p>
             </a>
           </li>

           <li class="nav-item">
             <a href="{{route('new-users')}}" class="nav-link" style="color:#FFF">
               <i class="fa fa-angle-double-right nav-icon"></i>
               <p>New User</p>
             </a>
           </li>

         </ul>
       </li>
       @endif
       

       @if($user_permission->footer_status == 1)
        <li class="nav-item">
         <a href="" class="nav-link" style="color:#000">
           <i class="nav-icon fas fa-arrow-down"></i>
           <p>Footer widget<i class="fas fa-angle-left right"></i></p>
         </a>
         <ul class="nav nav-treeview">

           <li class="nav-item">
             <a href="{{route('social-media')}}" class="nav-link" style="color:#FFF">
               <i class="fa fa-angle-double-right nav-icon"></i>
               <p>Social Media Link</p>
             </a>
           </li>

           <li class="nav-item">
             <a href="{{route('writer-desk')}}" class="nav-link" style="color:#FFF">
               <i class="fa fa-angle-double-right nav-icon"></i>
               <p>Writer Desk</p>
             </a>
           </li>

           <li class="nav-item">
             <a href="{{route('footer-content')}}" class="nav-link" style="color:#FFF">
               <i class="fa fa-angle-double-right nav-icon"></i>
               <p>Footer</p>
             </a>
           </li>

           <li class="nav-item">
             <a href="{{route('news-family')}}" class="nav-link" style="color:#FFF">
               <i class="fa fa-angle-double-right nav-icon"></i>
               <p>Our News Family</p>
             </a>
           </li>

         </ul>
       </li>
       @endif
    
  

      </ul>
    </nav>
    <!-- /.sidebar-menu -->
  </div>
  <!-- /.sidebar -->
</aside>
