$(function () {
    "use strict";
    $(".table-mri>tbody>tr:odd").css("background-color", "#d0d0d0");
    $(".table-mri>tbody>tr:even").css("background-color", "#eeeeee");

});

$(document).ready(function () {
   "use strict";
   $('#panel-main-heading span.clickable').on("click", function () {
        if ($(this).hasClass('panel-collapsed')) {
            // expand the panel
            $(this).parents('.panel').find('.panel-mri-body').slideDown();
            $(this).removeClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        } else {
            // collapse the panel
            $(this).parents('.panel').find('.panel-mri-body').slideUp();
            $(this).addClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
    });

    var callback = function (extraparam) {

        // Ensure extraparam is not undefined
        extraparam = extraparam || '';

        return function () {
            var checked = $("input.mripanel:checkbox:checked");

            if (0 < checked.size()) {
                // Build the url params based on selected image(s)
                var FileIDs = [];
                checked.each(function (index, element) {

                    FileIDs.push(element.dataset.fileId);
                });

                // Open a new window
                var w = window.open(
                    loris.BaseURL + "/brainbrowser/?minc_id=" + FileIDs + extraparam
                );
                w.focus();

            } else {
                // Display a warning if no image is selected
                var message = '<div class="alert alert-warning">Please select at least 1 image</div>';
                $(message).hide().appendTo('#panel-main-heading').fadeIn(500).delay(1000).fadeOut(500);
            }
        };
    };

    // Add event listener to each button
    $("#bboverlay").click(callback("&overlay=true"));
    $("#bbonly").click(callback());

});

function open_popup(newurl) {
    "use strict";
    var x = 200, y = 400, open_param = 'width=500px,height=300px, toolbar=no, location=no,status=yes, scrollbars=yes, resizable=yes, top=' + y + ', screenY=' + y + ', left=' + x + ', screenX=' + x;
    w = window.open(newurl, 'feedback_mri', open_param);
    w.focus();
}
