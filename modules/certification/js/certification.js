$(document).ready(function() {

    $("select[name='certification_instruments']").change(function() {

        // check if they should be changing

        var instrument = $("option:selected", this).val();
        var instrumentName = $("option:selected", this).text();
        var select = this;

        $(".alert-certification").remove();

        if (instrument !== "0") {
            $.post("AjaxHelper.php?Module=certification&script=getExaminerTestStatus.php", {instrument: instrument}, function(data) {
                if (data == 2) {
                    var uncertifiedHTML = '<div class="alert alert-success alert-certification" role="alert">' 
                                          + 'Please complete the training below to be certified for ' 
                                          + instrumentName 
                                          + '</div>';

                    $(select).parent().parent().parent().after(uncertifiedHTML);
                    loadTabs(instrument);
                    //loadTab(1);
                }
                else if (data == 1) {
                    var inProgressHTML = '<div class="alert alert-warning alert-certification" role="alert">' 
                                         + 'Please continue the training below to be certified for ' 
                                         + instrumentName 
                                         + '</div>';

                    $(select).parent().parent().parent().after(inProgressHTML);
                }
                else {
                    var certifiedHTML = '<div class="alert alert-danger alert-certification" role="alert">' 
                                        + 'You have already been certified for ' 
                                        + instrumentName 
                                        + '</div>';

                    $(select).parent().parent().parent().after(certifiedHTML);
                }
            });
        }
        else {
            // cleanup tabs
        }

        
    });

    // on click of next tab button, load next tab

    // on click of quiz completion, mark quiz, update certification status, clear tabs?
});

function loadTabs(instrument) {
    $.post("AjaxHelper.php?Module=certification&script=getTabs.php", {instrument: instrument}, function(data) {
        console.log(data);
        $('#tabs').html(data);
    });
}

function loadTabContent() {

}