<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\App_setting;
use App\Models\User;
use App\Models\User_log;
use App\Models\Brand_promoter;
use App\Models\NewsTable;
use App\Models\UserRole;
use Image;

use App\Http\Requests\LoginRequest;
use App\Helpers\UserSystemInfoHelper;

class AuthController extends Controller
{
    // Show Login Form ---->
    public function LoginForm()
    {
        $data['title'] = "Login";
        $data['app'] = App_setting::find(1);
        return view('admin.login', $data);
    }

    // Attempt Login Process ---->
    public function LoginProccess(LoginRequest $request)
    {
        $loginCredentials['status'] = 1;
        $loginCredentials = $request->validated();

        if (Auth::attempt($loginCredentials)) {
            return redirect()
                ->route('dashboard')
                ->with('message', 'Logged in successfull!');
        } else {
            return redirect()
                ->route('login')
                ->with('message', 'Login attempt unsucessfull!');
        }
    }

    // Dashboard ---->
    public function Dashboard()
    {
        $cdate = date('d-m-Y');
        $data['title'] = "Dashboard";
        $data['app'] = App_setting::find(1);
        $data['total_news'] = NewsTable::all();
        $data['todays_news'] = NewsTable::where('published_date', $cdate)->get();
        $data['total_hit'] = NewsTable::sum('hit');
        $data['users'] = User::all();
        return view('admin.dashboard_admin', $data);
    }


    // User Logout ---->
    public function LogOut()
    {
        auth()->logout();
        return redirect()->route('login')
            ->with('massage', 'Logout Successfully')
            ->with('msg_type', 'success');
    }

    public function AppSetting()
    {
        $data['title'] = "Users";
        $data['app'] = App_setting::find(1);
        return view('admin.app_setting', $data);
    }

