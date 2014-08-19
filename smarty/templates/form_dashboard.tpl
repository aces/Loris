<link rel="stylesheet" href="css/c3.css">

<div class="container">
    <div class="row">
        <div class="col-lg-8">

        	<!-- Welcome panel -->
            <div class="panel panel-default">
                <div class="panel-body">
                	<h3 class="welcome">Welcome, {$username}.</h3>
                    <p class="pull-right small login-time">Last login: {$last_login}</p>
                	<p class="project-description">{$project_description}</p>
                </div>
                <!-- Only add the welcome panel footer if there are links -->
                {if $dashboard_links neq ""}
    	            <div class="panel-footer">| 
    	            	{foreach from=$dashboard_links item=link}
    						<a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> |
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
                                <li><a id="recruitment-breakdown-dropdown" data-target="recruitment-site-breakdown">View site breakdown</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="recruitment-panel" id="overall-recruitment">
                        {if $recruitment_target neq ""}
                            {if $surpassed_recruitment eq "true"}
                                The recruitment target has been passed.
                                <div class="progress">
                                    <div class="progress-bar progress-bar-female progress-striped" role="progressbar" aria-valuenow="{$female_full_percent}" aria-valuemin="0" aria-valuemax="100" style="width: {$female_full_percent}%" data-toggle="tooltip" data-placement="bottom" title="{$female_total} Females">
                                        <p>
                                        {$female_full_percent}%
                                        </br>
                                        Female
                                        </p>
                                    </div>
                                    <div class="progress-bar progress-bar-male progress-striped" data-toggle="tooltip" data-placement="bottom" role="progressbar" aria-valuenow="{$male_full_percent}" aria-valuemin="0" aria-valuemax="100" style="width: {$male_full_percent}%"  title="{$male_total} Males">
                                        <p>
                                        {$male_full_percent}%
                                        </br>
                                        Male
                                        </p>
                                    </div>
                                    <p class="pull-right small target">Target: {$recruitment_target}</p>
                                </div>

                            {else}
                                <div class="progress">
                                    <div class="progress-bar progress-bar-female progress-striped" role="progressbar" aria-valuenow="{$female_percent}" aria-valuemin="0" aria-valuemax="100" style="width: {$female_percent}%" data-toggle="tooltip" data-placement="bottom" title="{$female_total} Females">
                                        <p>
                                        {$female_percent}%
                                        </br>
                                        Female
                                        </p>
                                    </div>
                                    <div class="progress-bar progress-bar-male progress-striped" data-toggle="tooltip" data-placement="bottom" role="progressbar" aria-valuenow="{$male_percent}" aria-valuemin="0" aria-valuemax="100" style="width: {$male_percent}%"  title="{$male_total} Males">
                                        <p>
                                        {$male_percent}%
                                        </br>
                                        Male
                                        </p>
                                    </div>
                                    <p class="pull-right small target">Target: {$recruitment_target}</p>
                                </div>
                            {/if}
                            
                        {else}
                            Please add a recruitment target to the config file to see recruiment progression.
                        {/if}
                    </div>
                    <div class="recruitment-panel hidden" id="recruitment-site-breakdown">
                        <div class="col-lg-4">
                            <div>
                                <h5 class="chart-title">Total recruitment per site</h5>
                                <div id="recruitmentPieChart"></div>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div>
                                <h5 class="chart-title">Gender breakdown by site</h5>
                                <div id="recruitmentBarChart"></div>
                            </div>
                        </div>
                    </div>
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
                        <h5 class="chart-title">Scans per site</h5>
                        <div id="scanChart"></div>
                    </div>
                    <div id="recruitment-line-chart-panel" class="hidden">
                        <h5 class="chart-title">Recruitment per site</h5>
                        <div id="recruitmentChart"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4">

            <!-- My Tasks -->
            {if $new_scans neq "" or $conflicts neq "" or $incomplete_forms neq "" or $radiology_review neq ""}
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">My Tasks</h3>
                            <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                        </div>
                        <!-- /.panel-heading -->
                        <div class="panel-body">
                            <div class="list-group tasks">
                                {if $new_scans neq ""}
                                    <a href="main.php?test_name=imaging_browser&Pending=PN&filter=Show%20Data" class="list-group-item">
                                        <div class="row">
                                            <div class="col-xs-8 text-left">
                                                <div class="huge">{$new_scans}</div>
                                                New Scan{if $new_scans neq 1}s{/if}
                                            </div>
                                            <div class="col-xs-4 text-right alert-chevron">
                                                <span class="glyphicon glyphicon-chevron-right medium"></span>
                                                <p class="small task-site">{$new_scans_site}</p>
                                            </div>
                                        </div>
                                    </a>
                                {/if}
                                {if $conflicts neq ""}
                                <a href="main.php?test_name=conflicts_resolve" class="list-group-item">
                                    <div class="row">
                                        <div class="col-xs-8 text-left">
                                            <div class="huge">{$conflicts}</div>
                                            Data Entry Conflict{if $conflicts neq 1}s{/if}
                                        </div>
                                        <div class="col-xs-4 text-right alert-chevron">
                                            <span class="glyphicon glyphicon-chevron-right medium"></span>
                                            <p class="small task-site">{$conflicts_site}</p>
                                        </div>
                                    </div>
                                </a>
                                {/if}
                                {if $incomplete_forms neq ""}
                                <a href="main.php?test_name=statistics_site" class="list-group-item">
                                    <div class="row">
                                        <div class="col-xs-8 text-left">
                                            <div class="huge">{$incomplete_forms}</div>
                                            Incomplete Form{if $incomplete_forms neq 1}s{/if}
                                        </div>
                                        <div class="col-xs-4 text-right alert-chevron">
                                            <span class="glyphicon glyphicon-chevron-right medium"></span>
                                            <p class="small task-site">{$incomplete_forms_site}</p>
                                        </div>
                                    </div>
                                </a>
                                {/if}
                                {if $radiology_review neq ""}
                                <a href="main.php?test_name=final_radiological_review&Review_done=no&filter=Show%20Data" class="list-group-item">
                                    <div class="row">
                                        <div class="col-xs-9 text-left">
                                            <div class="huge">{$radiology_review}</div>
                                            Final radiological review{if $radiology_review neq 1}s{/if}
                                        </div>
                                        <div class="col-xs-3 text-right alert-chevron">
                                            <span class="glyphicon glyphicon-chevron-right medium"></span>
                                            <p class="small task-site">{$radiology_review_site}</p>
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
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Document Repository Notifications</h3>
                            <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                        </div>
                        <!-- /.panel-heading -->
                        <div class="panel-body">
                            <div class="list-group document-repository-item">
                                {foreach from=$document_repository_notifications item=link}
                                <a href="document_repository/admin/{$link.File_name}" class="list-group-item">
                                    <span class="pull-right text-muted small">Uploaded: {$link.Date_uploaded}</span>
                                    {$link.File_name}
                                </a>
                                {/foreach}
                            </div>
                            <!-- /.list-group -->
                            <a href="main.php?test_name=document_repository" class="btn btn-default btn-block">Document Repository <span class="glyphicon glyphicon-chevron-right"></span></a>
                        </div>
                        <!-- /.panel-body -->
                    </div>
                </div>
            {/if}

        </div>
    </div>
