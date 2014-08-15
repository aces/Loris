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

    $(".list-group-item-info").click(function () {
        var id = $(this).attr('id');
        $("#" + id + ".form").toggle();
    });
    $(".cancel").click(function () {
        var id = $(this).attr('id');
        $("#" + id + ".form").hide();
    });
    var count = 0;
    $(".add").click(function () {
        count = count + 1;
        var id = $(this).attr('id'),
            new_id = id + "-" + count;
        $(this).before('<div class="input-group" id="' + new_id + '"><input class="form-control" name="' + new_id + '" id="' + new_id + '" type="text" value=""><span class="input-group-btn"><input class="btn btn-default remove" type="button" value="Remove" id="' + new_id + '"></span></div>');
    });

    $("form").on("click", ".remove", function () {
        var id = $(this).attr('id');
        $("#" + id + ".input-group").remove();
    });

    $("select").addClass("form-control");
    $(".form").draggable();
});
 
