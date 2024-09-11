<!DOCTYPE html>
<html style="height:100%; background:transparent">
    {if $dynamictabs neq "dynamictabs"}
    <head>
        <link rel="stylesheet" href="{$baseurl}/{$css}" type="text/css" />
        <link rel="stylesheet" href="{$baseurl}/fontawesome/css/all.css" type="text/css" />
        <link rel="stylesheet" href="{$baseurl}/css/tooltip.css" type="text/css" />
        <link type="image/x-icon" rel="icon" href="/images/favicon.ico">

        {*
        This can't be loaded from getJSDependencies(), because it's needs access to smarty
           variables to be instantiated, so that other js files don't need access to smarty variables
           and can access them through the loris global (ie. loris.BaseURL) *}
        <script src="{$baseurl}/js/loris.js" type="text/javascript"></script>
        <script language="javascript" type="text/javascript">
        let loris = new LorisHelper({$userjson}, {$jsonParams}, {$userPerms|json_encode}, {$studyParams|json_encode});
        </script>
        {section name=jsfile loop=$jsfiles}
            <script src="{$jsfiles[jsfile]}" type="text/javascript"></script>
        {/section}

        {section name=cssfile loop=$cssfiles}
            <link rel="stylesheet" href="{$cssfiles[cssfile]}">
        {/section}

        <title>
            {$study_title}
        </title>
        <script type="text/javascript">
          let breadcrumbsRoot;
          document.addEventListener('DOMContentLoaded', () => {
            {if $breadcrumbs|default != "" && empty($error_message)}
              const breadcrumbs = [{$breadcrumbs}];
              breadcrumbsRoot = ReactDOM.createRoot(
                document.getElementById("breadcrumbs")
              );
              breadcrumbsRoot.render(
                React.createElement(Breadcrumbs, {
                  breadcrumbs: breadcrumbs,
                  baseURL: loris.BaseURL
                })
              );
              document.title = document.title.concat(breadcrumbs.reduce(function (carry, item) {
                return carry.concat(' - ', item.text);
              }, ''));
            {/if}
            {if !$breadcrumbs|strstr:'"Edit Help Content"'}
              const helpContainers = document.getElementsByClassName('help-container');
              for (let i = 0; i < helpContainers.length; i++) {
                ReactDOM.createRoot(
                  helpContainers.item(i)
                ).render(
                  React.createElement(RHelp, {
                    testname: loris.TestName,
                    subtest: loris.Subtest,
                    baseURL: loris.BaseURL,
                  })
                );
              }
            {/if}

            // Make Navigation bar toggle change glyphicon up/down
            let navBtn = document.querySelector('.nav-button');
            navBtn.addEventListener('click', function() {
              let toggleIcon = document.querySelector('.toggle-icon');
              if (navBtn.classList.contains('collapsed')) {
                // change chevron to up
                toggleIcon.classList.remove('glyphicon-chevron-down');
                toggleIcon.classList.add('glyphicon-chevron-up');
              } else {
                // change chevron to down
                toggleIcon.classList.remove('glyphicon-chevron-up');
                toggleIcon.classList.add('glyphicon-chevron-down');
              }
            });
          });
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
            <nav class="navbar navbar-default navbar-static-top" role="navigation" id="nav-left">
               <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed nav-button" data-toggle="collapse"
                            data-target="#example-navbar-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="toggle-icon glyphicon glyphicon-chevron-down" style="color:white"></span>
                        </button>
                        <span class='help-container navbar-toggle'></span>
                       {if $bvl_feedback|default}
                       <button type="button" class="navbar-toggle">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="glyphicon glyphicon-edit" style="color:white"></span>
                        </button>
                       {/if}


                       <!-- toggle sidebar in mobile view -->
                        {if $control_panel|default}
                            <a id="menu-toggle" href="#" class="navbar-brand">
                                <span class="glyphicon glyphicon-th-list"></span>
                            </a>
                        {/if}

                       <!-- toggle feedback in mobile view -->


                        <a class="navbar-brand" href="{$baseurl}/">LORIS{if $sandbox}: DEV{/if}</a>
                   </div>
                   <div class="collapse navbar-collapse" id="example-navbar-collapse">
                        <ul class="nav navbar-nav">
                            {foreach from=$menus item=menuitems key=category}
                                 <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">{$category}<b class="caret"></b>
                                        <ul class="dropdown-menu">
                                            {section name=itemloop loop=$menuitems}
                                            <li><a href="{$menuitems[itemloop]->getLink()}">{$menuitems[itemloop]->getLabel()}</a></li>
                                            {/section}
                                        </ul>
                                    </a>
                            {/foreach}
                        </ul>
                        <ul class="nav navbar-nav navbar-right" id="nav-right">
                            {if $bvl_feedback|default}
                            <li class="hidden-xs hidden-sm">
                                <a href="#" class="navbar-toggle" data-toggle="offcanvas" data-target=".navmenu" data-canvas="body">
                                    <span class="glyphicon glyphicon-edit"></span>
                                </a>
                            </li>
                            {/if}

                            <li class="hidden-xs hidden-sm help-container"></li>
                            <li class="nav">
                                <a href="#" class="css-tooltip">
                                    Site Affiliations: {$userNumSites}
                                    <span class="tooltip-text">{$user.SitesTooltip}</span>
                                </a>
                            </li>

                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding-right:25px;">
                                    {$user.Real_name|escape} <b class="caret"></b>
                                </a>
                                <ul class="dropdown-menu">
                                    {if $my_preferences|default}
                                    <li>
                                        <a href="{$baseurl}/my_preferences/">
                                            My Preferences
                                        </a>
                                    </li>
                                    {/if}
                                    <li>
                                        <a href="{$baseurl}/?logout=true">
                                            Log Out
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                   </div>
               </div>
            </nav>
        {/if}
        <div id="page" class="container-fluid">
		{if $control_panel|default or $feedback_panel|default}
			{if $control_panel|default}
				<div id = "page_wrapper_sidebar" class ="wrapper">
			{/if}
		    <div id="bvl_panel_wrapper">
                <!-- Sidebar -->
                            {$feedback_panel|default}
			    {if $control_panel|default}
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
            <div class="page-content inset">

                {if $console}
                    <div class="alert alert-warning" role="alert">
                        <h3>Console Output</h3>
                        <div>
                        <pre>{$console}</pre>
                        </div>
                    </div>

                {/if}
                {if $breadcrumbs|default != "" && empty($error_message)}
                    <div id="breadcrumbs"></div>
                {/if}
                        <div>
                            {if $error_message|default != ""}
                                <p>
                                    The following errors occurred while attempting to display this page:
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
                                    <a target="issue_tracker_url" href="{$issue_tracker_url}">
                                        report a bug to your administrator
                                    </a>.
                                </p>
                                <p>
                                    <a href="javascript:history.back()">
                                        Please click here to go back
                                    </a>.
                                </p>
                            {/if}

                          <div id="lorisworkspace">
                            {$workspace}
                          </div>
                        </div>
            </div>


            <!-- </div> -->
	</div>

            {else}
                {$workspace}
            {/if}
		</div>

	</div>

        {if $control_panel|default or $feedback_panel|default}
        </div></div>
        {/if}

        {if $dynamictabs neq "dynamictabs"}
            {if $control_panel|default}
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
                                    <a href="{$link.url}" target="{$link.windowName}" rel="noopener noreferrer">
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
