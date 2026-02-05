/* global UploadProgress */
import React, {Component} from 'react';
import Panel from 'Panel';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import {
  FormElement,
  SelectElement,
  TextareaElement,
} from 'jsx/Form';

/**
 * Log Panel Component
 *
 * Panel component that displays logs for a selected MRI upload whether it is
 * in progress or already completed or failed.
 *
 * @author Alex Ilea
 * @version 1.0.0
 */
class LogPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    const {t} = this.props;
    this.state = {
      logText: t('<select a row in the table below to view the upload logs>',
        {ns: 'imaging_uploader'}),
      logType: 'summary',
    };

    this.initHelper = this.initHelper.bind(this);
    this.onLogTypeChange = this.onLogTypeChange.bind(this);
    this.setServerPolling = this.setServerPolling.bind(this);
    this.monitorProgress = this.monitorProgress.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.initHelper();
  }

  /**
   * Init helper
   */
  initHelper() {
    const uploadProgress = new UploadProgress();
    this.uploadProgress = uploadProgress;
    const {t} = this.props;
    const table = document.getElementById('mri_upload_table');
    if (table) {
      table.addEventListener('click', (event) => {
        const tr = event.target.closest('tr');
        if (tr && tr.parentElement.tagName == 'TBODY') {
          // Stop server polling if any was taking place
          if (uploadProgress.getUploadRow() !== null) {
            uploadProgress.getUploadRow().style.backgroundColor = 'white';
            this.setServerPolling(false);
          }

          // If user clicked on the same row, it is interpreted as a de-selection:
          // deselect row and set log text to 'nothing selected'
          if (tr === uploadProgress.getUploadRow()) {
            uploadProgress.setUploadRow(null);
            uploadProgress.setProgressFromServer(null);
            this.setState({
              logText: t('<select a row in the table below to view'
                +' the upload logs>',
              {ns: 'imaging_uploader'}),
            });
            return;
          }

          uploadProgress.setUploadRow(tr);
          tr.style.backgroundColor = '#EFEFFB';
          this.monitorProgress(this.state.logType);
        }
      });
    }
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

    const formData = new FormData();
    formData.append('uploadId', uploadId);
    formData.append('summary', summary);

    fetch(loris.BaseURL + '/imaging_uploader/ajax/getUploadSummary.php', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status);
        return;
      }

      response.json().then((data) => {
        uploadProgress.setProgressFromServer(data);
        this.setState({logText: uploadProgress.getProgressText()});
        // If the pipeline is still running, start polling
        // If the pipeline is not running, end the polling (if any was started)
        const pipelineStatus = uploadProgress.getPipelineStatus();
        const pipelineStatusRunning = UploadProgress.PIPELINE_STATUS_RUNNING;
        this.setServerPolling(pipelineStatus === pipelineStatusRunning);
      });
    }).catch((error) => {
      // Network error
      console.error(error);
    });
  }

  /**
   * Starts/stops polling on the server.
   *
   * @param {boolean} poll - pool boolean
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
        this.setServerPolling.dotUpdateInterval = setInterval(() => {
          uploadProgress.updateDots();
          this.setState({
            logText: uploadProgress.getProgressText(),
          });
        }, 3000);
      }
      // If there were no updates to the animated chars, start updating
      if (!this.setServerPolling.animatedCharInterval) {
        this.setServerPolling.animatedCharInterval = setInterval(() => {
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

  /**
   * On log type change
   *
   * @param {string} name
   * @param {*} value
   */
  onLogTypeChange(name, value) {
    // Update log box
    this.monitorProgress(value);
    this.setState({logType: value});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    const logTypes = {
      summary: t('Summary', {ns: 'imaging_uploader'}),
      detailed: t('Detailed', {ns: 'imaging_uploader'}),
    };

    return (
      <Panel id='log_panel' title={t('Log Viewer', {ns: 'imaging_uploader'})}>
        <FormElement name='log_form'>
          <SelectElement
            name='LogType'
            label={t('Logs to display', {ns: 'imaging_uploader'})}
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

LogPanel.propTypes = {
  t: PropTypes.func,
};

export default withTranslation(['imaging_uploader', 'loris'])(LogPanel);
