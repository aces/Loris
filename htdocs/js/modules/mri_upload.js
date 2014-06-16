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
   // $("#upload").click(function(e) {
     //   e.preventDefault();
     //   $("#progress").append('<div id="progressbar"><div class="progress-label">Loading...</div></div>');
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
           // if (val < 99) {
              //  setTimeout(progress, 100 );
           // }
        }
        function remove() {
            $("#progress").hide();
        }
       // setTimeout(progress, 3000);
//});
   
}

function changeProgress(val) {
    var widthBar = val*$("#progressbar").width()/100;
    $("#progressbar").width(widthBar).html(val + "%");
}

function sendFile() {
    $("#mri_upload").submit(function(e) {
        $("#progressbar").show();
        var formObj = $(this);
        var formURL = "main.php?test_name=mri_upload";
        var formData = new FormData(this);
        var file = $('#file input')[0].files[0];
        formData.append('file', file.name);
        $.ajax({
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = Math.floor((evt.loaded / evt.total)*100);
                        console.log(percentComplete);
                        showProgress(percentComplete);
                    }
                }, false);
                return xhr;
            },
            url: formURL,
            type: 'POST',
            data:  formData,
            mimeType:"multipart/form-data",
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
        e.preventDefault(); //Prevent Default action.
    });
}

$(function () {
   change();
   $("#progressbar").hide();
   sendFile();
   //showProgress();
});

