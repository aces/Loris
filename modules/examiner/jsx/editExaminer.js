import Panel from 'Panel';
import Loader from 'Loader';

/**
 * Examiner Module
 *
 * Edit examiner page to the module that allows changes to the examiner's
 * certification status for enabled instruments
 *
 * Renders the Edit Examiner page consisting of FormElement
 * and Panel components.
 *
 * @author Zaliqa Rosli
 * @version 1.0.0
 */
class EditExaminer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: {},
      formData: {},
      statusOptions: {
        null: "N/A",
        not_certified: "Not Certified",
        in_training: "In Training",
        certified: "Certified"
      }
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   */
  fetchData() {
    const self = this;
    let formData = {};
    $.ajax({
      url: this.props.dataURL,
      type: 'GET',
      dataType: 'json',
      data: {
        identifier: this.props.examinerID
      },
      success: data => {
        const instruments = data.instruments;
        for (let instrumentID in instruments) {
          if (instruments.hasOwnProperty(instrumentID)) {
            formData[instrumentID] = {
              status: data.instruments[instrumentID].pass,
              date: data.instruments[instrumentID].date_cert,
              comments: data.instruments[instrumentID].comment
            };
          }
        }
        self.setState({
          data: data,
          formData: formData,
          isLoaded: true
        });
      },
      error: error => {
        console.error(error);
      }
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement  name of the form element
   * @param {string} value        value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    let split = formElement.split("_");
    let key = split[0];
    let element = split[1];
    formData[key][element] = value;
    this.setState({
      formData: formData
    });
  }

  /**
   * Handles the submission of the Add Examiner form
   *
   * @param {event} e event of the form
   */
  handleSubmit(e) {
    e.preventDefault();
    let formData = this.state.formData;
    let formObject = new FormData();
    for (let testID in formData) {
      if (formData.hasOwnProperty(testID) &&
        JSON.stringify(formData[testID]) !== '{}') {
        let instrumentData = JSON.stringify(formData[testID]);
        formObject.append(testID, instrumentData);
      }
    }
    formObject.append('identifier', this.props.examinerID);
    $.ajax({
      type: 'POST',
      url: `${loris.BaseURL}/examiner/editCertification`,
      data: formObject,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        swal('Success!', 'Changes to certification submitted.', 'success');
        this.fetchData();
      },
      error: error => {
        console.error(error);
        let message = error.responseText;
        swal('Error!', message, 'error');
      }
    });
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <Loader/>
      );
    }

    let formHeaders = (
      <div className="row hidden-xs hidden-sm">
        <div className = "col-md-5">
          <label className = "col-md-3 instrument-header">Instrument</label>
          <label className="col-md-9 status-header">Certification Status</label>
        </div>
        <div className = "col-md-3">
          <div className="col-md-3" />
          <label className="col-md-9 date-header">Certification Date</label>
        </div>
        <div className = "col-md-3">
          <div className="col-md-3" />
          <label className="col-md-9 comments-header">Comments</label>
        </div>
      </div>
    );

    const inputRow = [];
    for (let instrumentID in this.state.data.instruments) {
      if (this.state.data.instruments.hasOwnProperty(instrumentID)) {
        // Set date field as required if status is certified
        let dateRequired = false;
        if (this.state.formData[instrumentID].status === "certified") {
          dateRequired = true;
        }
        let hasError = false;
        let errorMessage = null;
        if (this.state.data.instruments[instrumentID].pass) {
          if (this.state.formData[instrumentID].status === "null") {
            hasError = true;
            errorMessage ="You may not change a valid status to N/A";
          }
        }
        // Create elements
        let instrumentName = this.state.data.instruments[instrumentID].name;
        const instrumentRow = (
          <div className="row">
            <div className="col-md-5" >
              <SelectElement
                label={instrumentName}
                name={instrumentID + "_status"}
                options={this.state.statusOptions}
                value={this.state.formData[instrumentID].status}
                onUserInput={this.setFormData}
                ref={instrumentID + "_status"}
                emptyOption={false}
                hasError={hasError}
                errorMessage={errorMessage}
              />
            </div>
            <div className="col-md-3">
              <DateElement
                name={instrumentID + "_date"}
                value={this.state.formData[instrumentID].date}
                onUserInput={this.setFormData}
                ref={instrumentID + "_date"}
                required={dateRequired}
                minYear={this.state.data.minYear}
                maxYear={this.state.data.maxYear}
              />
            </div>
            <div className="col-md-3">
              <TextboxElement
                name={instrumentID + "_comments"}
                value={this.state.formData[instrumentID].comments}
                onUserInput={this.setFormData}
                ref={instrumentID + "_comments"}
              />
            </div>
          </div>
        );
        inputRow.push(instrumentRow);
      }
    }

    const historyData = [];
    for (let result in this.state.data.certification_history) {
      if (this.state.data.certification_history.hasOwnProperty(result)) {
        const rowData = (
          <tr>
            <td>{this.state.data.certification_history[result].changeDate}</td>
            <td>{this.state.data.certification_history[result].userID}</td>
            <td>{this.state.data.certification_history[result].Measure}</td>
            <td>{this.state.data.certification_history[result].old}</td>
            <td>{this.state.data.certification_history[result].old_date}</td>
            <td>{this.state.data.certification_history[result].new}</td>
            <td>{this.state.data.certification_history[result].new_date}</td>
          </tr>
        );
        historyData.push(rowData);
      }
    }

    let editForm = (
      <FormElement
        Module="examiner"
        name="edit_cert"
        id="edit_cert_form"
        onSubmit={this.handleSubmit}
        ref="editCert"
      >
        {inputRow}
        <div className="row col-xs-12">
          <div className="col-sm-6 col-md-2 col-xs-12 col-md-offset-8">
            <ButtonElement
              name="fire_away"
              label="Save"
              type="submit"
              buttonClass="btn btn-sm btn-primary col-xs-12"
              columnSize=""
            />
          </div>
          <div className="reset-button">
            <ButtonElement
              label="Reset"
              type="reset"
              buttonClass="btn btn-sm btn-primary col-xs-12"
              columnSize="col-sm-6 col-md-2 col-xs-12"
              onUserInput={this.fetchData}
            />
          </div>
        </div>
      </FormElement>
    );

    let changeLog = (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h3>Change Log</h3>
          </div>
        </div>
        <table className="table table-hover table-primary table-bordered table-scroll">
          <thead>
            <tr className="info">
              <th>Time</th>
              <th>User</th>
              <th>Measure</th>
              <th>Old Value</th>
              <th>Old Date</th>
              <th>New Value</th>
              <th>New Date</th>
            </tr>
          </thead>
          <tbody>
            {historyData}
          </tbody>
        </table>
      </div>
    );

    return (
      <div>
        <Panel
          id="panel-body"
          title={"Edit Certification for " +
            this.state.data.examinerName}
        >
          {formHeaders}
          <hr className="row hidden-xs hidden-sm"/>
          {editForm}
        </Panel>
        {changeLog}
      </div>
    );
  }
}

EditExaminer.propTypes = {
  Module: React.PropTypes.string.isRequired,
  examinerID: React.PropTypes.string.isRequired,
  dataURL: React.PropTypes.string.isRequired
};

/**
 * Render Edit Examiner on page load
 */

const args = QueryString.get(document.currentScript.src);
window.onload = () => {
  const fetchURL = `${loris.BaseURL}/examiner/fetchCertification/`;
  let editExaminer = (
    <div id="page-editexaminer">
      <EditExaminer
        Module="examiner"
        examinerID={args.identifier}
        dataURL={fetchURL}
      />
    </div>
  );
  ReactDOM.render(editExaminer, document.getElementById('lorisworkspace'));
};
