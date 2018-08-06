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
        var successClosure = function(i, form) {
            return function() {
                $(form.find(".saveStatus")).text("Successfully saved").css({ 'color': 'black'}).fadeIn(500).delay(1000).fadeOut(500)
                setTimeout(function(){ 
                    location.reload();
                }, 1000);
            }
        }
        
        var errorClosure = function(i, form) {
            return function() {
                $(form.find(".saveStatus")).text("Failed to save, same title already exist!").css({ 'color': 'red'}).fadeIn(500).delay(1000).fadeOut(500);
            }
        }

        jQuery.ajax(
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
                    "success" : successClosure(subprojectID, form),
                    "error" : errorClosure(subprojectID, form)   
                }

          );


    });
});
