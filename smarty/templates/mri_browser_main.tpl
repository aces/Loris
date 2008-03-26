<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<HEAD>
<LINK REL=StyleSheet HREF="{$css}" TYPE="text/css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<TITLE>MRI - {$study_title}</TITLE>
<!-- end page header -->
</HEAD>

<BODY>
<!-- start main table -->
<table width="90%" border="0" cellpadding="5" cellspacing="2">
<tr>
    <th background="images/title_background.jpg" class="banner" colspan="2" align="left">
        <strong>MRI browser - {$study_title}</strong>
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
    <td width="8%" class="tabox" valign="top" nowrap="nowrap">
    
        <!-- Start Section on the left -->
        <table border="0" valign="top" cellpadding="1" cellspacing="1"><tr>
        
        <!-- back button and other navigation buttons -->
        <td class="controlPanelSection">Navigation</td>
        </tr>
        <!-- Back Button - need to add code to control it -->
        {if $backURL!=""}
            <tr><td class="controlPanelItem"><br>
                <a href="{$backURL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Back to list</a>
            </td></tr>
        {/if}

        <tr>
        <td>&nbsp;</td>
        </tr>

        <tr><td class="controlPanelItem">

        <!-- Prev Button -->
        {if $prevTimepoint.URL!=""}
                <a href="{$prevTimepoint.URL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Prev</a>
        {else}<br><br>{/if}

        {if $prevTimepoint.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}

        <!-- Next Button -->
        {if $nextTimepoint.URL!=""}
                <a href="{$nextTimepoint.URL}">&nbsp;&nbsp;&nbsp;Next&nbsp;<img src="images/right.gif" alt="Back" align="texttop" border="0" width="12" height="12"></a>
        {/if}

        &nbsp;  
        </td></tr>

        <tr>
        <td>&nbsp;</td>
        </tr>
        
        {if $efax.assigned_dir!=""}
        <tr>
            <td class="controlPanelItem">
                <a href="mri_efax.php?mri_efax_screen=assigned" target="MRI_EFAX"><img src="images/transfer.gif" alt="MRI Parameter Forms" border="0" width="12" height="12">&nbsp;MRI Parameter Forms</a>
            </td>
        </tr>
        {/if}        
        <tr>
            <td class="controlPanelItem">
                <a href="{$mantis}" target="mantis"><img src="images/transfer.gif" alt="Mantis" border="0" width="12" height="12">&nbsp;Mantis</a>
            </td>
        </tr>
        </table>
    </td>
    
    
    <!-- main page table tags -->
    <td width=100% class="tabox" valign="top">
    
    
    <!-- Start workspace area -->
    
    {$body}
    
    <!-- end workspace area -->
    
    <!-- end Main Table and HTML PAGE -->
    </td>
</tr>
</table>
</BODY>
</HTML>






