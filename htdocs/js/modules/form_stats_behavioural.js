/*global document, $*/
function updateBehaviouralTab() {
    var BehaviouralProject = document.getElementById("BehaviouralProject");
   // var BehaviouralSite = document.getElementById("BehaviouralSite");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_behavioural&dynamictabs=dynamictabs&BehaviouralProject=' + BehaviouralProject.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
            $('#data_entry').html(response);
        }
    });
}

function showStats(clicked){
    var id = clicked.id;
    $('.' + id).show();
    $('#' + id).attr('colspan', '3');
    $('#' + id + "PIS").attr('colspan', '3');
    $('#' + id).attr('onClick', 'hideStats(this)');
    $('#' + id).addClass('stats-active');
    $('#' + id).attr('data-original-title', 'Click to minimize');
    checkOverflow();
}
function hideStats(clicked){
    var id = clicked.id;
    $('.' + id).hide();
    $('#' + id).attr('colspan', '1');
    $('#' + id + "PIS").attr('colspan', '1');
    $('#' + id).attr('onClick', 'showStats(this)');
    $('#' + id).removeClass('stats-active');
    $('#' + id).attr('data-original-title', 'Click to maximize');
    checkOverflow();
}
$(document).ready(function(){
    $.getScript("js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft", "headcol");
            Table.setup("contentDD", "scrollRightDD", "scrollLeftDD");
            Table.checkOverflow("contentDD", "scrollRightDD", "scrollLeftDD");
        });
    
    $(".spacer").height($(".centers").height());
    // checkOverflow();
});
$(window).resize(function(){
    $(".spacer").height($(".centers").height());
    Table.checkOverflow("contentDD", "scrollRightDD", "scrollLeftDD");
    Table.checkOverflow("content", "scrollRight", "scrollLeft", "headcol");
    // checkOverflow();
});
$(function(){
        $(".tip").tooltip();
    });
