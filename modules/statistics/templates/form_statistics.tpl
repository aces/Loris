
{literal}
<!-- jQuery CSV parser plugin, which handles escaping/quotes -->
<script type="text/javascript" src="js/jquery.csv.js"></script>
<!-- <script src="js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script> -->
<!-- <script type="text/javascript" src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script> -->
<script language="javascript" type="text/javascript">
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
        </ul>
    </div>
    <div class="tab-content">
        <div class="tab-pane active">

        </div>
    </div>
</div>
