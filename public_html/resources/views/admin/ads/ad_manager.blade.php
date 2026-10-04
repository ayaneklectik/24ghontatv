@extends('admin.master_layout')
@section('content')

@push('scripts')
<style>
    .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    }

    .upload-btn {
    border: 1px solid gray;
    color: gray;
    background-color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    }

    .upload-btn1 {
    border: 1px solid gray;
    color: gray;
    background-color: white;
    padding: 5px 15px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    }

    .upload-btn-wrapper input[type=file] {
    font-size: 50px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    }
</style>
@endpush
<meta name="csrf-token" content="{{ csrf_token() }}">
<section class="content" style="padding-bottom:200px;">
    <div class="container-fluid">
        <div class="card-body">
            @foreach($ads as $ad)
            <form class="form-horizontal" action="{{route('update-ad', $ad->id)}}" method="post"  enctype="multipart/form-data">
             @csrf
            <div style="background-color:#FFF; border: solid 1px #E3E3E3; border-radius:6px; margin-top:15px;">
                <div class="row" style="padding:10px 20px;">
                    <div class="col-4">
                        <div style="color:#1A4252;"><b>Ad Image (970 x 90 px)</b></div>
                        <div style="padding-top:8px;">
                            @if($ad->status == 1)
                                <img style="width: 100%;" src="{{ asset('public/images/ad/'. $ad->ad_image) }}" alt="">
                            @else 
                                <img style="width: 100%;" src="{{ asset('public/images/ad/default.png') }}" alt="">
                            @endif
                        </div>

                        <div>
                            <div  style="color:#1A4252; padding-top:10px;"><b>Company Link</b></div>
                            <div>
                            <input type="text" name="company_link" value="{{ $ad->company_link }}" class="form-control">
                            </div>
                        </div>
                    </div>

                    <div class="col-4" style="text-align:center;">
                        <div style="color:#1A4252;"><b>Ad Position (fixed)</b></div>
                        <div style="padding-top:8px;">
                            {{$ad->ad_position}}
                        </div>
                    </div>

                    <div class="col-2" style="text-align:center;">
                        <div style="color:#1A4252;"><b>Default Image</b></div>
                        <div style="padding-top:8px;">
                            <div class="checkbox-wrapper-2">
                                <input type="checkbox" id="status{{$loop->iteration}}"   class="sc-gJwTLC ikxBAC" value=1 {{ $ad->status == 1 ? 'checked' : '' }}>
                            </div>
                        </div>
                    </div>

                    <div class="col-2" style="text-align:right;">
                        <div style="color:#1A4252;"><b>Update AD Image</b></div>
                        <div style="padding-top:8px;">
                      
                        <div class="row">
                            <div class="col-6">
                            <div class="upload-btn-wrapper" style="margin-right:-20px;">
                                <button class="upload-btn" id="btn1{{$loop->iteration}}"><i class="fa fa-plus"></i>&nbsp;Add image</button>
                                <input type="hidden" name="ad_image" value="{{$ad->ad_position}}"/>
                                <input id="btn{{$loop->iteration}}" type="file" name="ad_image_file" />
                            </div>
                            </div>
                            <div class="col-6" >
                            <div>
                                <button type="submit" class="btn btn-warning btn-xs">Update</button>
                            </div>
                            </div>
                        </div>
                        
                            
                        </div>
                    </div>

                </div>
            </div>
            </form>
            <script>
                $(document).ready(function () {
                    $('#status{{$loop->iteration}}').on('change', function () {
                        var statusValue = $(this).is(':checked') ? 1 : 0;
                        var id = {{$ad->id}}
                        $.ajax({
                            url: "{{route('ad-status-update')}}",
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

            <script>
                $(document).ready(function(){
                    $("#btn{{$loop->iteration}}").click(function(){
                        $(this).val("");
                    });

                    $("#btn{{$loop->iteration}}").change(function(){
                        const button1 = document.getElementById("btn1{{$loop->iteration}}");
                        button1.style.backgroundColor = "green";
                        button1.style.color = "white";
                    });
                });
            </script>
            @endforeach

            <div style="color:#1A4252; padding:10px 0px;  margin-top:15px; font-size:18px;"><b>Facebook Post Share AD <span style="color:red">(*important note: image Type PNG. Image Size: 800 x 50 px)</span></b></div>
            <div style="background-color:#CCC; border: solid 1px #E3E3E3; border-radius:6px;">
            <form class="form-horizontal" action="{{route('fb-post-ad')}}" method="post"  enctype="multipart/form-data">
             @csrf
            <div class="row" style="padding:10px 20px;">
                    <div class="col-6">
                       
                        <div>
                            <div  style="color:#1A4252; padding-top:0px;"><b>Post Add (800 x 50 px)</b></div>
                            <div>
                            <img style="width: 100%;" src="{{ asset('public/images/logos/wm_logo.png') }}" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="col-3" style="text-align:center;"></div>

                    <div class="col-2" style="text-align:center;">
                        <div style="margin-right:-20px; padding-top:23px;">
                            <input type="file" name="fb_ad" accept=".png, .jpg, .jpeg"/>
                        </div>
                    </div>

                    


                    <div class="col-1" style="text-align:right;">
                        <div style="padding-top:23px;">
                            <button type="submit" class="btn btn-warning">Update</button>
                        </div>
                    </div>

                </div>
            </form>
            </div>


            <div style="color:#1A4252; padding:10px 0px;  margin-top:15px; font-size:22px;"><b>Home Page Category Ad Image (970 x 90 px)</b></div>
            <div style="background-color:#CCC; border: solid 1px #E3E3E3; border-radius:6px;">
            <form class="form-horizontal" action="{{route('insert-cat-ad')}}" method="post"  enctype="multipart/form-data">
             @csrf
            <div class="row" style="padding:10px 20px;">
                    <div class="col-5">
                       
                        <div>
                            <div  style="color:#1A4252; padding-top:0px;"><b>Company Link</b></div>
                            <div>
                            <input type="text" name="company_link" value="" class="form-control">
                            </div>
                        </div>
                    </div>

                    <div class="col-2" style="text-align:center;">
                        <div class="upload-btn-wrapper" style="margin-right:-20px; padding-top:23px;">
                            <button class="upload-btn1" id="btn123"><i class="fa fa-plus"></i>&nbsp;Add image</button>
                            <input id="btn223" type="file" name="ad_cat_image_file" />
                        </div>
                    </div>

                    <div class="col-4" style="text-align:center;">
                    <div>
                    <div>Select Ad Position by Category</div>
                    <select name="cat_order" class="form-control" required>
                        <option value="" selected="selected">-- select Position --</option>
                        @foreach($cats as $cat)
                        <option value="{{$cat->cat_order}}" >{{$cat->cat_name}}</option>
                        @endforeach
                    </select>
                    </div>
                    </div>

                    <div class="col-1" style="text-align:right;">
                        <div style="padding-top:23px;">
                            <button type="submit" class="btn btn-success">Submit</button>
                        </div>
                    </div>

                </div>
            </form>
            </div>



            @foreach($cat_ads as $cat_ad)
            <div style="background-color:#FFF; border: solid 1px #E3E3E3; border-radius:6px; margin-top:15px;">
                <div class="row" style="padding:10px 20px;">
                    <div class="col-4">
                        <div style="color:#1A4252;"><b>Ad Image (970 x 90 px)</b></div>
                        <div style="padding-top:8px;">
                            <img style="width: 100%;" src="{{ asset('public/images/ad/'. $cat_ad->ad_image) }}" alt="">
                            <div>{{$cat_ad->company_link}}</div>
                        </div>
                    </div>

                    <div class="col-4" style="text-align:center;">
                        <div style="color:#1A4252;"><b>Ad Position</b></div>
                        <div style="padding-top:8px;">

                        @php 
                        $ad_position = $cat_ad->ad_position;
                        try{
                            $cat = App\Http\Controllers\StaticLinkController::getCatNameByOrder($ad_position);
                            $cat_name = $cat->cat_name;
                        }catch(Exception $e){
                            $cat_name = "";
                        }
                    @endphp
                           {{$cat_name}}
                        </div>
                    </div>

                    <div class="col-2" style="text-align:center;">
                        <div style="color:#1A4252;"><b>Hide</b></div>
                        <div style="padding-top:8px;">
                            <div class="checkbox-wrapper-2">
                                <input type="checkbox" id="status_cat{{$loop->iteration}}"   class="sc-gJwTLC ikxBAC" value=1 {{ $cat_ad->status == 1 ? 'checked' : '' }}>
                            </div>
                        </div>
                    </div>

                    <div class="col-2" style="text-align:right;">
                    <a href="{{route('cat-ad-delete', $cat_ad->id )}}" onClick="return confirmation()" class="btn btn-danger btn-xs">delete</a>
                    </div>


                </div>
            </div>

            <script>
                $(document).ready(function () {
                    $('#status_cat{{$loop->iteration}}').on('change', function () {
                        var statusValue = $(this).is(':checked') ? 1 : 0;
                        var id = {{$cat_ad->id}}
                        $.ajax({
                            url: "{{route('cat-ad-status-update')}}",
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



        </div>
    </div>
</section>

<script>
                $(document).ready(function(){
                    $("#btn223").click(function(){
                        $(this).val("");
                    });

                    $("#btn223").change(function(){
                        const button1 = document.getElementById("btn123");
                        button1.style.backgroundColor = "green";
                        button1.style.color = "white";
                    });
                });
 </script>

<script type="text/javascript">
        function confirmation() {
        return confirm('Are you sure you want to Delete this?');
          }
  </script>

@endsection