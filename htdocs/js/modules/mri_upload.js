function change() {
"use strict";
$('#hide').show();
$('#show').hide();
$('#show').bind('click', function () {
    $('#log_box').show();
    $('#log_box').load("logs/customize_header.log");
    $('#hide').show();
    $('#show').hide();
});

//To hide : table hides...and the show shows...
$('#hide').bind('click', function () {
    $('#log_box').hide();
    $('#show').show();
    $('#hide').hide();
});
}

function toggle(){

"use strict";

$('.advancedOptions').hide();

$('#advanced').bind('click', function () {
    $('#advanced').hide();
    $('.advancedOptions').show();
});

//To hide : table hides...and the show shows...
$('#basic').bind('click', function () {
    $('#advanced').show();
    $('.advancedOptions').hide();
});

}
function run_mri(){
    ///entire mri_pipeline
    /*
    $.get("GetInstruments.php?visit_label=" + visit_label_value ,
    function(data)
    {
    instruments = data.split("\n");
    instrument_dropdown.options.length = 0;
    var i, numInstruments = instruments.length, val, selected = "";
    for (i=0;i<numInstruments;i++) {
    val = instruments[i];
    if(val !='') {
    instrument_dropdown.options[i] = new Option(val,val);
    if ((val==instrument_dropdown_value) && (instrument_dropdown_value!= undefined)) {
    instrument_dropdown.options[i].selected = "selected";
    }
    }
    }
    }
    );
    */

    /*$('.description').
    bind('blur',function(event){
    event.stopImmediatePropagation();
    id = event.target.id;
    value = $("#" + id) .text();
    // sendRemoteDataQuery("query_gui_data_loader.php?mode=loadQuery&action="+action+"&qid="+qid);
    var test = "UpdateDataDict.php?fieldname=" + id + "&description=" + value;
    $.get("UpdateDataDict.php?fieldname=" + id + "&description=" + value, function(data) {
    }
    );
    }
    )

    */
    $('.entire_pipeline').
    bind('click', function (event) {
        //event.stopImmediatePropagation();
        id = event.target.id;

        //$.get("MRI_Pipeline_Runner.php?action=all" + "&id=" + value, function (data) {
        $.get("MRI_Pipeline_Runner.php?action=all" + "&id=" + id , function (data) {
            alert("Server Returned: " + data);
            ///change the td to be set to the value....
        });

        return false;
    });
}

$(function(){
    toggle();
    change();
    run_mri();
    //$('#log_box').load("logs/customize_header.log");
});

