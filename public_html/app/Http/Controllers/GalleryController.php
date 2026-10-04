<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\Photo;
use Image;

class GalleryController extends Controller
{
    public function AllGalleryPhoto(){
        $data['title']= "Photo Gallery";
        $data['app']= App_setting::find(1);
        $data['photos']= Photo::orderBy('created_at', 'DESC')->get();
        return view('admin.photo_gallery.all_gallery_photo', $data);
    }

    public function insertGalleryPhoto(Request $request){
        $file_image = $request->file('imageUpload');
        $photo_name = "webnews24_".rand().time().'.jpg';

         // Image Upload with Crop
         if (!empty($request->imageUpload)) {
            $input = $request->All();
      
            $folderPath = public_path('images/photo_gallery/');
            $image_parts = explode(";base64,", $input['base64image']);
            $image_base64 = base64_decode($image_parts[1]);
            $filename = $photo_name;
            $file =$folderPath.$filename;
            file_put_contents($file, $image_base64);
      
              // Image Upload with Crop and rezise
              $Image_file = $request->file('imageUpload');
              $destinationPath = public_path('/images/photo_gallery/thumbnail');
              $img = Image::make($file);
              $img->resize(200, 200, function ($constraint) {
                $constraint->aspectRatio();
              })->save($destinationPath.'/'.$filename );
    
            }

            $data=[
                'photo_details' =>  $request->input('photo_details'),
                'cdate'     => $request->input('cdate'),
                'photo'     => $photo_name,
              ];

              try {
                Photo:: create($data);
                return redirect()->route('all-gallery-photo')
                ->with('massage', 'Submit Successfully')
                ->with('msg_type', 'success');
              } catch(Exception $e){
                $this->setErrorMsg($e->getMessage());
            }    
      
    }


    public function DeleteGalleryPhoto($id){
        try {

            $photo = Photo:: find($id);
            $photo->delete();
            return redirect()->route('all-gallery-photo')
            ->with('massage', 'Delete Successfully')
            ->with('msg_type', 'error');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
          }
    }

    public function EditGalleryPhoto($id){
      $data['title']= "Photo Gallery";
      $data['app']= App_setting::find(1);
      $data['photo']= Photo::select('*')->where('id', $id)->first();
      return view('admin.photo_gallery.edit_gallery_photo', $data);
  }

  public function UpdateGalleryPhoto($id, Request $request){
    $file_image = $request->file('imageUpload');
    $photo_name = $request->input('image');

     // Image Upload with Crop
     if (!empty($request->imageUpload)) {
        $input = $request->All();
  
        $folderPath = public_path('images/photo_gallery/');
        $image_parts = explode(";base64,", $input['base64image']);
        $image_base64 = base64_decode($image_parts[1]);
        $filename = $photo_name;
        $file =$folderPath.$filename;
        file_put_contents($file, $image_base64);
  
          // Image Upload with Crop and rezise
          $Image_file = $request->file('imageUpload');
          $destinationPath = public_path('/images/photo_gallery/thumbnail');
          $img = Image::make($file);
          $img->resize(200, 200, function ($constraint) {
            $constraint->aspectRatio();
          })->save($destinationPath.'/'.$filename );

        }

          try {
            $photo = Photo:: find($id);
            $photo->update([
              'photo_details' =>  $request->input('photo_details'),
              'cdate'     => $request->input('cdate'),
            ]);
            return redirect()->route('edit-gallery-photo', $id)
            ->with('massage', 'Submit Successfully')
            ->with('msg_type', 'success');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
        }    
  
}
}
