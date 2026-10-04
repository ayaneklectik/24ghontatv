@extends('admin.master_layout')
@section('content')
    @push('scripts')
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css" />
        <style>
            .avatar-upload .avatar-preview {
                width: 100%;
                height: 200px;
                position: relative;
                border: 3px solid #CCCCCC;
                background-image: url("{{ asset('public/images/no_image.jpg') }}");
                background-size: cover;
                /* Adjust based on your needs */
                background-position: center;
                box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
            }

            .avatar-upload .avatar-preview>div {
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

            .select2-container {
                width: 100% !important;
            }

            .select2-container--default .select2-selection--multiple {
                border: 1px solid #ced4da;
                min-height: 38px;
                border-radius: 4px;
                padding: 2px;
            }
        </style>
    @endpush

    <section class="content">
        <div class="container-fluid">
            <div class="card-body">

                <table style="width:100%;">
                    <tr>
                        <td>
                            <div class="card-title" style="color:#CE185B; font-size:20px;"><i class="fa fa-plus"></i> &nbsp;Add
                                New News</div>
                        </td>
                        <td style="text-align:right;">
                            <a href="{{ route('all-news') }}" class="btn btn-info"><i
                                    class="fa fa-newspaper"></i>&nbsp;&nbsp;Manage All News</a>
                        </td>
                    </tr>
                </table>
                <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:15px; margin-top:10px;"></div>

                <form class="form-horizontal" action="{{ route('insert-news') }}" method="post"
                    enctype="multipart/form-data">
                    @csrf
                    <div class="row">

                        <!--Col Section-->
                        <div class="col-md-9" style="padding-right:25px;">

                            <div>
                                <table style="width:100%;">
                                    <tr>
                                        <td style="width:80%;">
                                            <div class="label-title">News Headline<span>*</span></div>
                                            <div>
                                                <input type="text" name="news_title" value="{{ old('news_title') }}"
                                                    class="form-control" required>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="label-title">Headline Color</div>
                                            <div>
                                                <select name="title_color" class="form-control" required>
                                                    <option value="Black" selected="selected">Black</option>
                                                    <option value="Red">Red</option>
                                                    <option value="Green">Green</option>
                                                    <option value="Blue">Blue</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div style="padding-top:13px;">
                                <table style="width:100%;">
                                    <tr>
                                        <td style="width:80%;">
                                            <div class="label-title">News Shoulder<span>*</span></div>
                                            <div>
                                                <input type="text" name="news_sub_title"
                                                    value="{{ old('news_sub_title') }}" class="form-control">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="label-title">Shoulder Color</div>
                                            <div>
                                                <select name="sub_title_color" class="form-control" required>
                                                    <option value="Black" selected="selected">Black</option>
                                                    <option value="Red">Red</option>
                                                    <option value="Green">Green</option>
                                                    <option value="Blue">Blue</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div style="padding-top:13px;">
                                <div class="label-title">News Details<span>*</span></div>
                                <div>
                                    <textarea rows="4" name="dis" id="editor1" class="form-control"></textarea>
                                </div>
                            </div>

                            <div style="padding-top:13px;">
                                <div class="label-title">Meta Keyword</div>
                                <div>
                                    <input type="text" name="meta_keyword" value="{{ old('meta_keyword') }}"
                                        class="form-control" placeholder="keyword1, keyword2, keyword3, keyword4,">
                                </div>
                            </div>

                            <div style="padding-top:13px;">
                                <div class="label-title">Meta Description</div>
                                <div>
                                    <textarea rows="4" name="meta_dis" class="form-control"></textarea>
                                </div>
                            </div>


                        </div>
                        <!--/Col Section-->

                        <!--Col Section-->
                        <div class="col-md-3">
                            <div><i class="fa-solid fa-gear"></i>Actions</div>
                            <div style="padding:15px; border:solid 2px #0A9734; border-radius:8px; background-color:#FFF;">

                                <div>
                                    <div class="label-title">Category<span>*</span></div>
                                    <div>
                                        <select name="cat" id="cat" class="form-control" required>
                                            <option value="" selected="selected"> --select Category-- </option>
                                            @foreach ($cats as $cat)
                                                <option value="{{ $cat->id }}">{{ $cat->cat_name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                <div style="padding-top:13px;">
                                    <div class="label-title">Sub-Category</div>
                                    <div>
                                        <select name="sub_cat" id="sub_cat" class="form-control"> </select>
                                    </div>
                                </div>

                                <div style="padding-top:13px;">
                                    <div class="label-title">Extra-Category</div>

                                    <div>
                                        <select name="extra_cat[]" class="form-control select2" multiple>
                                            @foreach ($cats as $cat)
                                                <option value="{{ $cat->id }}">
                                                    {{ $cat->cat_name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>


                                <div style="padding-top:13px;">
                                    <div class="label-title">Publish Date<span>*</span></div>
                                    <div>
                                        <input type="text" id="datepicker111" name="published_date"
                                            value="{{ date('d-m-Y') }}" class="form-control" autocomplete="off" required>
                                    </div>
                                </div>

                                <div>
                                    <div class="label-title" style="padding-top:13px;">Photo:</div>
                                    <div class="avatar-upload" id="" style="margin-bottom:5px;">
                                        <div class="avatar-preview">
                                            <div id="imagePreview">
                                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                            </div>
                                        </div>
                                    </div>
                                    <input type='file' id="imageUpload"
                                        accept=".png, .jpg, .jpeg, .bmp, .gif, .svg, .webp, .avif" name="imageUpload"
                                        class="imageUpload" />
                                    <input type="hidden" name="base64image" id="base64image">
                                </div>

                                <div style="padding-top:13px; mb-2">
                                    <div class="label-title">Photo footer title</div>
                                    <div>
                                        <input type="text" id="" name="image_title" value=""
                                            class="form-control">
                                    </div>
                                </div>

                                <div style="padding-top:15px;">

                                    <button class="btn btn-outline-secondary btn-sm" type="button"
                                        data-toggle="collapse" data-target="#advancedNewsOptions" aria-expanded="false"
                                        aria-controls="advancedNewsOptions" style="width:100%; text-align:left;">

                                        <i class="fa fa-cog"></i>
                                        Advanced News Options
                                    </button>

                                    <div class="collapse" id="advancedNewsOptions">

                                        <div
                                            style="
                                                margin-top:10px;
                                                padding:15px;
                                                border:1px solid #ddd;
                                                border-radius:8px;
                                                background:#fafafa;
                                            ">

                                            <div>
                                                <div class="label-title">Writer Desk</div>

                                                <div>
                                                    <select name="writer_desk" class="form-control">
                                                        <option value="" selected="selected">
                                                            --select Writer Desk--
                                                        </option>

                                                        @foreach ($desks as $desk)
                                                            <option value="{{ $desk->writer_desk }}">
                                                                {{ $desk->writer_desk }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                            </div>

                                            <div style="padding-top:13px;">
                                                <div class="label-title">Representative Name</div>

                                                <div>
                                                    <input type="text" name="representative" value=""
                                                        class="form-control">
                                                </div>
                                            </div>

                                            <div style="padding-top:13px;">
                                                <div class="label-title">Representative Location</div>

                                                <div>
                                                    <input type="text" name="representative_loc" value=""
                                                        class="form-control">
                                                </div>
                                            </div>

                                            <div style="padding-top:20px;">
                                                <label class="container-checkbox">
                                                    Lead News

                                                    <input type="checkbox" name="islead" value="1">

                                                    <span class="checkmark"></span>
                                                </label>
                                            </div>

                                            <div style="padding-top:20px;">
                                                <label class="container-checkbox">
                                                    Breaking News (Scroll)

                                                    <input type="checkbox" name="isbreaking" value="1">

                                                    <span class="checkmark"></span>
                                                </label>
                                            </div>

                                            @if (optional(auth()->user())->user_type == 'Admin')
                                                <div style="padding-top:20px;">
                                                    <label class="container-checkbox">
                                                        Publish/Unpublish

                                                        <input type="checkbox" checked="checked" name="status"
                                                            value="1">

                                                        <span class="checkmark"></span>
                                                    </label>
                                                </div>
                                            @endif

                                            <div style="padding-top:10px;">
                                                <label class="container-checkbox" style="font-size:15px;">

                                                    News Publisher info Show/Hide

                                                    <input type="checkbox" name="writer_desk_show" value="1"
                                                        checked>

                                                    <span class="checkmark"></span>
                                                </label>
                                            </div>

                                        </div>

                                    </div>

                                </div>


                                <div style="height:15px; border-top:solid 1px #EBEBEB; margin-bottom:15px;"></div>

                                <div>
                                    <button type="submit" class="btn btn-success" style="width:100%">Submit</button>
                                </div>

                            </div>
                        </div>
                        <!--/Col Section-->



                    </div>
                </form>
            </div>
        </div>
    </section>

    <!--image crop modal-->
    <div class="modal fade bd-example-modal-lg imagecrop" id="model" tabindex="-1" role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true">
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
        $("body").on("change", ".imageUpload", function(e) {
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
                aspectRatio: 12 / 8,
                viewMode: 1,
            });
        }).on('hidden.bs.modal', function() {
            cropper.destroy();
            cropper = null;
        });
        $("body").on("click", "#crop", function() {
            canvas = cropper.getCroppedCanvas({
                width: 800,
                height: 600,
            });
            canvas.toBlob(function(blob) {
                url = URL.createObjectURL(blob);
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    var base64data = reader.result;
                    $('#base64image').val(base64data);
                    document.getElementById('imagePreview').style.backgroundImage = "url(" +
                        base64data + ")";
                    $modal.modal('hide');
                    $image_holder.show();
                    $image_holder_exsist.hide();
                }
            });
        })
    </script>


    <script type="text/javascript">
        $(document).ready(function() {
            $("#cat").change(function(e) {
                var cat_id = e.target.value;
                //console.log(brand_id);
                $(this).after('<div id="loader">Loading...</div>');
                $.get("load-sub-cat-ajax/" + cat_id, function(data) {
                    $("#sub_cat").html(data);
                    $("#loader").slideUp(200, function() {
                        $(this).remove();
                    });
                });
            });
        });
    </script>


    <script src="{{ asset('public/admin_assets/ckeditor4/ckeditor.js') }}"></script>
    <script src="{{ asset('public/admin_assets/ckeditor4/plugins/ckwebspeech/plugin.js') }}"></script>
    <script src="{{ asset('public/admin_assets/ckeditor4/plugins/html5audio/plugin.js') }}"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <script type="text/javascript">
        CKEDITOR.replace('editor1', {
            //startupFocus : true,
            toolbar: 'Full',
            filebrowserUploadUrl: "{{ route('ckeditor4.upload', ['_token' => csrf_token()]) }}",
            filebrowserUploadMethod: 'form',
            contentsCss: 'data:text/css;charset=utf-8,' + encodeURIComponent(
                'body { text-align: justify; padding:10px; }'),
            bodyClass: 'justified-content'

        });

        $(function() {
            $("#datepicker111").datepicker({
                dateFormat: "dd-mm-yy",
                duration: "fast"
            });

        });

        $('.select2').select2({
            placeholder: "Select Categories"
        });
    </script>
@endsection
