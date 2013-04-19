<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="{$css}" type="text/css" />
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<title>{$title}</title>

<!-- About this Javascript. As time goes on, one may need to update this file with new browsers and latest versions -->
{literal}
<script type="text/javascript">
<!--
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

// -->
</script>

{/literal}
</head>

<body>

<form action="{$action}" method="post">



<table align="center" bgcolor="#EEF" border="0" cellpadding="2" cellspacing="0">
    <tr>&nbsp;</tr>
	<tr>
    	<th align="left" class="banner" colspan="3" background="images/title_background.jpg">
    	    Douglas Hospital Research Centre Prevent-AD Study
	    </th>
    </tr>
    <tr>
    	<td><img src="images/douglas_logo.png" alt="Montreal Neurological Institute" border="0" width="128" height="106" /></td>
	    <td>
	        <table border="0" cellpadding="5" cellspacing="2">
        		<tr>
		            <td align="center" colspan="2">{$error_message}&nbsp;</td>
    		    </tr>
        		<tr>
	        	    <th align="right">User:</th>
		            <td align="left"><input name="username" size="40" tabindex="1" type="text" value="{$username}" /></td>
		            <td align="center" rowspan="2" valign="center"><input class="button" name="login" type="submit" value="login" /></td>
        		</tr>
	        	<tr>
		            <th align="right">Password:</th>
		            <td align="left"><input name="password" size="40" tabindex="2" type="password" /></td>
        		</tr>
                <tr>
	                <td align="center" colspan="2"><a href="lost_password.php">Forgot your password?</a></td>
	            </tr>
   	        </table>
    	</td>
	<td><img src="images/mni_logo_transparent.gif" alt="Montreal Neurological Institute" border="0" width="128" height="106" /></td>
    </tr>
    <tr>
    	<td align="left" class="tabox" colspan="2">
    	    Created By: <a href="http://www.bic.mni.mcgill.ca" target="_blank">ACE lab/McConnell Brain Imaging Centre</a>
	    </td>
    </tr>
</table>

{literal}
<script type='text/javascript'>
<!--
if(BrowserDetect.browser == "Explorer") {
	document.write('<p align="center"><b>The browser you are using (Internet Explorer) is not compatible with this database!</b><br>For full functionality please download the latest version of <a href="http://www.mozilla.com/" target="blank">Firefox.</a></p>');
}
// -->	
</script>
{/literal}

{*
{literal}
<script type='text/javascript'>
<!--
	document.write('<p><b>Browser check:</b> You\'re using ' + BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS + '!</p>');
// -->	
</script>
{/literal}
*}
</form>

</body>
</html>
