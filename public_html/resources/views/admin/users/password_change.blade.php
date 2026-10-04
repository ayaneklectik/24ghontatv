@extends('admin.master_layout')


@section('content')
<!-- Main content -->
<section class="content">
<div class="container-fluid">
  <div class="row">
    <div class="col-12" style="margin-top:20px;">
           <div class="card">
              <div class="card-header" style="background-color:#343A40; color:#FFF;">
                <h3 class="card-title"><i class="fa fa-lock"></i> &nbsp;Change Password</h3>
                <div class="card-tools">
              
                </div>
              </div>
              <!-- /.card-header -->
              <!-- form start -->
              <form class="form-horizontal" action="{{ route('update-password', $user->id) }}" method="post">
                @csrf
                @method('PUT')
                <div class="card-body">

                  <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">User Name</label>
                    <div class="col-sm-5" style="margin-top:7px;">
                    <div style="color:#138496;" style="margin-top:15px;"><b>{{ $user->name }}</b></div>
                    </div>
                  </div>
                  <div class="form-group row" style="margin-top:-20px;">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-5" style="margin-top:7px;">
                    {{ $user->email }}
                    </div>
                  </div>
                  <hr>
                  <div class="form-group row">
                    <label for="inputPassword3" class="col-sm-2 col-form-label">New Password</label>
                    <div class="col-sm-4">
                      <input type="password" class="form-control" name="password" autocomplete="off">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputPassword3" class="col-sm-2 col-form-label">Confirm Password</label>
                    <div class="col-sm-4">
                      <input type="password" class="form-control" name="confirm_password" autocomplete="off">
                    </div>
                  </div>


                </div>
                <!-- /.card-body -->
                <div class="card-footer">

                  <div class="form-group row">
                    <label for="inputPassword3" class="col-sm-2 col-form-label"></label>
                    <div class="col-sm-5">
                      <button type="submit" class="btn btn-warning float-left">Update Password</button>
                    </div>
                  </div>
                </div>
                <!-- /.card-footer -->
              </form>
            </div>
        </div>
      </div>
      </div>
</section>

@endsection


@section('footer')
  @parent
@endsection
