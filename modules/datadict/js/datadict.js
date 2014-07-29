function save() {
    
    $('.description').
            bind('blur',function(event){
                event.stopImmediatePropagation();   
                id = event.target.id;
                value = $("#" + id) .text();
               // sendRemoteDataQuery("query_gui_data_loader.php?mode=loadQuery&action="+action+"&qid="+qid);
                $.get("AjaxHelper.php?Module=datadict&script=UpdateDataDict.php&fieldname=" + id + "&description=" + value, function(data) {
                    }
                );
            }
    ).keypress(function(e) {
        if(e.which === 13) { // Determine if the user pressed the enter button
            $(this).blur();
        }

    });
};


$(function(){
    save();
});

