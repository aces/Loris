/*global document: false, $: false*/

var instrumentID;
var instrumentName;

function validateQuiz(form) {
    // Check if every question has been filled out
    if ($('input[type=radio]:checked').size() === $('.quiz-question').size()) {
        return 1;
    } else {
        return 0;
    }
}

function tryAgain() {
    $('#incorrect').modal('hide')
    $('#tabs').html("");
    loadTabs("training");
}

/* Load the content of one tab, enable the tab header to be clicked, open tab*/
function loadTabContent(tabNumber, type) {
    "use strict";

    var tabID = '#' + tabNumber;
    $.post("AjaxHelper.php?Module=training&script=getTabContent.php", {instrument: instrumentID, tabNumber: tabNumber, type: type}, function (data) {
        var tabPane = $(tabID).children().attr('data-target');
        $(tabPane).html(data);
    });
}

function activateTab(tabNumber) {
    var tabID = '#' + tabNumber,
          tabPane = $(tabID).children().attr('data-target');
    $(tabID).removeClass('disabled');
    $(tabID).tab('show');
    $('.tab-pane').removeClass("active");
    $(tabPane).addClass("active");
}

/* Load all the tab headers and the content of the first tab */
function loadTabs(type) {
    "use strict";

    $.post("AjaxHelper.php?Module=training&script=getTabs.php", {instrument: instrumentID, instrumentName: instrumentName, type: type}, function (data) {
        $('#tabs').html(data);
        if (type == 'training') {
            loadTabContent(1, type);
            activateTab(1);
        }
        else {
            loadTabContent(1, type);
            activateTab(1);
        }
    });
}

$(document).ready(function () {

    $(".panel-not-certified").click(function () {
        var ID         = this.id.split("-",2);
        instrumentID   = ID[1];
        instrumentName = $(this).attr("data-instrument");

        $("#training-options").slideUp();
        loadTabs('training');
    });

    $(".panel-certified").click(function () {
        var ID         = this.id.split("-",2);
        instrumentID   = ID[1];
        instrumentName = $(this).attr("data-instrument");

        $("#training-options").slideUp();
        loadTabs('review');
    });

    $('body').on('click', '.btn-agree', function (e) {
        e.preventDefault();
        var tabNumber = parseInt($("ul.nav-tabs li.active").attr('id')) + 1;
        loadTabContent(tabNumber, 'training');
        activateTab(tabNumber);
        $(this).prop('disabled', true);
    });

    $('body').on('click', '.review > a', function (e) {
        e.preventDefault();
        var tabNumber = $(this).parent().attr('id');
        // Todo: check if the tab has already been loaded before fetching content
        loadTabContent(tabNumber, 'review');
        activateTab(tabNumber);
    });

    // on click of quiz completion, mark quiz, update certification status, clear tabs?
    $('body').on('submit', '#quiz', function (e) {
        e.preventDefault();

        // Disable quiz button submit
        $(this).prop('disabled', true);

        // Check that all answers have been filled out
        if (validateQuiz(this) === 1) {
            var form          = $(this).serialize(),
            requestString = form + '&instrument=' + instrumentID;

            $.post("AjaxHelper.php?Module=training&script=markQuiz.php", requestString, function (data) {
                if (data === 'correct') {
                    $('#correct').modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                } else {
                    $('#incorrect').modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                }
            });
        } else {
            $('#incomplete').modal();
        }

    });
});