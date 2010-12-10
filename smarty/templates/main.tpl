<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="{$css}" type="text/css" />
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<title>{$study_title}</title>

{literal}
<script language="javascript" type="text/javascript">
<!--
function feedback_bvl_popup(features) { 
{/literal}    
    var myUrl = "feedback_bvl_popup.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}";
{literal}
    window.open(myUrl, "feedback_control", "width=800, height=600, resizable=yes, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no");
}
//-->
</script>
{/literal}
</head>

<body 
{if $PopUpFeedbackBVL && ($user.permissions.superuser==true || $user.permissions.access_all_profiles==true || $user.user_from_study_site==true)}
    onload="feedback_bvl_popup();"
{/if}
>
                               
<table border="0" cellpadding="3" cellspacing="2" width="100%">
    <tr>
        <th align="left" background="images/title_background.jpg" class="banner" colspan="2">
            {$study_title}
        </th>
    </tr>

    <tr>
    <!-- user info table -->
         <td width="50%" colspan="2" valign="bottom" align="left" nowrap="nowrap" class="controlPanelSection">
            User: {$user.Real_name}&nbsp; Site: {$user.Site}&nbsp; Date: {$smarty.now|date_format:"%B %e %Y"}
        </td>
    </tr>

    <tr>
        <!-- nav bar table -->
        <td colspan="2">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <!-- the buttons -->
                {foreach from=$tabs item=tab}
  				    {if $test_name == $tab.link && $subtest != "my_preferences"}
  				      {assign var=tab_selected value="Selected"}
  				    {/if}
                    <td valign="middle"><img src="images/tab{$tab_selected}Left.png" alt="" width="3" height="28"/></td>
                    <td valign="middle" nowrap="nowrap" background="images/tab{$tab_selected}Bg.png">
                        &nbsp; <a href="main.php?test_name={$tab.link}">{$tab.label}</a>&nbsp;
                    </td>
                    <td valign="middle"><img src="images/tab{$tab_selected}Right.png" alt="" width="3" height="28" /></td>
                    <td width="3" class="tabsp"><img src="images/shim.gif" alt="" height="1" width="3" /></td>
  				    {assign var=tab_selected value=null}
                {/foreach}
                
                <!-- my preferences button-->
			    {if $test_name == "user_accounts" && $subtest == "my_preferences"}
			      {assign var=tab_selected2 value="Selected"}
			    {/if}
                <td valign="middle"><img src="images/tab{$tab_selected2}Left.png" alt="" width="3" height="28" /></td>
                <td valign="middle" nowrap="nowrap" background="images/tab{$tab_selected2}Bg.png">
                    &nbsp;<a href="main.php?test_name=user_accounts&subtest=my_preferences">My Preferences</a>&nbsp;
                </td>
                <td valign="middle"><img src="images/tab{$tab_selected2}Right.png" alt="" width="3" height="28" /></td>
                <td width="3" class="tabsp"><img src="images/shim.gif" alt="" height="1" width="3" /></td>

                <!-- log out button-->
                <td valign="middle"><img src="images/tabLeft.png" alt="" width="3" height="28" /></td>
                <td valign="middle" nowrap="nowrap" background="images/tabBg.png">
                    &nbsp; <a href="main.php?logout=true">Log Out</a>&nbsp;
                </td>
                <td valign="middle"><img src="images/tabRight.png" alt="" width="3" height="28" /></td>
             </tr>
          </table>
        </td>
    </tr>

    <tr>
        <!-- left section -->
        <td class="tabox" valign="top">
            <table border="0" valign="top" cellpadding="1" cellspacing="1" width="150">
{if $lastURL != ""}
                <tr><td class="controlPanelSection">Navigation</td></tr>
                <tr>
                    <td class="controlPanelItem">
                        <a href="{$lastURL}"><img src="images/left.gif" alt="" border="0" width="12" height="12" />&nbsp;Back</a>
                    </td>
                </tr>

                <tr><td>&nbsp;</td></tr>
{/if}

                <!-- MISSING CODE HERE TO INCLUDE BUTTONS FOR INSTRUMENTS... -->

{if $test_name != "" && $error_message == ""}
    {if $commentID != ""}
                <!-- instrument status flags -->
{$control_panel}
    {elseif $sessionID != ""}    
                <!-- instrument list control panel -->
{$control_panel}
    {elseif $candID != ""}    
                <!-- timepoint list control panel -->
{$control_panel}
    {/if}
{/if}

                <!-- links -->
                <tr><td class="controlPanelSection">Links</a></td></tr>
  				{foreach from=$links item=link}
                <tr>
                    <td class="controlPanelItem">
                        <a href="{$link.url}" target="{$link.windowName}"><img src="images/transfer.gif" alt="" border="0" width="12" height="12" />&nbsp;{$link.label}</a>
                    </td>
                </tr>
                {/foreach}
