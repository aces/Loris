<!-- Nav tabs -->
<ul class="nav nav-tabs nav-tabs-loris" role="tablist">
  <li role="presentation">
    <a href="#browse" aria-controls="browse" role="tab" data-toggle="tab">Browse</a>
  </li>
  <li role="presentation" class="active">
    <a href="#upload" aria-controls="upload" role="tab" data-toggle="tab">Upload</a>
  </li>
</ul>


<!-- Tab panes -->
<div class="tab-content">

  <!-- Browse Videos -->
  <div role="tabpanel" class="tab-pane" id="browse">
    {include file='../part/selection_filter.tpl'}
    <div id="datatable"></div>
  </div>

  <!-- Upload Videos -->
  <div role="tabpanel" class="tab-pane active" id="upload">
    <div class="controlPanelSection">
      <a class="btn btn-sm btn-primary" href="video_upload/">Upload a New Video</a>
      {include file='../part/video_upload.tpl'}
    </div>
  </div>
</div>


<script>
  var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/videos/?format=json",
    "getFormattedCell" : formatColumn,
    "freezeColumn" : "File Name"
  });
  React.render(table, document.getElementById("datatable"));
</script>