<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsTable;

class NewsSectionController extends Controller
{
    public static function getSection_1_news($catID){
        $newsSection1= NewsTable::select('*')->where(['cat'=> $catID , 'status' => 1])->orderBy('id', 'DESC')->limit(3)->get();
        return $newsSection1;
    }

    public static function getSection_1_subnews($catID){
        // Fetch all records
        $allSubnews = NewsTable::where('cat', $catID)
            ->where('status', 1)
            ->orderBy('id', 'DESC')
            ->get();
    
        // Get the highest two id records
        $highestIds = $allSubnews->take(2)->pluck('id')->all();
    
        // Filter out the highest two id records
        $subnewsSection1 = $allSubnews->reject(function($subnews) use ($highestIds) {
            return in_array($subnews->id, $highestIds);
        });
    
        return $subnewsSection1;
    }

    public static function getSection_SubLead(){
        // Fetch all records
        $allLead = NewsTable::where('islead', 1)
            ->where('status', 1)
            ->orderBy('id', 'DESC')
            ->limit(5)
            ->get();
    
        // Get the highest two id records
        $LeadhighestIds = $allLead->take(3)->pluck('id')->all();
    
        // Filter out the highest two id records
        $LeadNewsSection1 = $allLead->reject(function($Leadnews) use ($LeadhighestIds) {
            return in_array($Leadnews->id, $LeadhighestIds);
        });
    
        return $LeadNewsSection1;
    }
    
    
    
}
