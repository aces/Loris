{literal}
<script src="js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script>

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
function hideFilter(){
    $("#panel-body").toggle();
    $("#down").toggle();
    $("#up").toggle();
}
function toggleMe() {
    "use strict";
    $("#advanced-label").toggle();
    $("#advanced-options").toggle();
    $("#advanced-buttons").toggle(); 
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

<div class="col-sm-9">
<div class="panel panel-primary">
    <div class="panel-heading" onclick="hideFilter();">
        Selection Filter  
        <label id="advanced-label" style="display:none">(Advanced Options)</label>
        <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
        <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
    </div>
    <div class="panel-body" id="panel-body">
        <form method="post" action="main.php?test_name=candidate_list">
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-6">
                        {$form.centerID.label}
                    </label>
                    <!-- <div class="col-sm-7"> -->
                        {$form.centerID.html}
                    <!-- </div> -->
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-4">
                        {$form.DCCID.label}
                    </label>
                    {$form.DCCID.html}
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-6">
                        {$form.SubprojectID.label}
                    </label>
                    {$form.SubprojectID.html}
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-4">
                        {$form.PSCID.label}
                    </label>
                    {$form.PSCID.html}
                </div>
            </div>
            <div id="advanced-options" style="display:none">
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-6">
                            {$form.Participant_Status.label}
                        </label>
                        {$form.Participant_Status.html}
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-6">
                            {$form.dob.label}
                        </label>
                        {$form.dob.html}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-6">
                            {$form.gender.label}
                        </label>
                        {$form.gender.html}
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-8">
                            {$form.Visit_Count.label}
                        </label>
                        {$form.Visit_Count.html}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-6">
                            {$form.Latest_Visit_Status.label}
                        </label>
                        {$form.Latest_Visit_Status.html}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-6">
                            {$form.Feedback.label}
                        </label>
                        {$form.Feedback.html}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-6">
                            {$form.scan_done.label}
                        </label>
                        {$form.scan_done.html}
                    </div>
                    <br class="visible-xs">
                    <div class="form-group col-sm-6">
                        <!-- <div class="col-sm-6"> -->
                            <div class="col-sm-4 col-xs-12">
                                <input type="submit" name="filter" value="Show Data" id="showdata_advanced_options" class="btn btn-sm btn-primary col-xs-12" />
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-4 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=candidate_list&reset=true'" />
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-4 col-xs-12">
                                <input type="button" name="advanced" value="Basic" class="btn btn-sm btn-primary col-xs-12" onclick="toggleMe()"/>
                            </div>
                        <!-- </div> -->
                    </div>
                </div>
            </div>
            <br class="visible-xs">
            <div id="advanced-buttons">
                <!-- <div class="form-group col-sm-6 col-sm-offset-6"> -->
                        <!-- <div class="col-sm-6"> -->
                            <div class="col-sm-2 col-xs-12 col-sm-offset-6">
                                <input type="submit" name="filter" value="Show Data" id="showdata_advanced_options" class="btn btn-sm btn-primary col-xs-12" />
                            </div>

                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-2 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=candidate_list&reset=true'" />
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-2 col-xs-12">
                                <input type="button" name="advanced" value="Advanced" class="btn btn-sm btn-primary col-xs-12" onclick="toggleMe()"/>
                            </div>
                        <!-- </div> -->
                    <!-- </div> -->
            </div>
        </form>
    </div>
</div>
</div>
<div class="col-sm-3">
    <div class="hidden-xs">
        <br><br><br>
    </div>
    <form name="accessProfileForm" method="get" action="main.php" onSubmit="return checkAccessProfileForm();">
        <div class="row">
            <label class="col-sm-5">
                DCC-ID:            
            </label>
            <input tabindex="2" size="10" maxlength="12" type=text name="candID" class="col-sm-7">
        </div>
        <br>
        <div class="row">
            <label class="col-sm-5">
                PSC-ID:           
            </label>
            <input tabindex="2" size="10" maxlength="12" type=text name="PSCID" class="col-sm-7">
        </div>
        <br>
        <input tabindex="3" rowspan="2" type="submit" value="Open Profile" class="btn btn-sm btn-primary col-sm-5 col-sm-offset-8">
    </form>
</div>

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

