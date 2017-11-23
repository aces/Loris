<script>
    loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
</script>
<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/">Profiles</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>GWAS</strong></a></li>
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
        <form method="post" action="{$baseurl}/genomic_browser/gwas_browser/">
          <div class="col-sm-12">
            <div class="row">
            <!-- GWAS section -->
              <div class="form-group col-sm-8">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilterGWAS();">
                    GWAS Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-gwas"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-gwas"></span>
                  </div>
                  <div class="panel-body" id="panel-body-gwas">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		      {$form.Chromosome.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.Chromosome.html}
			            </div>
                        <label class="col-sm-12 col-md-2">
        	          {$form.SNP_ID.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        	          {$form.SNP_ID.html}
			            </div>
                        <label class="col-sm-12 col-md-2">
        		      {$form.Major_Allele.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.Major_Allele.html}
			            </div>
		              </div>
		            </div>
		            <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		      {$form.BP_Position.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.BP_Position.html}
			            </div>
                        <label class="col-sm-12 col-md-2">
        		      {$form.MAF.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.MAF.html}
			            </div>
                        <label class="col-sm-12 col-md-2">
        		      {$form.Minor_Allele.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.Minor_Allele.html}
			            </div>
		              </div>
		            </div>
		            <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		      {$form.Pvalue.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.Pvalue.html}
			            </div>
                        <label class="col-sm-12 col-md-2">
        		      {$form.Estimate.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.Estimate.html}
			            </div>
                        <label class="col-sm-12 col-md-2">
        		      {$form.StdErr.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		      {$form.StdErr.html}
			            </div>
		              </div>
		            </div>
		          </div>
                </div> <!--end of SNP filters panel-->
              </div>
              <div class="form-group col-sm-4">
                <div class="row"><!--fixed vertical space-->
                  <br><br><br><br><br><br>
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
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="col-sm-6 col-xs-12 col-md-5">
                      <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/genomic_browser/gwas_browser/?reset=true'" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div> <!-- end row containing all filters-->
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

var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/genomic_browser/gwas_browser/?format=json",
    "getFormattedCell" : formatColumn,
});

ReactDOM.render(table, document.getElementById("datatable"));
</script>

