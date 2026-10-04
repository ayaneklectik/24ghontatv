@extends('admin.master_layout')
@section('content')

@push('scripts')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css"/>
  <style>
    .avatar-upload .avatar-preview {
        width: 250px;
        height: 180px;
        position: relative;
        border: 3px solid #CCCCCC;
        background-image: url("{{ asset('public/images/no_image.jpg') }}");
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
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-edit"></i> &nbsp;Edit News Family</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:15px; margin-top:10px;"></div>

        <form class="form-horizontal" action="{{route('update-news-family', $member->id)}}" method="post"  enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row">

            <!--Col Section-->
            <div class="col-md-3">
             <div style="padding:15px; border:solid 1px #999999; border-radius:8px;">
             <div style="padding-top:13px;">
                <div>Name*</div>
                <div>
                  <input type="text" id="" name="name" value="{{$member->name}}" class="form-control"  required>
                </div>
              </div>

              <div style="padding-top:13px;">
                <div>Contact</div>
                <div>
                  <input type="text" id="" name="contact" value="{{$member->contact}}" class="form-control">
                </div>
              </div>

              <div style="padding-top:13px;">
                <div>Position*</div>
                <div>
                  <input type="text" id="" name="position" value="{{$member->position}}" class="form-control"  required>
                </div>
              </div>

              <div style="padding-top:13px;">
                <div>Address</div>
                <div>
                  <textarea rows="3" name="address" id="" class="form-control" >{{$member->address}}</textarea>
                </div>
              </div>

              <div>
              <div class="label-title" style="padding-top:13px;">Photo:</div>
                      <div style="margin-top:5px; border:solid 1px #CCC; margin-bottom:15px;" id="image_holder_exsist">
                          <input type="hidden" name="image" value="{{$member->photo}}">
                          <img src="{{ asset($member->photo ? 'public/images/news_family/thumbnail/' . $member->photo : 'images/male.jpg') }} " id="output">
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

            

              <div style="height:15px; border-top:solid 1px #EBEBEB; margin-bottom:15px;"></div>

              <div>
                  <button type="submit" class="btn btn-success" style="width:100%">Submit</button>
              </div>

              </div>
            </div>
            <!--/Col Section-->
        </form>
    </div>
</div>
</section>

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
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>
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

 
<script type="text/javascript">
        function confirmation() {
        return confirm('Are you sure you want to Delete this?');
          }
</script>
@endsection

