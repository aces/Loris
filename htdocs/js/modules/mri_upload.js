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
    $("#upload").click(function(e) {
        ajax_stream();
        $("#progressbar").show();
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
            processData: false,
            success: function(data, textStatus, jqXHR)
            {
                console.log(data);
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
            }         
        });
        e.preventDefault();
 
    });
}

function log_message(message) {
    var previous = $("#log_box").html();
    var next = previous + message;
    $("#log_box").html(next + "<br>");
}

function ajax_stream() {
    if (!window.XMLHttpRequest) {
        log_message("Your browser does not support the native XMLHttpRequest object.");
        return;
    }
         
    try {
        var xhr = new XMLHttpRequest(); 
        xhr.previous_text = '';
             
        //xhr.onload = function() { log_message("[XHR] Done. responseText: <i>" + xhr.responseText + "</i>"); };
        xhr.onerror = function() { log_message("[XHR] Fatal Error."); };
        xhr.onreadystatechange = function() {
            try {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var result = xhr.responseText;
                    log_message(result);
                   // setTimeout(ajax_stream, 3000);
                }  
            } catch (e) {
                    log_message("<b>[XHR] Exception: " + e + "</b>");
            }
        };
     
        xhr.open("GET", "read_log.php", true);
        xhr.send();     
    } catch (e) {
        log_message("<b>[XHR] Exception: " + e + "</b>");
    }
}


function SSE() {
    
    var source = new EventSource("main.php?test_name=mri_upload");
    source.addEventListener('message', function(e) {
        $("#log_box").html(e.data + "<br>");
    }, false);
    source.addEventListener('open', function(e) {
        $("#log_box").html('connection opened<br />');
    }, false);
    source.addEventListener('error', function(e) {
        $("#log_box").html('error');
    }, false);
    //source.onmessage = function(event) {
    //    $("#log_box").html(event.data + "<br>");
    //};
}

$(function () {
   change();
   $("#progressbar").hide();
   sendFile();
  // $("#upload").click(function(e) {
   //    ajax_stream();
  // });
  // $("#upload").click(function(e) {
    //   SSE();
   //});
});

