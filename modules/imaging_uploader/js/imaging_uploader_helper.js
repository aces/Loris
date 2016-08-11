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
    $.ajax({
        type: 'GET',
        url: loris.BaseURL + '/imaging_uploader/ajax/read_log.php',
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
    });
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

    $("#file-input").hide();
    $("#file-progress").show();
    var formData = new FormData($("#mri_upload")[0]);
    formData.append("fire_away", "Upload");
    $.ajax({
        type: 'POST',
        url: loris.BaseURL + "/imaging_uploader/",
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
                        $(progressbar).width(percent + "%");
                        $(progresslabel).html(percent + "%");
                        progressbar.attr('aria-valuenow', percent);
                    }
                },
                false
            );
            return xhr;
        },
        success: function (data) {
            if (data.indexOf("The following errors occured while attempting to display this page:") > -1) {
                document.open();
                document.write(data);
                document.close();
            } else {
                $("#filter").click();
            }
        }
    });
}

/*
Main function
*/
$(function () {
    "use strict";
    change();
    $(".submit-button").click(
        function (e){
            if(e.currentTarget.id === "filter"){
                $("input[name=mri_file]").val("");
                $("#mri_upload").submit();
            } else if (e.currentTarget.id === "upload"){
                e.preventDefault();
                uploadFile();
            }
        }
    );
});


/**
 * Represents the progress of the MRI pipeline run on a specific scan. 
 */
