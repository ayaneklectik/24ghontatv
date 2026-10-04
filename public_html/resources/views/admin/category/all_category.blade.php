@extends('admin.master_layout')
@section('content')

@push('scripts')
<style>
    .card .card-header .collapse-header{
        padding:3px 10px !important;
    }

    .drag-container {
        width: 100%;
        height: 100%;
        padding:0px;
        }

        .drag-list-item {
        position: absolute;
        padding:0px 15px;
        width: 100%;
        }

        .drag-item-content {
        border-radius: 4px;
        color: #000;
        font-size: 16px;
        padding:0px 15px;
        background-color: #FFF;
        box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
        }

        .hidden {
            display: none;
        }
</style>
@endpush


<meta name="csrf-token" content="{{ csrf_token() }}">
<section class="content" style="padding-bottom:200px;">
<div class="container-fluid">
    <div class="card-body">

        <table style="width:100%;">
            <tr>
                <td><div class="card-title" style="color:#CE185B; font-size:23px;"><i class="fa fa-list"></i> &nbsp;Manage & Add Home Category</div></td>
                <td style="text-align:right;"> </td>
            </tr>
        </table>
        <div style="height:5px; border-top:solid 1px #EBEBEB; margin-bottom:15px; margin-top:10px;"></div>
        <div class="row">

            <!--Col Section-->
            <div class="col-md-3">
                <div style="padding:10px; text-align:center; background-color:#002D3E; Color: #FFF; border-top-left-radius:5px; border-top-right-radius:5px;">New Category</div>
                <div style="padding:15px; border:solid 1px #999999;">

                <form class="form-horizontal" action="{{route('insert-category')}}" method="post"  enctype="multipart/form-data">
                @csrf
                <div style="padding-top:13px;">
                    <div>Category Name</div>
                    <div>
                    <input type="text" name="cat_name" value="" class="form-control" required>
                    </div>
                </div>

                <div style="padding-top:13px;">
                    <div>Category Short Description</div>
                    <div>
                    <input type="text" name="cat_dis" value="" class="form-control" >
                    </div>
                </div>

                <div style="padding-top: 20px;">
                    <button type="submit" class="btn btn-success" style="width:100%">Submit</button>
                </div>

                </form>
                </div>


                <div style="padding:10px; text-align:center; background-color:#002D3E; Color: #FFF;">New Sub-Category</div>
                <div style="padding:15px; border:solid 1px #999999;">
                <form class="form-horizontal" action="{{route('insert-sub-category')}}" method="post"  enctype="multipart/form-data">
                @csrf
                <div>
                    <div>Category</div>
                    <div>
                    <select name="cat_id" class="form-control" required>
                        <option value="" selected="selected">--select Category--</option>
                        @foreach($cats as $cat)
                        <option value="{{$cat->id}}" >{{$cat->cat_name}}</option>
                        @endforeach
                    </select>
                    </div>
                </div>

                <div style="padding-top:13px;">
                    <div>Sub-Category Name</div>
                    <div>
                    <input type="text" name="sub_cat_name" value="" class="form-control" required>
                    </div>
                </div>




                <div style="height:15px; border-top:solid 1px #EBEBEB; margin-bottom:15px;"></div>

                <div>
                    <button type="submit" class="btn btn-success" style="width:100%">Submit</button>
                </div>
                </form>

                </div>


                </div>
                <!--/Col Section-->

                <!--Col Section-->
                <div class="col-md-9">


                    <div style="padding:10px 20px; margin:0px 0px 10px 15px; background-color:#002D3E; border-radius: 5px;">

                    <table style="width:100%;">
                        <tr>
                            <td style="font-size:18px; Color: #FFF;"><b>Setup Menu & Home News Category</b></td>
                            <td style="text-align:right;">

                            </td>
                        </tr>
                    </table>
                </div>

                <!--Show SubCats-->
                <div  id="subcat-content" class="sub-cat-container">
                   <div id="subcatShow"></div>
                </div>
                <!--/Show SubCats-->

                <div class="drag-container">
                @foreach($cats as $index => $cat)
                <div class="drag-list-item">
                    <div class="drag-item-content">
                        <div style="padding:10px 20px;">
                        <div class=" w-100">
                            <div class="row">
                            <div class="col-1">
                                <div style="padding-top:5px; color:#ccc;">
                                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                </div>
                            </div>
                                <div class="col-7">
                                    <div id="editItem{{ $index + 1 }}">
                                        <a><span class="order1">{{$index + 1}}</span>.&nbsp;&nbsp;<b>{{$cat->cat_name}}</b></a>
                                    </div>
                                    <input type="hidden" class="order" name="cat_order[]" value="{{ $index + 1 }}">
                                    <input type="hidden" name="cat_id[]" value="{{ $cat->id }}">
                                    <form class="form-horizontal" action="{{route('update-category', $cat->id )}}" method="post"  enctype="multipart/form-data">
                                    @csrf
                                    @method('PUT')
                                    <div class="row" id="itemDiv{{ $index + 1 }}" style="display:none;">
                                       
                                        <div class="col-8">
                                            <input type="text" name="cat_name" value="{{$cat->cat_name}}" style="width:100%" required>
                                        </div>
                                        <div class="col-4">
                                            <button type="submit"  id="hideButton" class="btn btn-warning btn-sm" >Update</button>
                                        </div>
                                        
                                    </div>
                                    </form>
                                </div>

                                <div class="col-1" style="text-align:right;">
                                    <div class="checkbox-wrapper-2">
                                        <input type="checkbox" id="status{{$loop->iteration}}"   class="sc-gJwTLC ikxBAC" value=1 {{ $cat->status == 1 ? 'checked' : '' }}>
                                    </div>
                                </div>
                                <script>
                                    $(document).ready(function () {
                                        $('#status{{$loop->iteration}}').on('change', function () {
                                            var statusValue = $(this).is(':checked') ? 1 : 0;
                                            var id = {{$cat->id}}
                                                $.ajax({
                                                    url: "{{route('cat-status-update')}}",
                                                    type: 'POST', // or 'GET' depending on your server configuration
                                                    data: {
                                                        status: statusValue,
                                                        id: id
                                                    },
                                                    headers: {
                                                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                                    },
                                                    success: function (response) {
                                                        console.log('Ajax call successful:', response);
                                                        toastr.success('Update successfully', 'Success', { positionClass: 'toast-top-right' });
                                                    },
                                                    error: function (error) {
                                                        console.error('Ajax call error:', error);
                                                    }
                                                });

                                        });
                                    });
                                </script>
                                <div class="col-3" style="text-align:right;">
                                <a   style="cursor: pointer;" id="cat{{ $index + 1 }}"  data-cat-id="{{ $cat->id }}" class="btn btn-info btn-xs">Sub-Category</a>
                                @if(optional(auth()->user())->user_edit_status == 1)
                                    <a id="editButton{{ $index + 1 }}" class="btn btn-warning btn-xs">Edit</a>
                                @endif    
                                @if(optional(auth()->user())->user_delete_status == 1)
                                    <a href="{{route('delete-category', $cat->id )}}" onClick="return confirmation()" class="btn btn-danger btn-xs">Delete</a>
                                @endif 
                                </div>


                            </div>
                        </div>
                        </div>

                    </div>
                    </div>

                    <script type="text/javascript">
                        $(document).ready(function () {
                            $("#subcat-content").hide();
                            $("#cat{{ $index + 1 }}").click(function (e) {
                                e.preventDefault(); // Prevent the default action of the anchor tag
                                var cat_id = $(this).attr('data-cat-id'); // Use $(this) to refer to the clicked element
                                console.log(cat_id);
                                $.get("load-sub-cat/" + cat_id, function (data) {
                                    $("#subcat-content").show();
                                    $("#subcatShow").html(data);
                                });
                            });


                            $("#itemDiv{{ $index + 1 }}").hide();
                            $("#editItem{{ $index + 1 }}").show();
                            $("#editButton{{ $index + 1 }}").click(function (e) {
                                $("#itemDiv{{ $index + 1 }}").show();
                                $("#editItem{{ $index + 1 }}").hide();
                            }); 

                        });
                        </script>

                 

                    @endforeach
                </div>


                </div>
                <!--/Col Section-->


                </div>


                <!--/Col Section-->


