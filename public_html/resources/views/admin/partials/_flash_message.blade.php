<link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/css/toastr.css" rel="stylesheet"/>
<script src="{{asset('public/admin_assets/plugins/jquery/jquery.min.js')}}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/js/toastr.js"></script>
<!-- Show Message -->
@if ($errors->any())
    <div class="alert alert-danger" style="margin:8px 15px 0 15px;">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

@if(session()->has('massage'))
    <script>
        toastr.{{ session('msg_type') }}("{{ session('massage') }}", "Message", { positionClass: 'toast-top-right' });
    </script>
@endif
<!-- End Message -->





