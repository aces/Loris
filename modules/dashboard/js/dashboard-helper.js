$(document).ready(function () {
    "use strict";

    // Make dashboard panels collapsible
    $('.panel-heading span.clickable').on("click", function () {
        if ($(this).hasClass('panel-collapsed')) {
            // expand the panel
            $(this).parents('.panel').find('.panel-body').slideDown();
            $(this).removeClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        } else {
            // collapse the panel
            $(this).parents('.panel').find('.panel-body').slideUp();
            $(this).addClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
    });
});
