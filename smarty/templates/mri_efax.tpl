<HTML>
<HEAD>
<LINK REL=StyleSheet HREF="{$css}" TYPE="text/css">
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
{literal}
<script language="JavaScript">
<!--
    function pop_me_up(pURL, name, features) { new_window = window.open(pURL, name, features); }

//-->
</script>
{/literal}
<!-- Check that the study date was passed when assigning new efax files -->
{literal}
<script>
function checkNewEfaxForm(){
   var form=document.newEfaxForm;
   if(form.SELECT.value=="Assign"){
       if(form.studyDate.value==""){
           alert("You must select MRI study date");
           form.candID.focus();
           return false;
       }
   }
   return true;
}
</script>
{/literal}

<!-- page title -->
<TITLE>{$study_title}</TITLE>
<!-- end page header -->
</HEAD>

<BODY bgColor="#f0f0f0" valign="top">
                               
<!-- page title table -->
<table width="100%" border="0" cellpadding="3" cellspacing="2"><th background="images/title_background.jpg" class="banner" align="left"><strong>{$study_title}</strong></table>
                               
<!-- navigation table -->
<TABLE valign="top" cellspacing="5" class="std">
    <TR>
    <TH colspan="3">MRI Efax Menu</TH>
    </TR><TR>
    {if $has_permission}
        <TD align="center"><A href="mri_efax.php?mri_efax_screen=new">Register New</A></td>
        <TD align="center"><A href="mri_efax.php?mri_efax_screen=assigned">View Assigned</A></td>
        <TD align="center"><A href="mri_efax.php?mri_efax_screen=unassigned">View Unassigned</A></td>
    {else}
        <TD align="center"><A href="mri_efax.php?mri_efax_screen=assigned">View Assigned</A></td>
    {/if}
    </TR>
</TABLE>

<!-- Display errors -->
{if $error_message}
    <TABLE valign="top" cellspacing="5">
        <TR>
            <TD><B>Warnings:</B></TD>
        </TR>
        {section name=error loop=$error_message}
        <TR>
            <TD align="center">{$error_message[error]}</td>
        </TR>
        {/section}
    </TABLE>

