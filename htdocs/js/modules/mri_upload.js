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
    var noMessage;

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
                        setTimeout(remove, 500);
                    }
                    noMessage = true;
                }
                else {
                    if (data.indexOf("completed") > -1 || data.indexOf("with errors") > -1) {
                        if (data.indexOf("\n") > -1) {
                            data = data.replace("\n", "<br />");
                        }
                        log_message(data);
                        return;
                    }
                }
                if (data.indexOf("\n") > -1) {
                    data = data.replace("\n", "<br />");
                }
                if (! noMessage) {
                    log_message(data);
                }
                // call it again, long-polling
                setTimeout(getMessage, 1000);
                
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
        processData: false,
        success: function(data, textStatus, jqXHR)
        {
            console.log(data);
        }
    });
}

function getCurrentTime() {
    "use strict";
    var date = new Date(),
        day = ("0" + date.getDate()).slice(-2),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        hours = ("0" + date.getHours()).slice(-2),
        minutes = ("0" + date.getMinutes()).slice(-2),
        seconds = ("0" + date.getSeconds()).slice(-2),
        result = "[" + date.getFullYear() + "-" + month + "-" 
            + day + " " + hours + ":" + minutes + ":" + seconds + "]";
    return result;
}

$(function () {
    "use strict";
    change();
    $("#progressbar").hide();
    $("#upload").click(function (e) {
        var time = getCurrentTime(); 
        $("#log_box").html(time + " Preparing... <br>");
        sendFile();
        e.preventDefault();
    });
});

