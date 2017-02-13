<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%">
<head>
<meta charset="utf-8"/>
  <script src="{$baseurl}/js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script>

<link rel="shortcut icon" href="{$baseurl}/images/mni_icon.ico" type="image/ico" />
<link rel="stylesheet" href="{$baseurl}/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="{$baseurl}/bootstrap/css/custom-css.css">
<!-- page title -->
<title>{$title}</title>

<meta name="viewport" content="width=device-width, initial-scale=1" />

</head>
<body background="" class="LoginBackground">
 	<div class="navbar navbar-default" role="navigation">
 		<div class="container">
	 		<div class="navbar-brand">
                         {if $study_logo}
		 		<img src="{$baseurl}/{$study_logo}" class="study-logo" />
                         {/if}
		 	{$study_title}
	 		</div>
	 	</div>
 	</div>
         <div id="lorisworkspace">
             {$workspace}
         </div>
</body>
</html>
