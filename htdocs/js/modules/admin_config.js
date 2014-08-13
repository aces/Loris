$(function () {                                                                                       
    "use strict";
    $(".collapsable").click(function () {
        $(this).parent().children().toggle();
        $(this).toggle();
    });
    $(".collapsable").each(function(){
        $(this).parent().children().toggle();
        $(this).toggle();
    });

    $(".minus").click(function() {
         var id = $(this).attr('id');
         $("#"+id+".form").toggle(); 
    });
}); 


