

<div class="container">
    <div class="row">
        <div class="col-lg-8">

        	<!-- Welcome panel -->
            <div class="panel panel-default">
                <div class="panel-body">
                	<h2>Welcome, {$username}.</h2>
                    <p><em>Last login: {$last_login}</em></p>
                	<p>{$project_description}</p>
                </div>
	            <div class="panel-footer">| 
	            	{foreach from=$dashboard_links item=link}
						<a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> |
					{/foreach}
				</div>
        	</div>

        	<!-- Recruitment -->
        	<div class="panel panel-default">
                <div class="panel-heading">
                    Recruitment
                    <div class="pull-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                                Actions
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu pull-right" role="menu">
                                <li class="active"><a href="#" id="overall-recruitment-dropdown">View overall recruitment</a></li>
                                <li><a href="#" id="recruitment-breakdown-dropdown">View site breakdown</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="recruitment-panel" id="overall-recruitment">
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
                        </div>
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
                    Study Progression
                    <div class="pull-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                                Actions
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu pull-right" role="menu">
                                <li class="active"><a href="#" id="scan-chart-dropdown">View scans per site</a></li>
                                <li><a href="#" id="recruitment-chart-dropdown">View recruitment per site</a></li>
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
            <div class="col-lg-12">
                <a href="main.php?test_name=imaging_browser">
                    <div class="panel panel-blue">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-9 text-left">
                                    <div class="huge">{$new_scans}</div>
                                    New Scans
                                </div>
                                <div class="col-xs-3 text-right alert-chevron">
                                    <span class="glyphicon glyphicon-chevron-right huge"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-lg-12">
                <a href="main.php?test_name=conflicts_resolve">
                    <div class="panel panel-blue">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-9 text-left">
                                    <div class="huge">{$conflicts}</div>
                                    Data Entry Conflicts
                                </div>
                                <div class="col-xs-3 text-right alert-chevron">
                                    <span class="glyphicon glyphicon-chevron-right huge"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-lg-12">
                <a href="main.php?test_name=statistics_site&CenterID=2&ProjectID=">
                    <div class="panel panel-blue">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-9 text-left">
                                    <div class="huge">{$incomplete_forms}</div>
                                    Incomplete Forms
                                </div>
                                <div class="col-xs-3 text-right alert-chevron">
                                    <span class="glyphicon glyphicon-chevron-right huge"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                    Document Repository Notifications
                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div class="list-group">
                            <a href="#" class="list-group-item">
                                New Document
                                <span class="pull-right text-muted small"><em>4 minutes ago</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Deleted Document
                                <span class="pull-right text-muted small"><em>12 minutes ago</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Updated Document
                                <span class="pull-right text-muted small"><em>27 minutes ago</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Updated Document
                                <span class="pull-right text-muted small"><em>43 minutes ago</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Updated Document
                                <span class="pull-right text-muted small"><em>11:32 AM</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Updated Document
                                <span class="pull-right text-muted small"><em>11:13 AM</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Updated Document
                                <span class="pull-right text-muted small"><em>10:57 AM</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Updated Document
                                <span class="pull-right text-muted small"><em>9:49 AM</em>
                                </span>
                            </a>
                            <a href="#" class="list-group-item">
                                Updated Document
                                <span class="pull-right text-muted small"><em>Yesterday</em>
                                </span>
                            </a>
                        </div>
                        <!-- /.list-group -->
                        <a href="#" class="btn btn-default btn-block">Document Repository <span class="glyphicon glyphicon-chevron-right"></span></a>
                    </div>
                    <!-- /.panel-body -->
                </div>
            </div>

        </div>
    </div>
</div>

<script src="js/Chart.min.js"></script>
<script language="JavaScript" type="text/javascript">
    $(document).ready(function() {
        $("#recruitment-line-chart-panel").addClass("hidden");
        $("#recruitment-site-breakdown").addClass("hidden");

        $("#recruitment-breakdown-dropdown").click(function() {
            $("#overall-recruitment").addClass("hidden");
            $("#recruitment-site-breakdown").removeClass("hidden");
            $("#overall-recruitment-dropdown").parent().removeClass("active");
            $("#recruitment-breakdown-dropdown").parent().addClass("active");
        })
        $("#overall-recruitment-dropdown").click(function() {
            $("#recruitment-site-breakdown").addClass("hidden");
            $("#overall-recruitment").removeClass("hidden");
            $("#recruitment-breakdown-dropdown").parent().removeClass("active");
            $("#overall-recruitment-dropdown").parent().addClass("active");
        })

        $("#recruitment-chart-dropdown").click(function() {
            $("#scans-line-chart-panel").addClass("hidden");
            $("#recruitment-line-chart-panel").removeClass("hidden");
            $("#scan-chart-dropdown").parent().removeClass("active");
            $("#recruitment-chart-dropdown").parent().addClass("active");
        })
        $("#scan-chart-dropdown").click(function() {
            $("#recruitment-line-chart-panel").addClass("hidden");
            $("#scans-line-chart-panel").removeClass("hidden");
            $("#recruitment-chart-dropdown").parent().removeClass("active");
            $("#scan-chart-dropdown").parent().addClass("active");
        })
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
    {ldelim}
    var recruitmentPieData = getPieData({$pie_chart});
    var recruitmentBarData = getBarData({$bar_chart});
    var scandata = updateChart({$scan_chart});
    var recruitmentdata = updateChart({$recruitment_chart});
    {rdelim}
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
    var scanctx = $("#scanChart").get(0).getContext("2d");
    var scanLineChart = new Chart(scanctx).Line(scandata, lineOptions);
    document.getElementById('scan-line-legend').innerHTML = scanLineChart.generateLegend();

    var recruitmentctx = $("#recruitmentChart").get(0).getContext("2d");
    var recruitmentLineChart = new Chart(recruitmentctx).Line(recruitmentdata, lineOptions);
    document.getElementById('recruitment-line-legend').innerHTML = recruitmentLineChart.generateLegend();

    var recruitmentPiectx = $("#snapshotRecruitment").get(0).getContext("2d");
    var recruitmentPieChart = new Chart(recruitmentPiectx).Pie(recruitmentPieData,pieOptions);
    document.getElementById('pie-legend').innerHTML = recruitmentPieChart.generateLegend();

    var recruitmentBarctx = $("#snapshotRecruitmentGender").get(0).getContext("2d");
    var recruitmentBarChart = new Chart(recruitmentBarctx).Bar(recruitmentBarData, barOptions);
    document.getElementById('bar-legend').innerHTML = recruitmentBarChart.generateLegend();

</script>
<script>
    $('.progress-bar').tooltip();
</script>
