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

    $("#email_dialog").dialog({
        'autoOpen': false,
        'title'   : "Email to Study Participant",
        'width'   : 900,
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

        $.get("AjaxHelper.php?Module=survey_accounts&script=GetEmailContent.php", {
            test_name: testname
        },
        function(content) {
            $("#email_dialog textarea").val(content);
        }
        );
        

    });
});
