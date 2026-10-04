<div class="row">
  <div class="col-4" style="font-size:16px; color:#138496; padding-top:20px;">
      <b>{{ $paginator->count() }}</b> News out of <b>{{ $paginator->total() }}</b>
      &nbsp;&nbsp;|&nbsp;&nbsp;total <b>{{ $paginator->lastPage() }}</b> pages
      &nbsp;&nbsp;|&nbsp;&nbsp;Current Page <b>{{ $paginator->currentPage() }}</b>
 </div>
 <div class="col-8" style="text-align:right; padding-right:10px;">
    @if($paginator->hasPages())
    <div style="text-align: right;"> 
    <table>
      <tr>
        <td>
          @if($paginator->onFirstPage())
            <a class="btn btn-default btn-sm" disabled>
              <i class="fas fa-angle-double-left"></i>&nbsp; Previous
            </a>&nbsp;
          @else
            <a href="{{ $paginator->previousPageUrl() }}" class="btn btn-default btn-sm">
              <i class="fas fa-angle-double-left"></i>&nbsp; Previous
            </a>&nbsp;
          @endif
        </td>
        <td>
          
           <div>
              <ul class="pagination" style="margin-top:14px;">
                  @php
                      $start = max($paginator->currentPage() - 5, 1);
                      $end = min($paginator->currentPage() + 5, $paginator->lastPage());
                  @endphp
                  @for($i = $start; $i <= $end; $i++)
                      <li class="{{ ($i === $paginator->currentPage()) ? 'active' : '' }}">
                          <a href="{{ $paginator->url($i) }}" class="btn btn-default btn-sm" style="{{ ($i === $paginator->currentPage()) ? 'color: #fff; background-color: #007bff; border-color: #007bff;' : '' }}">{{ $i }}</a>&nbsp;
                      </li>
                  @endfor
              </ul>
          </div>
        </td>
        <td>
            @if($paginator->hasMorePages())
            <a href="{{ $paginator->nextPageUrl() }}" class="btn btn-default btn-sm">
              Next &nbsp;<i class="fas fa-angle-double-right"></i>
            </a>
            @else
            &nbsp;&nbsp;Page End
          @endif
        </td>
      </tr>
    </table> 
  </div>
    @endif
</div>
</div>