</div>

<script src="js/d3.min.js" charset="utf-8"></script>
<script src="js/c3.min.js"></script>

<script>
    // Turn on the tooltip for the progress bar - shows total male and female registered candidates
    $('.progress-bar').tooltip();

    // Make dashboard panels collapsible
    $('.panel-heading span.clickable').on("click", function (e) {
        if ($(this).hasClass('panel-collapsed')) {
            // expand the panel
            $(this).parents('.panel').find('.panel-body').slideDown();
            $(this).removeClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
        else {
            // collapse the panel
            $(this).parents('.panel').find('.panel-body').slideUp();
            $(this).addClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
    });
    
    // Open the appropriate charts from the "views" dropdown menus
    $(".dropdown-menu a").click(function() {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
        $($(this).parent().siblings().children("a")).each(function(i) {
            $(document.getElementById(this.getAttribute('data-target'))).addClass("hidden");
        });
        $(document.getElementById(this.getAttribute('data-target'))).removeClass("hidden");
        recruitmentPieChart.resize();
        recruitmentBarChart.resize();
        recruitmentLineChart.resize();
    });
    var siteColours = ['#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000', '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    var genderColours = ['#2FA4E7', '#1C70B6'];

    function formatPieData(data) {
        var processedData = new Array();
        for (var i in data) {
            var siteData = [data[i].label, data[i].total];
            processedData.push(siteData);
        }
        return processedData;
    }
    function formatBarData(data) {
        var processedData = new Array();
        females = ['Female'];
        processedData.push(females.concat(data.datasets.female));
        males = ['Male'];
        processedData.push(males.concat(data.datasets.male));
        console.log(processedData);
        return processedData;
    }
    function getBarLabels(data) {
        return data.labels;
    }
    function formatLineData(data) {
        var processedData = new Array();
        var labels = new Array();
        labels.push('x');
        for (var i in data.labels) {
            labels.push(data.labels[i]);
        }
        processedData.push(labels);
        for (var i in data.datasets) {
            dataset = new Array();
            dataset.push(data.datasets[i].name);
            processedData.push(dataset.concat(data.datasets[i].data));
        }
        return processedData;
    }
    
    {ldelim}
    console.log({$bar_chart});
    var recruitmentPieData = formatPieData({$pie_chart});
    var recruitmentBarData = formatBarData({$bar_chart});
    var recruitmentBarLabels = getBarLabels({$bar_chart});
    var scanLineData = formatLineData({$scan_chart});
    var recruitmentLineData = formatLineData({$recruitment_chart});
    {rdelim}

    var recruitmentPieChart = c3.generate({
        bindto: '#recruitmentPieChart',
        data: {
            columns: recruitmentPieData,
            type : 'pie'
        },
        color: {
            pattern: siteColours
        }
    });
    var recruitmentBarChart = c3.generate({
        bindto: '#recruitmentBarChart',
        data: {
            columns: recruitmentBarData,
            type: 'bar'
        },
        axis: {
            x: {
                type : 'categorized',
                categories: recruitmentBarLabels
            }
        },
        color: {
            pattern: genderColours
        }
    });
    var scanLineChart = c3.generate({
        bindto: '#scanChart',
        data: {
            x: 'x',
            x_format: '%m-%Y',
            columns: scanLineData
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%m-%Y'
                }
            }
        },
        zoom: {
            enabled: true
        },
        color: {
            pattern: siteColours
        }
    });
    var recruitmentLineChart = c3.generate({
        bindto: '#recruitmentChart',
        data: {
            x: 'x',
            x_format: '%m-%Y',
            columns: recruitmentLineData
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%m-%Y'
                }
            }
        },
        zoom: {
            enabled: true
        },
        color: {
            pattern: siteColours
        }
    });
</script>
