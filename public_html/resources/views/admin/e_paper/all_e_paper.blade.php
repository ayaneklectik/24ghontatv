@extends('admin.master_layout')
@section('content')

@push('scripts')
<link rel="stylesheet" href="{{asset('public/admin_assets/dist/css/popup_form.css')}}">
<!-- DataTables -->
<link rel="stylesheet" href="{{asset('resources/admin_assets/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('resources/admin_assets/plugins/datatables-responsive/css/responsive.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('resources/admin_assets/plugins/datatables-buttons/css/buttons.bootstrap4.min.css')}}">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.8/css/fixedHeader.dataTables.min.css">
  <style>
    table th{
      border:solid 1px #818181;
      background-color:#002D3E;
      color:#FFF;
    }
  </style>
@endpush

<section class="content">
        <div class="card">
          <div class="card-body">
 
            <table style="width:100%;">
              <tr>
                <td><h4 class="card-title" style="color:#CE185B; font-size:25px;"><i class="fa fa-newspaper"></i>&nbsp;&nbsp;<b>Manage All Epaper</b></h4></td>
                <td style="text-align:right;">
                   <a onclick="openEpaperForm()" class="btn btn-dark btn-sm"><i class="fa fa-plus"></i>&nbsp;&nbsp;Add New Epaper</a>
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
                              <th>Published</th>
                              <th style="text-align:center;">Epaper</th>
                              <th style="text-align:right;">Actions</th>
                           </tr>
                         </thead>
                         <tbody>
                        @foreach ($epapers as $epaper)
                      
                        <tr>
                          <td>{{$loop->iteration}}</td>
                          <td>{{$epaper->pub_date}}</td>
               
                          <td style="text-align:center;">
                          @php
                              $imagePath2 = public_path('epaper/thumb/' . $epaper->epaper .'.jpg');
                              $imageSrc2 = file_exists($imagePath2) ? asset('public/epaper/thumb/' . $epaper->epaper.'.jpg') : asset('public/images/no-img-bg.png');
                          @endphp
                          <img src="{{$imageSrc2}}" alt="epaper" width="80">
                          </td>
                          <td  style="text-align:right;">
                    
                          @if($user->	user_delete_status == 1)
                            <a href="{{route('delete-epaper', $epaper->id)}}"  class="btn btn-danger btn-xs" onClick="return confirmation()"><i class="fa fa-trash"></i>&nbsp;Delete</a>
                          @endif 
                          </td>
                        </tr>
                 
                        @endforeach
                      </tbody>
                      </table>

                      <div style="padding:20px;">{{ $epapers->links('admin.partials.pagination-link') }}</div>
                </div>

                </div>
             </div>

          </div>
        </div>
     
</section>


 <!-- Add Epaper form-->
    <div class="form-popup" id="EpaperForm">
        <div style="background-color:#465F63; padding:7px 0 7px 15px; margin-bottom:15px; coloe:#fff;">
           <table style="width:100%; font-size:18px;">
                <tr>
                    <td  style="color:#fff;"><b>Add New E-Paper File</b></td>
                    <td style="text-align:right; padding-right:15px;"><a onclick="closeEpaperForm()" style="color:#fff; cursor: pointer;"><i class="fa fa-times"></i></a></td>
                </tr>
            </table>
        </div>
        <div class="form-container" >
            <div class="row" style="padding:5px 10px; margin-top:-15px;">
               <div class="col-sm-7 invoice-col">
                <form action="{{route('insert-epaper')}}" name="Reseller" method="post" role="form" enctype="multipart/form-data">
                @csrf

                <div style="padding-top:5px;">
                    <div>Published Date</div>
                    <input type="text" name="pub_date" id="datepicker" class="form-control" value="" required  autocomplete="off">
                </div>

                <div style="padding-top:15px;">File thumbnail image (<span style="color:red;">*mandatory</span>)</div>
                <div style="width: 157px; height: 172px; border: solid 1px #C4CFDA; margin-top:5px; ">
                    <img src="{{asset('public/images/no_image.jpg')}}" width="155" height="170" id="output">
                </div>
                <div style="padding-top:5px;">
                <input type='file' name="epaper_img"  onchange="loadFile(event)"/>
                </div>

                <script>
                        var loadFile = function(event) {
                          var reader = new FileReader();
                              reader.onload = function(){
                                var output = document.getElementById('output');
                                output.src = reader.result;
                              };
                              reader.readAsDataURL(event.target.files[0]);
                        };
                    </script>

                <div style="padding-top:10px;">Choose E-Paper PDF file</div>
                <div style="padding-top:5px; border: solid 1px #ccc;">
                <input type='file' name="epaper_file"  />
                </div>

                <div style="padding-top:20px;">
                    <button type="submit" class="btn btn-success"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;Add Epaper</button>
                    <button type="button" class="btn btn-info" onclick="closeEpaperForm()">Close</button>
                </div>
                </form>
                </div>
            </div>
        </div>
    </div>
    <!-- /Add Epaper form-->



@push('js_scripts')
  <!-- DataTables  & Plugins -->
  <script src="{{asset('resources/admin_assets/plugins/datatables/jquery.dataTables.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-responsive/js/dataTables.responsive.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-responsive/js/responsive.bootstrap4.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-buttons/js/dataTables.buttons.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-buttons/js/buttons.bootstrap4.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/jszip/jszip.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/pdfmake/pdfmake.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/pdfmake/vfs_fonts.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-buttons/js/buttons.html5.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-buttons/js/buttons.print.min.js')}}"></script>
  <script src="{{asset('resources/admin_assets/plugins/datatables-buttons/js/buttons.colVis.min.js')}}"></script>
  <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>

  <script>
  $(function () {
    $("#example1").DataTable({
      "lengthMenu": [[10, "All", 50, 25]],
      "fixedHeader": true,
      "responsive": false,
      "lengthChange": false,
      "autoWidth": false,
      "bPaginate": true, //hide pagination
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
        function openEpaperForm() {
            document.getElementById("EpaperForm").style.display = "block";
        }

        function closeEpaperForm() {
        document.getElementById("EpaperForm").style.display = "none";
        }
    </script>
@endpush

<script>
    $( function() {
        $( "#datepicker" ).datepicker({
        dateFormat: "dd-mm-yy"
        ,	duration: "fast"
        });
       
    } );
    </script>

@endsection

