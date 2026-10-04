@extends('admin.master_layout')
@section('content')
@push('scripts')
<meta name="csrf-token" content="{{ csrf_token() }}">
<!-- DataTables -->
<link rel="stylesheet" href="{{asset('public/admin_assets/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('public/admin_assets/plugins/datatables-responsive/css/responsive.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('public/admin_assets/plugins/datatables-buttons/css/buttons.bootstrap4.min.css')}}">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.8/css/fixedHeader.dataTables.min.css">
  <style>
    table th{
      border:solid 1px #818181;
      background-color:#002D3E;
      color:#FFF;
    }
    div.dataTables_filter,
    div.dataTables_length {
      display: inline-block;
      margin-left: 1em;
      float:right;
    }
  </style>
@endpush

<section class="content">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-6">
              <h4 class="card-title" style="color:#CE185B; font-size:25px;"><i class="fa fa-newspaper"></i>&nbsp;&nbsp;<b>Manage All News</b></h4>
              </div>
              <div class="col-4"  style="text-align:right;">
                <div class="checkbox-wrapper-2" style="padding-top:10px">
                <span style="font-size:18px; color:#E2126E"><b>News Scroller Hide</b></span>&nbsp;&nbsp;
                    <input type="checkbox" id="scrollerStatus"  class="sc-gJwTLC ikxBAC" value=1 {{ $scroller->status == 1 ? 'checked' : '' }}>

                </div>
              </div>
              <div class="col-2"  style="text-align:right;">
              <a href="{{route('add-new-news')}}" class="btn btn-dark btn-sm"><i class="fa fa-bars"></i>&nbsp;&nbsp;Add New News</a>
              </div>
            </div>


            <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:5px; margin-top:10px;"></div>

              <div class="row">
                <div class="col-md-12">
                  <div class="table-responsive" style="margin-top:0px; padding-bottom:30px;" >
                       <table  class="table table-striped"  id="example1">
                         <thead style="background-image: linear-gradient(to top, #e70a3a, #d80934, #c9082e, #ba0728, #ac0623);  background-color:#CE185B; color:#FFF;">
                           <tr>
                              <th></th>
                              <th>SL</th>
                              <th>Published</th>
                              <th>Headline</th>
                              <th>View</th>
                              <th style="text-align:center;">isLead</th>
                              <th style="text-align:center;">isScrolled</th>
                              <th>Status</th>
                              <th style="text-align:center;">Image</th>
                              <th style="text-align:right;">Actions</th>
                           </tr>
                         </thead>
                         <tbody>
                        @foreach ($all_news as $key => $news)

                        <tr>
                        <td>{{($all_news->currentpage()-1) * $all_news->perpage() + $key + 1}}</td>
                          <td>
                            {{$news->published_date}}
                            <div>{{$news->published_time}}</div>
                          </td>
                          <td>
                            @php
                             try{
                                $cat_id = $news->cat;

                                $cat = App\Http\Controllers\StaticLinkController::getCatByID($cat_id);
                                $cat_name = $cat->cat_name;

                             }catch(Exception $e){
                                $cat_name = "";

                             }

                             try{
                                $user_id = $news->user;
                                $user = App\Http\Controllers\StaticLinkController::getUser($user_id);
                                $user_name = $user->name;
                                $user_type = $user->user_type;
                             }catch(Exception $e){
                                $user_name = "";
                                $user_type = "";
                             }

                            @endphp
                            <div style="color:#CE185B; font-size:13px;">
                              <a href="{{route('news-details-admin',[$news->id, $news->title_link])}}" target="blank" style="color:#CE185B; font-size:13px;">
                                  <b>{{$news->news_title}}</b>
                              </a>
                            </div>
                            <div style="padding-top:5px; font-size:14px;">{{$cat_name}}</div>
                            <div style="padding-top:5px; color:#044016; font-size:14px;">Uploader:&nbsp;  {{$user_name}}, {{$user_type}}</div>
                          </td>

                            <td><div style="color:#002D3E;">  <b>{{$news->hit}}</b></div></td>

                          <td style="text-align:center;">
                             <div class="checkbox-wrapper-2" style="padding-top:10px">
                              <input type="checkbox" id="isLead{{$loop->iteration}}"  class="sc-gJwTLC ikxBAC" value=1 {{ $news->islead == 1 ? 'checked' : '' }}>
                            </div>
                          </td>
                          <td style="text-align:center;">
                             <div class="checkbox-wrapper-2" style="padding-top:10px">
                              <input type="checkbox" id="isBreaking{{$loop->iteration}}"  class="sc-gJwTLC ikxBAC" value=1 {{ $news->isbreaking == 1 ? 'checked' : '' }}>
                            </div>
                          </td>
                          <td>
                          @if (optional(auth()->user())->user_type == "Admin")
                            @if($news->status==1)
                               <a href="{{route('news-published', $news->id)}}" class="btn btn-success btn-sm"> Published</a>
                             @else
                              <a href="{{route('news-unpublished', $news->id)}}" class="btn btn-danger btn-sm"> NotPublished</a>
                             @endif
                          @else
                            @if($news->status==1)
                                <a class="btn btn-success btn-sm"> Published</a>
                              @else
                                <a class="btn btn-danger btn-sm"> In review</a>
                              @endif
                            @endif
                          </td>
                          <td style="text-align:center;">
                          @php
                              $imagePath = public_path('images/news_img/thumbnail/' . $news->image);
                              $imageSrc = file_exists($imagePath) ? asset('public/images/news_img/thumbnail/' . $news->image) : asset('public/images/no-img-bg.png');
                          @endphp
                            <img src="{{$imageSrc}}" alt="no image" width="80">
                          </td>
                          <td  style="text-align:right;">
                          @if(optional(auth()->user())->user_edit_status == 1)
                            <div><a href="{{route('news-edit-form', $news->id)}}" class="btn btn-warning btn-xs"><i class="fa fa-edit"></i>&nbsp; Edit</a></div>
                          @endif

                          @if(optional(auth()->user())->user_delete_status == 1)
                            <div style="padding-top:8px;">
                              <a href="{{route('delete-news', $news->id )}}"  class="btn btn-danger btn-xs" onClick="return confirmation()"><i class="fa fa-trash"></i>&nbsp;Delete</a>
                            </div>
                          @endif
                          </td>
                        </tr>
                        <script>
                          $(document).ready(function () {
                              $('#isLead{{$loop->iteration}}').on('change', function () {
                                  var statusIsLead = $(this).is(':checked') ? 1 : 0;
                                  var id = {{$news->id}}
                                      $.ajax({
                                          url: "{{url('is-lead-status')}}",
                                          type: 'POST', // or 'GET' depending on your server configuration
                                          data: {
                                              status: statusIsLead,
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

                              $('#isBreaking{{$loop->iteration}}').on('change', function () {
                                  var statusIsBraking = $(this).is(':checked') ? 1 : 0;
                                  var id = {{$news->id}}
                                      $.ajax({
                                          url: "{{url('is-scroll-status')}}",
                                          type: 'POST', // or 'GET' depending on your server configuration
                                          data: {
                                              status: statusIsBraking,
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
                      <div style="padding:20px;">{{ $all_news->links('admin.partials.pagination-link') }}</div>
                </div>

                </div>
             </div>

          </div>
        </div>

</section>
@push('js_scripts')
  <!-- DataTables  & Plugins -->
  <script src="{{asset('public/admin_assets/plugins/datatables/jquery.dataTables.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-responsive/js/dataTables.responsive.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-responsive/js/responsive.bootstrap4.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-buttons/js/dataTables.buttons.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-buttons/js/buttons.bootstrap4.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/jszip/jszip.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/pdfmake/pdfmake.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/pdfmake/vfs_fonts.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-buttons/js/buttons.html5.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-buttons/js/buttons.print.min.js')}}"></script>
  <script src="{{asset('public/admin_assets/plugins/datatables-buttons/js/buttons.colVis.min.js')}}"></script>
  <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>

  <script>
  $(function () {
    $("#example1").DataTable({
      "lengthMenu": [[10, "All", 50, 25]],
      "fixedHeader": true,
      "responsive": false,
      "lengthChange": false,
      "autoWidth": false,
      "bPaginate": false, //hide pagination
      "bFilter": true, //hide Search bar
      "bInfo": false, // hide showing entries
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copyHtml5', footer: true },
        { extend: 'excelHtml5', footer: true },
        { extend: 'csvHtml5', footer: true },
        { extend: 'pdfHtml5', footer: true },
        { extend: 'print', footer: true },
        'pageLength'
  ],
  lengthMenu: [
              [ 25, 50, 100, 200, -1 ],
              [ '25 rows', '50 rows', '100 rows', '200 rows', 'Show all' ]
          ],


    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

  });
  </script>


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
@endpush


<script>
                                    $(document).ready(function () {
                                        $('#scrollerStatus').on('change', function () {
                                            var statusValue = $(this).is(':checked') ? 1 : 0;
                                            var id = 1
                                                $.ajax({
                                                    url: "{{route('news-scroller-status-update')}}",
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
