<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\Epaper;
use App\Models\User;
use Image;

class EPaperController extends Controller
{
    public function AllE_paper(){
        $data['title']= "E-Paper";
        $data['app']= App_setting::find(1);
        $data['epapers']= Epaper::orderBy('pub_date', 'ASC')->paginate(25);
        $uid = optional(auth()->user())->id;
        $data['user']= User::find($uid);
        return view('admin.e_paper.all_e_paper', $data);
    }

    public function insertEpaper(Request $request){

    //---Validation
    $rules = [
        'epaper_img' => 'nullable|image|mimes:jpeg,jpg,png,gif',
    ];

    $messages = [
        'required'  => 'The :attribute field is required.',
        'unique'    => ':attribute is already used',
        'max'    => ':attribute is maximum 13 character',
        'min'    => ':attribute is minimum 8 character',
    ];
    $request->validate($rules, $messages);
    //---End validation--


        $file_name = "e-paper_".$request->input('pub_date')."_".time();
        $data=[
            'pub_date'    => $request->input('pub_date'),
            'epaper'      => $file_name,
          ];


          try {
            
            if ($request->hasFile('epaper_file') && $request->file('epaper_file')->isValid()) {
                

                if(!empty($request->epaper_img)){
                    $photo_title5 = $file_name.".jpg";
                    $request->epaper_img->move(public_path('epaper/epaper'), $photo_title5);
                    // Image Upload with Crop and rezise
                    $folderPath4 = public_path('epaper/epaper/');
                    $file5 =$folderPath4.$photo_title5;
                    $destinationPath5 = public_path('epaper/thumb');
                    $img5 = Image::make($file5);
                    $img5->resize(300, 300, function ($constraint) {
                      $constraint->aspectRatio();
                    })->save($destinationPath5.'/'.$photo_title5 );

                    $request->file('epaper_file')->move(public_path('epaper/'), $file_name.".pdf");
                    Epaper::create($data);

                    return redirect()->route('all-e-paper')
                    ->with('massage', 'Added Successfully')
                    ->with('msg_type', 'success');

                  }else{
                    return redirect()->route('all-e-paper')
                    ->with('massage', 'File thumbnail image is Empty')
                    ->with('msg_type', 'error');
                  }

            } else {
                return redirect()->route('all-e-paper')
                ->with('massage', 'Invalid file')
                ->with('msg_type', 'error');
            }

           

            } catch(Exception $e){
                $this->setErrorMsg($e->getMessage());
                return redirect()->back();
            }
    }

    public function DeleteEpaper($id){
        try {
            $epaper = Epaper:: select('*')->where('id', $id)->first();
            $epaper->delete();
            return redirect()->route('all-e-paper')
            ->with('massage', 'Delete Successfully')
            ->with('msg_type', 'error');
        } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
    }

}
