<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="/genomic_browser/">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="/genomic_browser/?submenu=snp_browser">SNP</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>CpG</strong></a></li>
      </ul>
      <br>
    </div>
  </div>
  <div class="row">
    <div class="tab-content">
      <div class="tab-pane active">
        <form method="post" action="/genomic_browser/?submenu=cpg_browser">
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
                        <label class="col-sm-12 col-md-1 col-lg-1" data-toggle="tooltip" title="Collecting sites of the candidates">
                          {$form.centerID.label}
                        </label>
                        <div class="col-sm-12 col-md-3 col-lg-3">
                          {$form.centerID.html}
                        </div>
                        <label class="col-sm-12 col-md-2">
                          {$form.SubprojectID.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.SubprojectID.html}
                        </div>
                        <label class="col-sm-12 col-md-2">
                          {$form.DCCID.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.DCCID.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
                          {$form.gender.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.gender.html}
                        </div>
                        <label class="col-sm-15 col-md-2">
                          {$form.dob.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.dob.html}
                        </div>
                        <label class="col-sm-12 col-md-2">
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
                    Gene Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-gene"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-gene"></span>
                  </div>
                  <div class="panel-body" id="panel-body-gene">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="HUGO Gene Nomenclature Committee ID ex: PINK1">
                          {$form.Gene.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.Gene.html}
                        </div>
                        <label class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="Genome Reference Consortium ID">
                          {$form.Assembly.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.Assembly.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="Chromosome number or symbole">
                          {$form.Chromosome.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.Chromosome.html}
                        </div>
                        <label class="col-sm-12 col-md-2">
                          {$form.Strand.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
                          {$form.Strand.html}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!-- end of row: Candidate/Gene filter boxes-->
            <div class="row">
            <!-- CpG section -->
              <div class="form-group col-sm-8">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilterCpG();">
                    CpG Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-cpg"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-cpg"></span>
                  </div>
                  <div class="panel-body" id="panel-body-cpg">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="HAIB Methyl450 item ID ex: cg12045430">
        		  {$form.CpG.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.CpG.html}
			</div>
                        <label style="" class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="High-methylation : beta-value > 0.6
Partially methylated : 0.2 < beta-value <= 0.6
Low-methylation : beta-value <= 0.2">
        		  {$form.Methylation.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Methylation.html}
			</div>
                        <label class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="Relation to UCSC CpG island">
        		  {$form.Context.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Context.html}
			</div>
		      </div>
		    </div>
		    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        		  {$form.Tissue.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Tissue.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.Date_collected.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Date_collected.html}
			</div>
                        <label class="col-sm-12 col-md-2">
        		  {$form.Beta_value.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Beta_value.html}
			</div>
		      </div>
		    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
                          {$form.Platform.label}
                        </label>
                        <div class="col-sm-12 col-md-4">
                          {$form.Platform.html}
                        </div>
                      </div>
                    </div>
	          </div> 
                </div> <!--end of CpG filters panel-->
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
                      <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='/genomic_browser/?submenu=cpg_browser&reset=true'" />
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
          <a href="{$csvUrl}" download="{$csvFile}.csv">Download all fields as CSV</a>
      {else}
        <td>No variants found. </td>
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
            <th><a href="/genomic_browser/?submenu=cpg_browser&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
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
            {elseif $items[item][piece].name == "Date_of_Birth" OR $items[item][piece].name == "Date_Collected"}
              <td style="white-space: nowrap">
            {else}
              <td>
            {/if}
            {if $items[item][piece].DCCID != "" AND $items[item][piece].name == "PSCID"}
              {assign var="PSCID" value=$items[item][piece].value}
              <a href="/{$items[item][piece].DCCID}/">{$items[item][piece].value}</a>
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
