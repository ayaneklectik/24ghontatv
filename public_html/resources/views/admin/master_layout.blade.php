<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Admin-{{$app->app_title}}</title>
         <!-- Favicon -->
        <link rel="shortcut icon" href="{{asset('public/admin_assets/images/logos/favicon.png')}}" type="image/x-icon">
        <link rel="icon" href="{{asset('public/admin_assets/images/logos/favicon.png')}}" type="image/x-icon">

        <!-- Google Font: Source Sans Pro -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"/>
        <!-- Font Awesome -->
        <link rel="stylesheet" href="{{ asset('public/admin_assets/plugins/fontawesome-free/css/all.min.css') }}"/>
        <!-- Ionicons -->
        <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
        <!-- Tempusdominus Bootstrap 4 -->
        <link rel="stylesheet" href="{{asset('public/admin_assets/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css')}}"/>
        <!-- iCheck -->
        <link rel="stylesheet" href="{{asset( 'public/admin_assets/plugins/icheck-bootstrap/icheck-bootstrap.min.css')}}" />
        <!-- JQVMap -->
        <link rel="stylesheet" href="{{ asset('public/admin_assets/plugins/jqvmap/jqvmap.min.css') }}" />
        <!-- Theme style -->
        <link rel="stylesheet" href="{{ asset('public/admin_assets/dist/css/adminlte.css') }}"/>
        <!-- overlayScrollbars -->
        <link rel="stylesheet" href="{{asset('public/admin_assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css')}}"/>
        <!-- datepicker-->
        <link rel="stylesheet" href="{{ asset('public/admin_assets/date_picker/jquery-ui.css') }}" />

        <link rel="stylesheet" href="{{ asset('public/admin_assets/custom_style.css') }}"/>

        @stack('scripts')

        <style>
            .nav-treeview {
                background-color: #21252b !important;
            }

            .nav-treeview .nav-item:hover {
                background-color: #000 !important;
            }

            .main-footer {
                padding: 10px 10px !important;
                font-size: 13px;
                font-weight: 400 !important;
            }

            .wrapper .content-wrapper {
                height: auto !important;
            }

            .vehicle-img {
                border-radius: 8px;
                float: left;
                height: 50px;
                width: 50px;
            }

            .vehicle-img-big {
                border-radius: 12px;
                float: left;
                height: 200px;
                width: 200px;
            }
        </style>
    </head>
    <body
        class="hold-transition sidebar-mini layout-fixed"
        style="background-color: #f4f6f9"
    >
        <div class="wrapper">
            <!-- Navbar -->
            @section('header')
            @include('admin.partials._navbar') @show

            <!-- Main Sidebar Container -->
            @section('side_navbar')
                    @include('admin.partials._sidebar_admin')
            @show

            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper">
                @include('admin.partials._flash_message')

                @yield('content')
            </div>
            <!-- /.content-wrapper -->
            @section('footer')
                @include('admin.partials._footer')
            @show

            <!-- Control Sidebar -->
            <aside class="control-sidebar control-sidebar-dark">
                <!-- Control sidebar content goes here -->
            </aside>
            <!-- /.control-sidebar -->
        </div>
        <!-- ./wrapper -->

        <!-- Main Sidebar Container -->
        @section('side_navbar')
            @include('admin.partials._sidebar_admin')
        @show


        <!-- jQuery JS -->
        <script src="{{asset('public/public_assist/js/assets/vendor/jquery-1.12.4.min.js')}}"></script>

        <!-- jQuery UI 1.11.4 -->
        <script src="{{asset('public/admin_assets/plugins/jquery-ui/jquery-ui.min.js')}}"></script>
        <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
        <script>
        $.widget.bridge('uibutton', $.ui.button)
        </script>
        <!-- Bootstrap 4 -->
        <script src="{{asset('public/admin_assets/plugins/bootstrap/js/bootstrap.bundle.min.js')}}"></script>

        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
        <!-- Tempusdominus Bootstrap 4 -->
        <script src="{{asset('public/admin_assets/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js')}}"></script>

        <!-- overlayScrollbars -->
        <script src="{{asset('public/admin_assets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js')}}"></script>
        <!-- AdminLTE App -->
        <script src="{{asset('public/admin_assets/dist/js/adminlte.js')}}"></script>
        <!-- AdminLTE for demo purposes -->
        <script src="{{asset('public/admin_assets/dist/js/demo.js')}}"></script>
        <!-- AdminLTE dashboard demo (This is only for demo purposes) -->

        @stack('js_scripts')
</body>
</html>