function UploadProgress() {
    /**
     * Row (i.e. <tr> element) in the MRI upload table associated to this progress element.
     */ 
    this._uploadRow         = null;
    /**
     * Series of dots used in the text used to describe the progress object
     * to indicate that the MRI pipeline is currently running.
     */
    this._dots               = '';
    /**
     * Char used in the text used to describe the progress object
     * to indicate that the MRI pipeline is currently running.
     */
    this._animatedCharIndex  = 0;
    /**
     * Server response to a POST request for the status of an upload progress.
     */
    this._progressFromServer = null; 
        
    /**
     * Getter method for field _uploadRow.
     */    
    this.getUploadRow = function() {
        return this._uploadRow;
    };
    
    /**
     * Setter method for field _uploadRow.
     */
    this.setUploadRow = function(uploadRow) {
        this._uploadRow = uploadRow;
        
        this._progressFromServer = null;
        this._dots              = '';
        this._animatedCharIndex = 0;
    };

    /**
     * Gets the upload ID associated to the current progress object.
     */
    this.getUploadId = function() {
        if(this._uploadRow == null) {
            return null;
        }
        
        return $.trim($(this._uploadRow).find('td').eq(1).text());
    }    
    
    /**
     * String representation of this object.
     */
    this.getProgressText = function() {
        var columns    = $(this._uploadRow).find('td'),
            uploadId   = $.trim($(columns).eq(1).text()),
            candid     = $.trim($(columns).eq(3).text()),
            pscid      = $.trim($(columns).eq(4).text()),
            visitLabel = $.trim($(columns).eq(5).text())

        var progressType = $('select[name=LogType] option:selected').text() == 'Summary' ? 'Summary' : 'Details';

        // All the messages in the notification_spool table
        var notificationText = '';        
        if(this._progressFromServer != null && this._progressFromServer.notifications != null) {
            for(i=0; i<this._progressFromServer.notifications.length; i++) {
                notificationText += this._progressFromServer.notifications[i].Message;
            }
        }
                
        // Display pSCID, CandID and VisitLabel for the selected upload
        var progressHeader = progressType + ' of upload ' + uploadId + ' for ' + pscid + ' (CandID ' + candid + ') at ' + visitLabel + "\n";
        
        // If pipeline is still running
        if(this.getPipelineStatus() == UploadProgress.PIPELINE_STATUS_RUNNING) {
            return progressHeader
                + notificationText
                + this._dots
                + ['|', '/', '-', '\\', '|', '/', '-', '\\'][this._animatedCharIndex % 8] + "\n";
        }
        
        // Pipeline is not currently running: it is either not started, stopped or communication with the server
        // could not be established and so the status of the pipeline is unknown 
        var statusText;
        if(this.getPipelineStatus() == UploadProgress.PIPELINE_STATUS_FINISHED) {
            statusText = 'Upload is finished and ' + (this.isInsertionComplete() ? 'was successful' : 'failed');
        } else if(this.getPipelineStatus() == UploadProgress.PIPELINE_STATUS_NOT_STARTED) {
            statusText = 'MRI pipeline not yet executed for this upload.';
        } else if(this.getPipelineStatus() == UploadProgress.PIPELINE_STATUS_UNKNOWN) {
            statusText = 'Communication with the server failed: progress information is not available at this time.';
        }
                
        return progressHeader + notificationText + statusText;
    };

    /**
     * Updates the series of dots used to indicate that the pipeline is running.
     */
    this.updateDots = function() {
        this._dots += '.';
    };
    
    /**
     * Updates the animated char used to indicate that the pipeline is running.
     */
    this.updateAnimatedCharIndex = function() {
        this._animatedCharIndex++;
    }

    /**
     * Determines whether the pipeline is currently running or not.
     */
    this.getPipelineStatus = function() {
        if(this._progressFromServer == null) {
            return UploadProgress.PIPELINE_STATUS_UNKNOWN;
        } 
        
        if(this._progressFromServer.inserting == null) {
            return UploadProgress.PIPELINE_STATUS_NOT_STARTED;
        }
         
        if(this._progressFromServer.inserting == 0) {
            return UploadProgress.PIPELINE_STATUS_FINISHED;
        }
        
        if(this._progressFromServer.inserting == 1) {
            return UploadProgress.PIPELINE_STATUS_RUNNING;
        }  
        
        throw "Unknown value for Inserting field: " + this._progressFromServer.inserting;
    }
    
    /**
     * Determines whether the pipeline terminated successfully (assumes pipeline has
     * finished running).
     */
    this.isInsertionComplete = function() {
        return this._progressFromServer != null && this._progressFromServer.insertionComplete == 1;
    }
    
    /**
     * Sets the _progressFromServer object based on the result of a POST request to the server for
     * this information.
     */
    this.setProgressFromServer = function(progressFromServer) {
        if(progressFromServer != null) {
            var newProgressFromServer = $.parseJSON(progressFromServer);
            
            // If the number of notifications changed since last POST request, reset the
            // dots and animated char
            if(this._progressFromServer != null 
              && this._progressFromServer.notifications != null 
              && newProgressFromServer.notifications != null
              && this._progressFromServer.notifications.length != newProgressFromServer.notifications.length) {
                this._dots = '';
                this._animatedCharIndex = 0;
            } else {
                // If the pipeline is not running anymore, reset dots and animated char
                if(newProgressFromServer.inserting != 1) {
                    this._dots ='';
                    this._animatedCharIndex = 0;
                }
            }
        
            this._progressFromServer = newProgressFromServer;    
        } else {
            this._progressFromServer = null;
            this._dots = '';
            this._animatedCharIndex = 0;
        }
    };
    
}
UploadProgress.PIPELINE_STATUS_FINISHED    = 0;
UploadProgress.PIPELINE_STATUS_RUNNING     = 1;
UploadProgress.PIPELINE_STATUS_NOT_STARTED = 2;
UploadProgress.PIPELINE_STATUS_UNKNOWN     = 3; 

var uploadProgress;
var clickOnSameRowDeselects = true;

/**
 * Invoked when the user changes the log type form Summary to Detailed and
 * vice-versa.
 */
function onUploadTypeChange() {
    var logTableClass = $('select[name=LogType] option:selected').text() == 'Summary' 
        ? 'upload-logs-table-summary' : 'upload-logs-table-detailed';
        
    // This will enlarge/shrink the logs table
    $('textarea[name=UploadLogs]').attr("class", logTableClass);
                
    // If an upload is currently selected, fetch the appropriate logs
    if(uploadProgress.getUploadRow() != null) {
        clickOnSameRowDeselects = false;
        $(uploadProgress.getUploadRow()).trigger('click');
        clickOnSameRowDeselects = true;
    }
}

/**
 * Monitors the progress of an MRI pipeline run on the server by repeatedly
 * issuing POST requests for this information at regular intervals.
 * As soon as the server indicates that the pipeline has finished running, polling
 * will end.
 */
