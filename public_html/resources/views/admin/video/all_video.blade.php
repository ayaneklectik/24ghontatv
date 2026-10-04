@extends('admin.master_layout')
@section('content')

@push('scripts')

@endpush

<section class="content">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-video"></i> &nbsp;Video Gallery</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:15px; margin-top:10px;"></div>

        <form class="form-horizontal" action="{{route('insert-video')}}" method="post" >
         @csrf
        <div class="row">

            <!--Col Section-->
            <div class="col-md-3">
             <div style="padding:15px; border:solid 1px #999999; border-radius:8px;">
  

             <div style="padding-top:13px;">
                <div>Video Title</div>
                <div>
                  <input type="text" name="video_title" value="" class="form-control"  required>
                </div>
              </div>

              <div style="padding-top:13px;">
                <div>Video Details</div>
                <div>
                  <textarea rows="4" name="video_dis" id="video_dis" class="form-control"></textarea>
                </div>
              </div>

              <div style="padding-top:13px;">
                <div>Publish Date</div>
                <div>
                  <input type="text" id="datepicker111" name="pub_date" value="{{date('d-m-Y')}}" class="form-control"  autocomplete="off" required>
                </div>
              </div>

              <div style="padding-top:10px;">
              <img id="image" src="{{asset('public/images/video_code.jpg')}}" width="100%">
              </div>

              <div style="padding-top:13px;">
                <div>YouTube Video Code</div>
                <div>
                  <input type="text" id="datepicker111" name="video_link" value="" class="form-control"  required>
                </div>
              </div>


              <div style="height:15px; border-top:solid 1px #EBEBEB; margin-bottom:15px;"></div>

              <div>
                  <button type="submit" class="btn btn-success" style="width:100%">Submit</button>
              </div>

              </div>
            </div>
            <!--/Col Section-->

             <!--Col Section-->
             <div class="col-md-9" style="padding-right:25px;">
             <div class="row">
              @foreach($videos as $video)
                <div class="col-3">
                <div style="border:solid 1px #ccc; padding:8px; ">
                    <table style="width:100%">
                        <tr>
                            <td><i class="fa fa-video"></i></td>
                            <td style="text-align:right">
                            <a href="{{route('edit-video', $video->id)}}"><i class="fa fa-edit"></i></a>&nbsp;
                            <a href="{{route('delete-video', $video->id)}}" onClick="return confirmation()"><i class="fa fa-trash"></i></a></td>
                        </tr>
                    </table>
                        
                    </div>
                    <div style="border:solid 1px #ccc; padding:8px;">
                        <div>
                        <a href="https://www.youtube.com/watch?v={{$video->video_link}}" target="_blank">
                            <img class="img-fluid" src="http://i.ytimg.com/vi/{{$video->video_link}}/mqdefault.jpg" width="100%" />
                            </a>
                        </div>
                        <div>{{$video->video_title}}</div>
                        
                    </div>
                   
                </div>
                @endforeach
        
                
             </div>

             <div class="" style="">
             <div style="padding:20px;">{{ $videos->links('admin.partials.pagination-link') }}</div>
             </div>
             
            </div>

          
            <!--/Col Section-->

        </div>
        </form>
    </div>
</div>

<script type="text/javascript">
      function confirmation() {
       return confirm('Are you sure you want to Delete this?');
        }
 </script>

<script>
 $( function() {
 	$( "#datepicker111" ).datepicker({
 		dateFormat: "dd-mm-yy"
 		,	duration: "fast"
 	});
   $( "#datepicker11" ).datepicker({
     dateFormat: "dd-mm-yy"
     ,	duration: "fast"
   });
   $( "#datepicker1" ).datepicker({
     dateFormat: "dd-mm-yy"
     ,	duration: "fast"
   });
 } );
 </script>
@endsection

