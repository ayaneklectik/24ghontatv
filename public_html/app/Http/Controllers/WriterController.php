<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\Reporter;

class WriterController extends Controller
{
    public function AllWriters(){
        $data['title']= "Reporter";
        $data['app']= App_setting::find(1);
        $data['reports']= Reporter::all();
        return view('admin.reporter.all_reporters', $data);
    }
}
