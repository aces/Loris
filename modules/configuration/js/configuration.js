/*global document: false, $: false, window: false*/
$(function () {
    "use strict";

    var count = 0;
    $(".add").click(function () {
        console.log("here");
        count = count + 1;
        var id = $(this).attr('id'),
            new_id = id + "-" + count,
            name = $("#" + id + ".name").html(),
            parent = $(this).attr("name");

        $("#"+id+".row").after('<div class="row" id="' + new_id +'" style="margin-left:0px;margin-right:0px;">'
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
                + '<button class="btn btn-default remove-new" id="' + new_id +'" type="button"><i class="glyphicon glyphicon-remove"></i></button>'
                + '<button class="btn btn-default add" id="' + new_id +'" type="button"><i class="glyphicon glyphicon-plus"></i></button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</span>'                                                                                                                                
                + '</li></div>'
        );

        /*
        <form class="form-inline" method="POST" action="">
            <input class="form-control" name="{$k}" type="text" id="{$k}" value="{$v}">
        </form>
        <form class="inline" method="POST" action="">
            <button class="btn btn-default remove" id="{$k}" type="submit" name="remove-{$k}"><i class="glyphicon glyphicon-remove"></i></button>
        </form>
        */
    });

    $("ul.list-group").on("click", ".remove-new", function () {
        var id = $(".remove-new").attr('id');
        $("#" + id + ".row").remove();
    });

    
    $('.form-control').keypress(function(e) {
        if(e.which === 13) { // Determine if the user pressed the enter button                                   
            $(this).blur();                                                                                      
        }                                                                                                        
    });   
});
 
                                                                                                                 
