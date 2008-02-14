{literal}
<script>
function checkAccessProfileForm(){
   var form = document.accessProfileForm;
   if(form.candID.value == ""){
      alert("You must enter a DCC-ID");
      form.candID.focus();
      return false;
   } else if (form.PSCID.value == ""){
      alert("You must enter a PSCID");
      form.PSCID.focus();
      return false;
   }
   return true;
}
</script>
{/literal}

<form name="accessProfileForm" method="get" action="main.php" onSubmit="return checkAccessProfileForm();">
<input type="hidden" name="test_name" value="timepoint_list">
<table border="0" cellpadding="2" cellspacing="2">
    <tr>
        <th align="right">DCC-ID:</th>
    	<td><input tabindex="1" size="10" maxlength="10" type=text name="candID"></td>
    	<th align="right">PSC-ID:</th>
    	<td><input tabindex="2" size="12" maxlength="12" type=text name="PSCID"></td>
    	<td><input tabindex="3" rowspan="2" type="submit" value="Open Profile" class="button"></td>
    </tr>
</table>
</form>

<form method="post" action="main.php?test_name=candidate_list">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan=6>Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">Site:</td>
        <td nowrap="nowrap">{$form.centerID.html}</td>
        <td nowrap="nowrap">DCC-ID:</td>
        <td nowrap="nowrap">{$form.DCCID.html}</td>
        <td nowrap="nowrap">PSC-ID:</td>
        <td nowrap="nowrap">{$form.PSCID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Gender:</td>
        <td nowrap="nowrap">{$form.gender.html}</td>
        <td nowrap="nowrap">Subproject:</td>
        <td nowrap="nowrap">{$form.SubprojectID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Date of Birth:</td>
        <td nowrap="nowrap">{$form.dob.html}</td>
        {if $useEDC=="true"}
	        <td nowrap="nowrap">EDC:</td>
	        <td nowrap="nowrap">{$form.edc.html}</td>
        {/if}
        <td colspan="2" align="center"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=candidate_list&reset=true'" /></td>
    </tr>
<table>
</form>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Profiles</td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<table  class ="fancytable" border="0" width="100%" class="listColorCoded">
<tr>
 <th nowrap="nowrap">No.</th>
    <!-- print out column headings - quick & dirty hack -->
    {section name=header loop=$headers}
        <th nowrap="nowrap"><a href="main.php?test_name=candidate_list&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
        <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
		{if $items[item][piece].DCCID != "" AND $items[item][piece].name == "PSCID"}
		    <a href="main.php?test_name=timepoint_list&candID={$items[item][piece].DCCID}">{$items[item][piece].value}</a>
        {else}
            {$items[item][piece].value}
        {/if}
		</td>
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="12">No candidates found</td></tr>
{/section}
                    
<!-- end data table -->
</table>

