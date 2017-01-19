<!-- Nav tabs -->
<ul class="nav nav-tabs nav-tabs-loris" role="tablist">
  <li role="presentation" class="active">
    <a id="tab-browse" href="#browse" aria-controls="browse" role="tab" data-toggle="tab">Browse</a>
  </li>
  {if $hasWritePermission}
    <li role="presentation">
      <a href="#upload" aria-controls="upload" role="tab" data-toggle="tab">
        Upload
      </a>
    </li>
  {/if}
</ul>

<!-- Tab panes -->
<div class="tab-content">

  <!-- Browse Media -->
  <div role="tabpanel" class="tab-pane active" id="browse">
    {include file='../part/selection_filter.tpl'}
    <div id="datatable"></div>
  </div>

  <!-- Upload Media -->
  <div role="tabpanel" class="tab-pane" id="upload">
      {include file='../part/file_upload.tpl'}
  </div>

</div>
