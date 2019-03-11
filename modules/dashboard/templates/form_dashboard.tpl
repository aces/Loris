<link rel="stylesheet" href="{$baseurl}/css/c3.css">

<div class="row">
    <div class="col-lg-8">

        <!-- Welcome panel -->
        <div class="panel panel-default">
            <div class="panel-body">
                <h3 class="welcome">Welcome, {$username}.</h3>
                <p class="pull-right small login-time">Last login: {$last_login}</p>
                {if !is_null($project_description)}
                    <p class="project-description">{$project_description}</p>
                {/if}
            </div>
            <!-- Only add the welcome panel footer if there are links -->
            {if $dashboard_links neq ""}
                <div class="panel-footer">|
                    {foreach from=$dashboard_links item=link}
                        <a href="{$link.url}" target="{$link.windowName}">{$link.label}</a>
                        |
                    {/foreach}
                </div>
            {/if}
        </div>

        <!-- Recruitment -->
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Recruitment</h3>
                <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                <div class="pull-right">
                    <div class="btn-group views">
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                            Views
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu pull-right" role="menu">
                            <li class="active"><a data-target="overall-recruitment">View overall recruitment</a></li>
                            <li><a data-target="recruitment-site-breakdown">View site breakdown</a></li>
                            {if $useProjects eq "true"}
                                <li><a data-target="recruitment-project-breakdown">View project breakdown</a></li>
                            {/if}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <div class="recruitment-panel" id="overall-recruitment">
                    {include file='progress_bar.tpl' project=$recruitment["overall"]}
                </div>
                <div class="recruitment-panel hidden" id="recruitment-site-breakdown">
                    {if $recruitment['overall']['total_recruitment'] neq 0}
                        <div class="col-lg-4 col-md-4 col-sm-4">
                            <div>
                                <h5 class="chart-title">Total recruitment per site</h5>
                                <div id="recruitmentPieChart"></div>
                            </div>
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-8">
                            <div>
                                <h5 class="chart-title">Biological sex breakdown by site</h5>
                                <div id="recruitmentBarChart"></div>
                            </div>
                        </div>
                    {else}
                        <p>There have been no candidates registered yet.</p>
                    {/if}
                </div>
                {if $useProjects eq "true"}
                    <div class="recruitment-panel hidden" id="recruitment-project-breakdown">
                        {foreach from=$recruitment key=ID item=project}
                            {if $ID != "overall"}
                                {include file='progress_bar.tpl' project=$project}
                            {/if}
                        {/foreach}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Charts -->
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Study Progression</h3>
                <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                <div class="pull-right">
                    <div class="btn-group views">
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                            Views
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu pull-right" role="menu">
                            <li class="active"><a data-target="scans-line-chart-panel">View scans per site</a></li>
                            <li><a data-target="recruitment-line-chart-panel">View recruitment per site</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <div id="scans-line-chart-panel">
                    <h5 class="chart-title">Scan sessions per site</h5>
                    {if $total_scans neq 0}
                        <div id="scanChart"></div>
                    {else}
                        <p>There have been no scans yet.</p>
                    {/if}
                </div>
                <div id="recruitment-line-chart-panel" class="hidden">
                    <h5 class="chart-title">Recruitment per site</h5>
                    {if $recruitment['overall']['total_recruitment'] neq 0}
                        <div id="recruitmentChart"></div>
                    {else}
                        <p>There have been no candidates registered yet.</p>
                    {/if}
                </div>
            </div>
        </div>
        <small><i>Note that the Recruitment and Study Progression charts include data from ineligible, excluded, and consent withdrawn candidates.</i></small>
    </div>

    <div class="col-lg-4">
        <!-- My Tasks -->
        {if $new_scans neq "" or $conflicts neq "" or $incomplete_forms neq "" or $radiology_review neq "" or $violated_scans neq "" or $pending_users neq "" or $issues_assigned neq ""}
            <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">My Tasks</h3>
                        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div class="list-group tasks">
                            {if $conflicts neq "" and $conflicts neq 0}
                                <a href="{$baseURL}/conflict_resolver/" class="list-group-item conflict_resolver">
                                    <div class="row">
                                        <div class="col-xs-8 text-left">
                                            <div class="huge">{$conflicts}</div>
                                            Data entry conflict{if $conflicts neq 1}s{/if}
                                        </div>
                                        <div class="col-xs-4 text-right alert-chevron">
                                            <span class="glyphicon glyphicon-chevron-right medium"></span>
                                            <p class="small task-site">{$conflicts_site}</p>
                                        </div>
                                    </div>
                                </a>
                            {/if}
                            {if $incomplete_forms neq "" and $incomplete_forms neq 0}
                                {if $incomplete_forms_site eq "Sites: all"}
                                     <a href="{$baseURL}/statistics/statistics_site" class="list-group-item statistics">
                                        <div class="row">
                                            <div class="col-xs-8 text-left">
                                                <div class="huge">{$incomplete_forms}</div>
                                                Incomplete form{if $incomplete_forms neq 1}s{/if}
                                            </div>
                                            <div class="col-xs-4 text-right alert-chevron">
                                                <span class="glyphicon glyphicon-chevron-right medium"></span>
                                                <p class="small task-site">{$incomplete_forms_site}</p>
                                            </div>
                                        </div>
                                     </a>
                                {else}
                                    <div class="list-group-item">
                                        <div class="row">
                                            <div class="col-xs-8 text-left">
                                                <div class="huge">{$incomplete_forms}</div>
                                                Incomplete form{if $incomplete_forms neq 1}s{/if}
                                            </div>
                                            <div class="col-xs-4 text-right alert-chevron">
                                                {foreach from=$user_site key=ind item=centerID}
                                                    <a href="{$baseURL}/statistics/statistics_site/?CenterID={$centerID}">
                                                        <p style="color:#555" class="small task-site">{$incomplete_forms_site.$ind}
                                                            <span class="glyphicon glyphicon-chevron-right small"></span>
                                                        </p>
                                                    </a>
                                                {/foreach}
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            {/if}
                                {if $new_scans neq "" and $new_scans neq 0}
                                    <a href="{$baseURL}/imaging_browser/" class="list-group-item new-scans">
                                        <div class="row">
                                            <div class="col-xs-8 text-left">
                                                <div class="huge">{$new_scans}</div>
                                                New and pending imaging session{if $new_scans neq 1}s{/if}
                                            </div>
                                            <div class="col-xs-4 text-right alert-chevron">
                                                <span class="glyphicon glyphicon-chevron-right medium"></span>
                                                <p class="small task-site">{$new_scans_site}</p>
                                            </div>
                                        </div>
                                    </a>
                                {/if}
                                {if $violated_scans neq "" and $violated_scans neq 0}
                                    <a href="{$baseURL}/mri_violations/" class="list-group-item mri_violations">
                                        <div class="row">
                                            <div class="col-xs-8 text-left">
                                                <div class="huge">{$violated_scans}</div>
                                                Violated scan{if $violated_scans neq 1}s{/if}
                                            </div>
                                            <div class="col-xs-4 text-right alert-chevron">
                                                <span class="glyphicon glyphicon-chevron-right medium"></span>
                                                <p class="small task-site">{$violated_scans_site}</p>
                                            </div>
                                        </div>
                                    </a>
                                {/if}
                                {if $pending_users neq "" and $pending_users neq 0}
                                    <a href="{$baseURL}/user_accounts/" class="list-group-item pending-accounts">
                                        <div class="row">
                                            <div class="col-xs-8 text-left">
                                                <div class="huge">{$pending_users}</div>
                                                Account{if $pending_users neq 1}s{/if} pending approval
                                            </div>
                                            <div class="col-xs-4 text-right alert-chevron">
                                                <span class="glyphicon glyphicon-chevron-right medium"></span>
                                                <p class="small task-site">{$pending_users_site}</p>
                                            </div>
                                        </div>
                                    </a>
                                {/if}
                                {if $issues_assigned neq "" and $issues_assigned neq 0}
                                    {*submit a post request here so its already filtered?*}
                                    <a href="{$baseURL}/issue_tracker/?submenu=my_issue_tracker" class="list-group-item issue_tracker">
                                        <div class="row">
                                            <div class="col-xs-8 text-left">
                                                <div class="huge">{$issues_assigned}</div>
                                                Issue{if $issues_assigned neq 1}s{/if} assigned to you
                                            </div>
                                            <div class="col-xs-4 text-right alert-chevron">
                                                <span class="glyphicon glyphicon-chevron-right medium"></span>
                                                <p class="small task-site">{$issues_assigned_site}</p>
                                            </div>
                                        </div>
                                    </a>
                                {/if}
                        </div>
                    </div>
                    <!-- /.panel-body -->
                </div>
            </div>
        {/if}

        <!-- Document Repository -->
        {if $document_repository_notifications neq ""}
            <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Document Repository Notifications</h3>
                        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div class="list-group document-repository-item">
                            {foreach from=$document_repository_notifications item=link}
                                <a href="/document_repository/Files/{$link.Data_dir}"
                                   download="{$link.File_name}" class="list-group-item">
                                    {if $link.new eq 1}
                                        <span class="pull-left new-flag">NEW</span>
                                    {/if}
                                    <span class="pull-right text-muted small">Uploaded: {$link.Date_uploaded}</span>
                                    <br>
                                    {$link.File_name}
                                </a>
                            {/foreach}
                        </div>
                        <!-- /.list-group -->
                        <a href="{$baseURL}/document_repository/" class="btn btn-default btn-block">Document Repository
                            <span class="glyphicon glyphicon-chevron-right"></span></a>
                    </div>
                    <!-- /.panel-body -->
                </div>
            </div>
        {/if}

       <!-- Behavioural Feedback -->
        {if $bvl_feedback_notifications neq ""}
            <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Behavioural Feedback Notifications</h3>
                        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div class="list-group bvl-feedback-item">
                            {foreach from=$bvl_feedback_notifications item=link}
                                <a href="{$baseURL}{$link.URL}" class="list-group-item">
                                    {if $link.new eq 1}
                                        <span class="pull-left new-flag">NEW</span>
                                    {/if}
                                    <span class="pull-right text-muted small">Updated: {$link.Testdate}</span>
                                    <br>
                                    {$link.Name}: {$link.Comment}
                                </a>
                            {/foreach}
                        </div>
                    </div>
                    <!-- /.panel-body -->
                </div>
            </div>
        {/if}
 
    </div>
</div>
