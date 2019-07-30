$(document).ready(function() {
    "use strict";
    $('div').tooltip();
    $(".saveproject").click(function(e) {
        var form = $(e.currentTarget).closest('form');

        var ProjectID = $(form.find(".ProjectID")).val();
        var Name = $(form.find(".projectName")).val();
        var recruitmentTarget= $(form.find(".projectrecruitmentTarget")).val();
        var SubprojectIDs= $(form.find(".projectSubprojectIDs")).val();

        e.preventDefault();
        var successClosure = function(i, form) {
            return function() {
                $(form.find(".saveStatus")).text("Successfully saved").css({ 'color': 'black'}).fadeIn(500).delay(1000).fadeOut(500);
                setTimeout(function(){ 
                    location.reload();
                }, 1000);
            }
        }
        
        var errorClosure = function(i, form) {
          if (isNaN(recruitmentTarget)) {
            return function () {
              $(form.find(".saveStatus")).text("Failed to save, recruitment target must be an integer!").css({'color': 'red'}).fadeIn(500).delay(1000).fadeOut(500);
            }
          } else {
            return function () {
              $(form.find(".saveStatus")).text("Failed to save, same name already exist!").css({'color': 'red'}).fadeIn(500).delay(1000).fadeOut(500);
            }
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
                        "SubprojectIDs" : SubprojectIDs
                    },
                    "success" : successClosure(ProjectID, form),
                    "error" : errorClosure(ProjectID, form)   
                }

          );
    });
});
