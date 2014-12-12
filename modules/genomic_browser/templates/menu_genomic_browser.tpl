<div class="col-sm-12">
  <div class="row">
    <div id="tabs"> 
      <ul class="nav nav-tabs">
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>CNV</strong></a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=snp_browser">SNP</a></li>
      </ul>
      <br>
    </div>
  </div>
  <div class="row">
    <div class="tab-content">
      <div class="tab-pane active">
        <form method="post" action="main.php?test_name=genomic_browser">
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
                        <label class="col-sm-12 col-md-2">
        		  {$form.Gene_Symbol.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
        	          {$form.Gene_Symbol.html}
		        </div>
                        <label class="col-sm-12 col-md-2">
        	          {$form.Gene_Name.label}
                        </label>
                        <div class="col-sm-12 col-md-5">
        	          {$form.Gene_Name.html}
		        </div>
		      </div>
	            </div>
	            <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3">
      		          {$form.Chromosome.label}
                        </label>
                        <div class="col-sm-12 col-md-2">
        	          {$form.Chromosome.html}
		        </div>
                        <label class="col-sm-12 col-md-3">
        	          {$form.Platform.label}
                        </label>
                        <div class="col-sm-12 col-md-4">
        	          {$form.Platform.html}
		        </div>
		      </div>
	            </div>
	          </div>
                </div>
              </div> 
            </div> <!-- end of Gene/Demographic filters row-->
            <div class="row">
              <!-- CNV section -->
              <div class="form-group col-sm-8">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilterCNV();">
                    CNV Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-cnv"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-cnv"></span>
                  </div>
                  <div class="panel-body" id="panel-body-cnv">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-1 col-lg-1">
                          {$form.CNV_Type.label}
                        </label>
                    	<div class="col-sm-12 col-md-2 col-lg-2">
                          {$form.CNV_Type.html}
                        </div>
                        <label class="col-sm-12 col-md-3">
		          {$form.Event_Name.label}
                        </label>
                    	<div class="col-sm-12 col-md-2 ">
        		  {$form.Event_Name.html}
			</div>
                        <label class="col-sm-12 col-md-3">
        		  {$form.Characteristics.label}
                        </label>
                    	<div class="col-sm-12 col-md-1">
        		  {$form.Characteristics.html}
			</div>
		      </div>
		    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2 col-lg-1">
        		  {$form.Common_CNV.label}
                        </label>
                    	<div class="col-sm-12 col-md-1 col-lg-2">
        		  {$form.Common_CNV.html}
			</div>
                        <label class="col-sm-12 col-md-3 col-lg-3">
        		  {$form.Copy_Num_Change.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Copy_Num_Change.html}
                        </div>
                        <label class="col-sm-12 col-md-2">
		          {$form.Inheritance.label}
                        </label>
                    	<div class="col-sm-12 col-md-2">
        		  {$form.Inheritance.html}
			</div>
		      </div>
		    </div>
		    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-2">
        	          {$form.CNV_Description.label}
                        </label>
                    	<div class="col-sm-12 col-md-4">
        		  {$form.CNV_Description.html}
			</div>
		      </div>
		    </div>
	          </div>
                </div> 
                <!-- end of CNV section -->
              </div> 
              <div class="form-group col-sm-4">
                <div class="row"><!-- fixed vertical spacing-->
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
                      <input type="submit" name="filter" value="Show data" id="showdata" class="btn btn-sm btn-primary col-xs-12" />
                    </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="col-sm-6 col-xs-12 col-md-5">
                      <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=genomic_browser&reset=true'"/>
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
          <td class="controlpanelsection">Variants found: <strong>{$resultcount}</strong> total</td>
        {else}
          <td>No variants found. </td>
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
            <th><a href="main.php?test_name=genomic_browser&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
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
            {if $items[item][piece].DCCID != "" AND $items[item][piece].name == "PSCID"}
              {assign var="PSCID" value=$items[item][piece].value}
               <a href="main.php?test_name=timepoint_list&candID={$items[item][piece].DCCID}">{$items[item][piece].value}</a>
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
