/* exported RMonitoringStatus */

var MonitoringStatus = React.createClass(
  {
    getInitialState: function() {
      return {
        flaggedOptions: {
          yes: "Yes",
          no: "No"
        },
        monitoredOptions: {
          Y: "Yes",
          N: "No"
        },
        Data: [],
        formData: {},
        updateResult: null,
        errorMessage: null,
        isLoaded: false,
        loadedData: 0
      };
    },
    componentDidMount: function() {
      var that = this;
      $.ajax(
        this.props.dataURL,
        {
          dataType: 'json',
          xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener(
              "progress",
              function(evt) {
                that.setState(
                  {
                    loadedData: evt.loaded
                  }
                );
              }
            );
            return xhr;
          },
          success: function(data) {
            var formData = {};
            var visits = data.visits;
            for (var visit in visits) {
              if (visits.hasOwnProperty(visit)) {
                var monitored = visit + "_monitored";
                var dateMonitored = visit + "_date";
                var dateMonitored2 = visit + "_date2";
                var monitorID = visit + "_monitor";
                formData[monitored] = data.monitored[visit];
                formData[visit] = data.flagged[visit];
                formData[dateMonitored] = data.dateMonitored[visit];
                formData[dateMonitored2] = data.dateMonitored[visit];
                formData[monitorID] = data.monitorID[visit];
              }
            }

            that.setState(
              {
                Data: data,
                formData: formData,
                isLoaded: true
              }
            );
          },
          error: function(data, errorCode, errorMsg) {
            that.setState(
              {
                error: 'An error occurred when loading the form!'
              }
            );
          }
        }
      );
    },
    setFormData: function(formElement, value) {
      var formData = this.state.formData;
      formData[formElement] = value;
      this.setState(
        {
          formData: formData
        }
      );
    },
    onSubmit: function(e) {
      e.preventDefault();
    },
    render: function() {
      if (!this.state.isLoaded) {
        if (this.state.error !== undefined) {
          return (
            <div className ="alert alert-danger text-center">
              <strong>
                {this.state.error}
              </strong>
            </div>
          );
        }

        return (
          <button className ="btn-info has-spinner">
            Loading
            <span
              className ="glyphicon glyphicon-refresh
                        glyphicon-refresh-animate">
                    </span>
          </button>
        );
      }

      var disabled = true;
      var updateButton = null;
      if (loris.userHasPermission('candidate_parameter_edit')) {
        disabled = false;
        updateButton = <ButtonElement label ="Update" />;
      }
      var disabledFields = [];
      var elRequired = [];
      var monitoredRequired = [];
      var i = 0;
      for (let visit in this.state.Data.visits) {
        if (this.state.Data.visits.hasOwnProperty(visit)) {
          if (this.state.formData[visit] === 'yes') {
            monitoredRequired[i] = true;
          } else {
            disabledFields[i] = true;
          }
          if (this.state.formData[visit + "_monitored"] === 'Y') {
            elRequired[i] = true;
          }
          i++;
        }
      }

      var visits = [];
      i = 0;
      for (let visit in this.state.Data.visits) {
        if (this.state.Data.visits.hasOwnProperty(visit)) {
          var label = this.state.Data.visits[visit];
          var monitored = visit + "_monitored";
          var monitoredLabel = " Monitored: ";
          var dateMonitored = visit + "_date";
          var dateMonitoredLabel = "Date Monitored: ";
          var dateMonitored2 = visit + "_date2";
          var dateMonitored2Label = "Confirm Date Monitored: ";
          var monitorID = visit + "_monitor";
          var monitorIDLabel = "Monitored By (Examiner): ";

          visits.push(
            <SelectElement
              label ={label}
              name ={visit}
              options ={this.state.flaggedOptions}
              value ={this.state.formData[visit]}
              onUserInput ={this.setFormData}
              ref ={visit}
              disabled ={disabled}
              required ={true}
            />
          );
          visits.push(
            <SelectElement
              label ={monitoredLabel}
              name ={monitored}
              options ={this.state.monitoredOptions}
              value ={this.state.formData[monitored]}
              onUserInput ={this.setFormData}
              ref ={monitored}
              disabled ={disabledFields[i] || disabled}
              required ={monitoredRequired[i]}
            />
          );
          visits.push(
            <DateElement
              label ={dateMonitoredLabel}
              name ={dateMonitored}
              value ={this.state.formData[dateMonitored]}
              onUserInput ={this.setFormData}
              ref ={dateMonitored}
              disabled ={disabledFields[i] || disabled}
              required ={elRequired[i]}
            />
          );
          visits.push(
            <DateElement
              label ={dateMonitored2Label}
              name ={dateMonitored2}
              value ={this.state.formData[dateMonitored2]}
              onUserInput ={this.setFormData}
              ref ={dateMonitored2}
              disabled ={disabledFields[i] || disabled}
              required ={elRequired[i]}
            />
          );
          visits.push(
            <SelectElement
              label ={monitorIDLabel}
              name ={monitorID}
              options ={this.state.Data.examiners}
              value ={this.state.formData[monitorID]}
              onUserInput ={this.setFormData}
              ref ={monitorID}
              disabled ={disabledFields[i] || disabled}
              required ={elRequired[i]}
            />
          );

          visits.push(<hr />);
          i++;
        }
      }

      var formattedHistory = [];
      for (let row in this.state.Data.history) {
        if (this.state.Data.history.hasOwnProperty(row)) {
          let line = [];
          let lineInfo = "";
          let historyRow = this.state.Data.history[row];
          let userH = historyRow.entry_staff;
          let updateDateH = historyRow.data_entry_date;
          let visitH = historyRow.visit_label;
          let flaggedH = historyRow.flag;
          let monitoredH = historyRow.monitored;
          let monitoredDateH = historyRow.date_monitored;
          let examinerH = historyRow.monitor_id;

          lineInfo += "[UPDATE by ";
          lineInfo += userH;
          lineInfo += " at ";
          lineInfo += updateDateH;
          lineInfo += "]";

          line.push(
            <td>
              <b>
                Visit->
              </b>
              {visitH}
            </td>
          );
          line.push(
            <td class="td-hist">
              <b>
                Flagged ->
              </b>
              {flaggedH}
            </td>
          );
          line.push(
            <td class="td-hist">
              <b>
                Monitored ->
              </b>
              {monitoredH}
            </td>
          );
          if (monitoredDateH !== null) {
            line.push(
              <td class="td-hist">
                <b>
                  Date Monitored ->
                </b>
                {monitoredDateH}
              </td>
            );
          }

          if (examinerH !== null) {
            line.push(
              <td class="td-hist">
                <b>
                  Monitored by ->
                </b>
                {this.state.Data.examiners[examinerH]}
              </td>
            );
          }

          formattedHistory.push(
            <tr>
              <td style={{padding: "1px", width: "25%"}}>
                <i>{lineInfo}</i>
              </td>
              {line}
            </tr>
            );
        }
      }

      var alertMessage = "";
      var alertClass = "alert text-center hide";
      if (this.state.updateResult) {
        if (this.state.updateResult === "success") {
          alertClass = "alert alert-success text-center";
          alertMessage = "Update Successful!";
        } else if (this.state.updateResult === "error") {
          var errorMessage = this.state.errorMessage;
          alertClass = "alert alert-danger text-center";
          alertMessage = errorMessage ? errorMessage : "Failed to update!";
        }
      }

      return (
        <div class="row">
          <div className ={alertClass} role="alert" ref="alert-message">
            {alertMessage}
          </div>
          <FormElement
            name ="monitoringStatus"
            onSubmit ={this.handleSubmit}
            ref ="form"
            class ="col-md-12"
          >
            <StaticElement
              label ="PSCID"
              text ={this.state.Data.pscid}
            />
            <StaticElement
              label ="DCCID"
              text ={this.state.Data.candID}
            />
            {visits}
            {updateButton}
            <table className="table-hist">
              {formattedHistory}
            </table>

          </FormElement>
        </div>
      );
    },
    /**
     * Handles form submission
     *
     * @param {event} e - Form submission event
     */
    handleSubmit: function(e) {
      e.preventDefault();
      var myFormData = this.state.formData;
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; // January is 0!
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      today = yyyy + '-' + mm + '-' + dd;
      for (let visit in this.state.Data.visits) {
        if (this.state.Data.visits.hasOwnProperty(visit)) {
          var label = this.state.Data.visits[visit];

          var dateMonitored = visit + "_date";
          var dateMonitored2 = visit + "_date2";

          var date1 = myFormData[dateMonitored] ?
            myFormData[dateMonitored] : null;
          var date2 = myFormData[dateMonitored2] ?
            myFormData[dateMonitored2] : null;

          if (date1 !== date2) {
            alert(label + " dates do not match!");
            return;
          }
          if (date1 > today) {
            alert(label + " date cannot be later than today!");
            return;
          }
        }
      }

      // Set form data
      var self = this;
      var formData = new FormData();
      for (var key in myFormData) {
        if (myFormData[key] !== "") {
          formData.append(key, myFormData[key]);
        }
      }

      formData.append('tab', this.props.tabName);
      formData.append('candID', this.state.Data.candID);
      $.ajax(
        {
          type: 'POST',
          url: self.props.action,
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: function(data) {
            self.setState(
              {
                updateResult: "success"
              }
            );
            self.showAlertMessage();
          },
          error: function(err) {
            if (err.responseText !== "") {
              var errorMessage = JSON.parse(err.responseText).message;
              self.setState(
                {
                  updateResult: "error",
                  errorMessage: errorMessage
                }
              );
              self.showAlertMessage();
            }
          }

        }
      );
    },
    /**
     * Display a success/error alert message after form submission
     */
    showAlertMessage: function() {
      var self = this;
      if (this.refs["alert-message"] === null) {
        return;
      }

      var alertMsg = this.refs["alert-message"];
      $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
        500,
        function() {
          self.setState(
            {
              updateResult: null
            }
          );
        }
      );
    }

  }
);

var RMonitoringStatus = React.createFactory(MonitoringStatus);

window.MonitoringStatus = MonitoringStatus;
window.RMonitoringStatus = RMonitoringStatus;

export default MonitoringStatus;
