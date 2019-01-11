<script>
    loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
</script>
<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/">Profiles</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/gwas_browser/">GWAS</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>SNP</strong></a></li>
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
        <form method="post" action="{$baseurl}/genomic_browser/snp_browser/">
          <div class="col-sm-12">
            <div class="row">
              <div class="form-group col-sm-7">
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
              <div class="form-group col-sm-5">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilterGene();">
                    Genomic Range Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-gene"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-gene"></span>
                  </div>
                  <div class="panel-body" id="panel-body-gene">
                    <div class="row">
                      <div class="form-group col-sm-12">
<!--
                        <label class="col-sm-12 col-md-1">
                          {$form.Gene_Symbol.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Gene_Symbol.html}
                        </div>
-->
                        <div class="col-sm-12 col-md-4"></div>
                        <label class="col-sm-12 col-md-2">
                          {$form.Assembly.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Assembly.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-1">
                          {$form.Strand.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.Strand.html}
                        </div>
                        <label class="col-sm-12 col-md-3">
                          {$form.genomic_range.label}
                        </label>
                        <div class="col-sm-12 col-md-6">
                          {$form.genomic_range.html}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!-- end of row: Candidate/Gene filter boxes-->
            <div class="row">
            <!-- SNP section -->
              <div class="form-group col-sm-8">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilterSNP();">
                    SNP Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-snp"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-snp"></span>
                  </div>
                  <div class="panel-body" id="panel-body-snp">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        	          {$form.rsID.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        	          {$form.rsID.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.SNP_Name.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.SNP_Name.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.SNP_Description.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.SNP_Description.html}
			</div>
		      </div>
		    </div>
		    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		  {$form.Allele_A.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Allele_A.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.Function_Prediction.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Function_Prediction.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.SNP_External_Source.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.SNP_External_Source.html}
			</div>
		      </div>
		    </div>
		    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		  {$form.Allele_B.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Allele_B.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.Exonic_Function.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Exonic_Function.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.Damaging.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Damaging.html}
			</div>
		      </div>
		    </div>
		    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		  {$form.Reference_Base.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Reference_Base.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.Genotype_Quality.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Genotype_Quality.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.Platform.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Platform.html}
			</div>
		      </div>
		    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		  {$form.Minor_Allele.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Minor_Allele.html}
			</div>
                        <label class="col-sm-12 col-md-2">
                          {$form.Validated.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.Validated.html}
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
                      <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/genomic_browser/snp_browser/?reset=true'" />
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
    "DataURL" : "{$baseurl}/genomic_browser/snp_browser/?format=json",
    "getFormattedCell" : formatColumn,
});

ReactDOM.render(table, document.getElementById("datatable"));
</script>

