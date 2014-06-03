
<form method="post" action="main.php?test_name=mri_protocol_violations">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan=4>Selection Filter</th>
    </tr>
    
    <tr>
      <td nowrap="nowrap">{$form.CandID.label}</td>
      <td nowrap="nowrap">{$form.CandID.html}</td>
   </tr>
   
   <tr>
      <td nowrap="nowrap">{$form.PSCID.label}</td>
      <td nowrap="nowrap">{$form.PSCID.html}</td>
   </tr>
   
   <tr>
      <td nowrap="nowrap">{$form.PatientName.label}</td>
      <td nowrap="nowrap">{$form.PatientName.html}</td>
   </tr>
   
   <tr>
      <td nowrap="nowrap">{$form.SeriesUID.label}</td>
      <td nowrap="nowrap">{$form.SeriesUID.html}</td>
   </tr>
   <tr>
      <td nowrap="nowrap">{$form.SeriesDescription.label}</td>
      <td nowrap="nowrap">{$form.SeriesDescription.html}</td>
   </tr>
   <tr>
      <td nowrap="nowrap">{$form.TimeRun.label}</td>
      <td nowrap="nowrap">{$form.TimeRun.html}</td>
   </tr>

    <tr>
    <tr>
    
        <td>Actions:</td>
        <td>&nbsp;</td>
        <td colspan="2" align="center"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=mri_protocol_violations&reset=true'"/></td>
    </tr>
<table>
</form>


<!-- Mri- protocol table  -->
<div id='hide' style="font-weight: bold" class="toggle_mri_tbl">
	-Hide mri-protocol Table
</div> 

<div id='show' style="font-weight: bold" class="toggle_mri_tbl">
	+Show mri-protocol Table
</div> 

<table class ="fancytable" id="tbl" border="0" width="100%" class="listColorCoded">
	<tr>
	{assign var=count value=0}
	{foreach from=$mri_protocol_header item=mp}
		    <th id="header_{$count}">
		       {$mp}
		    </th>
	  	   {assign var=count value=$count+1}
	{/foreach}
	</tr>

	{foreach from=$mri_protocol_data item=mp}
		{assign var=ccount value=0}
		
		  <tr>
			  {foreach from=$mp item=row}
				  {if $violated_scans_modifications}
					   <td id="row_{$mp.ID}_td_{$ccount}" class='description' contenteditable = "true">
				  {else}
					   <td id="row_{$mp.ID}_td_{$ccount}" class='description'>
				  {/if}  
  			      		{$row}
				  		{$k}
	                   </td>
				  {assign var=ccount value=$ccount+1}
			  {/foreach}
		  </tr>
	{/foreach}
</table>
<br>
<br>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<table  class ="fancytable" border="0" width="100%" class="listColorCoded">
<tr>
 <th nowrap="nowrap">No.</th>
    {section name=header loop=$headers}
        <th nowrap="nowrap"><a href="main.php?test_name=mri_protocol_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>                
    {/section}
</tr>
{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    
       	<td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}"> 
	  		{$items[item][piece].value}
		</td>

    {/section}
    </tr>           
{sectionelse}

	<tr><td colspan="12">No data found</td></tr>
{/section}
                    
<!-- end data table -->
</table>
