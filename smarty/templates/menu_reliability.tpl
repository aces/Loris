{* This is a hack. It should be in a separate javascript library file *}
{* Used to make the swap candidate table expand/collapse onclick *}
{literal}

<script language="javascript" type="text/javascript">
$(document).ready(function() {
    function _swapWrapper() {
        return toggleTable('swapcandidates');
    }
    function _addWrapper() {
        return toggleTable('addcandidate');
    }
    function toggleTable(table) {
        if(table) {
            t = $('table#' + table);
            body = t.children('tbody');
            body.toggle();
            if(body.css("display") == 'none') {
                t.css("border", "none");
            } else {
                t.css("border", "2px solid #08245B");
            }
        }
    }

    $('table#swapcandidates th').click(_swapWrapper);
    $('table#addcandidate th').click(_addWrapper);
    // Hide the tab by default
    toggleTable('swapcandidates');
    toggleTable('addcandidate');
});
</script>
{/literal}
<form method="post" action="main.php?test_name=reliability">
<!-- start the selection table -->
{if $form.error}
<div class="error">{$form.error.label}</div>
{/if}
{if $form.message}
<div class="error">{$form.message.label}</div>
{/if}
<table border="0" valign="top" class="std" width="33%" style="float:left; margin-top: 10px; margin-right: 110px;">
    <tr>
        <th nowrap="nowrap" colspan="4">Selection Filter</th>
    </tr>
    <tr>
	<td colspan = 4>
	<table border="0">
<tr>
{* OBJECTIVE IS NIHPD SPECIFIC - BUT WE ARE TOO LAZY TO CHANGE THIS TODAY *}
	<td nowrap="nowrap">Subproject:</td>
	<td nowrap="nowrap" class="MenuWidth">{$form.CommentID.html}</td>
    <td nowrap="nowrap">DCCID:</td>
    <td nowrap="nowrap">{$form.DCCID.html}</td>
</tr>
    <tr>
	{* <td nowrap="nowrap">Objective:</td>
        <td nowrap="nowrap">{$form.Objective.html}</td> *}
        <td nowrap="nowrap">{$form.CenterID.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.CenterID.html}</td>
        <td nowrap="nowrap">PSCID:</td>
        <td nowrap="nowrap">{$form.PSCID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Instrument.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.Instrument.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.reliability_center_id.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.reliability_center_id.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.ProjectID.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.ProjectID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Gender:</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.Gender.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Visit label:</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.Visit_label.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Invalid.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.Invalid.html}</td>
 </tr>
    <tr>
        <td colspan="12" align="right"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=reliability&reset=true'" /></td>
 	  </tr>

</table>
</td>
  <tr>
<!--        <td nowrap="nowrap"><input type="button" name="button" value="Add Instrument" class="button" onclick="location.href='main.php?test_name=csbs_reliability&subtest=csbs_reliability'"/></td> -->
    </tr>
</table>
</form>

{if $reliability_swap_candidates}
<form method="post" action="main.php?test_name=reliability">
    <input type="hidden" name="swap" value="swap"/>
    <table border="0" valign="top" class="hideable" id="swapcandidates">
    <thead>
    <tr>
        <th colspan="4" class="button" style="margin-top: 5px;">Swap Candidates</th>
    </tr>
    </thead>
    <tbody>
    <tr colspan="4">
        <td>Original Candidate</td>
    </tr>
    <tr>
        <td>{$form.Cand1PSCID.label}</td>
        <td>{$form.Cand1PSCID.html}</td>
        <td>{$form.Cand1Visit_label.label}</td>
        <td>{$form.Cand1Visit_label.html}</td>
    </tr>
    <tr colspan="4">
        <td>Replacement Candidate</td>
    </tr>
    <tr>
        <td>{$form.Cand2PSCID.label}</td>
        <td>{$form.Cand2PSCID.html}</td>
        <td>{$form.Cand2Visit_label.label}</td>
        <td>{$form.Cand2Visit_label.html}</td>
    </tr>
    <tr>
        <td>{$form.SwapInstrument.label}</td>
        <td colspan="3">{$form.SwapInstrument.html}</td>
    </tr>
    <tr>
        <td colspan="4" align="right"><input type="submit" name="swap" value="Swap Candidates" class="button" /></td>
    </tr>
    </tbody>
    </table>
</form>
{/if}
{if $EARLI_Reliability}
<form method="post" action="main.php?test_name=reliability">
    <table border="0" valign="top" class="hideable" id="addcandidate">
    <thead>
    <tr>
        <th colspan="4" class="button">Add EARLI Candidate</th>
    </tr>
    </thead>
    <tbody>
    <!--tr colspan="4">
        <td>Candidate</td>
    </tr-->
    <tr>
        <td>{$form.AddPSCID.label}</td>
        <td>{$form.AddPSCID.html}</td>
        <td>{$form.AddVisit_label.label}</td>
        <td>{$form.AddVisit_label.html}</td>
    </tr>
    <!--tr colspan="4">
        <td>Instrument</td>
    </tr-->
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
<!-- <h2><font color="red">Note: Phase 2 reliability forms are unavailable at the moment as the system is being upgraded.</font></h2> -->

<!--  title table with pagination -->
<table id="LogEntries" border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Log Entries</td>

    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<table border="0" width="100%" class="fancytable">
<tr>
 <th nowrap="nowrap">No.</th>
    <!-- print out column headings - quick & dirty hack -->
    {section name=header loop=$headers}
        <th nowrap="nowrap">
          {if $headers[header].displayName != "Reliable"}
            <a href="main.php?test_name=reliability&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">
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

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    

	{if $items[item][piece].name == "PSCID"}
	   <td nowrap="nowrap">
	   {if $items[item][piece].Current_stage == 'Recycling Bin'}
        {$items[item][piece].value} <font color="red">(Recycling Bin)</font>
     {elseif $items[item][piece].invalid == "yes"}
        {$items[item][piece].value} <font color="red">(Invalid)</font>
     {else}     
          <a href="main.php?test_name={$items[item][piece].Instrument}_reliability&subtest={$items[item][piece].Instrument}_reliability&identifier={$items[item][piece].CommentID}&reliability_center_id={$items[item][piece].SiteID}">{$items[item][piece].value}</a> 
       {/if}
        {if $items[item][piece].manual == "yes"}
            <font color="red">(Manual)</font>
        {/if}
      </td>
	{elseif  $items[item][piece].name == "Cohort"}
	      <td nowrap="nowrap">
  	    {if $items[item][piece].value== "1"}
      					6 month
      	{elseif $items[item][piece].value== "2"}
      					12 month
      	{elseif $items[item][piece].value== "3"}
      					Control
      		{/if}</td>
  	{elseif  $items[item][piece].name == "Reliability"}
  	  {if $items[item][piece].value== "Yes"}
  	  <td nowrap="nowrap" style="background-color:#55FF55;">{$items[item][piece].value}</td>
  	  {elseif $items[item][piece].value== "No"}
  	  <td nowrap="nowrap" style="background-color:#FF2222;color:white">{$items[item][piece].value}</td>
  	  {else}
  	  <td nowrap="nowrap"></td>
  	  {/if}
	  {else}
	     <td nowrap="nowrap">{$items[item][piece].value}</td>
    {/if}
   </td>
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="15">No reliability entries found</td></tr>
{/section}
                    
<!-- end data table -->
</table>

