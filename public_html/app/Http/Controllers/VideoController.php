<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\LiveVideo;
use App\Models\Video;

class VideoController extends Controller
{
    public function AllVideo(){
        $data['title']= "Video";
        $data['app']= App_setting::find(1);
        $data['videos']= Video::select('*')->orderBy('created_at', 'DESC')->paginate(24);
        return view('admin.video.all_video', $data);
    }

    public function LiveVideo(){
        $data['title']= "Video";
        $data['app']= App_setting::find(1);
        $data['video_link'] = LiveVideo:: select('*')->where('id', 1)->first();
        return view('admin.video.live_video_link', $data);
    }

    public function GoLive(Request $request){
        try {
            $video = LiveVideo:: select('*')->where('id', 1)->first();
            $video->update([
                'live_video_link'  => trim($request->input('live_video_link')),
                'live_title'  => trim($request->input('live_title')),
            ]);
            return redirect()->route('live-video-link')
            ->with('massage', 'Video is Live...')
            ->with('msg_type', 'success');
        } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
    }

    public function liveVideoStatusUpdate(Request $request){
        $status = $request->input('status');
        $id = $request->input('id');
        //return response()->json(['message' => $id]);
        try {
        $live = LiveVideo:: select('*')->where('id', $id)->first();
        $live->update([
          "status" => $status
        ]);
        } catch(Exception $e){
          $this->setErrorMsg($e->getMessage());
          return redirect()->back();
        }

      }

      public function insertVideo(Request $request){
          $data=[
            'video_title'   => trim($request->input('video_title')),
            'video_details' => trim($request->input('video_dis')),
            'pub_date'      => $request->input('pub_date'),
            'video_link'    => $request->input('video_link'),
            'status'        => 1,
          ];
  
          try {
            Video:: create($data);
            return redirect()->route('all-video')
            ->with('massage', 'Add Successfully')
            ->with('msg_type', 'success');
          } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
          }
      }

      public function DeleteVideo($id){
        try {
            $video = Video:: select('*')->where('id', $id)->first();
            $video->delete();
            return redirect()->route('all-video')
            ->with('massage', 'Delete Successfully')
            ->with('msg_type', 'error');
        } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
    }

    public function EditVideo($id){
      $data['title']= "Video";
      $data['app']= App_setting::find(1);
      $data['video'] = Video:: select('*')->where('id', $id)->first();
      return view('admin.video.edit_video', $data);
  }

  public function UpdateVideo($id, Request $request){

    try {
        $video = Video:: select('*')->where('id', $id)->first();
        $video->update([
          'video_title'   => trim($request->input('video_title')),
            'video_details' => trim($request->input('video_dis')),
            'pub_date'      => $request->input('pub_date'),
            'video_link'    => $request->input('video_link'),
        ]);
        return redirect()->route('edit-video', $id)
        ->with('massage', 'Update Successfully')
        ->with('msg_type', 'success');
    } catch(Exception $e){
        $this->setErrorMsg($e->getMessage());
        return redirect()->back();
    }
}

}
