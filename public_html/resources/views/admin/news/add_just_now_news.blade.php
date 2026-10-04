@extends('admin.master_layout')
@section('content')

@push('scripts')

  <style>
       .form-group .form-control {
        border-bottom: solid 1px #477d83;
        border-left: solid 1px #477d83;
      }

      .ck-editor__editable_inline {
        min-height: 600px;
    }

  </style>
@endpush

<section class="content">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-plus"></i> &nbsp;Add Just Now News</div></td>
                <td style="text-align:right;">
                  <a href="{{route('all-just-now-news')}}" class="btn btn-info"><i class="fa fa-list"></i>&nbsp;&nbsp;All Just Now News List</a>
                </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:15px; margin-top:10px;"></div>

        <form class="form-horizontal" action="{{route('insert-just-now-news')}}" method="post"  enctype="multipart/form-data">
        @csrf
        <div class="row">

            <!--Col Section-->
            <div class="col-md-12" style="padding-right:25px;">
            <div class="card">
            <div class="card-body">
            <div>
                <div class="label-title">News Headline<span>*</span></div>
                <div>
                  <input type="text" name="news_header" value="{{ old('news_header') }}" class="form-control" required>
                </div>
              </div>

              <div  style="padding-top:13px;">
                <div class="label-title">Publish<span>*</span></div>
                <div>
                <select name="status"  class="form-control" required style="width:200px;">
                      <option value="1" selected="selected">Yes</option>
                      <option value="0">No</option>
                  </select>
                </div>
              </div>

              <div style="height:15px; border-top:solid 1px #EBEBEB; margin-bottom:15px;"></div>

              <div>
                  <button type="submit" class="btn btn-success">Publish News</button>
              </div>

              </div>
              </div>
            </div>
            <!--/Col Section-->


        </div>
        </form>
    </div>
</div>
</section>



 <script>
    $( function() {
        $( "#datepicker111" ).datepicker({
            dateFormat: "dd-mm-yy"
            ,	duration: "fast"
        });

    } );
    </script>


@endsection


