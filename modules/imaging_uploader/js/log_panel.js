"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported LogPanel */
/* global UploadProgress */

var LogPanel = function (_React$Component) {
  _inherits(LogPanel, _React$Component);

  function LogPanel(props) {
    _classCallCheck(this, LogPanel);

    var _this = _possibleConstructorReturn(this, (LogPanel.__proto__ || Object.getPrototypeOf(LogPanel)).call(this, props));

    _this.state = {
      logText: "<select a row in the table below to view the upload logs>",
      logType: "summary"
    };

    _this.initHelper = _this.initHelper.bind(_this);
    _this.onLogTypeChange = _this.onLogTypeChange.bind(_this);
    _this.setServerPolling = _this.setServerPolling.bind(_this);
    _this.monitorProgress = _this.monitorProgress.bind(_this);

    return _this;
  }

  _createClass(LogPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initHelper();
    }
  }, {
    key: "initHelper",
    value: function initHelper() {
      var uploadProgress = new UploadProgress();
      this.uploadProgress = uploadProgress;

      $('#mri_upload_table').on('click', 'tbody tr', function (event) {
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
            logText: '<select a row in the table below to view the upload logs>'
          });
          return;
        }

        uploadProgress.setUploadRow(event.currentTarget);
        $(event.currentTarget).css('background-color', '#EFEFFB');
        this.monitorProgress();
      }.bind(this));
    }

    /**
     * Monitors the progress of an MRI pipeline run on the server by repeatedly
     * issuing POST requests for this information at regular intervals.
     * As soon as the server indicates that the pipeline has finished running, polling
     * will end.
     */

  }, {
    key: "monitorProgress",
    value: function monitorProgress() {
      var summary = this.state.selectedLogType === 'Summary';
      var uploadProgress = this.uploadProgress;
      var uploadId = uploadProgress.getUploadId();

      // If no row was selected
      if (!uploadId) {
        return;
      }

      $.post(loris.BaseURL + "/imaging_uploader/ajax/getUploadSummary.php", {
        uploadId: uploadId,
        summary: summary
      }, function (data) {
        uploadProgress.setProgressFromServer(data);
        this.setState({ logText: uploadProgress.getProgressText() });
        // If the pipeline is still running, start polling
        // If the pipeline is not running, end the polling (if any was started)
        this.setServerPolling(uploadProgress.getPipelineStatus() === UploadProgress.PIPELINE_STATUS_RUNNING);
      }.bind(this)); // post call
    }

    /**
     * Starts/stops polling on the server.
     * @param {bool} poll - pool boolean
     */

  }, {
    key: "setServerPolling",
    value: function setServerPolling(poll) {
      var uploadProgress = this.uploadProgress;

      if (poll) {
        // START POLLING
        // If there were no POST requests being issued, start issuing some.
        if (!this.setServerPolling.getSummaryInterval) {
          this.setServerPolling.getSummaryInterval = setInterval(this.monitorProgress, 5000);
        }
        // If there were no updates to the string of dots, start updating
        if (!this.setServerPolling.dotUpdateInterval) {
          this.setServerPolling.dotUpdateInterval = setInterval(function () {
            uploadProgress.updateDots();
            this.setState({
              logText: uploadProgress.getProgressText()
            });
          }, 3000);
        }
        // If there were no updates to the animated chars, start updating
        if (!this.setServerPolling.animatedCharInterval) {
          this.setServerPolling.animatedCharInterval = setInterval(function () {
            uploadProgress.updateAnimatedCharIndex();
            this.setState({
              logText: uploadProgress.getProgressText()
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
  }, {
    key: "onLogTypeChange",
    value: function onLogTypeChange(name, value) {
      this.setState({ logType: value });
      this.monitorProgress();
    }
  }, {
    key: "render",
    value: function render() {
      var logTypes = {
        summary: 'Summary',
        detailed: 'Detailed'
      };

      return React.createElement(
        Panel,
        { id: "log_panel", title: "Log Viewer" },
        React.createElement(
          FormElement,
          { name: "log_form" },
          React.createElement(SelectElement, {
            name: "LogType",
            label: "Logs to display",
            options: logTypes,
            onUserInput: this.onLogTypeChange,
            value: this.state.logType,
            emptyOption: false
          }),
          React.createElement(TextareaElement, {
            name: "UploadLogs",
            disabled: true,
            id: "mri_upload_logs",
            value: this.state.logText
          })
        )
      );
    }
  }]);

  return LogPanel;
}(React.Component);

LogPanel.propTypes = {};
LogPanel.defaultProps = {};