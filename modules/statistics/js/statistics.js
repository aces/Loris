$(document).ready(
    function() {
        $(".tab-pane").load($('.onLoad a').attr('value'));
        $(".statsTabLink").click(
            function(){
                $(".tab-pane").load(
                    $(this).attr('value'),
                    function() {
                        $(".dynamictable").DynamicTable();
                    }
                );
                $(".statsTab").removeClass("active");
                $(this).parent().addClass("active");
                $("#hiddenTabs").html($(this).html());
                $("#tabsContent").hide();
                $("#down").show();
                $("#up").hide();
            }
        )
    }
);
function toggleTabs(){
    $("#tabsContent").toggle();
    $("#down").toggle();
    $("#up").toggle();
}
