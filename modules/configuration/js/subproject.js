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
                      if (subprojectID === 'new') {
                        setTimeout(function(){
                          location.reload();
                        }, 1000);
                      } else {
                        var projectDiv = document.getElementById(`#subproject${subprojectID}`);
                        var Name = projectDiv.innerText;
                        projectDiv.innerText = title;
                        var projectHeader = document.getElementById(`subproject${subprojectID}`);
                        projectHeader.children[0].innerText = title + projectHeader.children[0].innerText.substring(
                          Name.length
                        );
                      }
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
