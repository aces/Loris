function save() {
    
    $('.description').
            bind('blur',function(event){
                event.stopImmediatePropagation();   
                $id = event.target.id;
                $value = $("#" + $id) .text();
               // sendRemoteDataQuery("query_gui_data_loader.php?mode=loadQuery&action="+action+"&qid="+qid);
                var $test = "UpdateDataDict.php?fieldname=" + $id + "&description=" + $value;
                $.get("UpdateDataDict.php?fieldname=" + $id + "&description=" + $value, function(data) {
                    }
                );
            }
    )
};


$(function(){
    save();
});

