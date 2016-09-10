<!DOCTYPE html>
<html style="height:100%; background:transparent">
    {if $dynamictabs neq "dynamictabs"}
    <head>
        <link rel="stylesheet" href="{$baseurl}/{$css}" type="text/css" />
        <link rel="shortcut icon" href="{$baseurl}/images/mni_icon.ico" type="image/ico" />

        {* 
        This can't be loaded from getJSDependencies(), because it's needs access to smarty
           variables to be instantiated, so that other js files don't need access to smarty variables
           and can access them through the loris global (ie. loris.BaseURL) *}
        <script src="{$baseurl}/js/loris.js" type="text/javascript"></script>
        <script language="javascript" type="text/javascript">
        var loris = new LorisHelper({$jsonParams}, {$userPerms|json_encode}, {$studyParams|json_encode});
        </script>
        {section name=jsfile loop=$jsfiles}
            <script src="{$jsfiles[jsfile]}" type="text/javascript"></script>
        {/section}
        <script>
            $.webshims.polyfill();
        </script>

        <!-- Custom JavaScript for the Menu Toggle -->
   
        <link type="text/css" href="{$baseurl}/css/loris-jquery/jquery-ui-1.10.4.custom.min.css" rel="Stylesheet" />

	{section name=cssfile loop=$cssfiles}
		<link rel="stylesheet" href="{$cssfiles[cssfile]}">
	{/section}

        <title>
            {$study_title}
            {if $crumbs != ""}
                {section name=crumb loop=$crumbs}
                    - {$crumbs[crumb].text}
                {/section}
            {/if}
        </title>
            <script language="javascript" type="text/javascript">
                $(document).ready(function(){
                    {if $crumbs != "" && empty($error_message)}
                        var crumbs = {$crumbs|@json_encode},
                            baseurl = "{$baseurl}",
                            breadcrumbs = RBreadcrumbs({
                                breadcrumbs: crumbs,
                                baseURL: baseurl
                            });
                        React.render(breadcrumbs, document.getElementById("breadcrumbs"));
                    {/if}
                })
            </script>
        <link type="text/css" href="{$baseurl}/css/jqueryslidemenu.css" rel="Stylesheet" />
        <link href="{$baseurl}/css/simple-sidebar.css" rel="stylesheet">

         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </head>
    {/if}
    <body>
    {* Defining a FormAction variable will allow use to define
       a form element which covers the scope of both the sidebar,
       and the workspace. This let's us put controls for the main
       page inside of the side panel.
    *}
        {if $FormAction} 
        <form action="{$FormAction}" method="post">
        {/if}
	    
    <div id="wrap">
        {if $dynamictabs neq "dynamictabs"}
            <nav class="navbar navbar-default navbar-fixed-top" role="navigation" id="nav-left">
               <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse"
                        data-target="#example-navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="glyphicon glyphicon-chevron-down" style="color:white"></span>
                    </button>
                    <button type="button" class="navbar-toggle help-button">
                        <span class="sr-only">Toggle navigation</span>
                        <img width=17 src="{$baseurl}/images/help.gif">
                    </button>
                   {if $bvl_feedback}
                   <button type="button" class="navbar-toggle">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="glyphicon glyphicon-edit" style="color:white"></span>
                    </button>
                   {/if}


                   <!-- toggle sidebar in mobile view -->
                    {if $control_panel}
                        <a id="menu-toggle" href="#" class="navbar-brand">
                            <span class="glyphicon glyphicon-th-list"></span>
                        </a>
                    {/if}

                   <!-- toggle feedback in mobile view -->


                    <a class="navbar-brand" href="{$baseurl}/">LORIS{if $sandbox}: DEV{/if}</a>
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
                                                {if substr($mySubtab.Link,0,4) eq 'http'}
                                                    <li>
                                                        <a href="{$mySubtab.Link}">
                                                            {$mySubtab.Label}
                                                        </a>
                                                    </li>
                                                {else}
                                                    <li>
                                                        <a href="{$baseurl}/{$mySubtab.Link}">
                                                            {$mySubtab.Label}
                                                        </a>
                                                    </li>
                                                {/if}
                                            {/if}
                                        {/foreach}
                                    </ul>
                                </li> 
                            {/if}
                        {/foreach}
                    </ul>
                    <ul class="nav navbar-nav navbar-right" id="nav-right">
                        {if $bvl_feedback}
                        <li class="hidden-xs hidden-sm">
                            <a class="navbar-toggle" data-toggle="offcanvas" data-target=".navmenu" data-canvas="body">
                                <span class="glyphicon glyphicon-edit"></span>
                            </a>
                        </li>
                        {/if}

                        <li class="hidden-xs hidden-sm">
                            <a href="#" class="navbar-brand pull-right help-button">
                                <img width=17 src="{$baseurl}/images/help.gif">
                            </a>
                        </li>
                        <li>
                            <p class="navbar-text">
                                &nbsp;&nbsp;  Site: {$user.Site} &nbsp;
                            </p>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding-right:25px;">
                                {$user.Real_name|escape} <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="{$baseurl}/preferences/">
                                        My Preferences
                                    </a>
                                </li>
                                <li>
                                    <a href="{$baseurl}/main.php?logout=true">
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
		{if $control_panel or $feedback_panel}
			{if $control_panel}
				<div id = "page_wrapper_sidebar" class ="wrapper">
			{/if}
		    <div id="bvl_panel_wrapper">
                <!-- Sidebar -->
                            {$feedback_panel}
			    {if $control_panel}
                    <div id="sidebar-wrapper" class="sidebar-div">
                       <div id="sidebar-content">
                            {$control_panel}
                        </div>
                    </div>
		    {/if}
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
                {if $crumbs != "" && empty($error_message)}
                    <div id="breadcrumbs"></div>
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
                                        <table cellpadding="2" class="table table-info table-bordered dynamictable" style="max-width:auto">
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
                                                                {$timePoint.Scan_done|default:"<img alt=\"Data Missing\" src=\"$baseurl/images/help2.gif\" width=\"12\" height=\"12\" />"}
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
                                <div id="lorisworkspace">
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

        {if $control_panel or $feedback_panel}
        </div></div>
        {/if}

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
                                    <a href="{$link.url}" target="{$link.windowName}">
                                        {$link.label}
                                    </a>
                                    |
                                </li>
                        {/foreach}
                    </ul>    
                </center>
                <div align="center" colspan="1">
                    Powered by LORIS &copy; {$currentyear}. All rights reserved.
                </div>
      		<div align="center" colspan="1">
                    Created by <a href="http://mcin-cnim.ca/" target="_blank">
                         MCIN
                    </a>
                </div>
            </div>
        {/if}
        {if $FormAction} 
        </form> 
        {/if}
    </body>
</html>
