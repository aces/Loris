$(document).ready(function() {

    $("select[name='certification_instruments']").change(function() {

        // check if they should be changing

        var instrument = $("option:selected", this).val();
        var instrumentName = $("option:selected", this).text();

        $(".alert-certification").remove();

        if (instrument !== "0") {
            $.post("AjaxHelper.php?Module=certification&script=getExaminerTestStatus.php", {instrument: instrument}, function(data) {
                if (data == 2) {
                    var uncertifiedHTML = '<div class="alert alert-success alert-certification" role="alert">' 
                                          + 'Please complete the training below to be certified for ' 
                                          + instrumentName 
                                          + '</div>';

                    $('#instructions').html(uncertifiedHTML);
                    loadTabs(instrument);
                    loadTabContent(instrument, 1);
                }
                else if (data == 1) {
                    var inProgressHTML = '<div class="alert alert-warning alert-certification" role="alert">' 
                                         + 'Please continue the training below to be certified for ' 
                                         + instrumentName 
                                         + '</div>';

                    $('#instructions').html(inProgressHTML);
                }
                else {
                    var certifiedHTML = '<div class="alert alert-danger alert-certification" role="alert">' 
                                        + 'You have already been certified for ' 
                                        + instrumentName 
                                        + '</div>';

                    $('#instructions').html(certifiedHTML);
                }
            });
        }
        else {
            $('#tabs').html("");
        }
    });

    $('body').on('click','.btn-agree', function (e) {
        var instrument = $("option:selected", "select[name='certification_instruments']").val();
        tabNumber = parseInt($("ul.nav-tabs li.active").attr('id')) + 1;
        loadTabContent(instrument, tabNumber);
        $(this).prop('disabled', true);
    });

    $('body').on('click','#quizSubmit', function (e) {
        e.preventDefault();

        var form = $(this).serialize();
        var instrument = $("option:selected", "select[name='certification_instruments']").val();

        $.post("AjaxHelper.php?Module=certification&script=markQuiz.php", {instrument: instrument, form: form}, function(data) {

        });
    });

    // on click of quiz completion, mark quiz, update certification status, clear tabs?
});

/* Load all the tab headers (no content) */
function loadTabs(instrument) {
    $('#tabs').load("AjaxHelper.php?Module=certification&script=getTabs.php", {instrument: instrument});
}

/* Load the content of one tab, enable the tab header to be clicked, open tab*/
function loadTabContent(instrument, tabNumber) {
    var tabID = '#' + tabNumber;
    /*var href = $("a:first-child", tabID).attr("href");
    console.log(href);
    $(href).load("AjaxHelper.php?Module=certification&script=getTabContent.php", {instrument: instrument, tabNumber: tabNumber}, function() {
        $('#trainingTabs').tab();
        $(tabID).removeClass('disabled');
        $(tabID).tab('show');
    });*/
    
    $.post("AjaxHelper.php?Module=certification&script=getTabContent.php", {instrument: instrument, tabNumber: tabNumber}, function(data) {
        var ref = $(tabID).children().attr('data-target');
        $(ref).html(data);
        $(tabID).removeClass('disabled');
        $(tabID).tab('show');
        $('.tab-pane').removeClass("active");
        $(ref).addClass("active");
    });
}