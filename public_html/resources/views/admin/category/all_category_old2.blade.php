@extends('admin.master_layout')
@section('content')

@push('scripts')
<style>
    .card .card-header .collapse-header{
        padding:3px 10px !important;
    }
</style>
@endpush
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- jQuery UI -->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>


<section class="content">
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
            <div class="col-md-9" style="padding-right:25px;">
                <div class="card">
                <div class="card-header" style="background-color:#002D3E; color:#FFF; font-size:25px;">
                    <h3 class="card-title">All Category</h3>
                </div>
                @foreach($cats as $index => $cat)
                    <div class="drag-body" data-catid="{{$index + 1}}">
                        <div style="border:solid 1px #CCC; padding:10px 20px; margin:6px 0;">
                        <div class=" w-100">
                            <div class="row">
                                <div class="col-7">
                                <a  style="color:#CE185B;" class="d-block w-100" href="">
                                    {{$index + 1}}.&nbsp;&nbsp;<b>{{$cat->cat_name}}</b>
                                </a>
                                </div>
                                <div class="col-3" style="text-align:right;">
                                    <div class="checkbox-wrapper-2">
                                        <input type="checkbox"   class="sc-gJwTLC ikxBAC" value=1 >
                                    </div>
                                </div>
                                <div class="col-2" style="text-align:right;">
                                    <a href="" class="btn btn-warning btn-xs">Edit</a>
                                    <a href="" class="btn btn-danger btn-xs">Delete</a>
                                </div>
                            </div>
                        </div>
                        </div>
                        
                    </div>
                    @endforeach
              
                </div>

                </div>
                <!--/Col Section-->


        </div>
    </div>
</div>

<script>
$(function() {
    $(".drag-body").sortable({
        connectWith: ".drag-body",
    }).disableSelection();
});
</script>


@endsection

