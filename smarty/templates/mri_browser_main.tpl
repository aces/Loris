<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	   "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<LINK REL=StyleSheet HREF="{$css}" TYPE="text/css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<TITLE>MRI - {$study_title}</TITLE>
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
</script>
{/literal}

<div id="divTopLeft" style="position:absolute">
<!-- back button and other navigation buttons -->
    {if $backURL!=""}
<!-- Back Button -  -->
        <p>Navigation</p>
        <p><a href="{$backURL}"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12"><img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Back to list</a></p>
    {/if}
<!-- Prev Button -->
    {if $prevTimepoint.URL!=""}
         <p><a href="{$prevTimepoint.URL}">&nbsp;&nbsp;&nbsp;<img src="images/left.gif" align="texttop" alt="Back" border="0" width="12" height="12">&nbsp;Previous</a></p>
    {else}<br><br>{/if}
<!-- Next Button -->
    {if $nextTimepoint.URL!=""}
       <p><a href="{$nextTimepoint.URL}">&nbsp;&nbsp;&nbsp;Next&nbsp;<img src="images/right.gif" alt="Back" align="texttop" border="0" width="12" height="12"></a></p>
    {/if}
    {if $prevTimepoint.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}
</div>

{if $showFloatJIV}
<div id="divTopRight" style="position:absolute">
<p>3D panel viewing<br><br>
<input type="button" accesskey="c" class="button" value="3D+Overlay" onClick="javascript:show_jiv(jivNames, jivData, true);"><br>
<input type="button" accesskey="d" class="button" value="3D Only" onClick="javascript:show_jiv(jivNames, jivData, false);">
</p>
</div>

<div id="divBottomLeft" style="position:absolute">
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
<!-- *********************************************************
     * You may use this code for free on any web page provided that 
     * these comment lines and the following credit remain in the code.
     * Floating Div from http://www.javascript-fx.com
     ********************************************************  -->

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
JSFX_FloatDiv("divTopLeft",       10, 100).flt();
JSFX_FloatDiv("divTopRight", 	  10, 230).flt();
JSFX_FloatDiv("divBottomLeft",    10, 350).flt();
//JSFX_FloatDiv("divBottomRight", -100, -100).flt();

</script>
{/literal}

<BODY>
<!-- start main table -->
<table width="95%" border="0" cellpadding="5" cellspacing="2">
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
    <td width="10%" class="tabox" valign="top" nowrap="nowrap">
    
        <!-- Start Section on the left -->
        <table border="0" valign="top" cellpadding="1" cellspacing="1" width="100px"><tr>
        
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






