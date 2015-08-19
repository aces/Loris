$(document).ready(function() {
    "use strict";
    $(".savesubproject").click(function(e) {
        var form = $(e.currentTarget).closest('form');

        var subprojectID = $(form.find(".subprojectID")).val();
        var title = $(form.find(".subprojectTitle")).val();
        var useEDC= $(form.find(".subprojectuseEDC")).val();
        var windowDifference= $(form.find(".subprojectWindowDifference")).val();
        e.preventDefault();
        var successClosure = function(i, form) {
            return function() {
                $(form.find(".saveStatus")).text("Successfully saved").fadeIn(500).delay(1000).fadeOut(500)

            }
        }

        jQuery.ajax(
                {
                    "type" : "post",
                    "url" : "AjaxHelper.php?Module=configuration&script=updateSubproject.php",
                    "data" : {
                        "subprojectID" : subprojectID,
                        "title" : title,
                        "useEDC" : useEDC,
                        "WindowDifference" : windowDifference,
                    },
                    "success" : successClosure(subprojectID, form)
                }

          );


    });
});
