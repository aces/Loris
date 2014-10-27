/*global document, $, window, scrollContent*/
function updateBehaviouralTab() {
    'use strict';
    var BehaviouralProject = document.getElementById("BehaviouralProject"),
        request = $.ajax({
            url: '/main.php?test_name=statistics&subtest=stats_behavioural&dynamictabs=dynamictabs&BehaviouralProject=' + BehaviouralProject.value,
            type: 'GET',
            data: 'html',
            success: function (response) {
                $('#data_entry').html(response);
            }
        });
}
function checkOverflow() {
    'use strict';
    var element = document.querySelector('#content');
    if ((element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth)) {
        // your element have overflow
        $("#content").addClass("col-xs-10 col-xs-offset-1");
        $("#scrollLeft").show();
        $("#scrollRight").show();
    } else {
        //your element don't have overflow
        $("#content").removeClass("col-xs-10 col-xs-offset-1");
        $("#scrollLeft").hide();
        $("#scrollRight").hide();
    }
    element = document.querySelector('#contentDD');
    if ((element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth)) {
        // your element have overflow
        $("#contentDD").addClass("col-xs-10 col-xs-offset-1");
        $("#scrollLeftDD").show();
        $("#scrollRightDD").show();
    } else {
        //your element don't have overflow
        $("#contentDD").removeClass("col-xs-10 col-xs-offset-1");
        $("#scrollLeftDD").hide();
        $("#scrollRightDD").hide();
    }
}
function showStats(clicked) {
    'use strict';
    var id = clicked.id;
    $('.' + id).show();
    $('#' + id).attr('colspan', '3');
    $('#' + id + "PIS").attr('colspan', '3');
    $('#' + id).attr('onClick', 'hideStats(this)');
    $('#' + id).addClass('stats-active');
    $('#' + id).attr('data-original-title', 'Click to minimize');
    checkOverflow();
}
function hideStats(clicked) {
    'use strict';
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
            Table.checkOverflow("contentDD", "scrollRightDD", "scrollLeftDD", "headcolDD");
        });
    
    $(".spacer").height($(".centers").height());
    // checkOverflow();
});
$(window).resize(function(){
    $(".spacer").height($(".centers").height());
    Table.checkOverflow("contentDD", "scrollRightDD", "scrollLeftDD", "headcolDD");
    Table.checkOverflow("content", "scrollRight", "scrollLeft", "headcol");
    // checkOverflow();
});
$(function(){
        $(".tip").tooltip();
    });
