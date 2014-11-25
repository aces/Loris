/*global document: false, $: false, window: false*/
$(function () {
    "use strict";

    $('.config-name').tooltip();

    var count = 0;
    $(".add").click(function (e) {
        e.preventDefault();

        count = count + 1;

        // Field that will be copied
        var currentField = $(this).parent().find(".entry:first-child");

        var id = $(currentField).parent().attr('id'),
        name   = 'add-' + id + '-' + count;

        // Setup the new form field
        var newField = currentField.clone();
        newField.find(".form-control").attr('name', name);
        $(newField).find(".btn-remove").addClass('remove-new').removeClass('btn-remove').prop('disabled', false);
        resetForm(newField);
        
        newField.appendTo($(this).parent().children(":first"));

    });

    $('body').on('click','.remove-new', function () {
        if ($(this).parent().parent().parent().children().length > 1) {
            $(this).parent().parent().remove();
        }
        else {
            resetForm($(this).parent().parent());
            $(this).prop('disabled', true);
        }
    });

    $('.btn-remove').click(function(e) {

        e.preventDefault();

        var id = $(this).attr('id');

        var button = this;

        $.ajax({
            type: 'post',
            url: 'AjaxHelper.php?Module=configuration&script=delete.php',
            data: {id: id},
            success: function () {
                if ($(button).parent().parent().parent().children().length > 1) {
                    $(button).parent().parent().remove();
                }
                else {
                    var parent_id = $(button).parent().parent().attr('id');
                    var name      = 'add-' + parent_id;

                    resetForm($(button).parent().parent());
                    $(button).prop('disabled', true);
                    $(button).parent().parent().children('.form-control').attr('name', name);
                }
            },
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });
        
    });

    // On form submit, process the changes through an AJAX call
    $('form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: 'AjaxHelper.php?Module=configuration&script=process.php',
            data: $(this).serialize(),
            success: function () {
                var html = "<label>Submitted</label>";
                $(html).hide().appendTo('.submit-area').fadeIn(500).delay(1000).fadeOut(500)
                $('input[type="reset"]').attr('disabled','disabled');
            },
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });

    });

    // Re-enable the delete button if the form changes
    $( ".input-group" ).change(function() {
        console.log(this);
        var button = $('.btn-remove', this);
        if ($(button).is(':disabled')) {
            $(button).prop('disabled', false);
            
        }
    });

});

function resetForm($form) {
    "use strict";

    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
        .removeAttr('checked').removeAttr('selected');
}