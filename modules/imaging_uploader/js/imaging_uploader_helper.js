/*global document: false, $: false, window: false, setTimeout:false, FormData:false*/

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

        var progressType = $('select[name=LogType] option:selected').text() == 'Summary' ? 'summary' : 'details';

        // All the messages in the notification_spool table
        var notificationText = '';
        if(this._progressFromServer != null && this._progressFromServer.notifications != null) {
            for(i=0; i<this._progressFromServer.notifications.length; i++) {
                notificationText += this._progressFromServer.notifications[i].Message;
            }
        }

        // Display pSCID, CandID and VisitLabel for the selected upload
        var progressHeader = 'Processing ' + progressType + ' for upload ' + uploadId;
        if(pscid) {
            progressHeader += ' of ' + pscid;
        }
        if(candid) {
            progressHeader += ' (CandID ' + candid + ')';
        }
        if(visitLabel) {
            progressHeader += ' at ' + visitLabel;
        }
        progressHeader += ":\n";

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
            statusText = 'Upload processing is finished and ' + (this.isInsertionComplete() ? 'was successful' : 'failed');
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

        if(this._progressFromServer.inserting == '') {
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
            // If the number of notifications changed since last POST request, reset the
            // dots and animated char
            if(this._progressFromServer != null
              && this._progressFromServer.notifications != null
              && progressFromServer.notifications != null
              && this._progressFromServer.notifications.length != progressFromServer.notifications.length) {
                this._dots = '';
                this._animatedCharIndex = 0;
            } else {
                // If the pipeline is not running anymore, reset dots and animated char
                if(progressFromServer.inserting != 1) {
                    this._dots ='';
                    this._animatedCharIndex = 0;
                }
            }

            this._progressFromServer = progressFromServer;
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

