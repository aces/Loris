$(document).ready(function() {
    "use strict";
    $('div').tooltip();
    $(".savecohort").click(function(e) {
        var form = $(e.currentTarget).closest('form');

        var cohortID = $(form.find(".cohortID")).val();
        var title = $(form.find(".cohortTitle")).val();
        var useEDC = $(form.find(".cohortuseEDC")).val();
        var windowDifference = $(form.find(".cohortWindowDifference")).val();
        var recruitmentTarget = $(form.find(".cohortRecruitmentTarget")).val();
        e.preventDefault();

        fetch(loris.BaseURL + "/configuration/ajax/updateCohort.php", {
                    method: "post",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body: new URLSearchParams({
                        "cohortID" : cohortID,
                        "title" : title,
                        "useEDC" : useEDC,
                        "WindowDifference" : windowDifference,
                        "RecruitmentTarget" : recruitmentTarget,
                    }),
                    credentials: "same-origin",
                })
                .then(async function(response) {
                    var data = null;
                    try {
                      data = await response.json();
                    } catch (err) {
                      data = null;
                    }
                    if (!response.ok) {
                      throw data || {};
                    }
                    $(form.find(".saveStatus"))
                    .text(data.ok)
                    .css({ 'color': 'green'})
                    .fadeIn(500)
                    .delay(1000);
                  if (cohortID === 'new') {
                    setTimeout(function(){
                      location.reload();
                    }, 1000);
                  } else {
                    var projectDiv = document.getElementById(`#cohort${cohortID}`);
                    var Name = projectDiv.innerText;
                    projectDiv.innerText = title;
                    var projectHeader = document.getElementById(`cohort${cohortID}`);
                    projectHeader.children[0].innerText = title + projectHeader.children[0].innerText.substring(
                      Name.length
                    );
                  }
                })
                .catch(function(data) {
                    $(form.find(".saveStatus"))
                    .text(data.error)
                    .css({ 'color': 'red'})
                    .fadeIn(500)
                    .delay(1000);
                });


    });
});
