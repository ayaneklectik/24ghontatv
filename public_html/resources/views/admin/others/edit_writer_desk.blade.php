@extends('admin.master_layout')
@section('content')

@push('scripts')


@endpush


<section class="content">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-edit"></i> &nbsp;Edit Writer Desk</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #E1E3E6; margin-bottom:15px; margin-top:10px;"></div>

    
        <div class="row">

            <!--Col Section-->
            <div class="col-md-6">
            <form class="form-horizontal" action="{{route('update-writer-desk', $desk->id)}}" method="post" >
             @csrf
             @method('PUT')
             <div style="padding:15px; border:solid 1px #999999; border-radius:8px;">
  
             <div style="padding-top:13px;">
                <div><b>Writer Desk</b></div>
                <div class="row">
                  <div class="col-8">
                  <div>
                  <input type="text" id="" name="writer_desk" value="{{$desk->writer_desk}}" class="form-control" required>
                </div>
                  </div>
                  <div class="col-4">
                    <button type="submit" class="btn btn-warning">Update</button>
                  </div>
                </div>
              
              </div>

       
              </div>
            </form>

            </div>
            <!--/Col Section-->

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

