/*global document: false, $: false, window: false*/
$(function () {
    "use strict";

    $('.config-name').tooltip();

    var count = 0;
    $(".add").click(function (e) {
        e.preventDefault();

        count = count + 1;
        var id = $(this).attr('id'),
        new_id = id + "-" + count,
        name   = $("#" + id + ".name").html(),
        parent = $(this).attr("name"),
        formID = new_id + "-form";

        //var newField = currentField.clone().appendTo()

        $("#"+id+"-formsection").append('<div class="form-item" id="' + formID + '">'
            + '<form method="POST">'
            + '<input class="form-control input-sm" id="' + new_id + '" name="'+ parent +'" type="text">'
            + '</form>'
            + '<form method="POST">'
            + '<button class="btn btn-default btn-small rm-btn remove-new" id="'+ new_id +'" type="button">Remove</button>'
            + '</form>'
            + '</div>'

        );
    });

    $('body').on('click','.remove-new', function () {
        var id = $(this).attr('id');
        $("#" + id + "-form").remove();
    });

    $('form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: 'AjaxHelper.php?Module=configuration&script=process.php',
            data: $(this).serialize(),
            success: function (data) {
                var html = "<label>Submitted</label>";
                $(html).hide().appendTo('.submit-area').fadeIn(500).delay(1000).fadeOut(500);
            },
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });

    });

});
 
                                                                                                                 
