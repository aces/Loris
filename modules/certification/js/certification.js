$(document).ready(function() {

    $("select[name='certification_instruments']").change(function() {
        var instrument = $("option:selected", this).text();

        $.post("AjaxHelper.php?Module=certification&script=getExaminerTestStatus.php", {instrument: instrument}, function(data) {
            if (data == 1) {
                var startTrainingHTML = '<div class="alert alert-success" role="alert">' + 'Please complete the training below to be certified for ' + instrument + '</div>';
                $(this).parent().before(startTrainingHTML);
                //loadTab(1);
            }
            else {
                var certificationCompletedHTML = '<div class="alert alert-success" role="alert">' + 'You have already been certified for ' + instrument + '</div>';
                $(this).parent().parent().before(certificationCompletedHTML);
            }
        });
    });

    // on click of next tab button, load next tab

    // on click of quiz completion, mark quiz, update certification status, clear tabs
});

function loadTab() {

}