{else}

    <!-- Display the warnings (they don't block the script) -->
    {if $message}
        <!-- navigation table -->
        <TABLE valign="top" cellspacing="5">
            <TR>
            <TD><B>Messages and warnings:</B></TD>
            </TR>
            {section name=error loop=$message}
                <TR><TD align="center">{$message[error]}</TD></TR>
            {/section}
        </TABLE>
    {/if}
    
    
    
    
    <!-- Section with New Efaxes -->
    {if $mri_efax_screen == "new"}
    
        <!-- start a form to assign new efaxes -->
        <FORM name="newEfaxForm" method="GET" onSubmit="return checkNewEfaxForm();">
        <table border="0" valign="top" class="std">
            <TR>
                <!-- psc.Name -->
                <td nowrap="nowrap">Site:</td>
                <td nowrap="nowrap">
                    {html_options onchange="newEfaxForm.submit()" name="centerID" values=$psc_value_array selected=$centerID output=$psc_label_array}
                </td>
            </TR><TR>
                <!-- mri_efax_parameter_form.Scan_type -->
                <td nowrap="nowrap">Type:</td>
                <td nowrap="nowrap">
                    {html_options onchange="newEfaxForm.submit()" name="scanType" values=$scan_type_value_array selected=$scanType output=$scan_type_label_array}
                </td>
            </TR><TR>
                <!-- candidate.CandID -->
                    <td nowrap="nowrap">DCC-ID:</td>
                    <td nowrap="nowrap">
                        {html_options onchange="newEfaxForm.submit()" name="candID" values=$candID_value_array selected=$candID output=$candID_label_array}
                    </td>
            </TR><TR>
                <!-- timepoint  -->
                <td nowrap="nowrap">Timepoint:</td>
                <td nowrap="nowrap">
                    {html_options onchange="newEfaxForm.submit()" name="sessionID" values=$sessionID_value_array selected=$sessionID output=$sessionID_label_array}
                </td>
            </TR><TR>
                <!-- timepoint  -->
                <td nowrap="nowrap">Date of Acquisition:</td>
                <td nowrap="nowrap">
                    {html_options onchange="newEfaxForm.submit()" name="studyDate" values=$studyDate_value_array selected=$studyDate output=$studyDate_label_array}
                </td>
            </TR><TR>
                <!-- submit buttons -->
                <td nowrap="nowrap">&nbsp;</td>
                <!-- button to select form data -->
                <td><input type="submit" name="SELECT" value="Show Data" class="button"></td>
            </TR>
            <TR>
                <TD nowrap="nowrap">Comment:</td>
                <TD><input type="text" name="comment" value="{$comment}" size="60"></TD>
            </TR>
            <TR>
                {if $showAssignButton && $has_permission}
                <TR>
                    <!-- button to assign the file -->
                    <td>&nbsp;</td>
                    <td><input class="button" name="Efax_action" value="Assign Files" type="submit" class="button"/></td>
                </TR>
                {/if}
        </table>
        
        <!-- table with pagination -->
        <table border="0" valign="bottom"><td align="right">{$page_links}</td></table>

        <!-- start new efax list table-->
        <TABLE class="list">
        <TR><TH colspan="3">New Files</TH></TR>
        <TR>
        <TH>Select File</TH>
        <TH>File Name</TH>
        <TH>Page No.</TH>
        </TR>
        {section name=efax_file loop=$efax_list}
            <TR>
            <TD><INPUT TYPE="CHECKBOX" NAME="newEfaxList[{$efax_list[efax_file].File_name}]" VALUE="{$efax_list[efax_file].Page}" {$efax_list[efax_file].Checked}></TD>
            <TD><a href="javascript:pop_me_up('mri/view_files.php?file={$efax_list[efax_file].absoluteFileName}', 'mri_efax_view', 'resizable=1,width=650,scrollbars=yes,toolbar=yes')">{$efax_list[efax_file].File_name}</TD>
            <TD>{$efax_list[efax_file].Page}</TD>
            <TR>
        {/section}
        <!-- repeat the Assign button and display Delete button -->
        <TR>
            <td> &nbsp
        {if $has_permission}
            <input class="button" name="Efax_action" value="Delete Files" type="submit" class="button"/>
        {/if}
            </td>
            <td>&nbsp;</td>
            <td> &nbsp
        {if $showAssignButton && $has_permission}
            <input class="button" name="Efax_action" value="Assign Files" type="submit" class="button"/>
        {/if}
            </td>
        </TR>
        <!-- end new efax list table-->
        </TABLE>
        <!-- end the form-->
        <INPUT TYPE="hidden" NAME="mri_efax_screen" VALUE="{$mri_efax_screen}">
        <INPUT TYPE="hidden" NAME="pageID" VALUE="{$pageID}">
        </FORM> 

        
        
        
        

        
    <!-- section w/ unassigned efaxes -->
    {elseif $mri_efax_screen == "unassigned"}

        <!--  title table with pagination -->
        <table border="0" valign="bottom"><td align="right">{$page_links}</td></table>

        {if $efax_list|@count == 0}
            <table border="0" valign="bottom" width="100%"><td class="controlPanelSection">There are no assigned files matching your criteria!</td></table>
        {else}

            <FORM name="unassignedEfaxForm" method="POST">
            <!-- unassigned efax list table-->
            <TABLE class="list">
            <TR><TH colspan="3">Unassigned Files</TH></TR>
            <TR>
            <TH>Select File</TH>
            <TH>File Name</TH>
            <TH>Page No.</TH>
            </TR>
            {section name=efax_file loop=$efax_list}
                <TR>
                <TD><INPUT TYPE="CHECKBOX" NAME="unassignedEfaxList[{$efax_list[efax_file].File_name}]" VALUE="{$efax_list[efax_file].Page}" {$efax_list[efax_file].Checked}></TD>
                <TD><a href="javascript:pop_me_up('mri/view_files.php?file={$efax_list[efax_file].absoluteFileName}', 'mri_efax_view', 'resizable=1,width=650,scrollbars=yes,toolbar=yes')">{$efax_list[efax_file].File_name}</TD>
                <TD>{$efax_list[efax_file].Page}</TD>
                </TR>
            {/section}
            <TR>
                <td> &nbsp
            {if $has_permission}
                <input class="button" name="Efax_action" value="Delete Files" type="submit" class="button"/>
            {/if}
                </td>
                <td>&nbsp;</td>
                <td> &nbsp
            {if $has_permission}
                <input class="button" name="Efax_action" value="Restore Files" type="submit" class="button"/>
            {/if}
                </td>
            </TR>
            <!-- end efax list table-->
            </TABLE>
            <!-- end the form-->
            <INPUT TYPE="hidden" NAME="mri_efax_screen" VALUE="{$mri_efax_screen}">
            </FORM>     
        {/if}

        
        
    <!-- section w/ assigned efaxes-->
    {else}
    
        <!-- start the selection table -->
        <FORM name="selectionForm" method="POST" action="?mri_efax_screen=assigned">
            <table border="0" valign="top" class="std">
            <tr>
            <!-- table title -->
            <th nowrap="nowrap" colspan="7">Selection Filter</th>
            </tr>
            <tr>
            <!-- psc.Name -->
            <td nowrap="nowrap">Site:</td>
            <td nowrap="nowrap">
                {html_options name="filter[candidate.CenterID]" values=$psc_value_array selected=$candidate_CenterID output=$psc_label_array}
            </td>
            <!-- can category -->
            <td nowrap="nowrap">Scan Type:</td>
            <td nowrap="nowrap">
            {html_options name="filter[mri_efax_parameter_form.Scan_category]" values=$scan_category_value_array selected=$scanCategory output=$scan_category_label_array}
            </td>
            <!-- candidate.CandID -->
            <td nowrap="nowrap">DCC-ID:</td>
            <td nowrap="nowrap"><input type="text" name="filter[candidate.CandID]" value="{$candidate_CandID}" maxlength=6 size=7></td>
            <!-- submit button -->
            <td nowrap="nowrap">&nbsp;</td>
            <td><input type="submit" name="filter[SELECT]" value="Show Data" class="button">&nbsp;<input type="submit" name="filter[RESET]" value="Clear Form" class="button"></td>
            </tr>
            <table>
        <INPUT TYPE="hidden" NAME="mri_efax_screen" VALUE="{$mri_efax_screen}">
        </FORM>
        <!-- end the selection table -->
    
        <!--  table with pagination -->
        <table border="0" valign="bottom"><td align="right">{$page_links}</td></table>
        
        {if $efax_list|@count == 0}
            <table border="0" valign="bottom" width="100%"><td class="controlPanelSection">There are no assigned files matching your criteria!</td></table>
        {else}
            <!-- table title -->
            <table border="0" valign="bottom" width="100%"><td class="controlPanelSection">Assigned Files</td></table>
            
            <FORM name="assignedEfaxForm" method="POST" action="?mri_efax_screen=assigned">
                <!-- start assigned efax list table-->
                <TABLE class="list">
                <TR>
                    <TH>Select File</TH>
                    <TH>Site</TH>
                    <TH>Scan_category</TH>
                    <TH>DCC-ID</TH>
                    <TH>PSC-ID</TH>
                    <TH>Visit_label</TH>
                    <TH>File Name</TH>
                    <TH>Page No.</TH>
                    <TH>Date</TH>
                    <TH>Efax ID</TH>
                    <TH>VisitNo</TH>
                    <TH>Date_assigned</TH>
                    {if $has_permission}
                        <TH>Comment</TH>
                        <TH>SessionID</TH>
                    {/if}
                </TR>
                {section name=efax_file loop=$efax_list}
                    <TR>
                        <TD>
                        {if $has_permission && $efax_list[efax_file].absoluteFileName && !$efax_list[efax_file].TimepointLock==1}
                            <INPUT TYPE="CHECKBOX" NAME="assignedEfaxList[{$efax_list[efax_file].File_name}]" VALUE="{$efax_list[efax_file].Page}" {$efax_list[efax_file].Checked}>
                        {/if}
                        </TD>
                        <TD>{$efax_list[efax_file].Site}</TD>
                        <TD>{$efax_list[efax_file].Scan_category}</TD>
                        <TD>{$efax_list[efax_file].CandID}</TD>
                        <TD>{$efax_list[efax_file].PSCID}</TD>
                        <TD>
                        {if $has_permission}
                            <a href="?mri_efax_screen=assigned&setTimepointLock=1&timepointLockSessionID={$efax_list[efax_file].SessionID}">
                        {/if}
                                {$efax_list[efax_file].Visit_label}
                        {if $has_permission}
                            </a>
                        {/if}
                        </TD>
                        <TD>
                        {if $efax_list[efax_file].absoluteFileName}
                        <a href="javascript:pop_me_up('mri/view_files.php?file={$efax_list[efax_file].absoluteFileName}', 'mri_efax_view', 'resizable=1,width=650,scrollbars=yes,toolbar=yes')">
                        {$efax_list[efax_file].File_name}</a>
                        {else}
                        <FONT color='red'>Invalid File!</FONT>
                        {/if}
                        </TD>
                        <TD>{$efax_list[efax_file].Page}</TD>
                        <TD>{$efax_list[efax_file].Date}</TD>
                        <TD>{$efax_list[efax_file].ID}</TD>
                        <TD>{$efax_list[efax_file].VisitNo}</TD>
                        <TD>{$efax_list[efax_file].Testdate}</TD>
                        {if $has_permission}
                            <TD>{$efax_list[efax_file].Comment}</TD>
                            <TD>{$efax_list[efax_file].SessionID}</TD>
                        {/if}
                    <TR>
                {/section}
                </TABLE>
                {if $has_permission}
                    <input class="button" name="Efax_action" value="Unassign Files" type="submit" class="button"/>
                {/if}
                <!-- end assigned efax list table-->
                <INPUT TYPE="hidden" NAME="mri_efax_screen" VALUE="{$mri_efax_screen}">
            </FORM>    
        {/if}
    {/if}
{/if}
 
</BODY>
</HTML>
