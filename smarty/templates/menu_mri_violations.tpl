<form method="post" action="main.php?test_name=mri_violations">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan=4>Selection Filter</th>
    </tr>
    
    <tr>
      <td nowrap="nowrap">{$form.PatientName.label}</td>
      <td nowrap="nowrap">{$form.PatientName.html}</td>
      <td nowrap="nowrap">{$form.TimeRun.label}</td>
      <td nowrap="nowrap">{$form.TimeRun.html}</td>
   </tr>
   
   <tr>
      <td nowrap="nowrap">{$form.Filename.label}</td>
      <td nowrap="nowrap">{$form.Filename.html}</td>
      <td nowrap="nowrap">{$form.ProblemType.label}</td>
      <td nowrap="nowrap">{$form.ProblemType.html}</td>
   </tr>
   <tr>
      <td nowrap="nowrap">{$form.Description.label}</td>
      <td nowrap="nowrap">{$form.Description.html}</td>
   </tr>
   
    <tr>
        <td>Actions:</td>
        <td>&nbsp;</td>
        <td colspan="2" align="center"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=mri_violations&reset=true'"/></td>
    </tr>
<table>
</form>


</div> 

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection"></td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<table  class ="fancytable" border="0" width="100%" class="listColorCoded">
<tr>
 <th nowrap="nowrap">No.</th>
    {section name=header loop=$headers}
        <th nowrap="nowrap"><a href="main.php?test_name=mri_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>
{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
        {if $items[item][piece].value eq 'Could not identify scan type'}
    
       	<td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}"> 
	  		<a href="main.php?test_name=mri_protocol_violations&PatientName={$items[item].PatientName}">{$items[item][piece].value}</a>
        </td>
        {elseif $items[item][piece].value eq 'Protocol Violation'}
       	<td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
            <a href="main.php?test_name=mri_protocol_check_violations&PatientName={$items[item].PatientName}">{$items[item][piece].value}</a>
        </td>
        {else}
       	<td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
            {$items[item][piece].value}
        </td>
        {/if}
    {/section}
    </tr>           
{sectionelse}

	<tr><td colspan="12">No data found</td></tr>
{/section}
                    
<!-- end data table -->
</table>
