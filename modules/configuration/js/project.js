$(document).ready(function() {
    "use strict";
    $(".saveproject").click(function(e) {
        var form = $(e.currentTarget).closest('form');

        var ProjectID = $(form.find(".ProjectID")).val();
        var Name = $(form.find(".projectName")).val();
        var recruitmentTarget= $(form.find(".projectrecruitmentTarget")).val();
        e.preventDefault();
        var successClosure = function(i, form) {
            return function() {
                $(form.find(".saveStatus")).text("Successfully saved").fadeIn(500).delay(1000).fadeOut(500)
            }
        }

        jQuery.ajax(
                {
                    "type" : "post",
                    "url" : loris.BaseURL + "/configuration/ajax/updateProject.php",
                    "data" : {
                        "ProjectID" : ProjectID,
                        "Name" : Name,
                        "recruitmentTarget" : recruitmentTarget,
                    },
                    "success" : successClosure(ProjectID, form)
                }

          );
    });
});
