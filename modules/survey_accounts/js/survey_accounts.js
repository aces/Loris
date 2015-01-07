/*global document: false, $: false, window: false*/
$(document).ready(function(){
    $.getScript("js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft");
        });
    // checkOverflow();
});
$(window).resize(function(){
    Table.checkOverflow("content", "scrollRight", "scrollLeft");
    // checkOverflow();
});

$(document).ready(function () {
    $('#email_survey').attr('disabled','disabled');
    $('#Email2').change (function() {
            var email2 = $("input[name=Email2]").val();
            var email  = $("input[name=Email]").val();
            if (email.length > 0 && email2.length > 0 )
            {
                $('#email_survey').removeAttr('disabled');
                $('#create_survey').attr('disabled','disabled');
            }
            if (email2.length == 0 || email.length == 0 || email != email2)
            {
                $('#create_survey').removeAttr('disabled');
                $('#email_survey').attr('disabled','disabled');
            }

            } );
    $("#emailData").click(function(){
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
            value: $("#emailContent").val()
        }).appendTo("#participant_accounts_form");
        $("#participant_accounts_form").submit();
    });
    $("input[type=submit]").click(function (e) {
        if(e.currentTarget.classList.contains('email')) {
            $("#emailModal").modal();
            // $("#email_dialog").dialog("open");
            return false;
        }
    });
    $("select[name=Test_name]").change(function (e) {
        var testname = $(this).val();

        $.get("AjaxHelper.php?Module=survey_accounts&script=GetEmailContent.php", {
            test_name: testname
        },
        function(content) {
            $("#emailContent").val(content);
        }
        );
        

    });
});
