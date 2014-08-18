/*global document: false, $: false, window: false*/
function change() {
    "use strict";
    $('#hide').show();
    $('#show').hide();
    $('#tbl').show();
    $('#show').bind('click', function () {
        $('#tbl').show('slow', function () {});
        $('#hide').show();
        $('#show').hide();
    });

    //To hide : table hides...and the show shows...
    $('#hide').bind('click', function () {
        $('#tbl').hide('slow', function () {});
        $('#show').show();
        $('#hide').hide();
    });
}

function save() {
    "use strict";
    var default_value, id, value;
    /**To get the default value**/
    $('.description').click(function (event) {
        id = event.target.id;
        default_value = $("#" + id).text();
    });

    $('.description').bind('blur', function (event) {
        event.stopImmediatePropagation();
        id = event.target.id;
        value = $("#" + id).text();
        $('<div/>').appendTo('body')
            //.css({background : 'black', opacity: '0.9'})
            .html("<div id ='asdfsaf'>Are you sure?</div>")
            .dialog({
                title: 'Modification',
                width: 'auto',
                resizable: false,
                //dialogClass:'transparent',
                position: [800, 120],
                buttons: {
                    Yes: function () {
                        $.get("UpdateMRIProtocol.php?field_id=" + id + "&field_value=" + value, function () {});
                        $(this).dialog("close");
                    },
                    close: function () {
                        $(this).remove();
                        $("#" + id).text(default_value);
                    }
                }
            });
    }).keypress(function (e) {
        if (e.which === 13) { // Determine if the user pressed the enter button
            $(this).blur();
        }
    });
}

$(function () {
    "use strict";
    change();
    save();
});
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