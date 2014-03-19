{literal}
<script src="js/jquery/jquery-1.10.4.min.js" type="text/javascript"></script>

<script type="text/javascript" src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script>
<script type="text/javascript" src="js/advancedMenu.js">
</script>
<script language="javascript" type="text/javascript">

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

$(function(){
		$('input[name=dob]').datepicker({
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true
		});
});
</script>
{/literal}

<form method="post" action="main.php?test_name=candidate_list">
<table style="width:550px; float:left; margin-bottom:10px" border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan=6>Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.centerID.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.centerID.html}</td>
        <td nowrap="nowrap">{$form.DCCID.label}</td>
        <td nowrap="nowrap">{$form.DCCID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.SubprojectID.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.SubprojectID.html}</td>
        <td nowrap="nowrap">{$form.PSCID.label}</td>
        <td nowrap="nowrap" colspan="1">{$form.PSCID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.ProjectID.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.ProjectID.html}</td>
        <td colspan="2" style="display:table-cell" align="right" class="selector" nowrap="nowrap" id="basicSelector"><input type="submit" name="filter" value="Show Data" class="button" />
       <input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=candidate_list&reset=true'" />
        <input type="button" name="advanced" value="Advanced" class="button" onclick="toggleMe()"/></td>
</tr>

    </tr>
    <tr name="advancedOptions" style="display:none" class="advancedOptions">
        <th colspan="6" nowrap="nowrap">Advanced Options</th>
    </tr>
    <tr name="advancedOptions" style="display:none" class="advancedOptions">
        <td nowrap="nowrap">{$form.Participant_Status.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.Participant_Status.html}</td>
        <td nowrap="nowrap">{$form.dob.label}</td>
        <td nowrap="nowrap">{$form.dob.html}</td>
    </tr>
    <tr name="advancedOptions" style="display:none" class="advancedOptions">
        <td nowrap="nowrap">{$form.gender.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.gender.html}</td>
        <td nowrap="nowrap">{$form.Visit_Count.label}</td>
        <td nowrap="nowrap">{$form.Visit_Count.html}</td>
    </tr>
    <tr name="advancedOptions" style="display:none" class="advancedOptions">
        <td nowrap="nowrap">{$form.Latest_Visit_Status.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.Latest_Visit_Status.html}</td>
    </tr>
    <tr name="advancedOptions" style="display:none" class="advancedOptions">
        <td nowrap="nowrap">{$form.Feedback.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.Feedback.html}</td>
    </tr>
    <tr name="advancedOptions" style="display:none" class="advancedOptions">
        <td nowrap="nowrap">{$form.scan_done.label}</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.scan_done.html}</td>
        <td colspan="3" class="selector" align="right" nowrap="nowrap"><input type="submit" name="filter" value="Show Data" id="showdata_advanced_options" class="button" />
       <input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=candidate_list&reset=true'" />
        <input type="button" name="advanced" value="Basic" class="button" onclick="toggleMe()"/></td>
    </tr>
    {if $useEDC=="true"}
    <tr name="advancedOptions" style="display:none">
            <td nowrap="nowrap">{$form.edc.label}</td>
            <td nowrap="nowrap">{$form.edc.html}</td>
            <td nowrap="nowrap">&nbsp;</td>
            <td nowrap="nowrap">&nbsp;</td>
    </tr>
    {/if}
</table>
</form>
<form name="accessProfileForm" method="get" action="main.php" onSubmit="return checkAccessProfileForm();">
<input type="hidden" name="test_name" value="timepoint_list">
<table style="width:50; float:right; margin-top:15px" border="0" cellpadding="2" cellspacing="2">
    <tr>
    <br><br>
        <th align="right">DCC-ID:</th>
        <td><input tabindex="1" size="10" maxlength="10" type=text name="candID"></td>
    </tr>
    <tr>
        <th align="right">PSC-ID:</th>
        <td><input tabindex="2" size="10" maxlength="12" type=text name="PSCID"></td>
    </tr>
    <tr>
    <td></td>
        <td align="right"><input tabindex="3" rowspan="2" type="submit" value="Open Profile" class="button"></td>
    </tr>
</form>
</td>
</tr>
</table>
</table>
<table>
<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection"></td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>
</form>
<!-- start data table -->
<table  class ="fancytable" border="0" width="100%">
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
		    {assign var="PSCID" value="$items[item][piece].value"}
		    <a href="main.php?test_name=timepoint_list&candID={$items[item][piece].DCCID}">{$items[item][piece].value}</a>
		    	
		{elseif $items[item][piece].name == "scan_Done"}
        	{if $items[item][piece].value == 'Y'}
        		{assign var="scan_done" value="Yes"}
        		<a href="mri_browser.php?filter%5BpscID%5D={$PSCID}">{$scan_done}</a>
            {else}
                {assign var="scan_done" value="No"}
                {$scan_done}
            {/if}
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

