/*global document: false, $: false, window: false, unescape: false, Option: false*/
$(function () {
    "use strict";
    
    $('#config li a').each(function () {
        $(this).click(function (event) {
        	
            event.preventDefault(); // Prevents the browser to navigate to the specified url (href)
            /****
            Close all other ul's excluding the ul's in the current branch.
            returns the siblings of the 
            slide all the ul elements element except the siblings of the current element and the parents
            ***/
            $("#config ul").not($(this).siblings()).not($(this).parentsUntil("#config")).slideUp();
            $(this).next().slideToggle(); // Toggle the targeted ul
        });
    });
    
    
   
    $(':text').each(function () {
    		$(this).bind('blur',function(event){
				
                event.stopImmediatePropagation();   
                var id = event.target.id;
                var value = $("#" + id).val();
               // sendRemoteDataQuery("query_gui_data_loader.php?mode=loadQuery&action="+action+"&qid="+qid);
                $.get("UpdateConfigs.php?fieldname=" + id + "&description=" + value, function(data) {
                    }
                );
            }).keypress(function(e) {
        if(e.which === 13) { // Determine if the user pressed the enter button
            $(this).blur();
        }

    });
    });
     
    
    
});