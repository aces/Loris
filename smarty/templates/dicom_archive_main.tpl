<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	   "http://www.w3.org/TR/html4/loose.dtd">
<html>
<HEAD>
<LINK REL=StyleSheet HREF="{$css}" TYPE="text/css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<TITLE>DICOM - {$study_title}</TITLE>
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
<!-- start main table -->
<table width="90%" cellpadding="5" cellspacing="2">
<tr>
    <th background="images/title_background.jpg" class="banner" align="left" colspan="2">
        <strong>DICOM archive - {$study_title}</strong>
    </th>
</tr>
<tr>
    <td colspan="2" class="controlPanelSection" >
        User:&nbsp;{$user_full_name}
        &nbsp;&nbsp;Site:&nbsp;{$user_site_name}
        &nbsp;&nbsp;Date:&nbsp;{$smarty.now|date_format:"%B %e %Y"}
    </td>
</tr>
<!-- navigation panel -->
<tr>
    <td width="10%" class="tabox" valign="top">
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
