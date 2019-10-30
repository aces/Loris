/* global UploadProgress */
import React, {Component} from 'react';
import Panel from 'Panel';

/**
 * Log Panel Component
 *
 * Panel component that displays logs for a selected MRI upload whether it is
 * in progress or already completed or failed.
 *
 * @author Alex Ilea
 * @version 1.0.0
 * @since 2017/04/01
 *
 */
class LogPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logText: '<select a row in the table below to view the upload logs>',
      logType: 'summary',
    };

    this.initHelper = this.initHelper.bind(this);
    this.onLogTypeChange = this.onLogTypeChange.bind(this);
    this.setServerPolling = this.setServerPolling.bind(this);
    this.monitorProgress = this.monitorProgress.bind(this);
  }

  componentDidMount() {
    this.initHelper();
  }

  initHelper() {
    const uploadProgress = new UploadProgress();
    this.uploadProgress = uploadProgress;

    $('#mri_upload_table').on('click', 'tbody tr', function(event) {
      // Stop server polling if any was taking place
      if (uploadProgress.getUploadRow() !== null) {
        $(uploadProgress.getUploadRow()).css('background-color', 'white');
        this.setServerPolling(false);
      }

      // If user clicked on the same row, it is interpreted as a de-selection:
      // deselect row and set log text to 'nothing selected'
      if (event.currentTarget === uploadProgress.getUploadRow()) {
        uploadProgress.setUploadRow(null);
        uploadProgress.setProgressFromServer(null);
        this.setState({
          logText: '<select a row in the table below to view the upload logs>',
        });
        return;
      }

      uploadProgress.setUploadRow(event.currentTarget);
      $(event.currentTarget).css('background-color', '#EFEFFB');
      this.monitorProgress(this.state.logType);
    }.bind(this));
  }

  /**
   * Monitors the progress of an MRI pipeline run on the server by repeatedly
   * issuing POST requests for this information at regular intervals.
   * As soon as the server indicates that the pipeline has finished running, polling
   * will end.
   *
   * @param {string} logType - summary or details
   */
  monitorProgress(logType) {
    const summary = (logType === 'summary');
    const uploadProgress = this.uploadProgress;
    const uploadId = uploadProgress.getUploadId();

    // If no row was selected
    if (!uploadId) {
      return;
    }

    $.post(loris.BaseURL + '/imaging_uploader/ajax/getUploadSummary.php', {
      uploadId: uploadId,
      summary: summary,
    }, function(data) {
      uploadProgress.setProgressFromServer(data);
      this.setState({logText: uploadProgress.getProgressText()});
      // If the pipeline is still running, start polling
      // If the pipeline is not running, end the polling (if any was started)
      this.setServerPolling(
        uploadProgress.getPipelineStatus() === UploadProgress.PIPELINE_STATUS_RUNNING
      );
    }.bind(this)); // post call
  }

  /**
   * Starts/stops polling on the server.
   * @param {bool} poll - pool boolean
   */
  setServerPolling(poll) {
    const uploadProgress = this.uploadProgress;

    if (poll) {
      // START POLLING
      // If there were no POST requests being issued, start issuing some.
      if (!this.setServerPolling.getSummaryInterval) {
        this.setServerPolling.getSummaryInterval = setInterval(
          this.monitorProgress, 5000
        );
      }
      // If there were no updates to the string of dots, start updating
      if (!this.setServerPolling.dotUpdateInterval) {
        this.setServerPolling.dotUpdateInterval = setInterval(function() {
          uploadProgress.updateDots();
          this.setState({
            logText: uploadProgress.getProgressText(),
          });
        }, 3000);
      }
      // If there were no updates to the animated chars, start updating
      if (!this.setServerPolling.animatedCharInterval) {
        this.setServerPolling.animatedCharInterval = setInterval(function() {
          uploadProgress.updateAnimatedCharIndex();
          this.setState({
            logText: uploadProgress.getProgressText(),
          });
        }, 250);
      }
    } else {
      // STOP POLLING
      // Stop issuing POST requests (if any polling was taking place)
      if (this.setServerPolling.getSummaryInterval) {
        clearInterval(this.setServerPolling.getSummaryInterval);
        this.setServerPolling.getSummaryInterval = null;
      }
      // Stop updating the series of dots string (if such an update was going on)
      if (this.setServerPolling.dotUpdateInterval) {
        clearInterval(this.setServerPolling.dotUpdateInterval);
        this.setServerPolling.dotUpdateInterval = null;
      }
      // Stop updating the animated char (if such an update was going on)
      if (this.setServerPolling.animatedCharInterval) {
        clearInterval(this.setServerPolling.animatedCharInterval);
        this.setServerPolling.animatedCharInterval = null;
      }
    }
  }

  onLogTypeChange(name, value) {
    // Update log box
    this.monitorProgress(value);
    this.setState({logType: value});
  }

  render() {
    const logTypes = {
      summary: 'Summary',
      detailed: 'Detailed',
    };

    return (
      <Panel id='log_panel' title='Log Viewer'>
        <FormElement name='log_form'>
          <SelectElement
            name='LogType'
            label='Logs to display'
            options={logTypes}
            onUserInput={this.onLogTypeChange}
            value={this.state.logType}
            emptyOption={false}
          />
          <TextareaElement
            name='UploadLogs'
            disabled={true}
            id='mri_upload_logs'
            value={this.state.logText}
            rows={6}
          />
        </FormElement>
      </Panel>
    );
  }
}

LogPanel.propTypes = {};
LogPanel.defaultProps = {};

export default LogPanel;
