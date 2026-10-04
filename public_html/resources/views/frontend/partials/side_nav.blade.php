

<drawer-menu class="menu">
    <div class="drawer-content">
        @foreach($nav_cats as $cat)
        <div class="nav-cat-name">
            <a href="{{route('all-category-news', $cat->id)}}">
            <i class="fa fa-angle-right"></i>&nbsp; {{$cat->cat_name}}
            </a>
        </div>
        @endforeach

        <div class="nav-cat-name">
            <a href="{{route('e-paper')}}">
            <i class="fa fa-angle-right"></i>&nbsp; ই-পেপার
            </a>
        </div>
    </div>
</drawer-menu>
