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
              <h4 class="card-title" style="color:#CE185B; font-size:25px;"><i class="fa fa-newspaper"></i>&nbsp;&nbsp;<b>Set Top Five News</b></h4>
              </div>
              <div class="col-4"  style="text-align:right;">

              </div>
    
            </div>
 
          
            <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:5px; margin-top:10px;"></div>

              <div class="row">
                <div class="col-md-12">
                  <div class="table-responsive" style="margin-top:0px; padding-bottom:30px;" >
                       <table  class="table table-striped" >
                         <thead style="background-image: linear-gradient(to top, #e70a3a, #d80934, #c9082e, #ba0728, #ac0623);  background-color:#CE185B; color:#FFF;">
                           <tr>
                              <th>SL</th>
                              <th>Published</th>
                              <th>Headline</th>
                              <th>View</th>
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

                                $subcat = App\Http\Controllers\StaticLinkController::getSubCatByID($news->sub_cat);
                                $subcat_name = $subcat->sub_cat_name;
                             }catch(Exception $e){
                                $cat_name = "";
                                $subcat_name = "";
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
                            <div style="padding-top:5px; font-size:14px;">{{$cat_name}} &nbsp; >&nbsp;  {{$subcat_name}}</div>
                          </td>

                            <td><div style="color:#002D3E;">  <b>{{$news->hit}}</b></div></td>

                          <td>
             
                            @if($news->status==1)
                                <a class="btn btn-success btn-sm"> Published</a>
                              @else 
                                <a class="btn btn-danger btn-sm"> In review</a>
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

                            <div><a href="{{route('top-five-news-update', [$top_five_id, $news->id])}}" class="btn btn-info"> Set as Top Five</a></div>
             
                          </td>
                        </tr>
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

