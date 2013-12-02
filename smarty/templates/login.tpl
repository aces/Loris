<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<link rel="stylesheet" href="{$css}" type="text/css"/ >
<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%">
<head>
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
<body background="images/LORIS_v2.grey.clear.png" class="LoginBackground">
<div class ="logo">

</div>
<form action="{$action}" method="post">



<!--<table align="center" bgcolor="#D3DCE3" "#ededed" border="0" cellpadding="2" cellspacing="0">-->
<table align="center" border="0" cellpadding="2" cellspacing="0" width="100%" style="height:100%" > 
<tr>
<!--td style="padding:0px"><img src="images/neuro_logo_blue.gif" alt="Montreal Neurological Institute" border="0" width="64" height="57" /></td-->
<th align="center" class="loginheader" colspan="3" style="padding:5px;"  background="images/title_background.jpg">
{$study_title}
</br>
<!--</th>
</tr>
<tr>
<th align="left" class="banner login" colspan="3" style="padding:2px;" background="images/title_background.jpg">-->
</th>
<!--td style="padding:0px;"><img src="images/mni_logo_blue.gif" alt="Montreal Neurological Institute" border="0" width="64" height="57" /></td-->

</tr>
<td align="center" colspan="2">{$error_message}&nbsp;</td>
</tr>
</table>
<br>
<table align="center" bgcolor="#D3DCE3" border="0" cellpadding="2" cellspacing="0">
    <tr>
        <th align="left" class="banner" colspan="2" >
            LORIS Login
        </th>
    </tr>
    <tr>
        <td>
            <table border="0" cellpadding="2" cellspacing="2" style="background-color:transparent;">
                <tr>
                    <td align="center" colspan="2">{$error_message}&nbsp;</td>
                </tr>
                <tr>
                    <th align="center">User:</th>
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
    </tr>
</table>
<table class="StudyWeblinks" align="center">
<tr>
<div id="footerLinks">
<td width="100%">
<ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;" >

<li id="active">|</li>
{foreach from=$studylinks item=link}
<li><a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> | </li>
{/foreach}

</ul>
</td>
</div>
</tr>

</table>
<!--img src="images/mni_logo.png" class="watermark" alt="Montreal Neurological Institute" border="0" width="100" height="83"-->
<table class="LoginFooter" align="center">
<tr>
<!--td align="center" colspan="1"><br><font color="#C40A29">A WebGL-compatible browser is required for full functionality.</font></td-->
</tr>       
<tr>
<td align="center" colspan="1" style="color:#fff" >A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)</td>
</tr>	
<tr>
<td align="center" colspan="1" style="color:#fff" >Powered by LORIS &copy; 2013. All rights reserved.</td>
</tr>	
<tr>
<td align="center" colspan="1"style="color: #fff">Created by <a href="http://cbrain.mcgill.ca" style="color: #348b8d;" target="_blank"> ACElab</a></td>
</tr>
<tr>
<td align="center" colspan="1" style="color: #fff"> Developed at <a href="http://www.mni.mcgill.ca" style="color: #348b8d;" target="_blank">Montreal Neurological Institute and Hospital</a></td>

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
