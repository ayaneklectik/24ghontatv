<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\User;
use App\Models\NewsTable;
use App\Models\AdManager;
use App\Models\Home_cat_ad;
use App\Models\UserRole;

class StaticLinkController extends Controller
{
  public static function getNewsByID($id){
    $news = NewsTable::select('*')->where('id', $id)->orderBy('id', 'desc')->first();
    return $news;
  }

  public static function first_CatLeadNews($cat_id){
    $cat_lead = NewsTable::select('*')->where('cat', $cat_id)->orderBy('id', 'desc')->first();
    return $cat_lead;
  }

  public static function second_CatLeadNews($cat_id){
    $cat_lead_second = NewsTable::select('*')->where('cat', $cat_id)->orderBy('id', 'desc')->offset(1)->limit(3)->get();
    return $cat_lead_second;
  }

  public static function third_CatLeadNews($cat_id){
    $cat_lead_third = NewsTable::select('*')->where('cat', $cat_id)->orderBy('id', 'desc')->offset(4)->limit(4)->get();
    return $cat_lead_third;
  }

  public static function getCatLeadNews($cat_id){
    $catLead = NewsTable::select('*')->where('cat', $cat_id)->orderBy('id', 'DESC')->limit(3)->get();
    return $catLead;
  }

  public static function CatNewsSeven($cat_id){
    $cat_new_7 = NewsTable::select('*')->where('cat', $cat_id)->orderBy('id', 'DESC')->limit(4)->get();
    return $cat_new_7;
  }

    public static function getCatByID($id){
      $cat = Category::select('*')->where('id', $id)->first();
      return $cat;
    }

    public static function getSubCatByID($id){
      $subcat = SubCategory::select('*')->where('id', $id)->first();
      return $subcat;
    }

    public static function getUser($id){
      $user = User::select('*')->where('id', $id)->first();
      return $user;
    }

    public static function getAllSubCatByCatID($cat_id){
      $subcat = SubCategory::select('*')->where('cat_id', $cat_id)->get();
      return $subcat;
    }

    public static function getBanglaDate($cdate){
      $sdate = date("d F, Y", strtotime($cdate));
      $currentDate = $sdate;
      $engDATE = array(1,2,3,4,5,6,7,8,9,0,'January','February','March','April','May','June','July','August','September','October','November','December','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday');
      $bangDATE = array('১','২','৩','৪','৫','৬','৭','৮','৯','০','জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর','শনিবার','রবিবার','সোমবার','মঙ্গলবার','ুধবার','বৃহস্পতিবার','শুক্রবার' );
      $bangla_date = str_replace($engDATE, $bangDATE, $currentDate);
      //echo "$new_date1";
      return $bangla_date;
    }

    public static function getBanglaNumber($nu){
      $currentNu = $nu;
      $engNumber = array(1,2,3,4,5,6,7,8,9,0);
      $bangNumber = array('১','২','৩','৪','৫','৬','৭','৮','৯','০');
      $bangla_number = str_replace($engNumber, $bangNumber, $currentNu);
      //echo "$new_date1";
      return $bangla_number;
    }

   
    public static function getCatSubLeadNews($cat_id){
      $lead_news_max_id = NewsTable::where(['cat' => $cat_id, 'status' => 1])->orderBy('id', 'desc')->first();
      $catsubLead = NewsTable::where(['cat' => $cat_id, 'status' => 1])->where('id', '!=', $lead_news_max_id->id)->orderBy('id', 'desc')->limit(5)->get();
      return $catsubLead;
    }

    public static function getNewsByCat($cat_id){
      $catNews = NewsTable::select('*')->where(['cat' => $cat_id, 'status' => 1])->orderBy('id', 'DESC')->limit(4)->get();
      return $catNews;
    }

    public static function getADPosition($position){
      $ad1 = AdManager::select('*')->where('ad_position', $position)->first();
      return $ad1;
    }

    public static function getCatADPosition($position){
      $ad1 = Home_cat_ad::select('*')->where('ad_position', $position)->first();
      return $ad1;
    }

    public static function getCatNameByOrder($position){
      $cat1 = Category::select('*')->where('cat_order', $position)->first();
      return $cat1;
    }

    public static function getUser_permission($id){
      $per = UserRole::select('*')->where('user_id', $id)->first();
      return $per;
    }

    public static function total_unpublishNews(){
      $news = NewsTable::select('*')->where('status', 0)->get();
      return $news->count();
    }

    public static function get_unpublishNews(){
      $unnews = NewsTable::select('*')->where('status', 0)->orderBy('created_at', 'DESC')->limit(5)->get();
      return $unnews;
    }

}
