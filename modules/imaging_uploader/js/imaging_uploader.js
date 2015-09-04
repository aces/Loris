/*global document: false, $: false, window: false, setTimeout:false, FormData:false*/
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
/*
   Prints messages into the log box.
*/
function printMessage(message) {
    "use strict";
    var previous = $("#log_box").html(),
        next = previous + message;
    $("#log_box").html(next);
}

/* 
   Function sends requests to the server (read_log.php script) 
   and receives messages as strings, which it sends to printMessage. 
*/
function getMessage() {
    "use strict";
    $.ajax(
        {
            type: 'GET',
            url: 'AjaxHelper.php?Module=mri_upload&script=read_log.php',
            success: function (data) {
                if (data.indexOf("completed") > -1 || data.indexOf("Error") > -1) {
                    if (data.indexOf("\n") > -1) {
                        data = data.replace("\n", "<br />");
                    }
                    printMessage(data);
                    return;
                }
                if (data.indexOf("\n") > -1) {
                    data = data.replace("\n", "<br />");
                }
                printMessage(data);
                // call it again, long-polling
                setTimeout(getMessage, 1000);
            }
        }
    );
}

/*
   Forms a date and time string to be printed
   with the first default message to be consistent
   with the fromat of messages received from the server
*/
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

/*
   Updates progress bar value and label
*/
function progressHandler(event) {
    "use strict";
    var progressbar = $("#progressbar"),
        progresslabel = $("#progresslabel"),
        percent = Math.round((event.loaded / event.total) * 100);
    progressbar.attr('value', percent);
    progresslabel.text(percent + "%");
    if (percent === 100) {
        progresslabel.text("Complete!");
        progresslabel.css('left', '-230px');
    }
}

/*
   Uploads file to the server, listening to the progress
   in order to get the percentage uploaded as value for the progress bar 
*/
function uploadFile() {
    "use strict";
    getMessage();
    $("#progressbar").show();
    var formData = new FormData($("#mri_upload")[0]);

    $.ajax({
        type: 'POST',
        url: "main.php?test_name=mri_upload",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener(
                "progress",
                function (evt) {
                    if (evt.lengthComputable) {
                        var progressbar = $("#progressbar"),
                            progresslabel = $("#progresslabel"),
                            percent = Math.round((evt.loaded / evt.total) * 100);
                        progressbar.attr('value', percent);
                        progresslabel.text(percent + "%");
                    }
                },
                false
            );
            return xhr;
        }
    });
}

/*
   Main function
*/
$(function () {
    "use strict";
    change();
    $("#progressbar").hide();
/*
    $("#mri_upload").submit(
        function (e) {
            e.preventDefault();
            var time = getCurrentTime();
            $("#log_box").html(time + " Preparing... <br>");
            uploadFile();
        }
    );
*/
});
