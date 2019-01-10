<script>
    loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
</script>
<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>Profiles</strong></a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/gwas_browser/">GWAS</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/snp_browser/">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/cnv_browser/">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/cpg_browser/">Methylation</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/genomic_file_uploader/">Files</a></li>
      </ul>
      <br>
    </div>
  </div>
  <div class="row">
    <div class="tab-content">
      <div class="tab-pane active">
        <form method="post" action="{$baseurl}/genomic_browser/">
          <div class="col-sm-12">
            <div class="row">
              <div class="form-group col-sm-8">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilterCandidate();">
                    Candidate Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-candidate"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-candidate"></span>
                  </div>
                  <div class="panel-body" id="panel-body-candidate">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-1 col-lg-1">
                          {$form.centerID.label}
                        </label>
                        <div class="col-sm-12 col-md-3 col-lg-3">
                          {$form.centerID.html}
                        </div>
                        <label class="col-sm-12 col-md-2">
                          {$form.SubprojectID.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.SubprojectID.html}
                        </div>
                        <label class="col-sm-12 col-md-1">
                          {$form.DCCID.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.DCCID.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2 ">
                          {$form.sex.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.sex.html}
                        </div>
                        <label class="col-sm-12 col-md-3">
                          {$form.External_ID.label}
                        </label>
                        <div class="col-sm-12 col-md-2 pull-left">
                          {$form.External_ID.html}
                        </div>
                        <label class="col-sm-12 col-md-1">
                          {$form.PSCID.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.PSCID.html}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-12">
            <div class="row">
              <div class="form-group col-sm-8">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilterGenomic();">
                    Genomic Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-genomic"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-genomic"></span>
                  </div>
                  <div class="panel-body" id="panel-body-genomic">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3 col-lg-3">
                          {$form.File.label}
                        </label>
                        <div class="col-sm-12 col-md-3 col-lg-2">
                          {$form.File.html}
                        </div>
                        <label class="col-sm-12 col-md-3">
                          {$form.CPG.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.CPG.html}
                        </div>
                        <label class="col-sm-12 col-md-3 col-lg-3">
                          {$form.SNP.label}
                        </label>
                        <div class="col-sm-12 col-md-3 col-lg-2">
                          {$form.SNP.html}
                        </div>
                        <label class="col-sm-12 col-md-3">
                          {$form.CNV.label}
                        </label>
                        <div class="col-sm-12 col-md-3 pull-left">
                          {$form.CNV.html}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group col-sm-4">
                <div class="row"><!-- fixed vertical spacing-->
		          <br><br><br><br>
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
                      <input type="submit" name="filter" value="Show data" id="showdata" class="btn btn-sm btn-primary col-xs-12" />
                    </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="col-sm-6 col-xs-12 col-md-5">
                      <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/genomic_browser/?reset=true'"/>
                    </div>
                  </div>
                </div>
              </div><!-- end of show-data buttons/filter block-->
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <table border="0" valign="bottom" width="100%">
    <tr>
      <!-- display pagination links -->
      <td align="left" id="pageLinks"></td>
    </tr>
  </table>
  <div id="datatable"></div>
</div>
<script>

if (document.getElementsByName('Show_Brief_Results')[0].value != "brief") {
    loris.hiddenHeaders = [];
}

{literal}
loris.subprojectList = {};
Array.from(document.getElementsByName('SubprojectID')[0].children).forEach(
    function (o) {
        if (o.value !== "") {
            loris.subprojectList[o.value] = o.label;
        }
    }
);
{/literal}

var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/genomic_browser/?format=json",
    "getFormattedCell" : formatColumn,
    "freezeColumn" : "PSCID"
});
ReactDOM.render(table, document.getElementById("datatable"));
</script>
