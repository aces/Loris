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

<link rel="stylesheet" type="text/css" href="js/jquery/JQeggplant/css/eggplant/jquery-ui-1.8.2.custom.css" />
<link type="text/css" href="css/jquery-ui-1.8.2.custom.css" rel="Stylesheet" /> 
<script src="js/jquery/jquery-1.4.2.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/jquery/jquery-ui-1.8.2.custom.min.js"></script>
<script type="text/javascript" src="js/mribrowser.js"></script>
{if $test_name_js}
<script type="text/javascript" src="{$test_name_js}"></script>
{/if}


<link type="text/css" href="css/jqueryslidemenu.css" rel="Stylesheet" />
<script type="text/javascript" src="js/jquery/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/jquery/jqueryslidemenu.js"></script>

<!-- end page header -->
</head>

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

var FeedbackButtonBoolean;

function FeedbackButtonClicked() {
    document.cookie = "FeedbackButtonBoolean = true";
    {/literal}
    var thisUrl = "feedback_bvl_popup.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}";
    {literal}
    window.open(thisUrl, "MyWindow", "width=800, height=600, resizable=yes, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no");
}
</script>
{/literal}

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
&nbsp;&nbsp; Site: {$user_site_name} &nbsp;|
</div>
<div id="slidemenu" style="float:right" class="jqueryslidemenu">
<ul>
<li><a href="#" onclick="FeedbackButtonClicked()"><img width=17 src=images/pencil.gif></a></li>

<li><a href="#" onClick="MyWindow=window.open('context_help_popup.php?test_name={$test_name}','MyWindow','toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=800,height=400'); return false;"><img width=17 src=images/help.gif></a></li>
</ul>
</div>

</div>
</th>
</tr>
</table>

<div class="controlPanel" style="position:fixed">
<div id="divTopLeft">
<!-- back button and other navigation buttons -->
    {if $backURL!=""}
<!-- Back Button -  -->
        <h3>Navigation</h3>
        <p><a href="{$backURL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Back to list</a></p>
    {/if}
<!-- Prev Button -->
    {if $prevTimepoint.URL!=""}
         <p><a href="{$prevTimepoint.URL}">&nbsp;&nbsp;&nbsp;<img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Previous</a></p>
    {else}{/if}
<!-- Next Button -->
    {if $nextTimepoint.URL!=""}
       <p><a href="{$nextTimepoint.URL}">&nbsp;&nbsp;&nbsp;<img src="images/right.gif" alt="Back" align="texttop" border="0" width="12" height="12"></a><a href="{$nextTimepoint.URL}">&nbsp;Next</a></p>
    {/if}
    {if $prevTimepoint.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}
</div>
{if $showFloatJIV}
<div id="divTopRight">
<h3>JIV Panel</h3>
<br>
<input type="button" accesskey="c" class="button" value="3D+Overlay" onClick="javascript:show_jiv(jivNames, jivData, true);"><br>
<input type="button" accesskey="d" class="button" value="3D Only" onClick="javascript:show_jiv(jivNames, jivData, false);">

<h3>BrainBrowser</h3>
<br>
<input type="button" value="3D+Overlay" id="bboverlay" class="button"><br/>
<input type="button" value="3D Only" id="bbonly" class="button"><br/>
</div>
<div id="divBottomRight">
<h3>Links</h3><br>
<a href="main.php?test_name=mri_parameter_form&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.ParameterFormCommentID}">MRI Parameter Form</a>
<br>
<!--td nowrap="nowrap"><input type="button" name="button" value="Radiology Review" class="button" style = "background-color: #08245b" onclick="window.open('main.php?test_name=radiology_review&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.RadiologyReviewCommentID}')" /></td-->
<a href="main.php?test_name=radiology_review&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.RadiologyReviewCommentID}">Radiology Review </a>
<br>
{foreach from=$subject.tarchiveids item=tarchive}
<!--td nowrap="nowrap"><input type="button" name="button" value="DICOM Archive" class="button" style = "background-color: #08245b" onclick="window.open('dicom_archive.php?TarchiveID={$tarchive.TarchiveID}&backURL={$backURL|escape:"url"}')" /></td-->
<a href="dicom_archive.php?TarchiveID={$tarchive.TarchiveID}&backURL={$backURL|escape:"url"}">DICOM Archive {$tarchive.TarchiveID}</a>
<br>
{/foreach}
<a target="mantis" href="{$mantis}">Report a Bug (Mantis)</a>

</div>
<div id="divBottomLeft">
<h3>Visit Controls</h3>
<br>
 <a href="#" onClick="javascript:open_popup('feedback_mri_popup.php?sessionID={$subject.sessionID}')">Visit-level feedback</a>
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
<BODY>
<!-- start main table -->
<table width="100%" border="0" class="mainlayout" cellpadding="3" cellspacing="2">
    <tr>
        {if $sessionID != ""}   
        <td valign="top" nowrap="nowrap">
    
            <!-- Start Section on the left -->
            <table border="0" valign="top" cellpadding="1" cellspacing="1" width="167px"><tr>
       <!-- 
            {if $efax.assigned_dir!=""}
                <tr>
                    <td class="controlPanelItem">
                        <a href="mri_efax.php?mri_efax_screen=assigned" target="MRI_EFAX"><img src="images/transfer.gif" alt="MRI Parameter Forms" border="0" width="12" height="12">&nbsp;MRI Parameter Forms</a>
                    </td>
                </tr>
            {/if}
            -->
            </table>
        </td>
        {/if}
        <!-- main page table tags -->
        <td class="bgGradient" valign="top">
        {$body}
        </td>
    </tr>
</table>


<table class="MainFooter" align="center">
<tr>
<div id="footerLinks">
<td width="100%">
<hr width= 70%>
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
<td align="center" colspan="1" style="color:#064785" >Powered by LORIS &copy; 2013. All rights reserved.</td>
</tr>
<tr>
<td align="center" colspan="1"><a href="http://cbrain.mcgill.ca" style="color: #2a2a2a;" target="_blank">Created by ACElab</a></td>
</tr>
</table>

</BODY>
<br>
<br>
<br>
<br>
</div>
</HTML>
