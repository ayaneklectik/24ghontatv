@extends('admin.master_layout')
@section('content')

@push('scripts')

@endpush

<meta name="csrf-token" content="{{ csrf_token() }}">
<section class="content">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-plus"></i> &nbsp;Live Video Link</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:15px; margin-top:10px;"></div>

        <form class="form-horizontal" action="{{route('go-live')}}" method="post"  enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row">
       
            <!--Col Section-->
            <div class="col-md-9" style="padding-right:25px;">
            <div class="card">
            <div class="card-body">

              <div class="checkbox-wrapper-2" style="padding-top:10px">
                    <input type="checkbox" id="status"  class="sc-gJwTLC ikxBAC" style="margin-top:10px;" value=1 {{ $video_link->status == 1 ? 'checked' : '' }}>&nbsp;&nbsp; &nbsp;  <span>Enable Live Video Link</span>
               </div>

              <div style="padding-top:20px">
                <div>Live Video Header</div>
                <div>
                  <input type="text" name="live_title" value="{{$video_link->live_title}}" class="form-control">
                  
                </div>
              </div>

              <div style="padding-top:20px">
                <div>Live Video Link</div>
                <div>
                  <input type="text" name="live_video_link" value="{{$video_link->live_video_link}}" class="form-control">
                  
                </div>
              </div>

    

              <div style="padding-top:25px;">
                  <button type="submit" class="btn btn-success">Go Live</button>
              </div>
              </div>
              </div>
            </div>
            <!--/Col Section-->


        </div>
        </form>
    </div>
</div>




<script>
       $(document).ready(function () {
            $('#status').on('change', function () {
             var statusValue = $(this).is(':checked') ? 1 : 0;
             var id = 1
              $.ajax({
                url: "{{url('live-video-status-update')}}",
                type: 'POST', // or 'GET' depending on your server configuration
                data: {
                        status: statusValue,
                        id: id
                    },
                    headers: {
                      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                     },
                      success: function (response) {
                         console.log('Ajax call successful:', response);
                        toastr.success('Update successfully', 'Success', { positionClass: 'toast-top-right' });
                     },
                      error: function (error) {
                         console.error('Ajax call error:', error);
                 }
             });
                                
         });
        });
  </script>
@endsection

