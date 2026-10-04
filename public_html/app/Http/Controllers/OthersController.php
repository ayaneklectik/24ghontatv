<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\FooterContent;
use App\Models\SocialMedia;
use App\Models\WriterDesk;

class OthersController extends Controller
{
    public function SocialMedia(){
        $data['title']= "Social Media";
        $data['app']= App_setting::find(1);
        $data['media']= SocialMedia::find(1);
        return view('admin.others.social_media', $data);
      }

      public function UpdateSocialMedia(Request $request){
        try {
            $media = SocialMedia::find(1);
            $media->update([
                'facebook'  => trim($request->input('facebook')),
                'twitter'   => trim($request->input('twitter')),
                'instagram' => trim($request->input('instagram')),
                'youtube'   => trim($request->input('youtube')),
            ]);
            return redirect()->route('social-media')
            ->with('massage', 'Update Successfully')
            ->with('msg_type', 'success');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
          }
      }

      public function FooterContent(){
        $data['title']= "Social Media";
        $data['app']= App_setting::find(1);
        $data['footer']= FooterContent::find(1);
        return view('admin.others.footer_content', $data);
      }

      public function UpdateFooterContent(Request $request){
        try {
            $footer = FooterContent::find(1);
            $footer->update([
                'address'  => trim($request->input('address')),
                'contact'   => trim($request->input('contact')),
                'email' => trim($request->input('email')),
            ]);
            return redirect()->route('footer-content')
            ->with('massage', 'Update Successfully')
            ->with('msg_type', 'success');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
          }
      }

      public function WriterDesk(){
        $data['title']= "Writer Desk";
        $data['app']= App_setting::find(1);
        $data['desks']= WriterDesk::all();
        return view('admin.others.writer_desk', $data);
      }

      public function insertWriterDesk(Request $request){
        try {
          WriterDesk::create([
                'writer_desk'  => trim($request->input('writer_desk')),
            ]);
            return redirect()->route('writer-desk')
            ->with('massage', 'Add Successfully')
            ->with('msg_type', 'success');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
          }
      }

      public function editWriterDesk($id){
        $data['title']= "Writer Desk";
        $data['app']= App_setting::find(1);
        $data['desk']= WriterDesk::find($id);
        return view('admin.others.edit_writer_desk', $data);
      }

      public function updateWriterDesk($id, Request $request){
        try {
            $desk = WriterDesk::find($id);
            $desk->update([
              'writer_desk'  => trim($request->input('writer_desk')),
            ]);
            return redirect()->route('writer-desk')
            ->with('massage', 'Update Successfully')
            ->with('msg_type', 'success');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
          }
      }

      public function deleteWriterDesk($id){
        try {
            $desk = WriterDesk::find($id);
            $desk->delete();
            return redirect()->route('writer-desk')
            ->with('massage', 'Delete Successfully')
            ->with('msg_type', 'error');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
          }
      }
}
