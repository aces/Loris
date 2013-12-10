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
});
