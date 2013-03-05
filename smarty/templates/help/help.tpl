<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="main.css" type="text/css" />
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />

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

<!-- top table -->
{if not $is_popup}
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="pagetitle">
    <tr>
        <td><h1>NeuroDB Manual</h1></td>
        <td align="right">
	    <p><a href="javascript:doRefresh()"><img src="images/new.gif" width="" height="" border="0" alt="" />&nbsp;Refresh page</a> |
	    <a href="javascript:window.close()"><img src="images/delete.gif" width="" height="" border="0" alt="" />&nbsp;Close window</a><br />
	    <a href="javascript:mailThisPage()"><img src="images/mail.gif" width="12" height="12" border="0" alt="" />&nbsp;E-mail this<!--/a--> |
	    <a href="javascript:window.print()"><img src="images/print.gif" width="12" height="12" border="0" alt="" />&nbsp;Print this page</a></p>
        </td>
    </tr>
</table>

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
{if $menu == true}
        <!-- left menu -->
        <td class="tabox" valign="top">
            <table border="0" cellpadding="1" cellspacing="1" width="150">
                <tr>
                    <td class="controlPanelSection">Manual</td>
                </tr>
                <tr>
		    <td class="controlPanelItem">
                        <a href="context_help_popup.php"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Front Page</a>
                    </td>
                </tr>
{section name=menu loop=$sections}
                <tr>
		    <td class="controlPanelItem">
                        <a href="context_help_popup.php?helpID={$sections[menu].helpID}"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;{$sections[menu].topic}</a>
                    </td>
                </tr>
{/section}

                <!-- empty space between the items (within the left section) -->
                <tr><td>&nbsp;</td></tr>

                <tr>
                    <td class="controlPanelSection">Links</td>
                </tr>
                <tr>
		    <td class="controlPanelItem">
                        <a href="context_help_popup.php?mode=Index"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Manual Index</a>
                    </td>
                </tr>
                <tr>
		    <td class="controlPanelItem">
                        <a href="context_help_popup.php?mode=Browse"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Browse by Topic</a>
                    </td>
                </tr>
                <tr>
		    <td class="controlPanelItem">
                        <a href="context_help_popup.php?mode=Updates"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Recent Updates</a>
                    </td>
                </tr>
                <tr>
		    <td class="controlPanelItem">
                        <a href="context_help_popup.php?helpID={$howto.helpID}"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;How to Use Help</a>
                    </td>
                </tr>
                <tr>
		    <td class="controlPanelItem">
                        <a href="context_help_popup.php?helpID={$guide.helpID}"><img src="images/transfer.gif" alt="" border="0" width="12" height="12">&nbsp;Guidelines</a>
                    </td>
                </tr>

                <!-- empty space between the items (within the left section) -->
                <tr><td>&nbsp;</td></tr>

                <tr>
                    <td class="controlPanelSection">Search</td>
                </tr>
                <tr>
		    <td class="controlPanelItem">
                        <form action="context_help_popup.php" action="post">
                        <input type="text" name="search" /><br />
                        <input type="submit" name="mode" value="Search" class="button" />
                        </form>
                    </td>
                </tr>
            </table>
        </td>
{/if}
	
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
