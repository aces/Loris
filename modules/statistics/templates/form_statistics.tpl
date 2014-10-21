
{literal}
<!-- jQuery CSV parser plugin, which handles escaping/quotes -->
<script type="text/javascript" src="js/jquery.csv.js"></script>
<!-- highcharts graphing library -->
<!-- <script type="text/javascript" src="js/Highcharts/js/highcharts.src.js"></script> -->
<!-- <script src="js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script> -->
<!-- <script type="text/javascript" src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script> -->
<!-- <script type="text/javascript" src="js/LorisGraph.js"></script> -->
<script language="javascript" type="text/javascript">
var graph;
function changeFieldOptions(axis) {
    dropdown = document.getElementById("field" + axis);
    instrument = document.getElementById("instrument" + axis);
    dropdown.options.length = 0;
    $.get("GetScoreLabels.php?instrument=" + instrument.value, function(data) {
        options = data.split("\n");
        dropdown.options.length = 0;
        for(i = 0; i < options.length; i++) {
            if(options[i] != '') {
                dropdown.options[i] = new Option(options[i], options[i]);
            }
        }
        jQuery('#field' + axis).change();
    });
}

/*function updateGraph() {
    // Trigger the jQuery.change() closure created in CreateScatterplot by faking an administration change
    // (even if it's a different field that changed, it doesn't matter.
    jQuery("#Administration").change();
}*/
function CreateScatterplot() {
    var GetCSVUrl = function() {
        return 'GetCSV.php?InstrumentY=' + jQuery("#instrumenty").val() +
            '&InstrumentX=' + jQuery("#instrumentx").val() +
            '&FieldY=' + jQuery("#fieldy").val() + 
            '&FieldX=' + jQuery("#fieldx").val() + 
            '&Administration=' + jQuery('#Administration').val() +
            '&Visit_label=' + jQuery('#Visit_label').val() +
            '&site=' + jQuery('#GraphSite').val();
    };
    graph = new ACES_Scatterplot();
    graph.CSVUrl = GetCSVUrl();
    graph.CSVExtraFields = ['candID', 'sessionID', 'commentID']
    graph.RenderChart();
    FormatLink = function(url, val, extras) {
        full_url = 'main.php?test_name=' + url;
        if(extras) {
            for(exval in extras) {
                if(exval != 'x' && exval != 'y' && exval != 'name') {
                    full_url += '&' + exval + '=' + extras[exval];
                }
            }
        }
        base = '<a href="' + full_url + '">' + val + '</a><br />';
        return base;
    }
    graph.XFormat = function(val, pt) { return FormatLink(jQuery("#instrumenty").val(), jQuery("#fieldx").val() + ':' + val, pt.config); };
    graph.YFormat = function(val, pt) { return FormatLink(jQuery("#instrumenty").val(), jQuery("#fieldy").val() + ':' + val, pt.config); };
    jQuery("#fieldx").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.UpdateXField($(this).val());
        graph.RenderChart();
    });
    jQuery("#fieldy").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.UpdateYField($(this).val());
        graph.RenderChart();
    });
    jQuery("#Administration").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.RenderChart();
    });
    jQuery("#GraphSite").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.RenderChart();
    });
    jQuery("#Visit_label").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.RenderChart();
    });
}
  $(document).ready(function() {
    $(".tab-pane").load($('#onLoad').attr('value'));
    $(".statsTabLink").click(function(){
        $(".tab-pane").load($(this).attr('value'), function() {
            $(".dynamictable").DynamicTable();
        });
        $(".statsTab").removeClass("active");
        $(this).parent().addClass("active");
        $("#hiddenTabs").html($(this).html());
        $("#tabsContent").hide();
        $("#down").show();
        $("#up").hide();
        
    })
  });
  function toggleTabs(){
    $("#tabsContent").toggle();
    $("#down").toggle();
    $("#up").toggle();
}



</script>
{/literal}
<div id="tabs" style="background: white">
    <div class="hidden-xs hidden-sm">
        <ul class="nav nav-tabs ">
            <li class="statsTab active"><a class="statsTabLink" id="onLoad" value="main.php?test_name=statistics&subtest=stats_general&dynamictabs=dynamictabs">General Description</a></li>
            <li class="statsTab"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs">Demographic Statistics</a></li>
            <li class="statsTab"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_behavioural&dynamictabs=dynamictabs">Behavioural Statistics</a></li>
            <li class="statsTab"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_reliability&dynamictabs=dynamictabs">Reliability Statistics</a></li>
            <li class="statsTab"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_MRI&dynamictabs=dynamictabs">Imaging Statistics</a></li>
            <!-- <li class="statsTab"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_scatter&dynamictabs=dynamictabs">Scatterplots</a></li> -->
        </ul>
    </div>
    <div class="visible-xs visible-sm panel panel-primary">
        <div class="panel-heading" onclick="toggleTabs()">
            <label id="hiddenTabs">General Description</label>
            <span class="glyphicon glyphicon-chevron-down pull-right" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up" style="display:none"></span>
        </div>
        <ul class="list-group" style="display:none" id="tabsContent">
            <li class="statsTab active list-group-item"><a class="statsTabLink" id="onLoad" value="main.php?test_name=statistics&subtest=stats_general&dynamictabs=dynamictabs">General Description</a></li>
            <li class="statsTab list-group-item"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs">Demographic Statistics</a></li>
            <li class="statsTab list-group-item"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_behavioural&dynamictabs=dynamictabs">Behavioural Statistics</a></li>
            <li class="statsTab list-group-item"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_reliability&dynamictabs=dynamictabs">Reliability Statistics</a></li>
            <li class="statsTab list-group-item"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_MRI&dynamictabs=dynamictabs">Imaging Statistics</a></li>
            <!-- <li class="statsTab list-group-item"><a class="statsTabLink" value="main.php?test_name=statistics&subtest=stats_scatter&dynamictabs=dynamictabs">Scatterplots</a></li> -->
        </ul>
    </div>
    <div class="tab-content">
        <div class="tab-pane active">
                        
        </div>
    </div>
</div>
