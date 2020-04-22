$(document).ready(function() {
    "use strict";
    $('div').tooltip();
    $(".savesubproject").click(function(e) {
        var form = $(e.currentTarget).closest('form');

        var subprojectID = $(form.find(".subprojectID")).val();
        var title = $(form.find(".subprojectTitle")).val();
        var useEDC = $(form.find(".subprojectuseEDC")).val();
        var windowDifference = $(form.find(".subprojectWindowDifference")).val();
        var recruitmentTarget = $(form.find(".subprojectRecruitmentTarget")).val();
        e.preventDefault();

        $.ajax(
                {
                    "type" : "post",
                    "url" : loris.BaseURL + "/configuration/ajax/updateSubproject.php",
                    "data" : {
                        "subprojectID" : subprojectID,
                        "title" : title,
                        "useEDC" : useEDC,
                        "WindowDifference" : windowDifference,
                        "RecruitmentTarget" : recruitmentTarget,
                    },
                    "dataType": "json",
                    "success" : function(data) {
                        $(form.find(".saveStatus"))
                        .text(data.ok)
                        .css({ 'color': 'green'})
                        .fadeIn(500)
                        .delay(1000);
                        setTimeout(function(){
                            location.reload();
                        }, 1000);
                    },
                    "error" : function(data) {
                        $(form.find(".saveStatus"))
                        .text(data.responseJSON.error)
                        .css({ 'color': 'red'})
                        .fadeIn(500)
                        .delay(1000);
                    }
                }

          );


    });
});
