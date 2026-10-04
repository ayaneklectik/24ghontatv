<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\App_setting;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\NewsTable;

class CategoryController extends Controller
{
    public function AllCategory(){
        $data['title']= "Category";
        $data['app']= App_setting::find(1);
        $data['cats']= Category::select('*')->orderBy('cat_order', 'ASC')->get();
        return view('admin.category.all_category', $data);
    }

    public function insertCategory(Request $request){
        $this->validate($request, [
          'cat_name'  => 'required',
        ]);

        $cats = Category::all();
        $tot_cat = $cats->count()+1;

        $data=[
            'cat_name'  => trim($request->input('cat_name')),
            'cat_short_dis'  => trim($request->input('cat_dis')),
            'status'  => 1,
            'cat_order'  => $tot_cat
        ];

        try {
            Category:: create($data);
            return redirect()->route('all-category')
            ->with('massage', 'Category Created Successfully')
            ->with('msg_type', 'success');
        } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
      }

      public function insertSubCategory(Request $request){
        $this->validate($request, [
          'sub_cat_name'  => 'required',
        ]);

        $data=[
            'cat_id'  => $request->input('cat_id'),
            'sub_cat_name'  => trim($request->input('sub_cat_name')),
        ];

        try {
            SubCategory:: create($data);
            return redirect()->route('all-category')
            ->with('massage', 'Category Created Successfully')
            ->with('msg_type', 'success');
        } catch(Exception $e){
            $this->setErrorMsg($e->getMessage());
            return redirect()->back();
        }
      }

      public static function allSubCatByCat($cat_id){
        $subcat= SubCategory::select("*")->where('cat_id', $cat_id)->get();
        return $subcat;
      }

      public function UpdateCatOrder(Request $request){
        $catIds = $request->input('catIdValues');
        $catOrders = $request->input('catOrderValues');
      

        try {
          foreach ($catIds as $index => $catId) {
            Category::where('id', $catId)->update(['cat_order' => $catOrders[$index]]);
          }
          return redirect()->route('all-category')
          ->with('massage', 'Ordering Successfully')
          ->with('msg_type', 'success');
      } catch(Exception $e){
          $this->setErrorMsg($e->getMessage());
          return redirect()->back();
      }
      }

      public function LoadSubCat($cat_id){
        $data['subcats']= SubCategory::select("*")->where('cat_id', $cat_id)->get();
        $data['cat']= Category::select("*")->where('id', $cat_id)->first();
        return view('admin.category.load_sub_cats', $data);
      }

      public function CatStatusUpdate(Request $request){
        $status = $request->input('status');
        $id = $request->input('id');
        //return response()->json(['message' => $id]);
        try {
        $news = Category:: select('*')->where('id', $id)->first();
        $news->update([
          "status" => $status
        ]);
        } catch(Exception $e){
          $this->setErrorMsg($e->getMessage());
          return redirect()->back();
        }

      }

      public function DeleteCategory($id){
        try {
          $subCat =  SubCategory:: where('cat_id', $id)->get();
          if($subCat->count() > 0){
            return redirect()->route('all-category')
            ->with('massage', 'Sub-Category found under this Category, please delete this sub-category first.')
            ->with('msg_type', 'error');
          }else{
            $CategoryDelete = Category:: find($id);
            $CategoryDelete->delete();
  
            return redirect()->route('all-category')
            ->with('massage', 'Delete Successfully')
            ->with('msg_type', 'error');
          }
          
        } catch(Exception $e){
          $this->setErrorMsg($e->getMessage());
          return redirect()->back();
        }
      }

      public function DeleteSubCategory($id){
        try {
          $news =  NewsTable:: where('sub_cat', $id)->get();
          
          if($news->count() > 0){
            return redirect()->route('all-category')
            ->with('massage', 'News found under this sub-category, please delete this sub-category news first.')
            ->with('msg_type', 'error');
          }else{
            $SubCategoryDelete = SubCategory:: find($id);
            $SubCategoryDelete->delete();
  
            return redirect()->route('all-category')
            ->with('massage', 'Delete Successfully')
            ->with('msg_type', 'error');
          }
          
        } catch(Exception $e){
          $this->setErrorMsg($e->getMessage());
          return redirect()->back();
        }
      }

      public function UpdateCategory($id, Request $request){
        try {

            $Category = Category:: find($id);
            $Category->update([
              'cat_name' => trim($request->input('cat_name'))
            ]);
  
            return redirect()->route('all-category')
            ->with('massage', 'Update Successfully')
            ->with('msg_type', 'success');
 
        } catch(Exception $e){
          $this->setErrorMsg($e->getMessage());
          return redirect()->back();
        }
      }

      public function UpdateSubCategory($id, Request $request){
        try {

            $SubCategory = SubCategory:: find($id);
            $SubCategory->update([
              'sub_cat_name' => trim($request->input('sub_cat_name'))
            ]);
  
            return redirect()->route('all-category')
            ->with('massage', 'Update Successfully')
            ->with('msg_type', 'success');
 
        } catch(Exception $e){
          $this->setErrorMsg($e->getMessage());
          return redirect()->back();
        }
      }
}
