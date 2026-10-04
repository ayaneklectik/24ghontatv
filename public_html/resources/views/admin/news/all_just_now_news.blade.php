@extends('admin.master_layout')
@section('content')
@push('scripts')
<!-- DataTables -->

  <style>
    table th{
      border:solid 1px #818181;
      background-color:#002D3E;
      color:#FFF;
    }
  </style>
@endpush
<meta name="csrf-token" content="{{ csrf_token() }}">
<section class="content">
        <div class="card">
          <div class="card-body">
 
            <table style="width:100%;">
              <tr>
                <td><h4 class="card-title" style="color:#CE185B; font-size:25px;"><i class="fas fa-clock"></i>&nbsp;&nbsp;Manage All Just Now News</h4></td>
                <td style="text-align:right;">
                   <a href="{{route('add-just-now-news')}}" class="btn btn-success btn-sm"><i class="fa fa-plus"></i>&nbsp;&nbsp;Add New</a>
                </td>
              </tr>
            </table>
            <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:5px; margin-top:10px;"></div>

              <div class="row">
                <div class="col-md-12">
                  <div class="table-responsive" style="margin-top:0px; padding-bottom:30px;" >
                       <table  class="table table-striped"  id="example1">
                         <thead style="background-image: linear-gradient(to top, #e70a3a, #d80934, #c9082e, #ba0728, #ac0623);  background-color:#CE185B; color:#FFF;">
                           <tr>
                              <th>SL</th>
                              <th>Headline</th>
                              <th style="text-align:center;">Status</th>
                              <th>Last Update Info</th>
                              <th style="text-align:right;">Actions</th>
                           </tr>
                         </thead>
                         <tbody>
                         @foreach ($all_news as $news)
                        <tr>
                          <td>{{$loop->iteration}}</td>
                          <td><div style="color:#CE185B;">  <b>{{$news->news_title}}</b></div></td>
                          <td style="text-align:center;">
                          <div class="checkbox-wrapper-2">
                            <input type="checkbox" id="status{{$loop->iteration}}"  class="sc-gJwTLC ikxBAC" value=1 {{ $news->status == 1 ? 'checked' : '' }}>
                          </div>
                          </td>
                          <td>{{$news->published_date}}</td>
                          <td  style="text-align:right;">
                            <a href="{{route('delete-just-now-news', $news->id)}}" onClick="return confirmation()" class="btn btn-danger btn-xs" onClick="return confirmation()"><i class="fa fa-trash"></i>&nbsp;Delete</a>
                          </td>
                        </tr>

                        <script>
                          $(document).ready(function () {
                              $('#status{{$loop->iteration}}').on('change', function () {
                                  var statusValue = $(this).is(':checked') ? 1 : 0;
                                  var id = {{$news->id}}
                                      $.ajax({
                                          url: "{{url('just-now-news-status')}}",
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
                        @endforeach
                
                      </tbody>
                      </table>
                </div>

                </div>
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