</div>
</div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.4/utils/Draggable.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.4/TweenMax.min.js"></script>


<script>
var rowSize = 55; // => container height / number of items
var container = document.querySelector(".drag-container");
var listItems = Array.from(document.querySelectorAll(".drag-list-item")); // Array of elements
var sortables = listItems.map(Sortable); // Array of sortables
var total = sortables.length;

TweenLite.to(container, 0.5, { autoAlpha: 1 });

function changeIndex(item, to) {
  // Change position in array
  arrayMove(sortables, item.index, to);

  // Change element's position in DOM. Not always necessary. Just showing how.
  if (to === total - 1) {
    container.appendChild(item.element);
  } else {
    var i = item.index > to ? to : to + 1;
    container.insertBefore(item.element, container.children[i]);
  }

  // Set index for each sortable
  sortables.forEach((sortable, index) => sortable.setIndex(index));
  updateSerialNumbers();

}

function Sortable(element, index) {
  var content = element.querySelector(".drag-item-content");
  var order = element.querySelector(".order1");
  var order_input = element.querySelector(".order");

  var animation = TweenLite.to(content, 0.2, {
    boxShadow: "rgba(0,0,0,0.2) 0px 5px 10px 0px",
    force3D: false,
    scale: 1,
    paused: true
  });

  var dragger = new Draggable(element, {
    onDragStart: downAction,
    onRelease: upAction,
    onDrag: dragAction,
    cursor: "inherit",
    type: "y"
  });

  // Public properties and methods
  var sortable = {
    dragger: dragger,
    element: element,
    index: index,
    setIndex: setIndex
  };

  TweenLite.set(element, { y: index * rowSize });

  function setIndex(index) {
    sortable.index = index;
    order.textContent = index + 1;
	order_input.value = index + 1;

    // Don't layout if you're dragging
    if (!dragger.isDragging) layout();
  }

  function downAction() {
    animation.play();
    this.update();
  }

  function dragAction() {
    // Calculate the current index based on element's position
    var index = clamp(Math.round(this.y / rowSize), 0, total - 1);

    if (index !== sortable.index) {
      changeIndex(sortable, index);
    }
  }

  function upAction() {
    animation.reverse();
    layout();
  }

  function layout() {
    TweenLite.to(element, 0.3, { y: sortable.index * rowSize });
  }

  return sortable;
}

