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
    checkOverflow();
}
$(document).ready(function () {
    'use strict';
    checkOverflow();
});
$(window).resize(function () {
    'use strict';
    if ($(window).width() < 500) {
        $('.table-div').addClass('table-responsive');
    }
    checkOverflow();
});
var step = 100;
var scrolling = false;
$("#scrollRight").bind("click", function (event) {
    'use strict';
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#content").animate({
        scrollLeft: $("#content").scrollLeft() + step
    });
}).bind("mouseover", function () {
    'use strict';
    scrolling = true;
    scrollContent("right", "#content");
}).bind("mouseout", function () {
    'use strict';
    scrolling = false;
});
$("#scrollLeft").bind("click", function (event) {
    'use strict';
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#content").animate({
        scrollLeft: $("#content").scrollLeft() - step
    });
}).bind("mouseover", function () {
    'use strict';
    scrolling = true;
    scrollContent("left", "#content");
}).bind("mouseout", function () {
    'use strict';
    scrolling = false;
});
$("#scrollRightDD").bind("click", function (event) {
    'use strict';
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#contentDD").animate({
        scrollLeft: $("#contentDD").scrollLeft() + step
    });
}).bind("mouseover", function () {
    'use strict';
    scrolling = true;
    scrollContent("right", "#contentDD");
}).bind("mouseout", function () {
    'use strict';
    scrolling = false;
});
$("#scrollLeftDD").bind("click", function (event) {
    'use strict';
    event.preventDefault();
    // Animates the scrollTop property by the specified
    // step.
    scrolling = false;
    $("#contentDD").animate({
        scrollLeft: $("#contentDD").scrollLeft() - step
    });
}).bind("mouseover", function () {
    'use strict';
    scrolling = true;
    scrollContent("left", "#contentDD");
}).bind("mouseout", function () {
    'use strict';
    scrolling = false;
});
function scrollContent(direction, elem) {
    'use strict';
    var amount = (direction === "left" ? -3 : 3);
    $(elem).animate({
        scrollLeft: $(elem).scrollLeft() + amount
    }, 1, function () {
        if (scrolling) {
            scrollContent(direction, elem);
        }
    });
}
