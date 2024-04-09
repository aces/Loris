/*global document, $, window*/
$(document).ready(function () {
    "use strict";
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