    // Update App Settings Data ---->
    public function UpdateAppSetting(Request $request)
    {

        try {
            $user = App_setting::find(1);
            $user->update([
                'app_title' => trim($request->input('name')),
                'email' => strtolower(trim($request->input('email'))),
                'contact' => $request->input('contact'),
                'address' => $request->input('address'),
            ]);

            $imageName = 'logo.png';
            if (!empty($request->logo_image)) {
                $request->logo_image->move(public_path('images/logos/'), $imageName);
            }

            return redirect()->route('app-setting')
                ->with('massage', 'Apps Data Updated')
                ->with('msg_type', 'success');
        } catch (Exception $e) {
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
    }

    // get All user Data ---->
    public function getAllUsers()
    {
        $data['title'] = "Users";
        //$data['user']= User::all();
        //$data['user']= User::select('id', 'name', 'email', 'contact', 'status')->where('status',1)->orderBy('id', 'DESC')->take(10)->get();
        $data['user'] = User::select('*')->get();
        $data['app'] = App_setting::find(1);

        return view('admin.users.all_users', $data);
    }

    //User Active ---->
    public function UserActive($id, Request $request)
    {
        $user = User::find($id);
        $user->update([
            'status' => 1,
        ]);
        return redirect()->route('manage-users')
            ->with('massage', 'User Activated')
            ->with('msg_type', 'success');
    }

    //User Inactive ---->
    public function UserInActive($id, Request $request)
    {
        $user = User::find($id);
        $user->update([
            'status' => 0,
        ]);
        return redirect()->route('manage-users')
            ->with('massage', 'User Inactivated')
            ->with('msg_type', 'error');
    }

    // New User Form ---->
    public function NewUsers_form()
    {
        $data['title'] = "Users";
        $data['app'] = App_setting::find(1);
        return view('admin.users.new_users', $data);
    }

    // Create A new User ---->
    public function InsertUser(Request $request)
    {
        //---Validation
        $rules = [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'contact' => 'required|max:13|min:6|unique:users,contact',
            'password' => 'min:6|required_with:confirm_password|same:confirm_password',
            'confirm_password' => 'min:6'
        ];

        $messages = [
            'required'  => 'The :attribute field is required.',
            'unique'    => ':attribute is already used',
            'max'    => ':attribute is maximum 13 character',
            'min'    => ':attribute is minimum 8 character',
        ];
        $request->validate($rules, $messages);
        //---End validation--
        $name = str_replace(' ', '-', strtolower(trim($request->input('name'))));
        $image_name = time()."_".$name.".jpg";
        $user_type = $request->input('user_type');
        if($user_type == "Admin"){
            $data = [
                'name' => trim($request->input('name')),
                'email' => strtolower(trim($request->input('email'))),
                'contact' => $request->input('contact'),
                'user_type' => $request->input('user_type'),
                'password' => bcrypt($request->input('password')),
                'status' => $request->input('status') == 1 ? '1' : '0',
                'user_edit_status' => 1,
                'user_delete_status' => 1,
                'photo' => $image_name,
            ];
        }else{
            $data = [
                'name' => trim($request->input('name')),
                'email' => strtolower(trim($request->input('email'))),
                'contact' => $request->input('contact'),
                'user_type' => $request->input('user_type'),
                'password' => bcrypt($request->input('password')),
                'status' => $request->input('status') == 1 ? '1' : '0',
                'user_edit_status' => $request->input('user_edit_status') == 1 ? '1' : '0',
                'user_delete_status' => $request->input('user_delete_status') == 1 ? '1' : '0',
                'photo' => $image_name,
            ];
        }
        
 
        try {
            $user = User::create($data);

           
            if($user_type == "Admin"){
                $nav_data = [
                    'user_id'            => $user->id,
                    'add_news_status'    => 1,
                    'manage_news_status' => 1,
                    'category_status'    => 1,
                    'just_nows_status'   => 1,
                    'video_status'       => 1,
                    'photo_status'       => 1,
                    'ad_manager_status'  => 1,
                    'e_paper_status'     => 1,
                    'live_status'        => 1,
                    'user_manage_status' => 1,
                    'footer_status'      => 1,
                    'user_edit_status'   => 1,
                    'user_delete_status' => 1,
                ];
            }else{
                $nav_data = [
                    'user_id'            => $user->id,
                    'add_news_status'    => $request->input('add_news_status') == 1 ? '1' : '0',
                    'manage_news_status' => $request->input('manage_news_status') == 1 ? '1' : '0',
                    'category_status'    => $request->input('category_status') == 1 ? '1' : '0',
                    'just_nows_status'   => $request->input('just_nows_status') == 1 ? '1' : '0',
                    'video_status'       => $request->input('video_status') == 1 ? '1' : '0',
                    'photo_status'       => $request->input('photo_status') == 1 ? '1' : '0',
                    'ad_manager_status'  => $request->input('ad_manager_status') == 1 ? '1' : '0',
                    'e_paper_status'     => $request->input('e_paper_status') == 1 ? '1' : '0',
                    'live_status'        => $request->input('live_status') == 1 ? '1' : '0',
                    'user_manage_status' => $request->input('user_manage_status') == 1 ? '1' : '0',
                    'footer_status'      => $request->input('footer_status') == 1 ? '1' : '0',
                    'user_edit_status'   => $request->input('user_edit_status') == 1 ? '1' : '0',
                    'user_delete_status' => $request->input('user_delete_status') == 1 ? '1' : '0',
                ];
            }
           

            UserRole::create($nav_data);

            
            // Image Upload with Crop
            if (!empty($request->imageUpload)) {
                $input = $request->All();
                
                $folderPath = public_path('images/user_image/');
                $image_parts = explode(";base64,", $input['base64image']);
                $image_base64 = base64_decode($image_parts[1]);
                $filename = $image_name;
                $file =$folderPath.$filename;
                file_put_contents($file, $image_base64);

                // Image Upload with Crop and rezise
                $Image_file = $request->file('imageUpload');
                $destinationPath = public_path('/images/user_image/thumbnail');
                $img = Image::make($file);
                $img->resize(200, 200, function ($constraint) {
                    $constraint->aspectRatio();
                })->save($destinationPath.'/'.$filename );

            }


            return redirect()->route('new-users')
                ->with('massage', 'User Account Created')
                ->with('msg_type', 'success');
        } catch (Exception $e) {
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
    }

    // User Edit Form show ---->
    public function EditUser($id)
    {
        $data['title'] = "Users";
        $data['user'] = User::find($id);
        $data['app'] = App_setting::find(1);
        $data['user_role'] = UserRole::select('*')->where('user_id', $id)->first();
        return view('admin.users.edit_users', $data);
    }

    // Update user Data ---->
    public function UpdateUser($id, Request $request)
    {
        $user_type = $request->input('user_type');
        try {
            if($user_type == "Admin"){
                $user = User::find($id);
                $user->update([
                    'name' => trim($request->input('name')),
                    'email' => strtolower(trim($request->input('email'))),
                    'contact' => $request->input('contact'),
                    'user_type' => $request->input('user_type'),
                    'user_edit_status' => 1,
                    'user_delete_status' => 1,
                    
                ]);
    
            }else{
                $user = User::find($id);
                $user->update([
                    'name' => trim($request->input('name')),
                    'email' => strtolower(trim($request->input('email'))),
                    'contact' => $request->input('contact'),
                    'user_type' => $request->input('user_type'),
                    'user_edit_status' => $request->input('user_edit_status'),
                    'user_delete_status' => $request->input('user_delete_status'),
                    
                ]);
    
            }
           
            
            if($user_type == "Admin"){
                $userRole = UserRole::select('*')->where('user_id', $id)->first();
                $userRole->update([
                    'add_news_status'    => 1,
                    'manage_news_status' => 1,
                    'category_status'    => 1,
                    'just_nows_status'   => 1,
                    'video_status'       => 1,
                    'photo_status'       => 1,
                    'ad_manager_status'  => 1,
                    'e_paper_status'     => 1,
                    'live_status'        => 1,
                    'user_manage_status' => 1,
                    'footer_status'      => 1,
                    'user_edit_status'   => 1,
                    'user_delete_status' => 1,
                ]);
            }else{
                $userRole = UserRole::select('*')->where('user_id', $id)->first();
                $userRole->update([
                    'add_news_status'    => $request->input('add_news_status'),
                    'manage_news_status' => $request->input('manage_news_status'),
                    'category_status'    => $request->input('category_status'),
                    'just_nows_status'   => $request->input('just_nows_status'),
                    'video_status'       => $request->input('video_status'),
                    'photo_status'       => $request->input('photo_status'),
                    'ad_manager_status'  => $request->input('ad_manager_status'),
                    'e_paper_status'     => $request->input('e_paper_status'),
                    'live_status'        => $request->input('live_status'),
                    'user_manage_status' => $request->input('user_manage_status'),
                    'footer_status'      => $request->input('footer_status'),
                    'user_edit_status'   => $request->input('user_edit_status'),
                    'user_delete_status' => $request->input('user_delete_status'),
                ]);
            }
            

             // Image Upload with Crop
             if (!empty($request->imageUpload)) {
                $input = $request->All();
                $image_name = $request->input('image');

                $folderPath = public_path('images/user_image/');
                $image_parts = explode(";base64,", $input['base64image']);
                $image_base64 = base64_decode($image_parts[1]);
                $filename = $image_name;
                $file =$folderPath.$filename;
                file_put_contents($file, $image_base64);

                // Image Upload with Crop and rezise
                $Image_file = $request->file('imageUpload');
                $destinationPath = public_path('/images/user_image/thumbnail');
                $img = Image::make($file);
                $img->resize(200, 200, function ($constraint) {
                    $constraint->aspectRatio();
                })->save($destinationPath.'/'.$filename );

            }

            return redirect()->route('edit-user', $id)
                ->with('massage', 'User Account Updated')
                ->with('msg_type', 'success');
        } catch (Exception $e) {
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
    }

    // Delete User ---->
    public function DeleteUser($id)
    {
        $user = User::find($id);
        $user->delete();

        $user_role = UserRole::select('*')->where('user_id', $id)->first();
        $user_role->delete();

        return redirect()->route('manage-users')
            ->with('massage', 'User Delete Successfully')
            ->with('msg_type', 'error');
    }

    // Passwor Change Form ---->
    public function PasswordChange($id)
    {
        $data['title'] = "Users";
        $data['app'] = App_setting::find(1);
        $data['user'] = User::find($id);
        return view('admin.users.password_change', $data);
    }

    // Update Password ---->
    public function UpdatePassword($id, Request $request)
    {
        $this->validate($request, [
            'password' => 'min:6|required_with:confirm_password|same:confirm_password',
            'confirm_password' => 'min:6'
        ]);

        try {
            $user = User::find($id);
            $user->update([
                'password' => bcrypt($request->input('password')),
            ]);
            return redirect()->route('password-change', $id)
                ->with('massage', 'Password Updated')
                ->with('msg_type', 'success');
        } catch (Exception $e) {
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
    }

    // Passwor Change Form ---->
    public function UserProfile($id)
    {
        $data['title'] = "Users";
        $data['app'] = App_setting::find(1);
        $data['user'] = User::find($id);
        return view('admin.users.user_profile', $data);
    }

    // Get All User Logs ---->
    public function getUsersLog()
    {
        $data['title'] = "Users";
        $data['log'] = User_log::with(['user'])->latest()
            ->paginate(10);
        //dd($data);
        //$data['log']= User_log::select('id', 'user_id', 'user_ip', 'browser', 'device_name', 'os', 'created_at')->orderBy('created_at', 'DESC')->paginate(8);
        $data['app'] = App_setting::find(1);
        return view('admin.users.user_logs', $data);
    }
}