// Changes an elements's position in array
function arrayMove(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0]);
}

// Clamps a value to a min/max
function clamp(value, a, b) {
  return value < a ? a : value > b ? b : value;
}
// Function to handle AJAX call for updating serial numbers
function updateSerialNumbers() {
    var csrfToken = "{{ csrf_token() }}";
  var catOrders = Array.from(document.querySelectorAll(".order"));
  var catIds = Array.from(document.querySelectorAll("[name='cat_id[]']"));

  // Extract values for cat_order[] and cat_id[] inputs
  var catOrderValues = catOrders.map(order => order.value);
  var catIdValues = catIds.map(catId => catId.value);

  // Make AJAX POST request
  var baseUrl = "{{ route('update-cat-order') }}";
  //console.log(baseUrl);
  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
      // Add any additional headers if required
    },
    body: JSON.stringify({ catOrderValues: catOrderValues, catIdValues: catIdValues })

  })
  .then(response => {
    // Handle response from server, if needed
    console.log(response);
    if (response.ok) {
        // Update was successful, show success toastr
        toastr.success('Update successfully', 'Success', { positionClass: 'toast-top-right' });
    } else {
        // Handle other responses (e.g., errors)
        toastr.error('Update failed', 'Error', { positionClass: 'toast-top-right' });
    }

  })
  .catch(error => {
    // Handle error, if any
    console.error('Error:', error);
  });
}

</script>

<script type="text/javascript">
        function confirmation() {
        return confirm('Are you sure you want to Delete this?');
          }
  </script>



@endsection

