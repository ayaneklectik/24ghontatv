
<!-- Menu Area -->
<section class="" id="">
    <div class="custom-container">
        <div class="row">
            <div class="col-md-12" style="display:none" >
                <div class="">
                    @php
                        $ad_position = "website_top_ad";
                        try{
                            $ad1 = App\Http\Controllers\StaticLinkController::getADPosition($ad_position);
                            $status_top_ad = $ad1->status;
                            $ad_image = $ad1->ad_image;
                        }catch(Exception $e){
                            $status_top_ad = 0;
                            $ad_image ="";
                        }
                    @endphp

                    @if($status_top_ad == 1)
                        <a href="{{$ad1->company_link}}" target="blank">
                        <img style="width: 100%;" src="{{ asset('public/images/ad/'. $ad_image) }}" alt="">
                        </a>
                    @else
                        <img style="width: 100%;" src="{{ asset('public/images/ad/for_ad_image.png') }}" alt="">
                    @endif
                </a>
            </div>
            <div class="col-md-12" id="hide_in_mobile" style="height:20px;"></div>
        </div>

            <div class="col-md-12" id="hide_in_mobile" style="height:20px;"></div>
            <div class="col-lg-3 col-md-12">
                <div id="" style="padding:10px 10px 10px 0px;">
                  <a href="{{route('home')}}">
                      <img src="{{asset('public/images/logos/logo.png')}}" style="padding:15px 0px 0px 10px;" alt="Proval Logo" class="img-fluid" width="310">
                  </a>
                </div>
            </div>
            <div class="col-lg-4 col-md-12">
              <div style="padding-top:65px; font-size:20px;ß">
                  <i class="fa fa-calendar"></i> &nbsp;
                  @include('frontend.partials.c_date')
              </div>
            </div>

            <div class="col-lg-5 col-md-12">
              <div style="text-align:right;">
                <img src="{{asset('public/images/top_right_img.png')}}" style="padding:15px 0px 0px 10px;" alt="Proval Logo" class="img-fluid" width="350">
              </div>
            </div>
        </div>

    </div>
</section>
<!-- End Menu Area -->
