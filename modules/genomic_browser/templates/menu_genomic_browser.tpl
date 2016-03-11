<div class="col-sm-12">
  <div class="row">
    <div id="tabs"> 
      <ul class="nav nav-tabs">
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>Profiles</strong></a></li>
        <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/genomic_browser/?submenu=gwas_browser">GWAS</a></li>
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
                          {$form.gender.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.gender.html}
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
                          {$form.Raw_Filesets.label}
                        </label>
                        <div class="col-sm-12 col-md-3 col-lg-2">
                          {$form.Raw_Filesets.html}
                        </div>
                        <label class="col-sm-12 col-md-3">
                          {$form.Cleaned_Filesets.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Cleaned_Filesets.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3 col-lg-3">
                          {$form.SNP_Hits.label} 
                        </label>
                        <div class="col-sm-12 col-md-3 col-lg-2">
                          {$form.SNP_Hits.html}
                        </div>
                        <label class="col-sm-12 col-md-3">
                          {$form.CNV_Hits.label} 
                        </label>
                        <div class="col-sm-12 col-md-3 pull-left">
                          {$form.CNV_Hits.html} 
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
  <div class="row">
  <!-- title table with pagination -->
    <table id="LogEntries" border="0" valign="bottom" width="100%">
      <tr>
      <!-- title -->
        {if {$resultcount} != '' }
          <td class="controlpanelsection">Profiles found: <strong>{$resultcount}</strong> total</td>
                              <a href="{$csvUrl}" download="{$csvFile}_profiles.csv">
                                                    [ Download as CSV ]
                                                                        </a><br>
        {else}
          <td>No results found. </td>
        {/if}
        <!-- display pagination links -->
        {if $resultcount != '' && $resultcount > 25 }
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
            <th><a href="{$baseurl}/genomic_browser/?filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
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
            {if $items[item][piece].name == "DCCID"}
              {assign var="CandID" value=$items[item][piece].value}
              {$CandID}
            {elseif $items[item][piece].DCCID != "" AND $items[item][piece].name == "PSCID"}
              {assign var="PSCID" value=$items[item][piece].value}
               <a href="{$baseurl}/{$items[item][piece].DCCID}/">{$items[item][piece].value}</a>

            {elseif $items[item][piece].value eq ""}
              -
              {* just print a dash if no value available*}
            {elseif $items[item][piece].name eq "Total_Filesets" } 
               <a href="{$baseurl}/genomic_browser/viewGenomicFile/?candID={$CandID}">
                   <b>({$items[item][piece].value})</b> &nbsp;&nbsp;View
                   <span class="glyphicon glyphicon-eye-open"></span>
               </a>
            {elseif $items[item][piece].name eq "Raw_Filesets" } 
               {if $items[item][piece].value neq "1" }
                   <a href="{$baseurl}/genomic_browser/viewGenomicFile/?candID={$CandID}&Category=raw">
                     ({$items[item][piece].value}) View
                     <span class="glyphicon glyphicon-eye-open"></span>
                     View Files
                   </a>
               {else}
                 <a href="{$baseurl}/mri/jiv/get_file.php?file={$items[item][piece].file}">
                   ({$items[item][piece].value}) Download {*$items[item][piece].file*}
                   <span class="glyphicon glyphicon-download-alt"></span>
                 </a>
               {/if}
            {elseif $items[item][piece].name eq "Cleaned_Filesets" } 
               {if $items[item][piece].value neq "1" }
                 <a href="{$baseurl}/genomic_browser/viewGenomicFile/?candID={$CandID}&Category=cleaned">
                   ({$items[item][piece].value}) View
                   <span class="glyphicon glyphicon-eye-open"></span>
                 </a>
               {else}
                   <a href="{$baseurl}/mri/jiv/get_file.php?file={$items[item][piece].file}">
                     ({$items[item][piece].value}) Download {*$items[item][piece].file*}
                     <span class="glyphicon glyphicon-download-alt"></span>
                   </a>
               {/if}

            {elseif $items[item][piece].name eq "SNPs" }
                 <a href="#" class="snp_link" data-pscid="{$PSCID}" >{$items[item][piece].value}</a>
            {elseif $items[item][piece].name eq "CNVs" }
                 <a href="#" class="cnv_link" data-pscid="{$PSCID}" >{$items[item][piece].value}</a>
            {else}
              {$items[item][piece].value}
            {/if}
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
