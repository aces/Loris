/*global document: false, $: false, window: false*/
function change () {
    "use strict";
    $('#show').show();
    $("#show").css("cursor", "pointer");
    $('#hide').hide();
    $('#log_box').hide();
    $('#hide').bind('click', function () {
        $('#log_box').hide('slow');
        $('#hide').hide();
        $('#show').show();
    });

    $('#show').bind('click', function () {
        $('#log_box').show('slow');
        $('#show').hide();
        $("#hide").css("cursor", "pointer");
        $('#hide').show();
    });
}

function showProgress (perc) {
    var progressbar = $("#progressbar"),
    progressLabel = $(".progress-label");
    progressbar.progressbar({
        value: perc,
        change: function() {
            progressLabel.text(progressbar.progressbar("value") + "%");
        },
        complete: function() {
            progressLabel.text("Complete!");
            setTimeout(remove, 1000);
        }
    });
    function progress() {
        var val = perc || 0; 
        progressbar.progressbar("value", val);
    }
    function remove() {
        $("#progress").hide();
    }
}

function sendFile() {
    $("#progressbar").show();
    getMessage();
    var formObj = $("#mri_upload")[0];
    var formURL = "main.php?test_name=mri_upload";
    var formData = new FormData(formObj);
    var file = $('#file input')[0].files[0];
    formData.append('file', file.name);
    $.ajax({
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = Math.floor((evt.loaded / evt.total)*100);
                    showProgress(percentComplete);
                }
            }, false);
            return xhr;
        },
        url: formURL,
        type: 'POST',
        data:  formData,
        mimeType: "multipart/form-data",
        contentType: false,
        cache: false,
        processData: false         
    });
}

function log_message(message) {
    var previous = $("#log_box").html();
    var next = previous + message;
    $("#log_box").html(next);
}

function getMessage(timestamp)
{
    var queryString = {'timestamp' : timestamp};
    $.ajax(
        {
            type: 'GET',
            url: 'read_log.php',
            data: queryString,
            success: function(data){
                // put result data into "obj"
                var obj = jQuery.parseJSON(data);
                // put the data_from_file into #response
                log_message(obj.data_from_file);
                // call the function again, this time with the timestamp we just got from server.php
                getMessage(obj.timestamp);
            }
        }
    );
}


$(function () {
   change();
   $("#progressbar").hide();
   $("#upload").click(function(e) {
       sendFile();
       e.preventDefault();
   }); 
});

