$(document).ready(function() {
    "use strict";
    var lorisFetch = window.lorisFetch;
    $('div').tooltip();
    $(".savecohort").click(function(e) {
        var form = $(e.currentTarget).closest('form');

        var cohortID = $(form.find(".cohortID")).val();
        var title = $(form.find(".cohortTitle")).val();
        var useEDC = $(form.find(".cohortuseEDC")).val();
        var windowDifference = $(form.find(".cohortWindowDifference")).val();
        var recruitmentTarget = $(form.find(".cohortRecruitmentTarget")).val();
        e.preventDefault();

        lorisFetch(loris.BaseURL + "/configuration/ajax/updateCohort.php", {
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
                    var text = await response.text();
                    var data = null;
                    try {
                      data = JSON.parse(text);
                    } catch (err) {
                      data = null;
                    }
                    if (!response.ok) {
                      throw new Error(
                        (data && data.error) ? data.error : 'Request failed.'
                      );
                    }
                    $(form.find(".saveStatus"))
                    .text(data && data.ok ? data.ok : "Saved")
                    .css({ 'color': 'green'})
                    .fadeIn(500)
                    .delay(1000);
                  if (cohortID === 'new') {
                    setTimeout(function(){
                      location.reload();
                    }, 1000);
                  } else {
                    var projectTab = document.querySelector(`a[href="#cohort${cohortID}"]`);
                    var projectHeader = document.getElementById(`cohort${cohortID}`);

                    if (projectHeader && projectHeader.children.length > 0) {
                      var headerTitle = projectHeader.children[0].innerText;
                      var suffix = projectTab
                        ? headerTitle.substring(projectTab.innerText.length)
                        : '';
                      projectHeader.children[0].innerText = title + suffix;
                    }

                    if (projectTab) {
                      projectTab.innerText = title;
                    }
                  }
                })
                .catch(function(error) {
                    var message = error && error.message
                      ? error.message
                      : 'Request failed.';
                    $(form.find(".saveStatus"))
                    .text(message)
                    .css({ 'color': 'red'})
                    .fadeIn(500)
                    .delay(1000);
                });


    });
});
