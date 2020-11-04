  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/">Profiles</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/gwas_browser/">GWAS</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/snp_browser/">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/cnv_browser/">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/cpg_browser/">Methylation</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>Files</strong></a></li>
      </ul>
      <br>
    </div>
  </div>
  <form method="post" name="genomic_upload" id="genomic_upload" enctype="multipart/form-data">
    <div class="row">
      <div class="col-sm-10 col-md-8">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Genomic File Filters
          </div>
          <div class="panel-body" id="panel-body">
            <div class="row">
              <div class="form-group col-sm-5">
                <label class="col-sm-12 col-md-3">
                  {$form.genomic_file_type.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.genomic_file_type.html}
                </div>
              </div>
              <div class="form-group col-sm-7">
                <label class="col-sm-3">
                  {$form.file_name.label}
                </label>
                <div id="file-input" class="col-sm-9">
                  {$form.file_name.html}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-5">
                <label class="col-sm-12 col-md-3">
                  {$form.date_inserted.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.date_inserted.html}
                </div>
              </div>
              <div class="form-group col-sm-7">
                <label class="col-sm-12 col-md-3">
                  {$form.description.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.description.html}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-5">
                <label class="col-sm-12 col-md-3">
                  {$form.caveat.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.caveat.html}
                </div>
              </div>
              <div class="form-group col-sm-7">
                <label class="col-sm-12 col-md-3">
                  {$form.notes.label}
                </label>
                <div class="col-sm-12 col-md-9">
                  {$form.notes.html}
                </div>
              </div>
            </div>
            {$form.hidden}
          </div>
        </div>
      </div>
      <div class="form-group col-sm-4">
        <div class="row"><!--fixed vertical space-->
          <div class="form-group col-md-12">
            <br><br><br><br><br>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12">
            <label class="col-sm-4 col-md-3">
              {$form.Show_Brief_Results.label}
            </label>
            <div class="col-sm-8 col-md-8">
              {$form.Show_Brief_Results.html}
            </div>
          </div>
        </div>

        <div class="row">
          <div class="form-group col-sm-12">
            <div class="col-sm-6 col-xs-12 col-md-6">
              <input type="submit" name="filter" value="Show data" id="showdata" class="btn btn-sm btn-primary col-xs-12"/>
            </div>
{if $upload_allowed}
            <div class="col-sm-6 col-xs-12 col-md-6">
              <button type="button" name = "upload" class = "btn btn-sm btn-primary col-xs-12" data-toggle="modal" data-target="#fileUploadModal">Upload File</button>
            </div>
{/if}
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12">
            <div class="col-sm-6">
              <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='/genomic_browser/genomic_file_uploader/?reset=true'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
  <div id="datatable"></div>
</div>
<div id="modalContainer"></div>
<style>
.progress {
    height: 40px;
    margin-bottom: 0px;
}
.progress-bar-female {
    background-color: #2FA4E7;
}
</style>
<script>
    var table = RDynamicDataTable({
        "DataURL" : "{$baseurl}/genomic_browser/genomic_file_uploader/?format=json",
        "getFormattedCell" : formatColumn,
        "freezeColumn" : "file_name"
    });

    ReactDOM.render(table, document.getElementById("datatable"));

{if $upload_allowed}
    var uploadModal = RGenomicFileUploadModal({
            baseURL : "{$baseurl}"
    });
    ReactDOM.render(uploadModal, document.getElementById("modalContainer"));
{/if}
</script>

