<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<HEAD>
<LINK REL=StyleSheet HREF="{$css}" TYPE="text/css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<TITLE>DICOM - {$study_title}</TITLE>
<!-- end page header -->
</HEAD>

<BODY>
<!-- start main table -->
<table width="90%" cellpadding="5" cellspacing="2">
<tr>
    <th background="images/title_background.jpg" class="banner" align="left" colspan="2">
        <strong>DICOM archive - {$study_title}</strong>
    </th>
</tr>
<tr>
    <td colspan="2" class="controlPanelSection" >
        User:&nbsp;
        {$user_full_name}
        &nbsp;&nbsp;Site:&nbsp;
        {$user_site_name}
        &nbsp;&nbsp;Date:&nbsp;
        {$smarty.now|date_format:"%B %e %Y"}
    </td>
</tr>

<tr>
    <td width="8%" class="tabox" valign="top">
    
        <!-- Start Section on the left -->
        <table border="0" valign="top" cellpadding="1" cellspacing="1">
        <tr>
        <!-- back button and other navigation buttons -->
        <td class="controlPanelSection">Navigation</td>
        </tr>
        <!-- Back Button - need to add code to control it -->
        {if $backURL!=""}
            <tr><td class="controlPanelItem" nowrap="nowrap"><br>
                <a href="{$backURL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Back to list</a>
            </td></tr>
        {/if}

        <tr>
        <td>&nbsp;</td>
        </tr>

        <tr><td class="controlPanelItem" nowrap="nowrap">

        <!-- Prev Button -->
        {if $prevTarchive.URL!=""}
                <a href="{$prevTarchive.URL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Prev</a><br><br>
        {else}<br><br>&nbsp;&nbsp;&nbsp;{/if}

        {if $prevTarchive.URL!="" && $nextTarchive.URL!=""}&nbsp;&nbsp;&nbsp;{/if}

        <!-- Next Button -->
        {if $nextTarchive.URL!=""}
                <a href="{$nextTarchive.URL}">Next&nbsp;<img src="images/right.gif" align="texttop" alt="Back" border="0" width="12" height="12"></a>
        {/if}

        &nbsp;  
        </td></tr>

        <tr>
        <td>&nbsp;</td>
        </tr>
        </table>
   </td>

<!-- main page table tags -->
    <td class="tabox" valign="top">
<!-- Start workspace area -->
    
    {$body}
    
<!-- end workspace area -->

<!-- end Main Table and HTML PAGE -->
    </td>
</tr>
</table>
</BODY>
</HTML>
