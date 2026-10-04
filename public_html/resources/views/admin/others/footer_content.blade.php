@extends('admin.master_layout')
@section('content')

@push('scripts')


@endpush


<section class="content">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-plus"></i> &nbsp;Footer</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #E1E3E6; margin-bottom:15px; margin-top:10px;"></div>

        <form class="form-horizontal" action="{{route('update-footer-content')}}" method="post" >
        @csrf
        @method('PUT')
        <div class="row">

            <!--Col Section-->
            <div class="col-md-12">
             <div style="padding:15px; border:solid 1px #999999; border-radius:8px;">

              <div style="padding-top:13px;">

                <div>
                  <textarea name="address" id="editor1" class="form-control">{{$footer->address}}</textarea>
                </div>
              </div>
 
              <div style="height:15px; border-top:solid 1px #EBEBEB; margin-bottom:15px;"></div>

              <div>
                  <button type="submit" class="btn btn-success" >Update</button>
              </div>

              </div>
            </div>
            <!--/Col Section-->

        

        </div>
        </form>
    </div>
</div>
</section>


<script src="{{asset('public/admin_assets/ckeditor4/ckeditor.js')}}"></script>
<script src="{{asset('public/admin_assets/ckeditor4/plugins/ckwebspeech/plugin.js')}}"></script>
<script src="{{asset('public/admin_assets/ckeditor4/plugins/html5audio/plugin.js')}}"></script>

<script type="text/javascript">
    CKEDITOR.replace('editor1', {
      //startupFocus : true,
      toolbar : 'Full',
      filebrowserUploadUrl: "{{route('ckeditor4.upload', ['_token' => csrf_token()])}}",
      filebrowserUploadMethod: 'form' 

    });
</script>

@endsection

