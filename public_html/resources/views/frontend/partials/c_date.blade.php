{{-- @include('frontend.partials.bn_time') --}}
@php
    $time = time();
    $Bdate = BDdate($time); // Bangla calendar date
    $date = date('l, d M Y'); // English readable date
    $translatedDate = translateToBangla($date); // Translated version of above
@endphp
{{ $translatedDate }}<br>{{ $Bdate }}
