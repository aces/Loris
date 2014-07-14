/*global document: false, $: false, window: false*/
function change() {
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

function showProgress(perc) {
    "use strict";
    var progressbar = $("#progressbar"),
        progressLabel = $(".progress-label");

    function remove() {
        $("#progress").hide();
    }

    progressbar.progressbar({
        value: perc,
        change: function () {
            progressLabel.text(progressbar.progressbar("value") + "%");
        },
        complete: function () {
            if ($("#progress").is(":visible")) {
                progressLabel.text("Complete!");
                setTimeout(remove, 1000);
            }
        }
    });
}
function log_message(message) {
    "use strict";
    var previous = $("#log_box").html(),
        next = previous + message;
    $("#log_box").html(next);
}

function getMessage() {
    "use strict";

    function remove() {
        $("#progress").hide();
    }
    
    $.ajax(
        {
            type: 'GET',
            url: 'read_log.php',
            success: function (data) {
                // for Firefox, which waits for the response from the server                    
                // when file is uploaded                                    
                if (data.indexOf("Uploading") > -1) {
                    if ($("#progress").is(":visible")) {
                        $(".progress-label").text("Complete!");
                        setTimeout(remove, 1000);                
                    }
                }
                if (data.indexOf("completed") > -1 || data.indexOf("Error") > -1) {
                    log_message(data);
                    return;
                }
                log_message(data);
                // call it again, long-polling
                getMessage();
            }
        }
    );
}

function sendFile() {
    "use strict";
    $("#progressbar").show();
    getMessage();
    var formObj = $("#mri_upload")[0],
        formURL = "main.php?test_name=mri_upload",
        formData = new FormData(formObj),
        file = $('#file input')[0].files[0];
    formData.append('file', file.name);
    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                    showProgress(percentComplete);
                }
            }, false);
            return xhr;
        },
        url: formURL,
        type: 'POST',
        data: formData,
        mimeType: "multipart/form-data",
        contentType: false,
        cache: false,
        processData: false
    });
}

$(function () {
    "use strict";
    change();
    $("#progressbar").hide();
    $("#upload").click(function (e) {
        $("#log_box").html("-- Preparing to process files <br>");
        sendFile();
        e.preventDefault();
    });
});

