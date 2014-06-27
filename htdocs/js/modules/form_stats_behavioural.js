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
    checkOverflow();
}
function hideStats(clicked){
    var id = clicked.id;
    $('.' + id).hide();
    $('#' + id).attr('colspan', '1');
    $('#' + id + "PIS").attr('colspan', '1');
    $('#' + id).attr('onClick', 'showStats(this)');
    $('#' + id).removeClass('stats-active');
    checkOverflow();
}
$(document).ready(function(){
    console.log($(".centers").height());
    $(".spacer").height($(".centers").height());
    checkOverflow();
});
$(window).resize(function(){
    $(".spacer").height($(".centers").height());
    checkOverflow();
});
var step = 100;
var scrolling = false;
$("#scrollRight").bind("click", function(event) {
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#content").animate({
        scrollLeft: $("#content").scrollLeft() + step
    });
}).bind("mouseover", function(event) {
    scrolling = true;
    scrollContent("right", "#content");
}).bind("mouseout", function(event) {
    scrolling = false;
});
$("#scrollLeft").bind("click", function(event) {
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#content").animate({
        scrollLeft: $("#content").scrollLeft() - step
    });
}).bind("mouseover", function(event) {
    scrolling = true;
    scrollContent("left", "#content");
}).bind("mouseout", function(event) {
    scrolling = false;
});
$("#scrollRightDD").bind("click", function(event) {
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#contentDD").animate({
        scrollLeft: $("#contentDD").scrollLeft() + step
    });
}).bind("mouseover", function(event) {
    scrolling = true;
    scrollContent("right", "#contentDD");
}).bind("mouseout", function(event) {
    scrolling = false;
});
$("#scrollLeftDD").bind("click", function(event) {
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#contentDD").animate({
        scrollLeft: $("#contentDD").scrollLeft() - step
    });
}).bind("mouseover", function(event) {
    scrolling = true;
    scrollContent("left", "#contentDD");
}).bind("mouseout", function(event) {
    scrolling = false;
});
function scrollContent(direction, elem) {
    var amount = (direction === "left" ? -3 : 3);
    $(elem).animate({
        scrollLeft: $(elem).scrollLeft() + amount
    }, 1, function() {
        if (scrolling) {
            scrollContent(direction, elem);
        }
    });
}
function checkOverflow(){
    var element = document.querySelector('#content');
    if( (element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth)){
        // your element have overflow
        $(".table-scroll").addClass("scrollable");
        $(".headcol").addClass("colm-static");
        $("#scrollLeft").show();
        $("#scrollRight").show();
    }
    else{
        //your element don't have overflow
        $(".table-scroll").removeClass("scrollable");
        $(".headcol").removeClass("colm-static");
        $("#scrollLeft").hide();
        $("#scrollRight").hide();
    }
    element = document.querySelector('#contentDD');
    if( (element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth)){
        // your element have overflow
        $("#contentDD").addClass("col-xs-10 col-xs-offset-1");
        $("#scrollLeftDD").show();
        $("#scrollRightDD").show();
    }
    else{
        //your element don't have overflow
        $("#contentDD").removeClass("col-xs-10 col-xs-offset-1");
        $("#scrollLeftDD").hide();
        $("#scrollRightDD").hide();
    }
}
