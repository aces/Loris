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
$(window).ready(function () {
       var qsObj = QueryString.get();
       var filter = qsObj['filter'];
       if(filter==="true"){

            $( "input[name ='filter']" ).click();

        }
 });

