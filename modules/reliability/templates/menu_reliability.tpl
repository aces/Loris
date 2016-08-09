<div class="row">
<div class="col-sm-8">
    <div class="panel panel-primary">
        <div class="panel-heading" id="swap" onclick="hideFilter();">
            Selection Filter  
            <label id="advanced-label" style="display:none">(Advanced Options)</label>
            <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
        </div>
        <div class="panel-body" id="panel-body">
            <form method="post" action="{$baseurl}/reliability/">
            <!-- start the selection table -->
                {if $form.error}
                <div class="error">{$form.error.label}</div>
                {/if}
                {if $form.message}
                <div class="error">{$form.message.label}</div>
                {/if}
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">Subproject:</label>{* Changin this to {$form.CommentID.label} changes the label *}
                        <div class="col-sm-12 col-md-8">{$form.SubprojectID.html}</div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.DCCID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.DCCID.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                    <!-- {* <td>Objective:</td>
                        <td>{$form.Objective.html}</td> *} -->
                        <label class="col-sm-12 col-md-4">{$form.CenterID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.CenterID.html}</div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.PSCID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.PSCID.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.Instrument.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Instrument.html}</div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.reliability_center_id.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.reliability_center_id.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.Gender.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Gender.html}</div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.Visit_label.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Visit_label.html}</div>
                    </div>
                </div>    
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4 label-control">{$form.Invalid.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Invalid.html}</div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.ProjectID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.ProjectID.html}</div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-4 col-md-3 col-xs-12 col-md-offset-5 col-sm-offset-4">
                        <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                    </div>

                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    
                    <div class="col-sm-4 col-md-3 col-xs-12">
                        <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/reliability/?reset=true'" />
                    </div>
                </div> 
            </form>
        </div>
    </div>
</div>    



{if $reliability_swap_candidates}
    <div class="col-sm-4">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideSwap();">
                Swap Candidates
                <span class="glyphicon glyphicon-chevron-down pull-right" id="swapDown"></span>
                <span class="glyphicon glyphicon-chevron-up pull-right" style="display:none" id="swapUp"></span>
            </div>
            <div class="panel-body" style="display:none" id="swap-body">
                <form method="post" action="{$baseurl}/reliability/">
                    <input type="hidden" name="swap" value="swap"/>
                    <h5>Original Candidate</h5>
                    <div class="row">
                        <label class="col-sm-12 col-md-4">{$form.Cand1PSCID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Cand1PSCID.html}</div>
                    </div>
                    <br>
                    <div class="row">
                        <label class="col-sm-12 col-md-4">{$form.Cand1Visit_label.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Cand1Visit_label.html}</div>
                    </div>
                    <h5>Replacement Candidate</h5>
                    <div class="row">
                        <label class="col-sm-12 col-md-4">{$form.Cand2PSCID.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Cand2PSCID.html}</div>
                    </div>
                    <br>
                    <div class="row">
                        <label class="col-sm-12 col-md-4">{$form.Cand2Visit_label.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Cand2Visit_label.html}</div>
                    </div>
                    <br>
                    <div class="row">
                        <label class="col-sm-12 col-md-4">{$form.SwapInstrument.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.SwapInstrument.html}</div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="visible-xs visible-sm col-xs-12"> </div>
                        <div class="visible-xs visible-sm col-xs-12"> </div>
                        <div class="visible-xs visible-sm col-xs-12"> </div>
                        <div class="visible-xs visible-sm col-xs-12"> </div>
                        <div class="col-md-6 col-xs-12 col-md-offset-6">
                            <input type="submit" name="swap" value="Swap Candidates" class="btn btn-sm btn-primary col-xs-12" />
                        </div>
                    </div>
                </form>
            </div>
        </div>   
