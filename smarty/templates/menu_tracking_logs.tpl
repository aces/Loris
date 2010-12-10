<form method="post" action="main.php?test_name=tracking_logs">
<!-- start the selection table -->
<table border="0" valign="top" class="std" width="75%">
    <tr>
        <th nowrap="nowrap" colspan="15">Selection Filter</th>
    </tr>
    <tr>
		<td colspan = 15>
	<table border="0">
<tr>
{* OBJECTIVE IS NIHPD SPECIFIC - BUT WE ARE TOO LAZY TO CHANGE THIS TODAY *}
		  <td nowrap="nowrap">Objective:</td>
        <td nowrap="nowrap">{$form.Objective.html}</td>
        <td nowrap="nowrap">Site:</td>
        <td nowrap="nowrap">{$form.CenterID.html}</td>
        <td nowrap="nowrap">DCCID:</td>
        <td nowrap="nowrap">{$form.DCCID.html}</td>
        <td nowrap="nowrap">PSCID:</td>
        <td nowrap="nowrap">{$form.PSCID.html}</td>
 		  <td nowrap="nowrap">Gender:</td>
        <td nowrap="nowrap">{$form.Gender.html}</td>
        <td nowrap="nowrap">Visit label:</td>
        <td nowrap="nowrap">{$form.Visit_label.html}</td>
	  	  <td nowrap="nowrap" align="right">Locked Record:</td>
		  <td nowrap="nowrap">{$form.Lock_record.html}</td>
</tr>
</table>
</td>
   </tr>
	<tr>  
	 <td colspan = 15 nowrap="nowrap"><b>Scans Done:</b></td>
	 </tr>
 
		<tr>
	<td colspan=14>
	<table border="0" width="100%">
		<tr>
	    <td align="right" nowrap="nowrap">aMRI:</td>
       <td nowrap="nowrap">{$form.aMRI.html}</td>
		 <td align="right" nowrap="nowrap">Relaxomtery:</td>
       <td nowrap="nowrap">{$form.Relaxometry.html}</td>
		 <td align="right" nowrap="nowrap">DTI:</td>
       <td nowrap="nowrap">{$form.DTI.html}</td>
 		 <td align="right" nowrap="nowrap">2nd DC:</td>
		 <td nowrap="nowrap">{$form.Second_DC.html}</td>
 	  	 <td align="right" nowrap="nowrap" align="right">MRS:</td>
		 <td nowrap="nowrap">{$form.MRS.html}</td>
		 <td align="right" nowrap="nowrap" align="right">MRSI:</td>
		 <td nowrap="nowrap">{$form.MRSI.html}</td>
 	  	 <td align="right" nowrap="nowrap" align="right">eDTI:</td>
		 <td nowrap="nowrap">{$form.eDTI.html}</td>
  	 	</tr>
</table>
</td>	


 	 </tr>

    <tr>
        <td nowrap="nowrap" width='10%'>Actions:</td>
        <td nowrap="nowrap"><input type="button" name="button" value="Add Visit" class="button" onclick="location.href='main.php?test_name=tracking_logs&subtest=tracking_logs'" /></td>
        <td colspan="14" align="right"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=tracking_logs&reset=true'" /></td>
    </tr>
</table>
</form>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Log Entries</td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<table border="0" width="100%" class="listColorCoded">
<tr>
 <th nowrap="nowrap">No.</th>
    <!-- print out column headings - quick & dirty hack -->
    {section name=header loop=$headers}
        <th nowrap="nowrap"><a href="main.php?test_name=tracking_logs&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    <td nowrap="nowrap">
		{if $items[item][piece].name == "Visit_label"}
			<a href="main.php?test_name=tracking_logs&subtest=tracking_logs&identifier={$items[item][piece].Tracking_log_ID}">{$items[item][piece].value}</a>
	
		 {elseif  $items[item][piece].name == "aMRI"		
			||	$items[item][piece].name == "Relaxometry"				
			|| $items[item][piece].name == "DTI"
			|| $items[item][piece].name == "Second_DC"
			|| $items[item][piece].name == "MRS"
			|| $items[item][piece].name == "MRSI"
			|| $items[item][piece].name == "eDTI"
			|| $items[item][piece].name == "Lock_record"
			}
				{if $items[item][piece].value=="Yes"} 
					<img src="images/check_blue.gif" border="0" />
				{elseif $items[item][piece].value== "NA"}
					N/A
				{elseif $items[item][piece].value=="No"}
					<img src="images/delete.gif" border="0" />
				{elseif $items[item][piece].value=="Locked"}
					<img src="images/locked.jpeg" border="0" />
				{elseif $items[item][piece].value=="Unlocked"}
					<img src="images/unlocked.jpeg" border="0" />
				{/if}
	     {else}
	        {$items[item][piece].value}
 
    {/if}
   </td>
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="15">No tracking log entries found</td></tr>
{/section}
                    
<!-- end data table -->
</table>

