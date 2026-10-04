@extends('admin.master_layout')
@section('content')

@push('scripts')
<style>
    .card .card-header .collapse-header{
        padding:3px 10px !important;
    }

    .drag-container {
        width: 100%;
        height: 100%;
        padding:0px;
        }

        .drag-list-item {
        position: absolute;
        padding:0px 15px;
        width: 100%;
        }

        .drag-item-content {
        border-radius: 4px;
        color: #000;
        font-size: 16px;
        padding:0px 15px;
        background-color: #FFF;
        box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
        }
</style>
@endpush


<meta name="csrf-token" content="{{ csrf_token() }}">
<section class="content" style="padding-bottom:200px;">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:23px;"><i class="fa fa-list"></i> &nbsp;Manage Category</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:15px; margin-top:10px;"></div>
        <div class="row">

            <!--Col Section-->
            <div class="col-md-3">
                <div style="padding:10px; text-align:center; background-color:#002D3E; Color: #FFF; border-top-left-radius:5px; border-top-right-radius:5px;">New Category</div>
                <div style="padding:15px; border:solid 1px #999999;">

                <form class="form-horizontal" action="{{route('insert-category')}}" method="post"  enctype="multipart/form-data">
                @csrf
                <div style="padding-top:13px;">
                    <div>Category Name</div>
                    <div>
                    <input type="text" name="cat_name" value="" class="form-control" required>
                    </div>
                </div>

                <div style="padding-top:13px;">
                    <div>Category Short Description</div>
                    <div>
                    <input type="text" name="cat_dis" value="" class="form-control" >
                    </div>
                </div>

                <div style="padding-top: 20px;">
                    <button type="submit" class="btn btn-success" style="width:100%">Submit</button>
                </div>

                </form>
                </div>


                <div style="padding:10px; text-align:center; background-color:#002D3E; Color: #FFF;">New Sub-Category</div>
                <div style="padding:15px; border:solid 1px #999999;">
                <form class="form-horizontal" action="{{route('insert-sub-category')}}" method="post"  enctype="multipart/form-data">
                @csrf
                <div>
                    <div>Category</div>
                    <div>
                    <select name="cat_id" class="form-control" required>
                        <option value="" selected="selected">--select Category--</option>
                        @foreach($cats as $cat)
                        <option value="{{$cat->id}}" >{{$cat->cat_name}}</option>
                        @endforeach
                    </select>
                    </div>
                </div>

                <div style="padding-top:13px;">
                    <div>Sub-Category Name</div>
                    <div>
                    <input type="text" name="sub_cat_name" value="" class="form-control" required>
                    </div>
                </div>




                <div style="height:15px; border-top:solid 1px #EBEBEB; margin-bottom:15px;"></div>

                <div>
                    <button type="submit" class="btn btn-success" style="width:100%">Submit</button>
                </div>
                </form>

                </div>


                </div>
                <!--/Col Section-->

                <!--Col Section-->
                <div class="col-md-9">
                <form class="form-horizontal" action="{{route('update-cat-order')}}" method="post"  enctype="multipart/form-data">
                @csrf
                @method('PUT')
                    <div style="padding:10px 20px; margin:0px 0px 10px 15px; background-color:#002D3E; border-radius: 5px;">
                    
                    <table style="width:100%;">
                        <tr>
                            <td style="font-size:18px; Color: #FFF;"><b>All Category</b></td>
                            <td style="text-align:right;">
                               <button type="submit" class="btn btn-warning btn-sm">Update</button>
                            </td>
                        </tr>
                    </table>
                </div>

                <!--Show SubCats-->
                <div  id="subcat-content" class="sub-cat-container">
                   <div id="subcatShow"></div>
                </div>
                <!--/Show SubCats-->

                <div class="drag-container">
                @foreach($cats as $index => $cat)
                <div class="drag-list-item">
                    <div class="drag-item-content">
                        <div style="padding:10px 20px;">
                        <div class=" w-100">
                            <div class="row">
                                <div class="col-7">
                                    <a style="cursor: pointer;" id="cat{{ $index + 1 }}"  data-cat-id="{{ $cat->id }}"><span class="order1">{{$index + 1}}</span>.&nbsp;&nbsp;<b>{{$cat->cat_name}}</b></a>
                                    <input type="hidden" class="order" name="cat_order[]" value="{{ $index + 1 }}">
                                    <input type="hidden" name="cat_id[]" value="{{ $cat->id }}">
                                
                                </div>

                                <div class="col-3" style="text-align:right;">
                                    <div class="checkbox-wrapper-2">
                                        <input type="checkbox" id="status{{$loop->iteration}}"   class="sc-gJwTLC ikxBAC" value=1 {{ $cat->status == 1 ? 'checked' : '' }}>
                                    </div>
                                </div>
                                <script>
                                    $(document).ready(function () {
                                        $('#status{{$loop->iteration}}').on('change', function () {
                                            var statusValue = $(this).is(':checked') ? 1 : 0;
                                            var id = {{$cat->id}}
                                                $.ajax({
                                                    url: "{{url('cat-status-update')}}",
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
                                <div class="col-2" style="text-align:right;">
                                    <a href="" class="btn btn-warning btn-xs">Edit</a>
                                    <a href="" class="btn btn-danger btn-xs">Delete</a>
                                </div>
                       
                            
                            </div>
                        </div>
                        </div>
                        
                    </div>
                    </div>

                    <script type="text/javascript">
                        $(document).ready(function () {
                            $("#subcat-content").hide();
                            $("#cat{{ $index + 1 }}").click(function (e) {
                                e.preventDefault(); // Prevent the default action of the anchor tag
                                var cat_id = $(this).attr('data-cat-id'); // Use $(this) to refer to the clicked element
                                console.log(cat_id);
                                $.get("load-sub-cat/" + cat_id, function (data) {
                                    $("#subcat-content").show();
                                    $("#subcatShow").html(data);
                                });
                            });

                        
                        });
                        </script>

                    @endforeach
                </div>

                </form>
                </div>
                <!--/Col Section-->

              
                </div>

                
                <!--/Col Section-->


</div>
</div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.4/utils/Draggable.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.4/TweenMax.min.js"></script>

<script src="{{asset('admin_assets/drag_drop/drag_drop.js') }}"></script>


@endsection

