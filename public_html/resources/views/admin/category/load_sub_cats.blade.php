<div>
    <table style="width:100%">
        <tr>
            <td>
                <div style="font-size:20px;"><b>{{$cat->cat_name}}</b></div>
            </td>
            <td style="text-align:right; padding-right:40px;">
            <button type="button" id="close-btn" class="btn btn-danger btn-sm"><i class="fa fa-window-close" aria-hidden="true"></i>&nbsp;&nbsp;Close</button>
        </td>
        </tr>
    </table>

    <div style="padding-top:20px;">
        <table class="table">
            @foreach($subcats as $index => $sub_cat)
            <tr>
                <td style="width:5%">{{$loop->iteration}}</td>
                <td>
                   <div id="subitemDivMain{{ $index + 1 }}"> {{$sub_cat->sub_cat_name}}</div>
                   <form class="form-horizontal" action="{{route('update-sub-category', $sub_cat->id)}}" method="post"  enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="row" id="subitemDivEdit{{ $index + 1 }}" style="display:none;">
                                       
                       <div class="col-8">
                            <input type="text" name="sub_cat_name" value="{{$sub_cat->sub_cat_name}}" style="width:100%" required>
                        </div>
                        <div class="col-4">
                            <button type="submit"  id="hideButton" class="btn btn-warning btn-sm" >Update</button>
                         </div>
                                        
                    </div>
                 </form>

                 <script type="text/javascript">
                        $(document).ready(function () {
                   
                            $("#subitemDivEdit{{ $index + 1 }}").hide();
                            $("#subitemDivMain{{ $index + 1 }}").show();
                            $("#editSubCatButton{{ $index + 1 }}").click(function (e) {
                                $("#subitemDivEdit{{ $index + 1 }}").show();
                                $("#subitemDivMain{{ $index + 1 }}").hide();
                            }); 

                        });
                        </script>

                </td>
                <td style="text-align:right;  padding-right:40px;">
                @if(optional(auth()->user())->user_edit_status == 1)
                    <a id="editSubCatButton{{ $index + 1 }}" class="btn btn-warning btn-xs">Edit</a>
                @endif
                @if(optional(auth()->user())->user_delete_status == 1)
                    <a href="{{route('delete-sub-category', $sub_cat->id )}}" onClick="return confirmation()" class="btn btn-danger btn-xs">Delete</a>
                 @endif
                </td>
              
            </tr>
            @endforeach
        </table>
    </div>
</div>

<script type="text/javascript">
        $(document).ready(function () {
            $("#close-btn").click(function (e) {
                $("#subcat-content").hide();
            });
        });
     </script>