</div>
{/if}
{if $EARLI_Reliability}
<form method="post" action="{$baseurl}/reliability/">
    <table border="0" valign="top" class="hideable" id="addcandidate">
    <thead>
    <tr>
        <th colspan="4" class="button">Add EARLI Candidate</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>{$form.AddPSCID.label}</td>
        <td>{$form.AddPSCID.html}</td>
        <td>{$form.AddVisit_label.label}</td>
        <td>{$form.AddVisit_label.html}</td>
    </tr>
    <tr>
        <td>{$form.AddInstrument.label}</td>
        <td>{$form.AddInstrument.html}</td>
        <td>{$form.AddReliabilityCenter.label}</td>
        <td>{$form.AddReliabilityCenter.html}</td>
    </tr>
    <tr>
        <td colspan="4" align="right"><input type="submit" name="swap" value="Add Candidate" class="button" /></td>
    </tr>
    </tbody>
    </table>
</form>
{/if}
</div>
<!-- <h2><font color="red">Note: Phase 2 reliability forms are unavailable at the moment as the system is being upgraded.</font></h2> -->

<!--  title table with pagination -->
<table id="LogEntries" border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of candidates flagged for reliability</td>

    <!-- display pagination links -->
    <td align="right" id="pageLinks"></td>
</tr>
</table>

<!-- start data table -->
    <table border="0" width="100%" class ="table table-hover table-primary table-bordered dynamictable">
        <thead>
            <tr class="info">
             <th>No.</th>
                <!-- print out column headings - quick & dirty hack -->
                {section name=header loop=$headers}
                    <th>
                      {if $headers[header].displayName != "Reliable"}
                        <a href="{$baseurl}/reliability/?filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">
                          {if $headers[header].displayName == "Reliability Center Id"}
                            Site of Reliability Test
                          {else}
                            {$headers[header].displayName}
                          {/if}
                        </a>
                      {else}
                        {$headers[header].displayName}
                      {/if}
                    </th>
                {/section}
            </tr>
        </thead>

    {section name=item loop=$items}
        <tr>
        <!-- print out data rows -->
        {section name=piece loop=$items[item]}
        

    	{if $items[item][piece].name == "PSCID"}
    	   <td>
    	   {if $items[item][piece].Current_stage == 'Recycling Bin'}
            {$items[item][piece].value} <font color="red">(Recycling Bin)</font>
         {elseif $items[item][piece].invalid == "yes"}
            {$items[item][piece].value} <font color="red">(Invalid)</font>
         {else}     
              <a href="{$baseurl}/main.php?test_name={$items[item][piece].Instrument}_reliability&subtest={$items[item][piece].Instrument}_reliability&identifier={$items[item][piece].CommentID}&reliability_center_id={$items[item][piece].SiteID}">{$items[item][piece].value}</a> 
           {/if}
            {if $items[item][piece].manual == "yes"}
                <font color="red">(Manual)</font>
            {/if}
          </td>
    	{elseif  $items[item][piece].name == "Cohort"}
    	      <td>
      	    {if $items[item][piece].value== "1"}
          					6 month
          	{elseif $items[item][piece].value== "2"}
          					12 month
          	{elseif $items[item][piece].value== "3"}
          					Control
          		{/if}</td>
      	{elseif  $items[item][piece].name == "Reliability"}
      	  {if $items[item][piece].value== "Yes"}
      	  <td style="background-color:#86BC78;">{$items[item][piece].value}</td>
      	  {elseif $items[item][piece].value== "No"}
      	  <td style="background-color:#C43120;color:white">{$items[item][piece].value}</td>
      	  {else}
      	  <td></td>
      	  {/if}
    	  {else}
    	     <td>{$items[item][piece].value}</td>
        {/if}
       </td>
        {/section}
        </tr>           
    {sectionelse}
        <tr><td colspan="15">No reliability entries found</td></tr>
    {/section}
                        
    <!-- end data table -->
    </table>

<script>
var pageLinks = RPaginationLinks(
{
    RowsPerPage : {$rowsPerPage},
    Total: {$TotalItems},
    onChangePage: function(pageNum) {
        location.href="{$baseurl}/reliability/?filter[order][field]={$filterfield}&filter[order][fieldOrder]={$filterfieldOrder}&pageID=" + pageNum
    },
    Active: {$pageID}
});
React.render(pageLinks, document.getElementById("pageLinks"));
</script>

