<?php

if (!class_exists('BanglaDate')) {
    class BanglaDate
    {
        private $timestamp;
        private $morning;
        private $engHour;
        private $engDate;
        private $engMonth;
        private $engYear;
        private $bangDate;
        private $bangMonth;
        private $bangYear;

        private $bn_months = ["পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র", "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ"];
        private $bn_month_dates = [30, 30, 30, 30, 31, 31, 31, 31, 31, 30, 30, 30];
        private $bn_month_middate = [13, 12, 14, 13, 14, 14, 15, 15, 15, 15, 14, 14];
        private $lipyearindex = 3;

        function __construct($timestamp, $hour = 6)
        {
            $this->set_time($timestamp, $hour);
        }

        function set_time($timestamp, $hour = 6)
        {
            $this->engDate = date('d', $timestamp);
            $this->engMonth = date('m', $timestamp);
            $this->engYear = date('Y', $timestamp);
            $this->morning = $hour;
            $this->engHour = date('G', $timestamp);
            $this->calculate_date();
            $this->calculate_year();
            $this->convert();
        }

        private function calculate_date()
        {
            $this->bangDate = $this->engDate - $this->bn_month_middate[$this->engMonth - 1];
            if ($this->engHour < $this->morning) $this->bangDate -= 1;

            if (($this->engDate <= $this->bn_month_middate[$this->engMonth - 1]) ||
                ($this->engDate == $this->bn_month_middate[$this->engMonth - 1] + 1 && $this->engHour < $this->morning)
            ) {
                $this->bangDate += $this->bn_month_dates[$this->engMonth - 1];
                if ($this->is_leapyear() && $this->lipyearindex == $this->engMonth)
                    $this->bangDate += 1;
                $this->bangMonth = $this->bn_months[$this->engMonth - 1];
            } else {
                $this->bangMonth = $this->bn_months[($this->engMonth) % 12];
            }
        }

        function is_leapyear()
        {
            return ($this->engYear % 400 == 0 || ($this->engYear % 100 != 0 && $this->engYear % 4 == 0));
        }

        function calculate_year()
        {
            $this->bangYear = $this->engYear - 593;
            if (($this->engMonth < 4) || (($this->engMonth == 4) &&
                (($this->engDate < 14) || ($this->engDate == 14 && $this->engHour < $this->morning)))) {
                $this->bangYear -= 1;
            }
        }

        function bangla_number($int)
        {
            return str_replace([1, 2, 3, 4, 5, 6, 7, 8, 9, 0], ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '০'], $int);
        }

        function convert()
        {
            $this->bangDate = $this->bangla_number($this->bangDate);
            $this->bangYear = $this->bangla_number($this->bangYear);
        }

        function get_date()
        {
            return [$this->bangDate, $this->bangMonth, $this->bangYear];
        }

        function translate_string($str)
        {
            $en_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
            $bn_nums = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '০'];
            $str = str_replace($en_nums, $bn_nums, $str);

            $months_en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            $months_en_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $months_bn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'অগাস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

            $str = str_replace($months_en, $months_bn, $str);
            $str = str_replace($months_en_short, $months_bn, $str);

            $days_en = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            $days_en_short = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            $days_bn = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
            $days_bn_short = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'];

            $str = str_replace($days_en, $days_bn, $str);
            $str = str_replace($days_en_short, $days_bn_short, $str);

            $str = str_replace(['am', 'pm'], ['পূর্বাহ্ন', 'অপরাহ্ন'], $str);

            return $str;
        }
    }
}

// Define global helper functions with unique names
if (!function_exists('BDdate') && !function_exists('translateToBangla')) {
    function BDdate($timestamp)
    {
        $bn = new BanglaDate($timestamp);
        $output = $bn->get_date();
        return "$output[0] $output[1] $output[2]";
    }

    function translateToBangla($date_string)
    {
        $bn = new BanglaDate(time());
        return $bn->translate_string($date_string);
    }
}
