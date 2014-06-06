<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%">
<head>
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<link rel="stylesheet" href="bootstrap-3.1.1/css/bootstrap.css">
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
<meta name="viewport" content="width=device-width, initial-scale=1" />

</head>
<body background="" class="LoginBackground">
	<div class ="logo">

	</div>
	
 	<div class="navbar navbar-default" role="navigation" style="height:90px">
 		<div class="container">
	 		<a class="navbar-brand" href="#" style="align:center;">
		 		<img src="{$study_logo}" border="0" width="64" height="57" />
		 		{$study_title}
	 		</a>
	 	</div>
 	</div>
 	<div class="panel panel-default col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
		  <div class="panel-body">
		  		<div class="col-xs-12">
		  			<center>
		  			<img src="images/LORIS_v2.grey.clear.png" class="img-responsive" alt="Responsive image" align="middle">
		  		</center>
		  		</div>
		  		<br><br><br><br><br>
		  		<div class="hidden-xs hidden-sm">
		  			<br><br><br><br>
		  		</div>
		  		<div class="col-xs-12">
		  			<font color="red" align="middle">
		  			{$error_message}
		  		</font>
		  		<div>
		  		<div class="col-xs-12">
		  		<form action="{$action}" method="post">
		  			<div class="form-group">
		  				<input name="username" class="form-control" type="email" value="{$username}" placeholder="User"/>
		  			</div>
		  			<div class="form-group">
		  				<input name="password" class="form-control" type="password" placeholder="Password"/>
		  			</div>
		  			<input class="btn btn-primary col-xs-12" name="login" type="submit" value="login" />
		  			<br><br><br>
		  			<a href="lost_password.php"><center>Forgot your password?</center></a>
		  		</form>
		  		</div>
		  		
		  </div>
	</div>



<!-- old study web links positioning
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
-->
<!--img src="images/mni_logo.png" class="watermark" alt="Montreal Neurological Institute" border="0" width="100" height="83"-->
<table class="LoginFooter" align="center">
<tr>
<hr width = 70%>
<td width="100%">
<ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;">

<li id="active">|</li>
{foreach from=$studylinks item=link}
<li><a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> | </li>
{/foreach}

</ul>
</td>
</tr>
<tr>
<!--td align="center" colspan="1"><br><font color="#C40A29">A WebGL-compatible browser is required for full functionality.</font></td-->
</tr>       
<tr>
<td align="center" colspan="1" style="color:#808080" >A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)</td>
</tr>	
<tr>
<td align="center" colspan="1" style="color:#808080" >Powered by LORIS &copy; 2013. All rights reserved.</td>
</tr>	
<tr>
<td align="center" colspan="1"style="color: #808080">Created by <a href="http://cbrain.mcgill.ca" style="color: #064785" target="_blank"> ACElab</a></td>
</tr>
<tr>
<td align="center" colspan="1" style="color: #808080"> Developed at <a href="http://www.mni.mcgill.ca" style="color: #064785" target="_blank">Montreal Neurological Institute and Hospital</a></td>

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
