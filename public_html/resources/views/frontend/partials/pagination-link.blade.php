<div class="row">
 <div class="col-12" style=" padding-right:10px;">
    @if($paginator->hasPages())
    <div style="text-align: right;"> 
    <table>
      <tr>
        <td>
          @if($paginator->onFirstPage())
            <a class="btn btn-default btn-sm" style="font-size:22px;" disabled>
              <i class="fas fa-angle-double-left"></i>&nbsp; আগের পেইজ
            </a>&nbsp;
          @else
            <a href="{{ $paginator->previousPageUrl() }}" style="font-size:22px;" class="btn btn-default btn-sm">
              <i class="fas fa-angle-double-left"></i>&nbsp; আগের পেইজ
            </a>&nbsp;
          @endif
        </td>
        <td>
          
           <div style="margin-top:-15px;">
              <ul class="pagination" style="margin-top:14px;">
                  @php
                      $start = max($paginator->currentPage() - 5, 1);
                      $end = min($paginator->currentPage() + 5, $paginator->lastPage());
                  @endphp
                  @for($i = $start; $i <= $end; $i++)
                      <li class="{{ ($i === $paginator->currentPage()) ? 'active' : '' }}" >
                          <a href="{{ $paginator->url($i) }}"  class="btn btn-default btn-sm" style="{{ ($i === $paginator->currentPage()) ? 'color: #fff; background-color: #007bff; border-color: #007bff; font-size:22px;' : 'font-size:22px;' }}">{{ $i }}</a>&nbsp;
                      </li>
                  @endfor
              </ul>
          </div>
        </td>
        <td>
            @if($paginator->hasMorePages())
            <a href="{{ $paginator->nextPageUrl() }}" class="btn btn-default btn-sm"  style="font-size:22px;">
            পরের পেইজ &nbsp;<i class="fas fa-angle-double-right"></i>
            </a>
            @else
            &nbsp;&nbsp;<a  style="font-size:22px;">পেইজ শেষ</a>
          @endif
        </td>
      </tr>
    </table> 
  </div>
    @endif
</div>
</div>
