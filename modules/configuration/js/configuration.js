/*global document: false, $: false, window: false*/
$(function () {
    "use strict";

    var count = 0;
    $(".add").click(function () {
        count = count + 1;
        var id = $(this).attr('id'),
        new_id = id + "-" + count,
        name   = $("#" + id + ".name").html(),
        parent = $(this).attr("name"),
        formID = new_id + "-form";

        $("#"+id+"-formsection").append('<div class="form-item" id="' + formID + '">'
            + '<form class="inline" method="POST">'
            + '<input class="form-control input-sm" id="' + new_id + '" name="'+ parent +'" type="text">'
            + '</form>'
            + '<form class="inline" method="POST">'
            + '<button class="btn btn-default btn-small rm-btn remove-new" id="'+ new_id +'" type="button">Remove</button>'
            + '</form>'
            + '</div>'

        );
    });

    $('body').on('click','.remove-new', function () {
        var id = $(this).attr('id');
        $("#" + id + "-form").remove();
    });
    
    $('.form-control').keypress(function(e) {
        if(e.which === 13) { // Determine if the user pressed the enter button                                   
            $(this).blur();                                                                                      
        }                                                                                                        
    });   
});
 
                                                                                                                 
