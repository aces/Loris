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

function toggle() {
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

/*function doWork() {
var stringData = $.ajax({
url: log_file,
success: function(data) {
console.log(data);
setTimeout(doWork, 3000) ;
$("#log_box").html(data);
}
});

//Split values of string data
//var stringArray = stringData.split(",");
//doWork();
//$('#log_box').html(stringData);
//    $('#log_box').load(log_file);
///repeater = setTimeout(doWork, 1000);
}

*/

//doWork();
$(function () {
    "use strict";
    toggle();
    change();
    /////////////////////////////////////
    ////////////////Validation////////////
    //////////////////////////////////////////

    ///Get all the value
    //$("#mri_upload").submit(function() {
    //var elements = $(this).get(0).elements;
        /*---validate
        ---move the file and insert into the database....
        ---Then run dicomtar...
        ---then run minc-insertion...
        $.ajax({
        type: "POST",
        url:'validation.php',
        data : array{
        something:
        something:
        }
        success: function(data){
        alert(data);//only for testing purposes
        }
        });
        });
        ////control the action...
        $('#upload').
        bind('click', function (event) {
        });
        //change();
        //alert(log_file);


        //run_mri();
        */
     //});
});