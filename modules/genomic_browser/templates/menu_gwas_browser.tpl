<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/">Profiles</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>GWAS</strong></a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=snp_browser">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=cnv_browser">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=cpg_browser">Methylation</a></li>
      </ul>
      <br>
    </div>
  </div>
  <div class="row">
    <div class="tab-content">
      <div class="tab-pane active">
        <form method="post" action="{$baseurl}/genomic_browser/?submenu=gwas_browser">
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
                      <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/genomic_browser/?submenu=gwas_browser&reset=true'" />
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
  <div class="row">
    <!-- title table with pagination -->
    <table border="0" valign="bottom" width="100%"><tr>
      <!-- title -->
      {if {$resultcount} != '' }
        <td class="controlpanelsection">Results found: <strong>{$resultcount}</strong> total</td>
                            <a href="{$csvUrl}" download="{$csvFile}_GWAS.csv">
                                                  [ Download as CSV ]
                                                                      </a><br><br>
      {else}
        <td>No results found. </td>
      {/if} 
      <!-- display pagination links -->
      {if {$resultcount} != '' && $resultcount > 25}  
        <td align="right">Pages:&nbsp;&nbsp;&nbsp; {$page_links}</td>
      {/if}
    </tr>
    </table>
<!-- start data table -->
    <table  class ="dynamictable table table-hover table-primary table-bordered" border="0" width="100%">
      <thead>
        <tr class="info">
          <th>No.</th>
          <!-- print out column headings - quick & dirty hack -->
          {section name=header loop=$headers}
            <th>
               <a href="{$baseurl}/genomic_browser/?submenu=gwas_browser&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">
                   {if $headers[header].displayName == "P Value"}
                       P-value Trend
                   {else}
                       {$headers[header].displayName}
                   {/if}
               </a>
            </th>
          {/section}
        </tr>
      </thead>
      <tbody>
        {section name=item loop=$items}
          <tr>
        <!-- print out data rows -->
          {section name=piece loop=$items[item]}
            {if $items[item][piece].bgcolor != ''}
              <td style="background-color:{$items[item][piece].bgcolor}">
            {else}
              <td>
            {/if}
            {if $items[item][piece].SNP_ID != "" AND $items[item][piece].name == "SNP_ID"}
              {assign var="SNP_ID" value=$items[item][piece].value}
              <a href="{$baseurl}/genomic_browser/?submenu=snp_browser&rsID={$items[item][piece].SNP_ID}">{$items[item][piece].value}</a>
            {elseif $items[item][piece].name == "Chromosome"}
              {assign var="chromValue" value=$items[item][piece].value}
              {$chromValue} 
            {elseif $items[item][piece].name == "Position_BP"}
              {assign var="startLocValue" value=$items[item][piece].value}
              <a href="https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=chr{$chromValue}%3A{$startLocValue}-{$startLocValue}" target="_blank">{$startLocValue}</a>
            {else}
              {$items[item][piece].value}
            {/if }
            </td>
          {/section}
        </tr>
        {/section}
      </tbody>
      <!-- end data table -->
    </table>
  </div>
</div>
<br>
