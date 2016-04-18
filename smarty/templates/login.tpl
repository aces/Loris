<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%">
<head>
<meta charset="utf-8"/>
  <script src="{$baseurl}/js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script>

<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="{$baseurl}/images/mni_icon.ico" type="image/ico" />
<link rel="stylesheet" href="{$baseurl}/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="{$baseurl}/bootstrap/css/custom-css.css">
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
{/literal}

    /*
$(document).ready(function() {
    $("#loginAPI").click(function(e) {
        var username = document.getElementById("username").value,
            password = document.getElementById("password").value,
            error = document.getElementById("error");

        e.preventDefault();

        error.textContent = '';
        $.ajax("api/v0.0.1/login", {
            method: 'POST',
            data: {
                "username" : username,
                "password" : password
            },
            success: function(data) {
                var data = JSON.parse(data);
                var token = data.token;
                $.ajax("", {
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + token);
                    },
                    success: function() {
                        window.location = "{$baseurl}/main.php";
                    },
                    error: function() {
                        window.location = "{$baseurl}/main.php";
                    }
                });
            },
            error: function(data) {
                error.textContent = JSON.parse(data.responseText).error;
            }
        });
    });
});
    */
// -->
</script>

<meta name="viewport" content="width=device-width, initial-scale=1" />

</head>
<body background="" class="LoginBackground">
	<div class ="logo">

	</div>
	
 	<div class="navbar navbar-default" role="navigation" style="height:90px">
 		<div class="container">
	 		<div class="navbar-brand">
                {if $study_logo}
		 		<img src="{$baseurl}/{$study_logo}" border="0" width="64" height="57" />
                {/if}
		 		{$study_title}
	 		</div>
	 	</div>
 	</div>
   <div class="col-xs-12"> <!--maindiv start -->
    <div class="row panel panel-default col-xs-6 col-xs-offset-1">
        <div class="panel-body">
            {$study_description}
         </div>
    </div>
 	<div class="row panel panel-default col-xs-4 col-xs-offset-1">
		  <div class="panel-body">
		  		<div class="col-xs-12">
		  			<center>
		  				<img src="{$baseurl}/images/LORIS_logo.svg" class="img-responsive" alt="Responsive image" onerror="this.src='{$baseurl}/images/LORIS_logo.png'" align="middle" width="85%"> 
		  			</center>
					<br>
		  		</div>
		  		<div class="hidden-xs hidden-sm">
		  			<br><br><br><br>
		  		</div>
		  		<div class="col-xs-12">
		  			<font color="red" align="middle" id="error">
		  				{$error_message}
		  			</font>
		  		</div>
		  		<div class="row">
                    <form action="{$action}" method="post">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <input id="username" name="username" class="form-control" type="text" value="{$username}" placeholder="User"/>
                            </div>
                            <div class="form-group">
                                <input id="password" name="password" class="form-control" type="password" placeholder="Password"/>
                            </div>
                                <input class="btn btn-primary col-xs-12" id="loginAPI" name="login" type="submit" value="Login" />
                            <br><br><br>
                            <a href="lost_password.php"><center>Forgot your password?</center></a>
                            <a href="request_account/process_new_account.php"><center>Request Account</center></a>
                        </div>
                    </form>
			  	</div>	
		  		<div class="row">
		  		<table class="LorisFooter" align="center">
					<tr>
					<hr width = 70%>
					<td width="100%">
                    {if $studylinks}
                    <center>
					<ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;">

					<li id="active">|</li>
					{foreach from=$studylinks item=link}
					<li><a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> | </li>
					{/foreach}

					</ul>
                    </center>
                    {/if}
					</td>
					</tr>
					<tr>
                    <br>
					<td align="center" colspan="1">A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)</td>
					</tr>	
					<tr>
					<td align="center" colspan="1">Powered by LORIS &copy; {$currentyear}. All rights reserved.</td>
					</tr>	
					<tr>
					<td align="center" colspan="1">Created by <a href="http://mcin-cnim.ca" style="color: #064785" target="_blank">MCIN</a></td>
					</tr>
					<tr>
					<td align="center" colspan="1">Developed at <a href="http://www.mni.mcgill.ca" style="color: #064785" target="_blank">Montreal Neurological Institute and Hospital</a></td>

					</tr>
				</table>
				</div>
		  </div>
	</div>
  </div> <!--closing maindiv -->


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
