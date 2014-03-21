/*global document: false,alert, $: false, window: false*/
var repeater,
//log_file= "logs/MRI_upload." + $.datepicker.formatDate('yy-mm-dd', new Date()) +".log";
    log_file = " logs/MRI_upload.2013-11-19.log";

function change() {
    "use strict";
    $('#hide').show();
    $('#show').hide();
    $('#show').bind('click', function () {
        $('#log_box').show();
        $('#log_box').load("logs/customize_header.log");
        $('#log_box').load(log_file);
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

function run_mri() {
    ///entire mri_pipeline
    "use strict";
    $('.entire_pipeline').
        bind('click', function (event) {
            //event.stopImmediatePropagation();
            var id = event.target.id;
            //$.get("MRI_Pipeline_Runner.php?action=all" + "&id=" + value, function (data) {
            $.get("MRI_Pipeline_Runner.php?action=all" + "&id=" + id, function (data) {
                alert("Server Returned: " + data);
                ///change the td to be set to the value....
            });
            return false;
        });
}


//doWork();
$(function () {
    "use strict";
    //toggle();
    change();
  
});
