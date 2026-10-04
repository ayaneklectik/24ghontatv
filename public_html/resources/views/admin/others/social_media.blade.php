@extends('admin.master_layout')
@section('content')

@push('scripts')


@endpush


<section class="content">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-plus"></i> &nbsp;Social Media</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #E1E3E6; margin-bottom:15px; margin-top:10px;"></div>

        <form class="form-horizontal" action="{{route('update-social-media')}}" method="post" >
        @csrf
        @method('PUT')
        <div class="row">

            <!--Col Section-->
            <div class="col-md-6">
             <div style="padding:15px; border:solid 1px #999999; border-radius:8px;">
  

             <div style="padding-top:13px;">
                <div><b>Facebook</b></div>
                <div>
                  <input type="text" id="" name="facebook" value="{{$media->facebook}}" class="form-control">
                </div>
              </div>

              <div style="padding-top:13px;">
                <div><b>Twitter</b></div>
                <div>
                  <input type="text" id="" name="twitter" value="{{$media->twitter}}" class="form-control">
                </div>
              </div>

              <div style="padding-top:13px;">
                <div><b>Instagram</b></div>
                <div>
                  <input type="text" id="" name="instagram" value="{{$media->instagram}}" class="form-control">
                </div>
              </div>

              <div style="padding-top:13px;">
                <div><b>Youtube</b></div>
                <div>
                  <input type="text" id="" name="youtube" value="{{$media->youtube}}" class="form-control">
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




@endsection

