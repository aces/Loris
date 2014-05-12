<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%; background:transparent">
    <head>


        <link rel="stylesheet" href="{$css}" type="text/css" />
        {if $test_name_css}
            <link rel="stylesheet" href="css/instruments/{$test_name_css}" type="text/css" />
        {/if}
        <link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
        <script src="js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script>
        <script type="text/javascript" src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script>
        <!-- Custom JavaScript for the Menu Toggle -->
   
        <link type="text/css" href="css/loris-jquery/jquery-ui-1.10.4.custom.min.css" rel="Stylesheet" />

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

        <!-- Optional theme -->
        <link href="//netdna.bootstrapcdn.com/bootswatch/3.1.1/cerulean/bootstrap.min.css" rel="stylesheet">

        <!-- Latest compiled and minified JavaScript -->
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>



        <title>
            {$study_title}
        </title>

        {if $test_name_js}
            <script type="text/javascript" src="{$test_name_js}"></script>
        {/if}

        {literal}
            <script language="javascript" type="text/javascript"> 
                
                var FeedbackButtonBoolean;

                function FeedbackButtonClicked() {
                    document.cookie = "FeedbackButtonBoolean = true";
                    {/literal}
                    var thisUrl = "feedback_bvl_popup.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}";
                    {literal}
                    window.open(thisUrl, "MyWindow", "width=800, height=600, resizable=yes, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no");
                }

                function feedback_bvl_popup(features) { 
                    if (getCookie('FeedbackButtonBoolean')) {
                    {/literal}
                    var myUrl = "feedback_bvl_popup.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}";
                    {literal}
                    window.open(myUrl, "MyWindow", "width=800, height=600, resizable=yes, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no");
                    }
                }
                function open_help_section(){
                    {/literal}
                    var helpurl = "context_help_popup.php?test_name={$test_name}";
                    {literal}
                    window.open(helpurl);
                }

                function getCookie(c_name) {
                    "use strict";
                    var cookies = document.cookie.split("; "),
                        i,
                        cookie;
                    for (i = 0; i < cookies.length; i += 1) {
                        cookie = cookies[i].split("=");
                        if (cookie[0] === c_name) {
                            return cookie[1];
                        }
                    }
                    return undefined;
                }
                $(document).ready(function(){
                    $("#menu-toggle").click(function(e) {
                        e.preventDefault();
                        $("#wrapper").toggleClass("active");
                    });
                });

                
            </script>
        {/literal}
        <link type="text/css" href="css/jqueryslidemenu.css" rel="Stylesheet" />
        <script type="text/javascript" src="js/jquery/jqueryslidemenu.js"></script>
        <link href="css/simple-sidebar.css" rel="stylesheet">

        <meta name="viewport" content="width=device-width, initial-scale=1" />

    </head>
    <body {if $PopUpFeedbackBVL && ($user.permissions.superuser==true 
              || $user.permissions.access_all_profiles==true 
              || $user.user_from_study_site==true)}
                    onload="feedback_bvl_popup();" 
            {/if}
    >
        {if $dynamictabs neq "dynamictabs"}
            <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
               <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" 
                        data-target="#example-navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="glyphicon glyphicon-chevron-down"></span>
                    </button>

                    <!-- toggle sidebar in mobile view -->
                    {if $control_panel}
                        <a id="menu-toggle" href="#" class="navbar-brand">
                            <span class="glyphicon glyphicon-th-list"></span>
                        </a>
                    {/if}

                    <a class="navbar-brand" href="mainB.php">LORIS</a>
                    <a href="#" onClick="MyWindow=window.open('context_help_popup.php?test_name={$test_name}','MyWindow','toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=800,height=400'); return false;" class="navbar-brand pull-right">
                        <img width=17 src=images/help.gif>
                    </a>
                    <a href="#" onclick="FeedbackButtonClicked()" class="navbar-brand pull-right">
                        <span class="glyphicon glyphicon-edit"></span>
                    </a>
               </div>
               <div class="collapse navbar-collapse" id="example-navbar-collapse">
                    <ul class="nav navbar-nav">
                        {foreach from=$tabs item=tab}
                            {if $tab.visible == 1}
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        {$tab.label} <b class="caret"></b>
                                    </a>
                                    <ul class="dropdown-menu">
                                        {foreach from=$subtab item=mySubtab}
                                            <li>
                                                {if $tab.label == $mySubtab.parent}
                                                    {if $mySubtab.label == "Data Query Tool"}
                                                        <a href="{$mySubtab.link}" target="_blank">
                                                            {$mySubtab.label}
                                                        </a>
                                                    {else}
                                                        <a href="{$mySubtab.link}">
                                                            {$mySubtab.label}
                                                        </a>
                                                    {/if}
                                                {/if}
                                            </li>
                                        {/foreach}
                                    </ul>
                                </li> 
                            {/if}
                        {/foreach}
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <p class="navbar-text">
                                &nbsp;&nbsp;  Site: {$user.Site} &nbsp;
                            </p>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                {$user.Real_name} <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="main.php?test_name=user_accounts&subtest=my_preferences">
                                        My Preferences
                                    </a>
                                </li>
                                <li>
                                    <a href="main.php?logout=true">
                                        Log Out
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
               </div>
            </nav>
        {/if}
        <div id="page" class="container-fluid">
            {if $control_panel}
                <div id="wrapper">
                <!-- Sidebar -->
            
                    <div id="sidebar-wrapper" class="sidebar-div">
                        <br><br>
                        {$control_panel}
                    </div>
            

            <div id="page-content-wrapper">
            {/if}
                {if $dynamictabs neq "dynamictabs"}
                    <br><br><br>
                {/if}
                {if $crumbs != ""}
                <div class="page-content inset">
                    <div class="panel panel-primary">
                        
                        <div class="panel-heading">

                            {section name=crumb loop=$crumbs}
                                {if $test_name == "conflicts_resolve"}
                                    <a href="main.php/{$crumbs[crumb].query}" class="text-default">
                                        Conflicts Resolver
                                    </a> 
                                    {if not $smarty.section.crumb.last}
                                        &gt; 
                                    {/if}
                                {elseif $test_name == "statistics_dd_site"}
                                    <a href="main.php/{$crumbs[crumb].query}" class="text-default">
                                        Double Data Entry Site Statistics
                                    </a> 
                                    {if not $smarty.section.crumb.last}
                                        &gt; 
                                    {/if}
                                {else}
                                    <a href="main.php?{$crumbs[crumb].query}" style="color: white">
                                        {$crumbs[crumb].text}
                                    </a> 
                                    {if not $smarty.section.crumb.last}
                                        &gt; 
                                    {/if}
                                {/if}
                            {/section}
                        </div>
                            
                    </div>
                    <div>
                                {$workspace}
                            </div>                
                {/if}
                {if $error_message != ""}
                                    <p>
                                        The following errors occured while attempting to display this page:
                                        <ul>
                                            {section name=error loop=$error_message}
                                                <li>
                                                    <strong>
                                                        {$error_message[error]}
                                                    </strong>
                                                </li>
                                            {/section}
                                        </ul>

                                        If this error persists, please report a bug using 
                                        <a target="mantis" href="{$mantis_url}">
                                            Mantis
                                        </a>.
                                    </p>
                                    <p>
                                        <a href="javascript:history.back(-1)">
                                            Please click here to go back
                                        </a>.
                                    </p>
                                {elseif $test_name == ""}
                                    <h1 style="align:center" class="text-primary">
                                        Welcome to the LORIS Database!
                                    </h1>
                                    <div style="max-width:700px">
                                        This database provides an on-line mechanism to store both MRI and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun.
                                    </div>
                {/if}

                {if $dynamictabs neq "dynamictabs"}    
                    <div class="footer-wrapper">
                        <footer>
                            <table class="MainFooter" align="center">
                                <tr>
                                    <div id="footerLinks">
                                        <hr width = 70%>
                                        <td width="100%">
                                            <ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;" >
                                                <li id="active">
                                                    |
                                                </li>
                                                {foreach from=$links item=link}
                                                    <li>  
                                                        <a href="{$link.url}" style="color: #2FA4E7" target="{$link.windowName}">
                                                            {$link.label}
                                                        </a> 
                                                        |
                                                    </li>
                                                {/foreach}
                                            </ul>
                                        </td>
                                    </div>
                                </tr>
                                    <tr>
                                        <td align="center" colspan="1" style="color:#808080" >
                                            Powered by LORIS &copy; 2013. All rights reserved.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" colspan="1">
                                            <a href="http://cbrain.mcgill.ca" style="color: #2FA4E7" target="_blank">
                                                Created by ACElab
                                            </a>
                                        </td>
                                    </tr>
                            </table>
                            <br><br><br><br><br><br>
                        </footer>
                    </div>
                </div>
                {/if}
            </div>
            </div>
        </div>
    </body>
</html>






