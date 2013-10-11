<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	   "http://www.w3.org/TR/html4/loose.dtd">
<html>
<HEAD>
<div id="page">
<LINK REL=StyleSheet HREF="{$css}" TYPE="text/css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<TITLE>DICOM - {$study_title}</TITLE>

<link type="text/css" href="css/jqueryslidemenu.css" rel="Stylesheet" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery/jqueryslidemenu.js"></script>
<!-- end page header -->
</HEAD>

<!-- *********************************************************
     * You may use this code for free on any web page provided that 
     * these comment lines and the following credit remain in the code.
     * Floating Div from http://www.javascript-fx.com
     ********************************************************  -->

<div id="divTopLeft" style="position:absolute">
<!-- back button and other navigation buttons -->
    {if $backURL!=""}
<!-- Back Button -  -->
        <p>Navigation</p>
        <p><a href="{$backURL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Back to list</a></p>
    {/if}
<!-- Prev Button -->
    {if $prevTarchive.URL!=""}
         <p><a href="{$prevTarchive.URL}">&nbsp;&nbsp;&nbsp;<img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Previous</a></p>
    {else}<br><br>{/if}
<!-- Next Button -->
    {if $nextTarchive.URL!=""}
       <p><a href="{$nextTarchive.URL}">&nbsp;&nbsp;&nbsp;Next&nbsp;<img src="images/right.gif" alt="Back" align="texttop" border="0" width="12" height="12"></a></p>
    {/if}
    {if $prevTarchive.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}
</div>

{literal}
<script type="text/javascript">
var ns = (navigator.appName.indexOf("Netscape") != -1);
var d = document;
var px = document.layers ? "" : "px";
function JSFX_FloatDiv(id, sx, sy)
{
	var el=d.getElementById?d.getElementById(id):d.all?d.all[id]:d.layers[id];
	window[id + "_obj"] = el;
	if(d.layers)el.style=el;
	el.cx = el.sx = sx;el.cy = el.sy = sy;
	el.sP=function(x,y){this.style.left=x+px;this.style.top=y+px;};
	el.flt=function()
	{
		var pX, pY;
		pX = (this.sx >= 0) ? 0 : ns ? innerWidth : 
		document.documentElement && document.documentElement.clientWidth ? 
		document.documentElement.clientWidth : document.body.clientWidth;
		pY = ns ? pageYOffset : document.documentElement && document.documentElement.scrollTop ? 
		document.documentElement.scrollTop : document.body.scrollTop;
		if(this.sy<0) 
		pY += ns ? innerHeight : document.documentElement && document.documentElement.clientHeight ? 
		document.documentElement.clientHeight : document.body.clientHeight;
		this.cx += (pX + this.sx - this.cx)/8;this.cy += (pY + this.sy - this.cy)/8;
		this.sP(this.cx, this.cy);
		setTimeout(this.id + "_obj.flt()", 40);
	}
	return el;
}
JSFX_FloatDiv("divTopLeft",       10, 200).flt();

</script>
{/literal}

<BODY>
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
<table width="90%" cellpadding="5" cellspacing="2">
<!-- navigation panel -->
<tr>

<!-- main page table tags -->
    <td class="tabox" valign="top">
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
</div>
</BODY>
</HTML>
