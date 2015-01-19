$(document).ready(function() {

    $("select[name='certification_instruments']").change(function() {

        // TODO: add a check to see if they are currently completing training and give a warning about changing instruments

        var instrument = getSelectedInstrumentID();
        var instrumentName = getSelectedInstrumentName();

        $(".alert-certification").remove();

        if (instrument !== "0") {
            $.post("AjaxHelper.php?Module=certification&script=getExaminerTestStatus.php", {instrument: instrument}, function(data) {
                if (data == 0) {
                    var certifiedHTML = '<div class="alert alert-danger alert-certification" role="alert">' 
                                        + 'You have already been certified for ' 
                                        + instrumentName 
                                        + '.'
                                        + '</div>';

                    $('#instructions').html(certifiedHTML);
                }
                else {
                    var uncertifiedHTML = '<div class="alert alert-success alert-certification" role="alert">' 
                                          + 'Please complete the training below to be certified for ' 
                                          + instrumentName
                                          + '.'
                                          + '</div>';

                    $('#instructions').html(uncertifiedHTML);
                    loadTabs(instrument);
                    loadTabContent(instrument, 1);
                }
            });
        }
        else {
            $('#tabs').html("");
        }
    });

    $('body').on('click','.btn-agree', function (e) {
        var instrument = getSelectedInstrumentID();
        tabNumber = parseInt($("ul.nav-tabs li.active").attr('id')) + 1;
        loadTabContent(instrument, tabNumber);
        $(this).prop('disabled', true);
    });

    // on click of quiz completion, mark quiz, update certification status, clear tabs?
    $('body').on('submit','#quiz', function (e) {
        e.preventDefault();

        var form = $(this).serialize();
        var instrument = getSelectedInstrumentID();
        var queryString = form + '&instrument=' + instrument;

        $.post("AjaxHelper.php?Module=certification&script=markQuiz.php", queryString, function(data) {
            $('#tabs').html("");

            // If 1 - correct
            if (data == 1) {
                var correctHTML = '<div class="alert alert-success alert-certification" role="alert">' 
                                          + 'You are now certified for '
                                          + getSelectedInstrumentName()
                                          + '.'
                                          + '</div>';
                $('#instructions').html(correctHTML);
                // TODO: send the data to be inserted
            }
            // If 2 - incorrect
            else {
                var incorrectHTML = '<div class="alert alert-danger alert-certification" role="alert">' 
                                          + 'Your answers were not correct. Please complete the training again.'
                                          + '</div>';
                $('#instructions').html(incorrectHTML);
                loadTabs(instrument);
                loadTabContent(instrument, 1);
            }
        });
    });
});

function getSelectedInstrumentID() {
    return $("option:selected", "select[name='certification_instruments']").val();
}

function getSelectedInstrumentName() {
    return $("option:selected", "select[name='certification_instruments']").text();
}

/* Load all the tab headers (no content) */
function loadTabs(instrument) {
    $('#tabs').load("AjaxHelper.php?Module=certification&script=getTabs.php", {instrument: instrument});
}

/* Load the content of one tab, enable the tab header to be clicked, open tab*/
function loadTabContent(instrument, tabNumber) {
    var tabID = '#' + tabNumber;
    
    $.post("AjaxHelper.php?Module=certification&script=getTabContent.php", {instrument: instrument, tabNumber: tabNumber}, function(data) {
        var ref = $(tabID).children().attr('data-target');
        $(ref).html(data);
        $(tabID).removeClass('disabled');
        $(tabID).tab('show');
        $('.tab-pane').removeClass("active");
        $(ref).addClass("active");
    });
}