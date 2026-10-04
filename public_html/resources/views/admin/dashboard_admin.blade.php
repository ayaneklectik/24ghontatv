@extends('admin.master_layout')

@section('content')
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-12" style="text-align:center; padding-top:20px;">
          <img src="{{asset('public/images/logos/logo.png')}}"   alt="User Image" style="padding-left:15px; margin-top:-10px;" width="300">
  
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

  <!-- Main content -->
<section class="content" style="margin-top:15px;">
  <div class="container-fluid">

  <div class="row">
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-info"><i class="far fa-newspaper"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Total News</span>
                <span class="info-box-number">{{number_format($total_news->count())}}</span>
              </div>
              <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
          </div>
          <!-- /.col -->
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-success"><i class="far fa-newspaper"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Todays</span>
                <span class="info-box-number">{{$todays_news->count()}}</span>
              </div>
              <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
          </div>
          <!-- /.col -->
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-warning"><i class="fa fa-hand-pointer"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Total Hit</span>
                <span class="info-box-number">{{number_format($total_hit)}}</span>
              </div>
              <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
          </div>
          <!-- /.col -->
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-danger"><i class="fa fa-user"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Users</span>
                <span class="info-box-number">{{$users->count()}}</span>
              </div>
              <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->

  </div>
</section>
@endsection
