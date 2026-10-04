@extends('admin.master_layout')
@push('scripts')

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css"/>
  <style>
    .avatar-upload .avatar-preview {
        width: 100%;
        height: 200px;
        position: relative;
        border: 3px solid #CCCCCC;
        background-image: url("{{ asset('public/images/male.jpg') }}");
        background-size: cover; /* Adjust based on your needs */
        background-position: center;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      }
      .avatar-upload .avatar-preview > div {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        
       }

       .form-group .form-control {
        border-bottom: solid 1px #477d83;
        border-left: solid 1px #477d83;
      }

      .ck-editor__editable_inline {
        min-height: 600px;
    }

  </style>
@endpush
@section('content')
<!-- Main content -->
<form class="form-horizontal" action="{{ route('update-user', $user->id) }}" method="post">
@csrf
 @method('PUT')
<section class="content">
<div class="container-fluid">
  <div class="row">
    <div class="col-12" style="margin-top:20px;">
           <div class="card">
              <div class="card-header"  style="background-color:#343A40; color:#FFF;">
                <h3 class="card-title"><i class="fa fa-user"></i>&nbsp; Edit User</h3>
                <div class="card-tools">
                  <a href="{{ route('manage-users') }}" class="btn btn-success btn-sm"> All Users</a>
                  <a href="{{ route('password-change', $user->id) }}" class="btn btn-info btn-sm"><i class="fa fa-key"></i> Change Password</a>
                </div>
              </div>
              <!-- /.card-header -->
              <!-- form start -->
              <div class="row">
              <div class="col-6">
                <div class="card-body">
                  <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label">Name</label>
                    <div class="col-sm-8">
                      <input type="text" name="name" class="form-control" value="{{ $user->name }}">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label">Email</label>
                    <div class="col-sm-8">
                      <input type="email" name="email" class="form-control" value="{{ $user->email }}">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label">Contact</label>
                    <div class="col-sm-6">
                      <input type="text" name="contact" class="form-control" value="{{ $user->contact }}">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label">User Type</label>
                    <div class="col-sm-5">
                      <select  class="form-control" name="user_type" id="user_type">
                        <option value="Admin" @if($user->user_type == 'Admin') selected @endif>Admin</option>
                        <option value="Representative" @if($user->user_type == 'Representative') selected @endif>Representative</option>
                        <option value="Moderator" @if($user->user_type == 'Moderator') selected @endif>Moderator</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label"></label>
                    <div class="col-sm-4">
                    <div>
                    <div class="label-title" style="padding-top:13px;">Photo:</div>
                            <div style="margin-top:5px; border:solid 1px #CCC; margin-bottom:15px;" id="image_holder_exsist">
                              <input type="hidden" name="image" value="{{$user->photo}}">
                                <img src="{{ asset($user->photo ? 'public/images/user_image/thumbnail/' . $user->photo : 'images/male.jpg') }} " id="output" style="width:100%">
                            </div>

                            <div class="avatar-upload" id="image_holder">
                            <div class="avatar-preview">
                                <div id="imagePreview">
                                    <input type="hidden" name="_token" value="{{csrf_token()}}">
                                </div>
                            </div>
                            </div>
                      <input type='file' id="imageUpload" accept=".png, .jpg, .jpeg" name="imageUpload" class="imageUpload" />
                      <input type="hidden" name="base64image"  id="base64image">
                  </div>
                    </div>
                  </div>

                  <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label"></label>
                    <div class="col-sm-6">
                        <button type="submit" class="btn btn-warning float-left">Update</button>
                    </div>
                  </div>


                </div>
                </div>

                @php 
                  $user_type = $user->user_type;
                  if($user_type == "Admin"){
                    $dis = "display:none;";
                  }else{
                    $dis = "";
                  }
                @endphp
                <div class="col-3 box1" style="padding:15px; {{$dis}}">
                <div style="color:#002D3E"><em><b>Access Permission</b></em></div>

                  <div style="padding-top:10px;">
                    <label class="container-checkbox"> Add New News
                    <input type="checkbox" name="add_news_status" value=1 {{ $user_role->add_news_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> Manage All News
                    <input type="checkbox" name="manage_news_status" value=1 {{ $user_role->manage_news_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> News Category
                    <input type="checkbox" name="category_status" value=1 {{ $user_role->category_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> Just Now News
                    <input type="checkbox" name="just_nows_status" value=1 {{ $user_role->just_nows_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> Video Gallery
                    <input type="checkbox" name="video_status" value=1 {{ $user_role->video_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> Photo Gallery
                    <input type="checkbox" name="photo_status" value=1 {{ $user_role->photo_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> AD Manager
                    <input type="checkbox" name="ad_manager_status" value=1 {{ $user_role->ad_manager_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> E-Paper
                    <input type="checkbox" name="e_paper_status" value=1 {{ $user_role->e_paper_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> Live Video
                    <input type="checkbox" name="live_status" value=1 {{ $user_role->live_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> User Manage
                    <input type="checkbox" name="user_manage_status" value=1 {{ $user_role->user_manage_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:10px;">
                    <label class="container-checkbox"> Footer widget
                    <input type="checkbox" name="footer_status" value=1 {{ $user_role->footer_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                

                </div>

                <div class="col-3 box2" style="padding:15px; {{$dis}}">
                  <div style="color:#002D3E"><em><b>Actions</b></em></div>

                  <div style="padding-top:20px;">
                    <label class="container-checkbox">User can Edit
                    <input type="checkbox" name="user_edit_status" value=1 {{ $user->user_edit_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                <div style="padding-top:20px;">
                    <label class="container-checkbox">User can Delete
                    <input type="checkbox" name="user_delete_status" value=1 {{ $user->user_delete_status == 1 ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    </label>
                </div>

                </div>
                </div>
                <!-- /.card-body -->
         
             
            </div>
        </div>
      </div>
      </div>
</section>
</form>


<!--image crop modal-->
<div class="modal fade bd-example-modal-lg imagecrop" id="model" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Crop Image</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
              <div class="img-container">
                  <div class="row">
                      <div class="col-md-11">
                          <img id="image" src="https://avatars0.githubusercontent.com/u/3456749">
                      </div>
                  </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary crop" id="crop">Crop</button>
            </div>
        </div>
      </div>
    </div>
    <!--/image crop modal-->


<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.js"></script>
    <script>
        var $modal = $('.imagecrop');
        var image = document.getElementById('image');
        var cropper;
        var $image_holder_exsist = $('#image_holder_exsist');
         var $image_holder = $('#image_holder');
         $image_holder.hide();
         $image_holder_exsist.show();
        $("body").on("change", ".imageUpload", function(e){
            var files = e.target.files;
            var done = function(url) {
                image.src = url;
                $modal.modal('show');
            };
            var reader;
            var file;
            var url;
            if (files && files.length > 0) {
                file = files[0];
                if (URL) {
                    done(URL.createObjectURL(file));
                } else if (FileReader) {
                    reader = new FileReader();
                    reader.onload = function(e) {
                        done(reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
        $modal.on('shown.bs.modal', function() {
            cropper = new Cropper(image, {
                aspectRatio: 1/1,
                viewMode: 1,
            });
        }).on('hidden.bs.modal', function() {
            cropper.destroy();
            cropper = null;
        });
        $("body").on("click", "#crop", function() {
            canvas = cropper.getCroppedCanvas({
                width: 600,
                height: 500,
            });
            canvas.toBlob(function(blob) {
                url = URL.createObjectURL(blob);
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                     var base64data = reader.result;
                     $('#base64image').val(base64data);
                     document.getElementById('imagePreview').style.backgroundImage = "url("+base64data+")";
                     $modal.modal('hide');
                     $image_holder.show();
                     $image_holder_exsist.hide();
                }
            });
        })

    </script>

<script>
$(document).ready(function(){
        $("#user_type").change(function(){
            $( "#user_type option:selected").each(function(){
                if($(this).attr("value")=="Admin"){
                    $(".box1").hide();
                    $(".box2").hide();
                }else{
                  $(".box1").show();
                  $(".box2").show();
                }
               
            });
        }).change();
    });
</script>
@endsection
