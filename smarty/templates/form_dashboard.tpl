

<div class="container">
    <div class="row">
        <div class="col-lg-8">

        	<!-- Welcome panel -->
            <div class="panel panel-default">
                <div class="panel-body">
                	<h2>Welcome, {$username}.</h2>
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
                                <li><a href="#">View site breakdown</a></li>
                                <li><a href="#">View project breakdown</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="panel-body">
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
                                <li><a href="#">View recruitment chart</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="panel-body">
                    <canvas id="myChart" width="400" height="170"></canvas>
                </div>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="col-lg-12">
                <a href="#">
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
                <a href="#">
                    <div class="panel panel-blue">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-9 text-left">
                                    <div class="huge">{$conflicts}</div>
                                    Conflicts
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
                <a href="#">
                    <div class="panel panel-blue">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-9 text-left">
                                    <div class="huge">{$uncompleted_forms}</div>
                                    Uncompleted Forms
                                </div>
                                <div class="col-xs-3 text-right alert-chevron">
                                    <span class="glyphicon glyphicon-chevron-right huge"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

        </div>
    </div>
</div>

<script src="js/Chart.min.js"></script>
<script language="JavaScript" type="text/javascript">
    function updateChart(chartData) {
        var dataArray = getDatasets(chartData.datasets);
        var data = {
            labels: chartData.labels,
            datasets: dataArray
        };
        return data;
    }
    function getDatasets(datasets) {
        var processedDatasets = new Array();
        for (var i in datasets) {
            console.log(datasets[i]);
            var currentDataset = {
                label: datasets[i].name,
                fillColor: "rgba(121,209,207,0.4)",
                strokeColor: "rgba(121,209,207,1)",
                pointColor: "rgba(121,209,207,1)",
                pointStrokeColor: "#fff",
                pointHightlightFill: "#fff",
                pointHighlightStroke: "rgba(121,209,207,1)",
                data: datasets[i].data
            };
            processedDatasets.push(currentDataset);
        }
        return processedDatasets;
    }
    {ldelim}
    var data = updateChart({$recruitment_chart});
    {rdelim}
    var options = {
        responsive: true,
        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,
    };
    // Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx).Line(data, options);;
</script>
<script>
    $('.progress-bar').tooltip();
</script>
