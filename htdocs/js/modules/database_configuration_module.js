/*global document: false, $: false, window: false*/
$(function () {
    "use strict";
    $(".collapsable").click(function () {
        $(this).parent().children().toggle();
        $(this).toggle();
    });
    $(".collapsable").each(function () {
        $(this).parent().children().toggle();
        $(this).toggle();
    });

    /*$(".list-group-item-info").click(function () {
        var id = $(this).attr('id');
        $("#" + id + ".form").toggle();
    });*/
    $(".cancel").click(function () {
        var id = $(this).attr('id');
        $("#" + id + ".form").hide();
    });
    var count = 0;

    $(".add").click(function () {
        count = count + 1;
        var id = $(this).attr('id'),
            new_id = id + "-" + count,
            name = $("#" + id + ".name").html(),
            parent = $(this).attr("name");
alert(parent);
        $("#"+id+".row").after('<div class="row" style="margin-left:0px;margin-right:0px;">'
                + '<li class="list-group-item list-group-item-info" id="' + new_id + '">'
                + '<span class="collapsable" id="' + new_id + '">'
                + '<div class="col-md-8"><span class="name" id="' + new_id + '">' + name + '</span></div>'
                + '<div class="col-md-4">'
                + '<div class="form" id="' + new_id + '">'
                + '<div class="input-group">'
                + '<form method="POST" action="">'
                + '<input class="form-control" type="text" id="' + new_id + '" value="" name="' + parent + '">'
                + '</form>'
                + '<div class="input-group-btn">'
                + '<form method="POST" action="">'
                + '<button class="btn btn-default remove" id="' + new_id +'" type="submit" name="remove-' + new_id + '"><i class="glyphicon glyphicon-remove"></i></button>'
                + '<button class="btn btn-default add" id="' + new_id +'" type="button"><i class="glyphicon glyphicon-plus"></i></button>'
                + '</form>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</span>'                                                                                                                                
                + '</li></div>'
        );
    });

    $("form").on("click", ".remove", function () {
        var id = $(this).attr('id');
        $("#" + id + ".input-group").remove();
    });

    
    $('.form-control').keypress(function(e) {
        if(e.which === 13) { // Determine if the user pressed the enter button                                   
            $(this).blur();                                                                                      
        }                                                                                                        
    });   
});
 
                                                                                                                 
