$(document).ready(function () {

    $("#email_dialog").dialog({
        'autoOpen': false,
        'title'   : "Email to Study Participant",
        modal: true,
        buttons: {
            'Email': function () {
                $("<input>").attr({
                    type: 'hidden',
                    name: 'send_email',
                    value: 'true'
                }).appendTo('#participant_accounts_form');
                $("<textarea>").attr({
                    // For some reason .dialog() takes the
                    // email_dialog out of the form and moves
                    // it in the dom, so we add a new one
                    // with javascript with the correct content
                    name: 'EmailContent',
                    value: $("#email_dialog textarea").val()
                }).appendTo("#participant_accounts_form");
                $("#participant_accounts_form").submit();
            },
            'Cancel': function () {
                $(this).dialog("close");
            }
        }
    });
    $("input[type=submit]").click(function (e) {
        if(e.currentTarget.classList.contains('email')) {
            $("#email_dialog").dialog("open");
            return false;
        }
    });
    $("select[name=Test_name]").change(function (e) {
        var testname = $(this).val();

        $.get("GetEmailContent.php", {
            test_name: testname
        },
        function(content) {
            console.log(content);
            $("#email_dialog textarea").val(content);
        }
        );
        

    });
});
