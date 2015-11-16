/*global document, $, window*/
$(document).ready(function () {
    "use strict";
    var callback = function (extraparam) {
        extraparam = extraparam || '';
        return function () {
            var checked = $("input.mripanel:checkbox:checked");
            if (0 < checked.size()) {
                var FileIDs = [];
                checked.each(function(index, element) {
                    FileIDs.push(element.dataset.fileId);
                });
                var w = window.open(
                    "main.php?test_name=brainbrowser&minc_id=[" + FileIDs + "]" + extraparam
                );
                w.focus();
            } else {
                var panel_heading = $('#panel-main-heading')
                var message = '<div class="alert alert-warning">Please select at least 1 image</div>';
                $(message).hide().appendTo(panel_heading).fadeIn(500).delay(1000).fadeOut(500)
            }
        };
    };
    $("#bboverlay").click(callback("&overlay=true"));
    $("#bbonly").click(callback());
});
