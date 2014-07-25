$(document).ready(function(){
    $.getScript("js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft", "headcol");
        });
});
$(window).resize(function(){
    Table.checkOverflow("content", "scrollRight", "scrollLeft", "headcol");
    // checkOverflow();
});