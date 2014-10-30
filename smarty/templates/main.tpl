<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%; background:transparent">
    {if $dynamictabs neq "dynamictabs"}
    <head>
        <link rel="stylesheet" href="{$css}" type="text/css" />
        <link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
        <script src="js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script>
        <script type="text/javascript" src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script>
        <script type="text/javascript" src="js/jquery.dynamictable.js"></script>
        <!-- Custom JavaScript for the Menu Toggle -->
   
        <link type="text/css" href="css/loris-jquery/jquery-ui-1.10.4.custom.min.css" rel="Stylesheet" />

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="bootstrap/css/custom-css.css">
        <!-- <link rel="stylesheet" href="bootstrap-3.1.1/css/magic-bootstrap.css"> -->

        <!-- Module-specific CSS -->
        {if $test_name_css}
            <link rel="stylesheet" href="{$test_name_css}" type="text/css" />
        {/if}

        <!-- Latest compiled and minified JavaScript -->
        <script src="bootstrap/js/bootstrap.min.js"></script>
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
                    w = window.open(thisUrl, "MyWindow", "width=800, height=600, resizable=yes, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no");
                    w.focus();
                }

                function feedback_bvl_popup(features) { 
                    if (getCookie('FeedbackButtonBoolean')) {
                    {/literal}
                    var myUrl = "feedback_bvl_popup.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}";
                    {literal}
                    w = window.open(myUrl, "MyWindow", "width=800, height=600, resizable=yes, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no");
                    w.focus();
                    }
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
                        $(".wrapper").toggleClass("active");
                    });
                    $(".dropdown").hover(function(){
                        $(this).toggleClass('open');
                    });
                    $(".help-button").click(function(e) {
                        var getParams = {};
                        {/literal}
                        {if $test_name}
                            getParams.test_name = "{$test_name|escape:"javascript"}";
                        {/if}
                        {if $subtest}
                            getParams.subtest = "{$subtest|escape:"javascript"}";
                        {/if}
                        {literal}
                        document.cookie = 'LastUrl=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
                        $.get("AjaxHelper.php?Module=help_editor&script=help.php", getParams, function (content) {
                                var div = document.createElement("div"),
                                    pre = document.createElement("pre"),
                                    btn = document.createElement("BUTTON"),
                                    edit = document.createElement("BUTTON"),
                                    text = document.createTextNode("Edit"),
                                    button = document.createTextNode("Close");

                                pre.innerHTML = "<h3>" + content.topic + "</h3>";
                                pre.innerHTML += content.content;
                                pre.innerHTML =  pre.innerHTML + "<hr>Last updated: " + content.updated ;
                                btn.appendChild(button);
                                btn.className="btn btn-default";
                                btn.setAttribute("id","helpclose");
                                edit.appendChild(text);
                                edit.className="btn btn-default";
                                edit.setAttribute("id", "helpedit");
                                div.appendChild(pre);
                                div.appendChild(btn);
                                {/literal}
                                {if $hasHelpEditPermission}
                                    div.appendChild(edit);
                                {/if}
                                {literal}
                                document.getElementById('page').appendChild(div);
                                div.setAttribute("class", "help-content");
                                btn.addEventListener("click", function(e) {
                                    $(div).hide();      
                                    e.preventDefault(); 
                                }) ;
                                edit.addEventListener("click", function(e) {
                                    document.cookie = "LastUrl = " + document.location.toString();
                                    window.open("main.php?test_name=help_editor&subtest=edit_help_content&section="
                                    +getParams.test_name+"&subsection="+getParams.subtest, "_self");      
                                    e.preventDefault(); 
                                }) ;
                        }, "json");
                        e.preventDefault();
                    });

                    $(".dynamictable").DynamicTable();
                });

                
            </script>
        {/literal}
        <link type="text/css" href="css/jqueryslidemenu.css" rel="Stylesheet" />
        <script type="text/javascript" src="js/jquery/jqueryslidemenu.js"></script>
        <link href="css/simple-sidebar.css" rel="stylesheet">

         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </head>
    {/if}
    <body>
    <div id="wrap">
        {if $dynamictabs neq "dynamictabs"}
            <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
               <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" 
                        data-target="#example-navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="glyphicon glyphicon-chevron-down" style="color:white"></span>
                    </button>
                    <button type="button" class="navbar-toggle help-button">
                        <span class="sr-only">Toggle navigation</span>
                        <img width=17 src=images/help.gif>
                    </button>
                    <button type="button" class="navbar-toggle" onclick="FeedbackButtonClicked()">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="glyphicon glyphicon-edit" style="color:white"></span>
                    </button>

                    <!-- toggle sidebar in mobile view -->
                    {if $control_panel}
                        <a id="menu-toggle" href="#" class="navbar-brand">
                            <span class="glyphicon glyphicon-th-list"></span>
                        </a>
                    {/if}

                    <a class="navbar-brand" href="main.php">LORIS{if $sandbox}: DEV{/if}</a>
               </div>
               <div class="collapse navbar-collapse" id="example-navbar-collapse">
                    <ul class="nav navbar-nav">
                        {foreach from=$tabs item=tab}
                            {if $tab.Visible == 1 && $tab.subtabs}
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle">
                                        {$tab.Label} <b class="caret"></b>
                                    </a>
                                    <ul class="dropdown-menu">
                                        {foreach from=$tab.subtabs item=mySubtab}
                                            {if $mySubtab.Visible == 1}
                                            <li>
                                                        <a href="{$mySubtab.Link}">
                                                            {$mySubtab.Label}
                                                        </a>
                                            </li>
                                            {/if}
                                        {/foreach}
                                    </ul>
                                </li> 
                            {/if}
                        {/foreach}
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="hidden-xs hidden-sm">
                            <a href="#" onclick="FeedbackButtonClicked()" class="navbar-brand pull-right">
                                <span class="glyphicon glyphicon-edit"></span>
                            </a>
                        </li>
                        <li class="hidden-xs hidden-sm">
                            <a href="#" class="navbar-brand pull-right help-button">
                                <img width=17 src=images/help.gif>
                            </a>
                        </li>
                        <li>
                            <p class="navbar-text">
                                &nbsp;&nbsp;  Site: {$user.Site} &nbsp;
                            </p>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding-right:25px;">
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
                <div class="wrapper">
                <!-- Sidebar -->
            
                    <div id="sidebar-wrapper" class="sidebar-div">
                        <div id="sidebar-content">
                            {$control_panel}
                        </div>
                    </div>
            
        <!--    Want to wrap page content only when sidebar is in view
                if not then just put page content in the div #page    -->
        <div id="page-content-wrapper">
            {/if}
            {if $dynamictabs eq "dynamictabs"}
                {if $console}
                    <div class="alert alert-warning" role="alert">
                        <h3>Console Output</h3>
                        <div>
                        <pre>{$console}</pre>
                        </div>
                    </div>
                {/if}

            {/if}
            {if $dynamictabs neq "dynamictabs"}
            {* Add enough spacing to get below the menu *}
                <br><br><br>
            <div class="page-content inset">
                {if $console}
                    <div class="alert alert-warning" role="alert">
                        <h3>Console Output</h3>
                        <div>
                        <pre>{$console}</pre>
                        </div>
                    </div>

                {/if}
                <!-- <div class="panel panel-primary"> -->
                    
                    {if $crumbs != ""}
                        <div class="alert alert-info alert-sm">
                            {section name=crumb loop=$crumbs}
                                {if $test_name == "conflicts_resolve"}
                                    <a href="main.php/{$crumbs[crumb].query}" class="text-default" style="color: white">
                                        <label>Conflicts Resolver</label>
                                    </a> 
                                    {if not $smarty.section.crumb.last}
                                        &gt; 
                                    {/if}
                                {elseif $test_name == "statistics_dd_site"}
                                    <a href="main.php/{$crumbs[crumb].query}" class="text-default">
                                        <label>Double Data Entry Site Statistics</label>
                                    </a> 
                                    {if not $smarty.section.crumb.last}
                                        &gt; 
                                    {/if}
                                {else}
                                    <a href="main.php?{$crumbs[crumb].query}" style="color: white">
                                        <label>{$crumbs[crumb].text}</label>
                                    </a> 
                                    {if not $smarty.section.crumb.last}
                                        &gt; 
                                    {/if}
                                {/if}
                            {/section}
                        </div>
                    {/if}
                        <div>
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

                                    If this error persists, please 
                                    <a target="mantis" href="{$mantis_url}">
                                        report a bug to your administrator
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
                            {else}
                                {if $candID != ""}
                                    <!-- table with candidate profile info -->
                                    <div class="table-responsive">
                                        <table cellpadding="2" class="table table-info table-bordered" style="max-width:auto">
                                            <!-- column headings -->
                                            <thead>
                                                <tr class="info">
                                                        <th>
                                                            DOB
                                                        </th>
                                                        {if $candidate.EDC!=""}
                                                            <th>
                                                                EDC
                                                            </th>
                                                        {/if}
                                                        <th>
                                                            Gender
                                                        </th>
                                                        {if $candidate.ProjectTitle != ""}
                                                            <th>
                                                                Project
                                                            </th>
                                                        {/if}
                                                        {foreach from=$candidate.DisplayParameters item=value key=name}
                                                            <th>
                                                                {$name}
                                                            </th>
                                                        {/foreach}
                                                        {if $sessionID != ""}
                                                            <th>
                                                                Visit Label
                                                            </th>
                                                            <th>
                                                                Visit to Site
                                                            </th>
                                                            <th>
                                                                Subproject
                                                            </th>
                                                            <th>
                                                                MR Scan Done
                                                            </th>
                                                            {* 
                                                                <th>
                                                                    Age During Visit
                                                                </th> 
                                                            *}
                                                            <th>
                                                                Within Optimal
                                                            </th>
                                                            <th>
                                                                Within Permitted
                                                            </th>
                                                            {if $SupplementalSessionStatuses }
                                                                {foreach from=$timePoint.status item=status key=name}
                                                                    <th>
                                                                        {$name}
                                                                    </th>
                                                                {/foreach}
                                                            {/if}
                                                        {/if}
                                                </tr>
                                            </thead>
                                            <!-- candidate data --> 
                                            <tbody>   
                                                    <tr>
                                                        <td>
                                                            {$candidate.DoB}
                                                        </td>
                                                        {if $candidate.EDC!=""}
                                                            <td>
                                                                {$candidate.EDC}
                                                            </td>
                                                        {/if}
                                                        <td>
                                                            {$candidate.Gender}
                                                        </td>
                                                        {if $candidate.ProjectTitle != ""}
                                                            <td>
                                                                {$candidate.ProjectTitle}
                                                            </td>
                                                        {/if}
                                                        {foreach from=$candidate.DisplayParameters item=value key=name}
                                                            <td>
                                                                {$value}
                                                            </td>
                                                        {/foreach}

                                                        {if $sessionID != ""}
                                                            <!-- timepoint data -->
                                                            <td>
                                                                {$timePoint.Visit_label}
                                                            </td>
                                                            <td>
                                                                {$timePoint.PSC}
                                                            </td>
                                                            <td>
                                                                {$timePoint.SubprojectTitle}
                                                            </td>
                                                            <td>
                                                                {$timePoint.Scan_done|default:"<img alt=\"Data Missing\" src=\"images/help2.gif\" width=\"12\" height=\"12\" />"}
                                                            </td>
                                                            {* 
                                                                <td>
                                                                    {$timePoint.WindowInfo.AgeDays}
                                                                </td> 
                                                            *}
                                                            <td>
                                                                {if $timePoint.WindowInfo.Optimum}
                                                                    Yes
                                                                {else}
                                                                    No
                                                                {/if}
                                                            </td>
                                                            <td {if not $timePoint.WindowInfo.Optimum}class="error"{/if}>
                                                                {if $timePoint.WindowInfo.Permitted}
                                                                    Yes
                                                                {else}
                                                                    No
                                                                {/if}
                                                            </td>
                                                            {if $SupplementalSessionStatuses }
                                                                {foreach from=$timePoint.status item=status}
                                                                    <td>
                                                                        {$status}
                                                                    </td>
                                                                {/foreach}
                                                            {/if}
                                                        {/if}
                                                    </tr>
                                            </tbody>  
                                        </table>
                                    </div>

                                    {if $sessionID != ""}
                                        <div class="table-responsive">
                                            <table class="table table-bordered">
                                                <!-- visit statuses -->
                                                <thead>
                                                    <tr class="info">
                                                        <th nowrap="nowrap" colspan="3">
                                                            Stage
                                                        </th>
                                                        <th nowrap="nowrap" colspan="3">
                                                            Status
                                                        </th>
                                                        <th nowrap="nowrap" colspan="2">
                                                            Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td nowrap="nowrap" colspan="3">
                                                            Screening
                                                        </td>
                                                        <td nowrap="nowrap" colspan="3">
                                                            {$timePoint.Screening}
                                                        </td>
                                                        <td nowrap="nowrap" colspan="2">
                                                            {$timePoint.Date_screening}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td nowrap="nowrap" colspan="3">
                                                            Visit
                                                        </td>
                                                        <td nowrap="nowrap" colspan="3">
                                                            {$timePoint.Visit}
                                                        </td>
                                                        <td nowrap="nowrap" colspan="2">
                                                            {$timePoint.Date_visit}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td nowrap="nowrap" colspan="3">
                                                            Approval
                                                        </td>
                                                        <td nowrap="nowrap" colspan="3">
                                                            {$timePoint.Approval}
                                                        </td>
                                                        <td nowrap="nowrap" colspan="2">
                                                            {$timePoint.Date_approval}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    {/if}
                                {/if}
                                <div id="kgkjgkjg">
                                    {$workspace}
                                </div>  
                            {/if}
                        </div>
                         
                        
                    </div>              
                
                

                   
                <!-- </div> -->
            </div>
            {else}
                {$workspace}
            {/if}
        </div>
        </div>
        </div>
        {if $dynamictabs neq "dynamictabs"}
            {if $control_panel}
            <div id="footer" class="footer navbar-bottom wrapper">
            {else}
            <div id="footer" class="footer navbar-bottom">
            {/if}
                <center>
                    <ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;">
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
                </center>
                <div align="center" colspan="1" style="color:#808080" >
                    Powered by LORIS &copy; {$currentyear}. All rights reserved.
                </div>
      		<div align="center" colspan="1" style="color:#808080">
                    Created by <a href="http://mcin-cnim.ca/" style="color: #2FA4E7" target="_blank">
                         MCIN
                    </a>
                </div>
            </div>
        {/if}
    </body>
</html>
