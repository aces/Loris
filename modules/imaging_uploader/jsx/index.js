/* global UploadProgress, ReactDOM */

/**
 * Render imaging_uploader on page load
 */
window.onload = function() {
  var dataURL = loris.BaseURL + "/imaging_uploader/?format=json";
  var imagingUploader = (
    <ImagingUploader
      Module="imaging_uploader"
      DataURL={dataURL}
    />
  );

  // Create a wrapper div in which react component will be loaded
  const imagingUploaderDOM = document.createElement('div');
  imagingUploaderDOM.id = 'page-imaging-uploader';

  // Append wrapper div to page content
  const rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(imagingUploaderDOM);

  ReactDOM.render(imagingUploader, document.getElementById("page-imaging-uploader"));

  // Init helper once page is rendered
  initHelper();
};

var uploadProgress;
var clickOnSameRowDeselects = true;
var uploadLogs;
var selectedLogType;

/**
 * Inits helper functions, reponds to clicks in the MRI upload table by
 * updating the upload logs for that MRI scan in the logs table.
 */
function initHelper() {
  // defined in imaging_uploader_helper
  uploadProgress = new UploadProgress();

  let logType = $('select[name=LogType]');
  logType.on('click', onUploadTypeChange);
  selectedLogType = logType.find(":selected").text();

  let logTableClass = (selectedLogType === 'Summary') ? 'upload-logs-table-summary' : 'upload-logs-table-detailed';

  // update the logs table: make it read-only, as wide as the panel containing it
  // and set the initial content
  uploadLogs = $('textarea[name=UploadLogs]');
  uploadLogs.attr("readonly", "true");
  uploadLogs.attr("class", logTableClass);
  uploadLogs.val('<select a row in the table below to view the upload logs>');

  // Define behavior when MRI upload row is clicked
  $('#mri_upload_table').on('click', 'tbody tr', function(event) {
    // Stop server polling if any was taking place
    if (uploadProgress.getUploadRow() !== null) {
      $(uploadProgress.getUploadRow()).css('background-color', 'white');
      setServerPolling(false);
    }

    // If user clicked on the same row, it is interpreted as a de-selection:
    // deselect row and set log text to 'nothing selected'
    if (event.currentTarget === uploadProgress.getUploadRow() && clickOnSameRowDeselects) {
      uploadLogs.val('<select a row in the table below to view the upload logs>');
      uploadProgress.setUploadRow(null);
      uploadProgress.setProgressFromServer(null);
      return;
    }

    uploadProgress.setUploadRow(event.currentTarget);
    $(this).css('background-color', '#EFEFFB');
    monitorProgress();
  });
}

/**
 * Invoked when the user changes the log type form Summary to Detailed and
 * vice-versa.
 */
function onUploadTypeChange() {
  var logTableClass = (selectedLogType === 'Summary') ? 'upload-logs-table-summary' : 'upload-logs-table-detailed';

  // This will enlarge/shrink the logs table
  uploadLogs.attr("class", logTableClass);

  // If an upload is currently selected, fetch the appropriate logs
  if (uploadProgress.getUploadRow() !== null) {
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
  var summary = (selectedLogType === 'Summary');
  var uploadId = uploadProgress.getUploadId();

  $.post(
    loris.BaseURL + "/imaging_uploader/ajax/getUploadSummary.php",
    {uploadId: uploadId, summary: summary},
    function(data) {
      uploadProgress.setProgressFromServer(data);
      // If the pipeline is still running, start polling
      // If the pipeline is not running, end the polling (if any was started)
      setServerPolling(uploadProgress.getPipelineStatus() === UploadProgress.PIPELINE_STATUS_RUNNING);
      uploadLogs.val(uploadProgress.getProgressText());
    }
  );  // post call
}

/**
 * Starts/stops polling on the server.
 * @param {bool} poll - pool boolean
 */
function setServerPolling(poll) {
  if (poll) {
    // START POLLING
    // If there were no POST requests being issued, start issuing some.
    if (!setServerPolling.getSummaryInterval) {
      setServerPolling.getSummaryInterval = setInterval(monitorProgress, 5000);
    }
    // If there were no updates to the string of dots, start updating
    if (!setServerPolling.dotUpdateInterval) {
      setServerPolling.dotUpdateInterval = setInterval(function() {
        uploadProgress.updateDots();
        uploadLogs.val(uploadProgress.getProgressText());
      }, 3000);
    }
    // If there were no updates to the animated chars, start updating
    if (!setServerPolling.animatedCharInterval) {
      setServerPolling.animatedCharInterval = setInterval(function() {
        uploadProgress.updateAnimatedCharIndex();
        uploadLogs.val(uploadProgress.getProgressText());
      }, 250);
    }
  } else {
    // STOP POLLING
    // Stop issuing POST requests (if any polling was taking place)
    if (setServerPolling.getSummaryInterval) {
      clearInterval(setServerPolling.getSummaryInterval);
      setServerPolling.getSummaryInterval = null;
    }
    // Stop updating the series of dots string (if such an update was going on)
    if (setServerPolling.dotUpdateInterval) {
      clearInterval(setServerPolling.dotUpdateInterval);
      setServerPolling.dotUpdateInterval = null;
    }
    // Stop updating the animated char (if such an update was going on)
    if (setServerPolling.animatedCharInterval) {
      clearInterval(setServerPolling.animatedCharInterval);
      setServerPolling.animatedCharInterval = null;
    }
  }
}
