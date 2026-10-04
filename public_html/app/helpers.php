<?php
if (!function_exists('bn_date')) {
    function bn_date($str)
    {
        $en = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        $bn = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '০'];
        $str = str_replace($en, $bn, $str);
        $en = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'Jul',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        $en_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $bn = [
            'জানুয়ারি',
            'ফেব্রুয়ারি',
            'মার্চ',
            'এপ্রিল',
            'মে',
            'জুন',
            'জুলাই',
            'অগাস্ট',
            'সেপ্টেম্বর',
            'অক্টোবর',
            'নভেম্বর',
            'ডিসেম্বর',
        ];
        $str = str_replace($en, $bn, $str);
        $str = str_replace($en_short, $bn, $str);
        $en = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $en_short = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        $bn_short = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'];
        $bn = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
        $str = str_replace($en, $bn, $str);
        $str = str_replace($en_short, $bn_short, $str);
        $en = ['am', 'pm'];
        $bn = ['পূর্বাহ্ন', 'অপরাহ্ন'];
        $str = str_replace($en, $bn, $str);
        return $str;
    }
}
