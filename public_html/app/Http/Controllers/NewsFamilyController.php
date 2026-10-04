<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\NewsFamily;
use Image;

class NewsFamilyController extends Controller
{
    public function NewsFamily(){
        $data['title']= "News Family";
        $data['app']= App_setting::find(1);
        $data['all_members']= NewsFamily::all();
        return view('admin.news_family.news_family', $data);
    }

    public function insertNewsFamily(Request $request){
        $file_image = $request->file('imageUpload');
        $photo_name = "webnews_family_".rand().time().'.jpg';

         // Image Upload with Crop
         if (!empty($request->imageUpload)) {
            $input = $request->All();
      
            $folderPath = public_path('images/news_family/');
            $image_parts = explode(";base64,", $input['base64image']);
            $image_base64 = base64_decode($image_parts[1]);
            $filename = $photo_name;
            $file =$folderPath.$filename;
            file_put_contents($file, $image_base64);
      
              // Image Upload with Crop and rezise
              $Image_file = $request->file('imageUpload');
              $destinationPath = public_path('/images/news_family/thumbnail');
              $img = Image::make($file);
              $img->resize(200, 200, function ($constraint) {
                $constraint->aspectRatio();
              })->save($destinationPath.'/'.$filename );
    
            }

            $data=[
                'name' =>  $request->input('name'),
                'contact' =>  $request->input('contact'),
                'address' =>  $request->input('address'),
                'position' =>  $request->input('position'),
                'status' =>  1,
                'photo'     => $photo_name,
              ];

              try {
                NewsFamily:: create($data);
                return redirect()->route('news-family')
                ->with('massage', 'Submit Successfully')
                ->with('msg_type', 'success');
              } catch(Exception $e){
                $this->setErrorMsg($e->getMessage());
            }    
      
    }

    public function DeleteNewsFamily($id){
        try {
            $member = NewsFamily::find($id);
            $member->delete();
            return redirect()->route('news-family')
            ->with('massage', 'Delete Successfully')
            ->with('msg_type', 'error');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
        } 
    }

    public function EditNewsFamily($id){
        $data['title']= "News Family";
        $data['app']= App_setting::find(1);
        $data['member']= NewsFamily::find($id);
        return view('admin.news_family.edit_news_family', $data);
    }

    public function UpdateNewsFamily($id, Request $request){
        $photo_name = $request->input('image');

         // Image Upload with Crop
         if (!empty($request->imageUpload)) {
            $input = $request->All();
      
            $folderPath = public_path('images/news_family/');
            $image_parts = explode(";base64,", $input['base64image']);
            $image_base64 = base64_decode($image_parts[1]);
            $filename = $photo_name;
            $file =$folderPath.$filename;
            file_put_contents($file, $image_base64);
      
              // Image Upload with Crop and rezise
              $Image_file = $request->file('imageUpload');
              $destinationPath = public_path('/images/news_family/thumbnail');
              $img = Image::make($file);
              $img->resize(200, 200, function ($constraint) {
                $constraint->aspectRatio();
              })->save($destinationPath.'/'.$filename );
    
            }

            $data=[
                'name' =>  $request->input('name'),
                'contact' =>  $request->input('contact'),
                'address' =>  $request->input('address'),
                'position' =>  $request->input('position'),
              ];

              try {
                $member = NewsFamily:: find($id);
                $member->update($data);
                return redirect()->route('news-family')
                ->with('massage', 'Update Successfully')
                ->with('msg_type', 'success');
              } catch(Exception $e){
                $this->setErrorMsg($e->getMessage());
            }    
      
    }

    public function UpdateNewsFamilyStatus(Request $request){
      $status = $request->input('status');
      $id = $request->input('id');
      //return response()->json(['message' => $id]);
      try {
      $news = NewsFamily:: select('*')->where('id', $id)->first();
      $news->update([
        "status" => $status
      ]);
      } catch(Exception $e){
        $this->setErrorMsg($e->getMessage());
        return redirect()->back();
      }

    }


}
