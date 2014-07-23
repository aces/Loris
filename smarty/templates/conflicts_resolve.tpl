<script language="javascript" type="text/javascript">
$(document).ready(function() {
    $(".tab-pane").load($('#onLoad').attr('value'));
    $(".statsTabLink").click(function(){
        $(".tab-pane").load($(this).attr('value'));
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

<div id="tabs" style="background: white">
    <div class="hidden-xs hidden-sm">
        <ul class="nav nav-tabs ">
            <li class="statsTab active"><a class="statsTabLink" id="onLoad" value="main.php?test_name=unresolved_conflicts&dynamictabs=dynamictabs">Unresolved Conflicts</a></li>
            <li class="statsTab"><a class="statsTabLink" value="main.php?test_name=resolved_conflicts&dynamictabs=dynamictabs">Resolved Conflicts</a></li>
        </ul>
    </div>
    <div class="visible-xs visible-sm panel panel-primary">
        <div class="panel-heading" onclick="toggleTabs()">
            <label id="hiddenTabs">Unresolved Conflicts</label>
            <span class="glyphicon glyphicon-chevron-down pull-right" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up" style="display:none"></span>
        </div>
        <ul class="list-group" style="display:none" id="tabsContent">
            <li class="statsTab active list-group-item"><a class="statsTabLink" id="onLoad" value="main.php?test_name=unresolved_conflicts&dynamictabs=dynamictabs">Unresolved Conflicts</a></li>
            <li class="statsTab list-group-item"><a class="statsTabLink" value="main.php?test_name=resolved_conflicts&dynamictabs=dynamictabs">Resolved Conflicts</a></li>
        </ul>
    </div>
    <div class="tab-content">
        <div class="tab-pane active">
                        
        </div>
    </div>
</div>