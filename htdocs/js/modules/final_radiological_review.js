$(document).ready(function(){
    $.getScript("js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft");
            if($("#content2").length){
            	Table.setup("content2", "scrollRight2", "scrollLeft2");
            	Table.checkOverflow("content2", "scrollRight2", "scrollLeft2");
            }
            
        });
});
$(window).resize(function(){
    Table.checkOverflow("content", "scrollRight", "scrollLeft");
    if($("#content2").length){
    	Table.checkOverflow("content2", "scrollRight2", "scrollLeft2");
    }
    // checkOverflow();
});