<!--                <tr>
                    <td class="controlPanelItem">
                        <a href="context_help_popup.php?test_name={$test_name}&subtest={$subtest}" target="help"><img src="images/transfer.gif" alt="" border="0" width="12" height="12" />&nbsp;Help</a>
                    </td>
                </tr>
-->
            </table>
        </td>


        <!-- main page table tags -->
        <td width="100%" class="tabox" valign="top">

            <!-- Start workspace area -->

{if $crumbs != ""}
            <!-- bread crumb -->
            <table width="100%" border="0" cellpadding="2" cellspacing="2">
                <tr>
                    <th class="banner" align="left">
{section name=crumb loop=$crumbs}
                        <a href="main.php?{$crumbs[crumb].query}">{$crumbs[crumb].text}</a> {if not $smarty.section.crumb.last}&gt; {/if}
{/section}
                    </th>
                </tr>
            </table>
{/if}

{if $error_message != ""}
            <p>The following errors occured while attempting to display this page:

            <ul>
    {section name=error loop=$error_message}
                <li><strong>{$error_message[error]}</strong></li>
    {/section}
            </ul>
            
            If this error persists, please report a bug using <a target="mantis" href="{$mantis_url}">Mantis</a>.</p>
            <p><a href="javascript:history.back(-1)">Please click here to go back</a>.</p>
{elseif $test_name == ""}
            <p>Welcome to the Database!</p>
{else}

    {if $candID != ""}
            <!-- table with candidate profile info -->
            <table cellpadding="2" class="list" style='width:700px'>
                <!-- column headings -->
                <tr>
                    <th nowrap="nowrap">DOB</th>
        {if $candidate.EDC!=""}
                    <th nowrap="nowrap">EDC</th>
        {/if}
                    <th nowrap="nowrap">Gender</th>
        {if $sessionID != ""}
                    <th nowrap="nowrap">Visit Label</th>
                    <th nowrap="nowrap">Visit to Site</th>
                    <th nowrap="nowrap">Subproject</th>
                    <th nowrap="nowrap">MR Scan Done</th>
        {/if}
                </tr>
                <tr>
                    <!-- candidate data -->
                    <td nowrap="nowrap">{$candidate.DoB}</td>
        {if $candidate.EDC!=""}
                    <td nowrap="nowrap">{$candidate.EDC}</td>
        {/if}
                    <td nowrap="nowrap">{$candidate.Gender}</td>
        {if $sessionID != ""}
                    <!-- timepoint data -->
                    <td nowrap="nowrap">{$timePoint.Visit_label}</td>
                    <td nowrap="nowrap">{$timePoint.PSC}</td>
                    <td nowrap="nowrap">{$timePoint.SubprojectTitle}</td>
                    <td nowrap="nowrap">{$timePoint.Scan_done|default:"<img alt=\"Data Missing\" src=\"images/help2.gif\" width=\"12\" height=\"12\" />"}</td>
        {/if}
                </tr>
            </table>
        {if $sessionID != ""}
    		<table cellpadding="2" class="list" style='width:700px'>
                <!-- visit statuses -->
                <tr>
                    <th nowrap="nowrap" colspan="3">Stage</th>
                    <th nowrap="nowrap" colspan="3">Status</th>
                    <th nowrap="nowrap" colspan="2">Date</th>
                </tr>
                <tr>
                    <td nowrap="nowrap" colspan="3">Screening</td>
                    <td nowrap="nowrap" colspan="3">{$timePoint.Screening}</td>
                    <td nowrap="nowrap" colspan="2">{$timePoint.Date_screening}</td>
                </tr>
                <tr>
                    <td nowrap="nowrap" colspan="3">Visit</td>
                    <td nowrap="nowrap" colspan="3">{$timePoint.Visit}</td>
                    <td nowrap="nowrap" colspan="2">{$timePoint.Date_visit}</td>
                </tr>
                <tr>
                    <td nowrap="nowrap" colspan="3">Approval</td>
                    <td nowrap="nowrap" colspan="3">{$timePoint.Approval}</td>
                    <td nowrap="nowrap" colspan="2">{$timePoint.Date_approval}</td>
                </tr>
            </table>
        {/if}
    {/if}
            <!-- included file -->
<table width="90%"><tr><td>
{$workspace}
</td></tr></table>
{/if} 
        </td>
    </tr>
</table>

</body>
</html>






