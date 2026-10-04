@extends('admin.master_layout')


@section('content')

<!-- Main content -->
   <section class="content">
     <div class="container-fluid">
       <div class="row">
         <div class="col-md-4"  style="margin-top:20px;">

           <!-- Profile Image -->
           <div class="card card-info card-outline">
             <div class="card-body box-profile">
               <div class="text-center">
                 <img class="profile-user-img img-fluid img-circle"
                      src="{{ asset(optional(auth()->user())->photo ? 'public/images/user_image/thumbnail/' . optional(auth()->user())->photo : 'public/images/male.jpg') }}"
                      alt="User profile picture">
               </div>

               <h3 class="profile-username text-center">{{ optional(auth()->user())->name }}</h3>
               <p class="text-muted text-center">{{ optional(auth()->user())->email }}</p>
               <p class="text-muted text-center">{{ optional(auth()->user())->contact }}</p>
               <div class="text-center">
                 <a href="{{ route('edit-user', optional(auth()->user())->id) }}" class="btn btn-info btn-xs"><b>Edit</b></a>
                 <a href="{{ route('password-change', optional(auth()->user())->id) }}" class="btn btn-info btn-xs"><b>Change Password</b></a>
             </div>
             </div>
             <!-- /.card-body -->
           </div>
           <!-- /.card -->

        </div>
      </div>
    </div>
</section>
@endsection


@section('footer')
  @parent
@endsection
