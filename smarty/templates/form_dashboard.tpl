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
                    <div class="recruitment-panel" id="recruitment-site-breakdown">
                        <div class="col-lg-4">
                            <div>
                                <h5 class="chart-title">Total recruitment per site</h5>
                                <canvas id="snapshotRecruitment" width="163" height="190"></canvas>
                                <div id="pie-legend"></div>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div>
                                <h5 class="chart-title">Gender breakdown by site</h5>
                                <canvas id="snapshotRecruitmentGender" width="350" height="190"></canvas>
                                <div id="bar-legend"></div>
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
                        <canvas id="scanChart" width="400" height="190"></canvas>
                        <div id="scan-line-legend"></div>
                    </div>
                    <div id="recruitment-line-chart-panel">
                        <h5 class="chart-title">Recruitment per site</h5>
                        <canvas id="recruitmentChart" width="400" height="190"></canvas>
                        <div id="recruitment-line-legend"></div>
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

<script src="js/Chart.min.js"></script>
<script language="JavaScript" type="text/javascript">
    $(document).ready(function() {
        
        $("#recruitment-site-breakdown").addClass("hidden");
        $("#recruitment-line-chart-panel").addClass("hidden");
        
        $(".dropdown-menu a").click(function() {
            $(this).parent().siblings().removeClass("active");
            $(this).parent().addClass("active");
            $($(this).parent().siblings().children("a")).each(function(i) {
                $(document.getElementById(this.getAttribute('data-target'))).addClass("hidden");
            });
            $(document.getElementById(this.getAttribute('data-target'))).removeClass("hidden");
        });
    });
    var colours = ["121,209,207", "245,147,34", "214,51,192", "54,209,57", "245,229,56"]
    function updateChart(chartData) {
        var dataArray = getLineData(chartData.datasets);
        var data = {
            labels: chartData.labels,
            datasets: dataArray
        };
        return data;
    }
    function getLineData(datasets) {
        var processedDatasets = new Array();
        for (var i in datasets) {
            var lightColour = "rgba(" + colours[i] + ",0.4)";
            var darkColour = "rgba(" + colours[i] + ",1)";
            var currentDataset = {
                label: datasets[i].name,
                fillColor: lightColour,
                strokeColor: darkColour,
                pointColor: darkColour,
                pointStrokeColor: "#fff",
                pointHightlightFill: "#fff",
                pointHighlightStroke: darkColour,
                data: datasets[i].data
            };
            processedDatasets.push(currentDataset);
        }
        return processedDatasets;
    }
    function getPieData(chartData) {
        var processedData = new Array();
        for (var i in chartData) {
            var lightColour = "rgba(" + colours[i] + ",0.6)";
            var darkColour = "rgba(" + colours[i] + ",1)";
            var currentSite = {
                value: parseInt(chartData[i].total),
                color: darkColour,
                highlight: lightColour,
                label: chartData[i].label
            }
            processedData.push(currentSite);
        }
        return processedData;
    }
    function getBarData(chartData) {
        var dataArray = [
            {
                label: "Female",
                fillColor: "rgba(47,164,231,0.6)",
                strokeColor: "rgba(47,164,231,1)",
                highlightFill: "rgba(47,164,231,1)",
                highlightStroke: "rgba(47,164,231,1)",
                data : chartData['datasets']['female']
            },
            {
                label: "Male",
                fillColor: "rgba(28,112,182,0.6)",
                strokeColor: "rgba(28,112,182,1)",
                highlightFill: "rgba(28,112,182,1)",
                highlightStroke: "rgba(28,112,182,1)",
                data : chartData['datasets']['male']
            }
        ]
        var data = {
            labels: chartData.labels,
            datasets: dataArray
        }
        return data;
    }

    // Chart options
    var lineOptions = {
        responsive: true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : true,
        bezierCurveTension : 0.4,
        pointDot : true,
        pointDotRadius : 4,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
    };
    var pieOptions = {
        responsive: true,
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        percentageInnerCutout : 0, // This is 0 for Pie charts
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false
    };
    var barOptions = {
        responsive: true,
        scaleBeginAtZero : true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 2,
        barValueSpacing : 5,
        barDatasetSpacing : 1
    }

    // Get the data for the chart, in the appropriate form
    {ldelim}
    var recruitmentPieData = getPieData({$pie_chart});
    var recruitmentBarData = getBarData({$bar_chart});
    var scanData = updateChart({$scan_chart});
    var recruitmentData = updateChart({$recruitment_chart});
    {rdelim}

    // Create the charts and their asoiciated legends
    if (scanData.labels.length > 1) {
        var scanctx = $("#scanChart").get(0).getContext("2d");
        var scanLineChart = new Chart(scanctx).Line(scanData, lineOptions);
        document.getElementById('scan-line-legend').innerHTML = scanLineChart.generateLegend();
    }
    else {
        document.getElementById('scans-line-chart-panel').innerHTML = "<h5 class='chart-title'>Scans per site</h5><p>Not enough data to generate a chart.</p>";
    }
        
    if (recruitmentData.labels.length > 1) {
        var recruitmentctx = $("#recruitmentChart").get(0).getContext("2d");
        var recruitmentLineChart = new Chart(recruitmentctx).Line(recruitmentData, lineOptions);
        document.getElementById('recruitment-line-legend').innerHTML = recruitmentLineChart.generateLegend();
    }
    else {
        document.getElementById('recruitment-line-chart-panel').innerHTML = "<h5 class='chart-title'>Recruiment per site</h5><p>Not enough data to generate a chart.</p>";
    }

    var recruitmentPiectx = $("#snapshotRecruitment").get(0).getContext("2d");
    var recruitmentPieChart = new Chart(recruitmentPiectx).Pie(recruitmentPieData,pieOptions);
    document.getElementById('pie-legend').innerHTML = recruitmentPieChart.generateLegend();

    var recruitmentBarctx = $("#snapshotRecruitmentGender").get(0).getContext("2d");
    var recruitmentBarChart = new Chart(recruitmentBarctx).Bar(recruitmentBarData, barOptions);
    document.getElementById('bar-legend').innerHTML = recruitmentBarChart.generateLegend();
    
</script>
<script>
    $('.progress-bar').tooltip();

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
</script>
