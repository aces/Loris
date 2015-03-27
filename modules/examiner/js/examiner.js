$(document).ready(function() {
    $("#addExaminerButton").click(function(e) {
        var form = $("#examiner").serialize();

        $.post("AjaxHelper.php?Module=examiner&script=validateExaminer.php", form, function (data) {
            if (data == 1) {
                $("#form-errors").html(createError("Please include both a name and site"));
            }
            else if (data == 2) {
                $("#form-errors").html(createError("This examiner already exists"));
            } else {
                console.log($("#examiner").serialize());
                $("#examiner").submit();
            }
        });
    });
});

function createError(message) {
    return '<div class="alert alert-danger" role="alert">' + message + '</div>';
}