function monitorProgress() {
    var summary = $('select[name=LogType] option:selected').text() == 'Summary' ? true : false;
    var uploadId = uploadProgress.getUploadId();
    
    $.post(
        loris.BaseURL + "/imaging_uploader/ajax/getUploadSummary.php",
        {uploadId: uploadId, summary: summary},
        function (data) {
            uploadProgress.setProgressFromServer(data);
            // If the pipeline is still running, start polling
            // If the pipeline is not running, end the polling (if any was started)
            setServerPolling(uploadProgress.getPipelineStatus() == UploadProgress.PIPELINE_STATUS_RUNNING);
            $('textarea[name=UploadLogs]').val(uploadProgress.getProgressText());
        }    
    );  // post call
}

/**
 * Starts/stops polling on the server.
 */
function setServerPolling(poll) {
    // If polling should be stopped
    if(!poll) {
        // Stop issuing POST requests (if any polling was taking place)
        if(setServerPolling.getSummaryInterval) {
            clearInterval(setServerPolling.getSummaryInterval);
            setServerPolling.getSummaryInterval = null;
        }
        // Stop updating the series of dots string (if such an update was
        // going on) 
        if(setServerPolling.dotUpdateInterval) {
            clearInterval(setServerPolling.dotUpdateInterval);
            setServerPolling.dotUpdateInterval= null;
        }
        // Stop updating the animated char (if such an update was
        // going on) 
        if(setServerPolling.animatedCharInterval) {
            clearInterval(setServerPolling.animatedCharInterval);
            setServerPolling.animatedCharInterval = null;
        }  
    // If polling should begin  
    } else {
        // If there were no POST requests being issued, start issuing some.
        if(!setServerPolling.getSummaryInterval) {
            setServerPolling.getSummaryInterval = setInterval(
                monitorProgress,
                5000
            )
        }

        // If there were no updates to the string of dots, start updating
        if(!setServerPolling.dotUpdateInterval) {
            setServerPolling.dotUpdateInterval = setInterval(
                function() {
                    uploadProgress.updateDots(); 
                    $('textarea[name=UploadLogs]').val(uploadProgress.getProgressText());
                },
                3000
            )
        }
        
        // If there were no updates to the animated chars, start updating
        if(!setServerPolling.animatedCharInterval) {
            setServerPolling.animatedCharInterval = setInterval(
                function() {
                    uploadProgress.updateAnimatedCharIndex();
                    $('textarea[name=UploadLogs]').val(uploadProgress.getProgressText());
                },
                250
            )
        }
    }
}

/**
 * Invokes wen the DOM is ready. Will repond to clicks in the MRI upload table by
 * updating the upload logs for that MRI scan in the logs table.
 */
$(document).ready(
    function() {
        uploadProgress = new UploadProgress();        
        
        $(".image-link").click(function(e){
            loris.loadFilteredMenuClickHandler(
                'imaging_browser',
                {'DCCID': $(this).attr("data-dccid")}
            )(e);
        });
        // update the logs table: make it read-only, as wide as the panel containing it
        // and set the initial content
        $('textarea[name=UploadLogs]').attr("readonly", "true");
        var logTableClass = $('select[name=LogType] option:selected').text() == 'Summary' 
            ? 'upload-logs-table-summary' : 'upload-logs-table-detailed';
        $('textarea[name=UploadLogs]').attr("class", logTableClass);
        $('textarea[name=UploadLogs]').val('<select a row in the table below to view the upload logs>');
    
        $('select[name=LogType]').on('click', onUploadTypeChange);
    
        // Define behavior when MRI upload row is clicked
        $('#mri_upload_table tbody tr').click(
            function(event) {
                // Stop server polling if any was taking place
                if(uploadProgress.getUploadRow() != null) {
                    $(uploadProgress.getUploadRow()).css('background-color', 'white'); 
                    setServerPolling(false);  
                }
                
                // If user clicked on the same row, it is interpreted as a de-selection:
                // deselect row and set log text to 'nothing selected'
                if(event.delegateTarget == uploadProgress.getUploadRow() && clickOnSameRowDeselects) {
                    $('textarea[name=UploadLogs]').val(
                        '<select a row in the table below to view the upload logs>'
                    );
                    uploadProgress.setUploadRow(null);
                    uploadProgress.setProgressFromServer(null);
                    return;
                }
                
                uploadProgress.setUploadRow(event.delegateTarget);

                $(this).css('background-color', '#EFEFFB');  
                
                monitorProgress();
            }  
        ); 
    } 
);
