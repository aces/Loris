<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="main.css" type="text/css" />
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />

<link type="text/css" href="css/jqueryslidemenu.css" rel="Stylesheet" />
<script src="js/jquery/jquery-1.4.2.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script>
<script type="text/javascript" src="js/jquery/jqueryslidemenu.js"></script>

{literal}
<script language="javascript" type="text/javascript">
<!--
function doEdit(f, mode) {
    var url = 'context_help_popup.php?mode=' + mode + '&helpID=' + f.helpID.value;
    window.open(url, 'help_edit', 'width=370,height=300,resizable=yes,scrollbars=yes');
}

function getFormData(f) {
    f.topic.value = window.opener.document.forms['edit'].topic.value;
    f.content.value = window.opener.document.forms['edit'].content.value;
}

function strpos(haystack, needle)
{
    for (i=0; i < haystack.length; i++) {
        if (needle == haystack.charAt(i)) {
            return i;
        }
    }        
    return -1;
}

function doRefresh()
{
    if (window.opener) {
        URL = String(window.opener.location);
        window.location = 'context_help_popup.php' + URL.substr(strpos(URL, '?'), URL.length);
    }
}
function mailThisPage()
{
	var link = window.location;
	var emailSubject = "Review article: "+ document.title;
	var emailAddress = prompt ("Please enter recipient email address","");
	var atpos=emailAddress.indexOf("@");
	var dotpos=emailAddress.lastIndexOf(".");
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
	{
		alert("Not a valid e-mail address");
		location.reload();
	}
        window.location ="mailto:"+emailAddress+"?Subject="+emailSubject+"&body="+link;

}
//-->
</script>
{/literal}

<!-- page title -->
<title>{$pagetitle|default:"NeuroDB Manual"}</title>
<!-- end page header -->
</head>
<body>
<form action="context_help_popup.php" method="get">
<table width="100%" class="header">
<tr>
<th align="left" id="jsheader">
<div id="slidemenu" class="jqueryslidemenu">
<ul>
<li><a href="context_help_popup.php"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Front Page</a></li>
<li><a href="#">Actions</a>
<ul>
<a href="context_help_popup.php?mode=Index"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Manual Index</a>
<a href="context_help_popup.php?mode=Browse"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Browse by Topic</a>
<a href="context_help_popup.php?mode=Updates"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Recent Updates</a>
<a href="context_help_popup.php?helpID={$howto.helpID}"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;How to Use Help</a>
<a href="context_help_popup.php?helpID={$guide.helpID}"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Guidelines</a>
</ul>
</li>
<div class="Account">
<li align="right">
<input type="text" name="search" /><br />
</li>
<li>
<input type="submit" name="mode" value="Search" class="button" />
</li>
</div>
</ul>
</div>
</th>
</tr>
</table>
</form>

<!-- top table -->
{if not $is_popup}
{if $error_message}
<!-- table with error messages -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" >
    <tr>
        <th>The following errors have occured:</th>
    </tr>
{section name=message loop=$error_message}
    <tr>
        <td nowrap="nowrap">{$error_message[message]}</td>
    </tr>
{/section}
</table>
{else}

<!-- main table -->
<table border="0" cellpadding="3" cellspacing="2" width="100%">
    <tr>
	<!-- right content -->
        <td width="100%" class="tabox" valign="top">
{/if}
{$page_data}
{if not $is_popup}
        </td>
    </tr>
</table>
{/if}
{/if}

</body>
</html>
