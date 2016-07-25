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

<script>
  loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
  var hasWritePermission = {json_encode($hasWritePermission)};
  var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/media/?format=json",
    "getFormattedCell" : formatColumn,
    "freezeColumn" : "File Name"
  });
  React.render(table, document.getElementById("datatable"));


  // Adds tab href to url + opens tab based on hash on page load
  // See: http://bit.ly/292MDI8
  $(function(){
    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');

    $('.nav-tabs a').click(function (e) {
      $(this).tab('show');
      var scrollmem = $('body').scrollTop() || $('html').scrollTop();
      window.location.hash = this.hash;
      $('html,body').scrollTop(scrollmem);
    });
  });


</script>