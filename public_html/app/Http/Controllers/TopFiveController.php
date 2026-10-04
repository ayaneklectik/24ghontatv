<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\NewsTable;
use App\Models\NewsJustNow;
use App\Models\User;
use App\Models\UserRole;
use App\Models\HideNewsScroller;
use App\Models\WriterDesk;
use App\Models\TopFiveNews;
use Image;
use Illuminate\Support\Facades\File;

class TopFiveController extends Controller
{
    public function TopFiveNews(){
        $data['title']= "News";
        $data['app']= App_setting::find(1);
        $data['top_news']= TopFiveNews::orderBy('id', 'ASC')->get();
        $uid = optional(auth()->user())->id;
        $data['user']= User::find($uid);
        $data['scroller'] = HideNewsScroller:: select('*')->where('id', 1)->first();
        return view('admin.top_five.top_five_news', $data);
    }


    public function TopFiveNewsPage($id){
      $data['title']= "News";
      $data['app']= App_setting::find(1);
      $data['all_news']= NewsTable::orderBy('created_at', 'DESC')->paginate(25);
      $uid = optional(auth()->user())->id;
      $data['user']= User::find($uid);
      $data['top_five_id']= $id;
      $data['scroller'] = HideNewsScroller:: select('*')->where('id', 1)->first();
      return view('admin.top_five.top_five_news_page', $data);
    }

    public function TopFiveNewsUpdate($id, $news_id){
      $data['news_id']= $news_id;
      try {
        $newsUpdate = TopFiveNews:: find($id);
        $newsUpdate->update($data);

        return redirect()->route('top-five-news')
        ->with('massage', 'Update Successfully')
        ->with('msg_type', 'success');
      } catch(Exception $e){
        $this->setErrorMsg($e->getMessage());
        return redirect()->back();
      }
    }
}
