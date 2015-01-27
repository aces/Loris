/*global document: false, $: false*/

function getSelectedInstrumentID() {
    "use strict";
    return $("option:selected", "select[name='certification_instruments']").val();
}

function getSelectedInstrumentName() {
    "use strict";
    return $("option:selected", "select[name='certification_instruments']").text();
}

function createAlert(alertType, message) {
    "use strict";
    var alertHTML = '<div class="alert alert-'
                    + alertType
                    + ' alert-certification" role="alert">'
                    + message
                    + '</div>';
    return alertHTML;
}

/* Load the content of one tab, enable the tab header to be clicked, open tab*/
function loadTabContent(instrument, tabNumber) {
    "use strict";
    var tabID = '#' + tabNumber;
    $.post("AjaxHelper.php?Module=examiner&script=getTabContent.php", {instrument: instrument, tabNumber: tabNumber}, function (data) {
        var ref = $(tabID).children().attr('data-target');
        $(ref).html(data);
        $(tabID).removeClass('disabled');
        $(tabID).tab('show');
        $('.tab-pane').removeClass("active");
        $(ref).addClass("active");
    });
}

/* Load all the tab headers (no content) */
function loadTabs(instrument) {
    "use strict";
    $.post("AjaxHelper.php?Module=examiner&script=getTabs.php", {instrument: instrument}, function (data) {
        if (data === '0') {
            $('#tabs').html("");
            var alertHTML = createAlert('danger', 'There is no online training for the ' + getSelectedInstrumentName() + ' at this time.');
            $('#instructions').html(alertHTML);
        } else {
            $('#tabs').html(data);
            loadTabContent(instrument, 1);
        }
    });
}

$(document).ready(function () {

    $("select[name='certification_instruments']").change(function () {

        // TODO: add a check to see if they are currently completing training and give a warning about changing instruments

        var instrument = getSelectedInstrumentID(),
            instrumentName = getSelectedInstrumentName();

        $(".alert-certification").remove();

        if (instrument !== "0") {
            $.post("AjaxHelper.php?Module=examiner&script=getExaminerTestStatus.php", {instrument: instrument}, function (data) {
                if (data === '0') {
                    var certifiedHTML = createAlert('danger', 'You have already been certified for ' + instrumentName + '.');

                    $('#instructions').html(certifiedHTML);
                } else {
                    var uncertifiedHTML = createAlert('success', 'Please complete the training below to be certified for ' + instrumentName + '.');
                    $('#instructions').html(uncertifiedHTML);
                    loadTabs(instrument);
                }
            });
        } else {
            $('#tabs').html("");
        }
    });

    $('body').on('click', '.btn-agree', function (e) {
        e.preventDefault();
        var instrument = getSelectedInstrumentID(),
            tabNumber = parseInt($("ul.nav-tabs li.active").attr('id')) + 1;
        loadTabContent(instrument, tabNumber);
        $(this).prop('disabled', true);
    });

    // on click of quiz completion, mark quiz, update certification status, clear tabs?
    $('body').on('submit', '#quiz', function (e) {
        e.preventDefault();

        var form = $(this).serialize(),
            instrument = getSelectedInstrumentID(),
            queryString = form + '&instrument=' + instrument;

        $.post("AjaxHelper.php?Module=examiner&script=markQuiz.php", queryString, function (data) {
            $('#tabs').html("");
            console.log(data);
            // If 1 - correct
            if (data === '1') {
                var correctHTML = createAlert('success', 'You are now certified for ' + getSelectedInstrumentName() + '.');
                $('#instructions').html(correctHTML);
            } else { // If 2 - incorrect
                var incorrectHTML = createAlert('danger', 'Your answers were not correct. Please complete the training again.');
                $('#instructions').html(incorrectHTML);
                loadTabs(instrument);
            }
        });
    });
});