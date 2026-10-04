@foreach($subcats as $subcat)
    <option value="{{$subcat->id}}">{{$subcat->sub_cat_name}}</option>
@endforeach