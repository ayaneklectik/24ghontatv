<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>
        Login-{{$app->app_title}}
        </title>
        <!-- Favicon -->
        <link rel="shortcut icon" href="{{asset('public/admin_assets/images/logos/favicon.png')}}" type="image/x-icon">
        <link rel="icon" href="{{asset('public/admin_assets/images/logos/favicon.png')}}" type="image/x-icon">
        <meta name="description" content="Login">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, minimal-ui">
        <!-- Call App Mode on ios devices -->
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <!-- Remove Tap Highlight on Windows Phone IE -->
        <meta name="msapplication-tap-highlight" content="no">

        <!-- base css -->
        <link rel="stylesheet" href="{{asset('public/admin_assets/login/css/vendors.bundle.css')}}">
        <link rel="stylesheet" href="{{asset('public/admin_assets/login/css/app.bundle.css')}}">
        <!-- Place favicon.ico in the root directory -->

        <!-- Optional: page related CSS-->
        <link rel="stylesheet" href="{{asset('public/admin_assets/login/css/fa-brands.css')}}">
        <style>
        	.alert p {
        		margin-bottom: 0;
        	}
        </style>
    </head>
    <body>
        <div class="page-wrapper">
            <div class="page-inner bg-danger">
                <div class="page-content-wrapper bg-transparent m-0">
                    <div class="height-10 w-100 shadow-lg px-4 bg-danger-gradient" style="">
                        <div class="d-flex align-items-center container p-0">
                            <div class="page-logo width-mobile-auto m-0 align-items-center justify-content-center p-0 bg-transparent bg-img-none shadow-0 height-9">
                                <a href="" class="page-logo-link press-scale-down d-flex align-items-center">
                                    <img src="{{asset('public/images/logos/logo.png')}}" alt="logo" style="width:80px; margin-top:8px;">
                                </a>
                            </div>
                            <a target="_blank" href="{{route('home')}}" class="btn-link text-white ml-auto">
                                Visit Website
                            </a>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="container py-4 py-lg-5 my-lg-5 px-4 px-sm-0">
                            <div class="row">
                                <div class="col col-md-6 col-lg-7 hidden-sm-down">
                                    <img style="width: 200px;" src="{{asset('public/images/welcome.png')}}" alt="">
                                    
                                    <h1 style="width: 200px; font-size: 28px;font-family: 'circular'; font-weight: bolder;font-size: 32px;" class="text-white text-center">To</h1>
                                    
                                    <h2 class="fs-xxl fw-400 mt-2 text-white">
                                       ২৪ ঘন্টা - Chobbish Ghonta
                                    </h2>


                                    <div class="d-sm-flex flex-column align-items-center justify-content-center d-md-block" style="padding-top:150px;">
                                        <div class="px-0 py-1 mt-5 text-white fs-nano">
                                            Find us on social media
                                        </div>
                                        <div class="d-flex flex-row">
                                            <a href="" class="mr-2 fs-xxl text-white">
                                                <i class="fab fa-facebook-square"></i>
                                            </a>
                                            <a href="" class="mr-2 fs-xxl text-white">
                                                <i class="fab fa-twitter-square"></i>
                                            </a>
                                            <a href="#" class="mr-2 fs-xxl text-white">
                                                <i class="fab fa-google-plus-square"></i>
                                            </a>
                                            <a href="#" class="mr-2 fs-xxl text-white">
                                                <i class="fab fa-linkedin"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-5 col-xl-5 ml-auto">

                            
                                    
                                    <div class="card p-4 rounded-plus bg-faded">
                                    <form action="{{ route('post.login') }}" method="post">
                                    @csrf

                                    @if(session()->has('message'))
                                    <div style="color:#CD2228; padding-bottom:10px;">
                                         <b><i class="fab fa-warning"></i>&nbsp;{{ session('message') }}</b>
                                    </div>
                                    @endif
                                            <div class="form-group">
                                          
                                                <label class="form-label" for="identity">Username</label>
                                                <input type="email" id="identity" name="email" class="form-control form-control-lg" placeholder="your id or email" value="" required>
                                                <div class="invalid-feedback">No, you missed this one.</div>
                                                <div class="help-block">Your unique username to app</div>
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label" for="password">Password</label>
                                                <input type="password" id="password" name="password" class="form-control form-control-lg" placeholder="password" value="" required>
                                                <div class="invalid-feedback">Sorry, you missed this one.</div>
                                                <div class="help-block">Your password</div>
                                            </div>
                                      
                                            <div class="row no-gutters">
                                                <div class="col-lg-6 pl-lg-1 my-2">
                                                    <button id="js-login-btn" type="submit" class="btn btn-danger btn-block btn-lg">Secure login</button>
                                                </div>
                                            </div>
                                    </form>
                                    </div>
                             
                                </div>
                            </div>


                            <div class="position-absolute pos-bottom pos-left pos-right p-3 text-center text-white" style="background: rgb(0,0,0);background: linear-gradient(90deg, rgba(0,0,0,1) 34%, rgba(231,5,49,1) 100%, rgba(0,212,255,1) 100%); margin-bottom: 20px;">
                                {{date('Y')}} © {{$app->app_title}} Version: 3.0.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="{{asset('public/admin_assets/login/js/vendors.bundle.js')}}"></script>
        <script src="{{asset('public/admin_assets/login/js/app.bundle.js')}}"></script>
        <script>
            $("#js-login-btn").click(function(event) {
                var form = $("#js-login")

                if (form[0].checkValidity() === false)
                {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.addClass('was-validated');
            });
        </script>
    </body>
</html>
