<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	   "http://www.w3.org/TR/html4/loose.dtd">
<html>
<div id="page">
<head>
<LINK REL=StyleSheet HREF="{$css}" TYPE="text/css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<TITLE>MRI - {$study_title}</TITLE>

<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/ui-lightness/jquery-ui.css" />
<link type="text/css" href="css/jquery-ui-1.8.2.custom.css" rel="Stylesheet" /> 
<script src="js/jquery/jquery-1.4.2.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/jquery/jquery-ui-1.8.2.custom.min.js"></script>
{if $test_name_js}
<script type="text/javascript" src="{$test_name_js}"></script>
{/if}


<link type="text/css" href="css/jqueryslidemenu.css" rel="Stylesheet" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery/jqueryslidemenu.js"></script>

<!-- end page header -->

{literal}
<script type="text/javascript">
function open_popup(newurl) {
var x = 200, y = 400;
   var open_params = 'width=500px,height=300px,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes,top='+y+',screenY='+y+',left='+x+',screenX='+x;
  //alert(open_params);
  window.open(newurl, 'feedback_mri', open_params);
}
function open_help_section(){
    {/literal}
    var helpurl = "context_help_popup.php?test_name={$test_name}";
    {literal}
    window.open(helpurl);
}
</script>
{/literal}
</head>
<body>
<table width="100%" class="header">
<tr>
<th align="left" id="jsheader">
<div id="slidemenu" class="jqueryslidemenu">
<ul>
<li><a href="main.php"><img width=20 src=images/home-icon.png></a></li>
{foreach from=$tabs item=tab}
{if $tab.visible == 1}
<li><a href="#">{$tab.label}</a>
<ul width="250">
{foreach from=$tab.subtab item=mySubtab}
{if $tab.label == $mySubtab.parent && $mySubtab.visible == 1}
<a href="{$mySubtab.link}">{$mySubtab.label}</a>
{/if}
{/foreach}
{if $tab.subtab.label != ''}
<a href="{$tab.subtab.link}">{$tab.subtab.label}</a>
{/if}
</ul>
</li>
{/if}
{/foreach}
<li><a href= javascript:open_help_section()>Help</a></li>
<div class="Account">
<li><a href="#">{$user_full_name}</a>
<ul>
<li><a href="main.php?test_name=user_accounts&subtest=my_preferences">My Preferences</a></li>
<li><a href="main.php?logout=true">Log Out</a></li>
</ul>
</li>
</ul>
</div>
<div class="site">
Site: {$user_site_name} &nbsp;|
</div>
</div>
</th>
</tr>
</table>

<!-- start main table -->
<table width="95%" border="0" style="padding-bottom:70px" cellpadding="5" cellspacing="2">
{if $ID_session != ''}
<tr>
    <td width="10%" class="tabox" valign="top" nowrap="nowrap">
 <div id="sidebar" style="position:fixed; display: block; top: 75px; padding-left: 5px;">
<!-- back button and other navigation buttons -->
        <h2>Links</h2>
        <ul class="controlPanel">
        {if $subject.ParameterFormCommentID}
            <li class="controlPanelItem">
                <a href="main.php?test_name=mri_parameter_form&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.ParameterFormCommentID}">MRI Parameter Form</a>
            </li>
        {/if}
        {if $subject.RadiologicalReviewCommentID}
            <li class="controlPanelItem">
                <a href="main.php?test_name=final_radiological_review&subtest=final_radiological_review&identifier={$subject.RadiologicalReviewCommentID}">Radiological Review</a>
            </li>
        {/if}
        {if $subject.tarchiveids != ""}
                {foreach from=$subject.tarchiveids item=Tarchive }
                <li class="controlPanelItem"><a href="dicom_archive.php?TarchiveID={$Tarchive.TarchiveID}" class="linkButton">DICOM Archive {$Tarchive.TarchiveID}</a>
                </li>
                {/foreach}
        {/if}
            <li class="controlPanelItem">
                <a href="{$mantis}" target="mantis">Mantis</a>
            </li>
        </ul>
    {if $backURL!=""}
        <h2>Navigation</h2>
        <ul class="controlPanel">
<!-- Back Button -  -->
        <li><a href="{$backURL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">Back to list</a></li>
    {/if}
<!-- Prev Button -->
    {if $prevTimepoint.URL!=""}
         <li><a href="{$prevTimepoint.URL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">Previous</a></li>
    {/if}
<!-- Next Button -->
    {if $nextTimepoint.URL!=""}
       <li><a href="{$nextTimepoint.URL}">
        <img src="images/right.gif" alt="Back" align="texttop" border="0" width="12" height="12">
        Next</a>
       </li>
    {/if}
    </ul>

    {if $showFloatJIV}
    <div id="divTopRight">
    <p>3D panel viewing<br><br>
    <input type="button" accesskey="c" class="button" value="3D+Overlay" onClick="javascript:show_jiv(jivNames, jivData, true);"><br>
    <input type="button" accesskey="d" class="button" value="3D Only" onClick="javascript:show_jiv(jivNames, jivData, false);">
    </p>
    </div>

    <div id="divBottomLeft">
    <p>Visit-Level controls</p>
     <a href="#" onClick="javascript:open_popup('feedback_mri_popup.php?sessionID={$subject.sessionID}')">Visit-level<br>feedback</a>
    <!-- table with candidate profile info -->
    {if $has_permission}<form action="" method="post">{/if}
    <p>QC Status<br>   {if $has_permission}{html_options options=$status_options selected=$subject.mriqcstatus name=visit_status tabindex=1>}
                   {else}{$subject.mriqcstatus}
                   {/if}
    </p>
    <p>QC Pending<br>  {if $has_permission}{html_options options=$pending_options selected=$subject.mriqcpending name=visit_pending tabindex=2}
                   {else}{if $subject.mriqcpending=="Y"}<img src="images/check_blue.gif" width="12" height="12">{else}&nbsp;{/if}
                   {/if}
    </p>
    {if $has_permission}<input class="button" type="submit" accesskey="s" value="Save" name="save_changes">{/if}            
    </div>
    {/if}

</div>
{/if}
        {if $subject.tarchiveids != ""}
<div style="color: rgba(255, 0, 0, 0)">
DICOM Archive 400015599
</div>
{/if}

        <!-- Start Section on the left -->
    </td>
    
    
    <!-- main page table tags -->
    <td width=90% class="tabox" valign="top">
    
    
    <!-- Start workspace area -->
    
    {$body}
    
    <!-- end workspace area -->
    
    <!-- end Main Table and HTML PAGE -->
    </td>
</tr>
</table>
<table class="mriFooter" align="center">
<tr>
<div id="footerLinks">
<td width="100%">
<ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;" >
<li id="active">|</li>
{foreach from=$links item=link}
<li><a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> | </li>
{/foreach}
</ul>
</td>
</div>
</tr>
<tr>
<td align="center" colspan="1" style="color:#fff" >Powered by LORIS &copy; 2013. All rights reserved.</td>
</tr>
<tr>
<td align="center" colspan="1"><a href="http://cbrain.mcgill.ca" style="color: #348b8d;" target="_blank">Created by ACElab</a></td>
</tr>
</table>
</body>
</div>
</HTML>






