<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="{$css}" type="text/css" />
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<title>{$study_title}</title>

<link type="text/css" href="css/jquery-ui-1.8.2.custom.css" rel="Stylesheet" />	
<script src="js/jquery/jquery-1.4.2.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/jquery/jquery-ui-1.8.2.custom.min.js"></script>

{if $test_name_js}
<script type="text/javascript" src="{$test_name_js}"></script>
{/if}

{literal}
<script language="javascript" type="text/javascript"> 
<!--
function feedback_bvl_popup(features) { 
    {/literal}    
        var myUrl = "feedback_bvl_popup.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}";
        {literal}
            window.open(myUrl, "feedback_control", "width=800, height=600, resizable=yes, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no");
}
function open_help_section(){
{/literal}
  var helpurl = "context_help_popup.php?test_name={$test_name}";
  {literal}
     window.open(helpurl);
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
{if $dynamictabs neq "dynamictabs"}
<table border="0" cellpadding="3" cellspacing="2" width="100%" class="mainlayout">
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
        <td colspan="2" class="navigationRow">
            <ul class="navigationBar">
                <!-- the buttons -->
                {foreach from=$tabs item=tab}
                    <li class="navigationButtons {if ($tab.link == $test_name && $subtest != "my_preferences")}active{elseif $tab.link == $top_level && $subtest != "my_preferences"}active{/if}">
                        <a href="main.php?test_name={$tab.link}">{$tab.label}</a>
                    </li>
                {/foreach}
                
                <!-- my preferences button-->
                <li class="navigationButtons {if $test_name== "user_accounts" && $subtest == "my_preferences" }active{/if}">
                    <a href="main.php?test_name=user_accounts&subtest=my_preferences">My Preferences</a>
                </li>
                <li class="navigationButtons"> 
                    <a href="main.php?logout=true">Log Out</a>
                </li>
                </ul>
        </td>
    </tr>

    <tr>
        <!-- left section -->
        <td class="tabox sidenav" valign="top">
        {if $lastURL != ""}
	        <h3 class="controlPanelSection">Navigation</h3>
	        <ul class="controlPanel">
		        <li id="backButton"><a href="{$lastURL}"><img src="images/left.gif" alt="" border="0" width="12" height="12" /> Back</a></li>
	        </ul>
        {/if}

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

	<!--links-->
                    <h3 class="controlPanelSection">Links</h3>
                    <ul class="controlPanel">
                                {foreach from=$links item=link}
                        <li class="linkButton"><a href="{$link.url}" target="{$link.windowName}">{$link.label}</a></li>
                        {/foreach}
            </ul>
        </td>


        <!-- main page table tags -->
        <td width="100%" class="bgGradient" valign="top">
            <!-- Start workspace area -->
<h1 align="right"><a href="javascript:open_help_section()" ><u>Help</u></a>  </h1>
{if $crumbs != ""}
            <!-- bread crumb -->
            <table width="100%" border="0" cellpadding="3" cellspacing="4">
                <tr>
                    <th class="banner" align="left">
{section name=crumb loop=$crumbs}
                        <a href="main.php?{$crumbs[crumb].query}">{$crumbs[crumb].text}</a> {if not $smarty.section.crumb.last}&gt; {/if}
{/section}
                    </th>
                </tr>
            </table>
{/if}
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
            <h1>Welcome to the Database!</h1>
	    <p>This database provides an on-line mechanism to store both MRI and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help section to the left. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun.</p>
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
        {if $candidate.ProjectTitle != ""}
                    <th nowrap="nowrap">Project</th>
        {/if}
        {foreach from=$candidate.DisplayParameters item=value key=name}
                    <th nowrap="nowrap">{$name}</th>
        {/foreach}
        {if $sessionID != ""}
                    <th nowrap="nowrap">Visit Label</th>
                    <th nowrap="nowrap">Visit to Site</th>
                    <th nowrap="nowrap">Subproject</th>
                    <th nowrap="nowrap">MR Scan Done</th>
                    {* <th nowrap="nowrap">Age During Visit</th> *}
                    <th nowrap="nowrap">Within Optimal</th>
                    <th nowrap="nowrap">Within Permitted</th>
                    {if $SupplementalSessionStatuses }
                        {foreach from=$timePoint.status item=status key=name}
                            <th nowrap="nowrap">{$name}</th>
                        {/foreach}
                    {/if}
        {/if}
                </tr>
                <tr>
                    <!-- candidate data -->
                    <td nowrap="nowrap">{$candidate.DoB}</td>
        {if $candidate.EDC!=""}
                    <td nowrap="nowrap">{$candidate.EDC}</td>
        {/if}
                    <td nowrap="nowrap">{$candidate.Gender}</td>
        {if $candidate.ProjectTitle != ""}
                    <td nowrap="nowrap">{$candidate.ProjectTitle}</td>
        {/if}
        {foreach from=$candidate.DisplayParameters item=value key=name}
                    <td nowrap="nowrap">{$value}</td>
        {/foreach}

        {if $sessionID != ""}
                    <!-- timepoint data -->
                    <td nowrap="nowrap">{$timePoint.Visit_label}</td>
                    <td nowrap="nowrap">{$timePoint.PSC}</td>
                    <td nowrap="nowrap">{$timePoint.SubprojectTitle}</td>
                    <td nowrap="nowrap">{$timePoint.Scan_done|default:"<img alt=\"Data Missing\" src=\"images/help2.gif\" width=\"12\" height=\"12\" />"}</td>
                    {* <td nowrap="nowrap">{$timePoint.WindowInfo.AgeDays}</td> *}
                    <td nowrap="nowrap">{if $timePoint.WindowInfo.Optimum}Yes{else}No{/if}</td>
                    <td nowrap="nowrap" {if not $timePoint.WindowInfo.Optimum}class="error"{/if}>{if $timePoint.WindowInfo.Permitted}Yes{else}No{/if}</td>
                    {if $SupplementalSessionStatuses }
                        {foreach from=$timePoint.status item=status}
                            <td nowrap="nowrap">{$status}</td>
                        {/foreach}
                    {/if}
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






