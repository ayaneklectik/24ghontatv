@extends('admin.master_layout')


@section('content')
<!-- Main content -->
<section class="content">
<div class="container-fluid">
<div class="row">
  <div class="col-12" style="margin-top:20px;">
    @if(session()->has('massage'))
      <div class="alert alert-{{ session('msg_type') }}">{{ session('massage') }}</div>
    @endif
    <div class="card">
      <div class="card-header" style="background-color:#343A40; color:#FFF;">
        <div><h3 class="card-title"><i class="fa fa-list"></i>&nbsp;All User Logs</h3></div>
        <div class="card-tools">
          <a href="{{ route('dashboard') }}" class="btn btn-success btn-sm"><i class="fa fa-arrow-left"></i>&nbsp;Back</a>
        </div>
      </div>
      <!-- /.card-header -->
      <div class="card-body table-responsive p-0">
        <table id="example1" class="table table-hover text-nowrap table-bordered table-striped">
          <thead>
            <tr>
              <th>SL</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>User IP</th>
              <th>Browser</th>
              <th>Device</th>
              <th>OS</th>
              <th>Date Time</th>

            </tr>
          </thead>
          <tbody>
              @foreach ($log as  $key => $logs)
              <tr>
                <td>{{($log->currentpage()-1) * $log->perpage() + $key + 1}}</td>
                <td><div style="color:#138496;">{{ $logs->user->name }}</b></td>
                <td>{{ $logs->user->email }}</td>
                <td>{{ $logs->user->user_type }}</td>
                <td>{{ $logs->user_ip }}</td>
                <td>{{ $logs->browser }}</td>
                <td>{{ $logs->device_name }}</td>
                <td>{{ $logs->os }}</td>
                <td>{{ $logs->created_at }}</td>
              </tr>
              @endforeach
          </tbody>
        </table>

      </div>
      <!-- /.card-body -->
     <div style="padding:20px;">{{ $log->links('admin.partials.pagination-link') }}</div>
    </div>
    <!-- /.card -->
  </div>
</div>
</div>
</section>
<script type="text/javascript">
      function confirmation() {
       return confirm('Are you sure you want to Delete this?');
        }
 </script>
@endsection


@section('footer')
  @parent
@endsection
