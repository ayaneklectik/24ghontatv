<div class="col-lg-12 col-md-12">

    <div style="color:red; font-size:35px; padding-bottom:15px;">
                  <img src="{{asset('public/images/braking_img.png')}}" alt="webnews24" class="img-fluid" width="35">
                  &nbsp;
                <b>ছবি</b>
                </div>
</div>
<div class="col-lg-7 col-md-12">
                <div class="image-gallery" style="background-color:#ECECEC;">
                    <div class="image-gallery-box" style="padding:0px 20px;">
                        <div class="gallery-slider owl-carousel">
                          @foreach($slider_photos as $slider_photo)
                          @php
                                $imagePath1 = public_path('images/photo_gallery/' . $slider_photo->photo);
                                $imageSrc1 = file_exists($imagePath1) ? asset('public/images/photo_gallery/' . $slider_photo->photo) : asset('public/images/no-img-bg.png');
                            @endphp
                            <div class="gallery-item">
                              <a href="">
                                <img src="{{$imageSrc1}}" class="img-fluid">
                              </a>
                                <div class="gallery-content">
                                    <p><a href="">{{$slider_photo->photo_details}}</a></p>
                                </div>
                            </div>
                            @endforeach

                        </div>
                        <div class="sec-title" style="padding:20px 0px;">
                            <h5><a href="{{route('all-photos')}}" >আরও ছবি<i class="fa fa-caret-right"></i></a></h5>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-lg-5 col-md-12">
                <div class="row">
                @foreach($photos as $photo)
            
                    @php
                        $imagePath = public_path('images/photo_gallery/thumbnail/' . $photo->photo);
                        $imageSrc = file_exists($imagePath) ? asset('public/images/photo_gallery/thumbnail/' . $photo->photo) : asset('public/images/no-img-bg.png');
                     @endphp
                    <div class="col-6">
                        <div class="gallery-img">
                            <a href="{{ asset('public/images/photo_gallery/' . $photo->photo) }}" data-lightbox="gallery">
                                <img src="{{$imageSrc}}" width="100%">
                            </a>
                            <div class="gallery-content">
                                <p>{{$photo->photo_details}}</p>
                            </div>
                        </div>
                    </div>
                @endforeach

                </div>
          
            </div>
