/*global document: false, $: false, window: false*/
$(document).ready(function(){
    $.getScript(loris.BaseURL + "/js/modules/dynamic_table.table.js")
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
    // Handles cases where there was an error on the page and we're resubmitting
    var email2 = $("input[name=Email2]").val();
    var email  = $("input[name=Email]").val();
    if (email && email2) {
      if (email.length > 0 && email2.length > 0 && email == email2)
      {
              $('#email_survey').removeAttr('disabled');
      } else {
              $('#email_survey').attr('disabled','disabled');
      }
    }
    // Reset Test_name so that the template can be loaded by ajax below
    $("select[name=Test_name]").val("");

    $('#Email2').change (function() {
            var email2 = $("input[name=Email2]").val();
            var email  = $("input[name=Email]").val();
            if (email.length > 0 && email2.length > 0 )
            {
                $('#email_survey').removeAttr('disabled');
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
            $.get(loris.BaseURL + "/survey_accounts/ajax/ValidateEmailSubmitInput.php", {
                dccid: $("input[name=CandID]").val(),
                pscid: $("input[name=PSCID]").val(),
                VL: $("select[name=VL]").val(),
                TN: $("select[name=Test_name]").val(),
                Email: $("input[name=Email").val(),
                Email2: $("input[name=Email2]").val()
            },
            function(result) {
                if (result) {
                    // if an error was already thrown,
                    // hide it to avoid stacking error messages
                    $(".error").hide();
                    result = JSON.parse(result);
                    $("#email-error").show();
                    $("#email-error").html(result.error_msg);
                }
                else {
                    $("#emailModal").modal();
                }
            }
            );

            // $("#email_dialog").dialog("open");
            return false;
        }
    });
    $("select[name=Test_name]").change(function (e) {
        var testname = $(this).val();
        $.get(loris.BaseURL + "/survey_accounts/ajax/GetEmailContent.php", {
            test_name: testname
        },
        function(content) {
            $("#emailContent").val(content);
        }
        );


    });
});
