$(document).ready(function() {
    $("#examiner").submit(function(e) {
        e.preventDefault();
        var form = $(this).serialize();
        $.post("AjaxHelper.php?Module=examiner&script=validateExaminer.php", form, function (data) {
            if (data == 1) {
                console.log("Please include both a name and site");
            }
            else if (data == 2) {
                console.log("This examiner already exists");
            } else {
                $("#examiner").unbind('submit').submit();
            }
        });
    });
});