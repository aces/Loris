/*global document: false, $: false, window: false, unescape: false, Option: false,isElementsSet, alert*/
function hideFilter(obj) {
    'use strict';

     var heading = $(obj);
     var arrow   = $(obj).children('.arrow');
     if (heading.hasClass('panel-collapsed')) {
            // expand the panel
            heading.parents('.panel').find('.panel-body').slideDown();
            heading.removeClass('panel-collapsed');
            arrow.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        } else {
            // collapse the panel
            heading.parents('.panel').find('.panel-body').slideUp();
            heading.addClass('panel-collapsed');
            arrow.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
}
function toggleMe() {
    "use strict";
    $("#advanced-label").toggle();
    $(".advancedOptions").toggle();
    $(".advanced-buttons").toggle();
}


$(function(){
        $('input[name=dob]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true
        });
        $('input[name=edc]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true
        });
});
