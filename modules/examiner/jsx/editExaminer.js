import Panel from 'Panel';
import Loader from 'Loader';

class EditExaminer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            Data: {},
            formData: {},
            statusOptions: {
                null: "N/A",
                not_certified: "Not Certified",
                in_training: "In Training",
                certified: "Certified",
            },
            updateResult: null,
            errorMessage: null,
            loadedData: 0,
        };

        //Bind component instance to custom methods
        this.fetchData = this.fetchData.bind(this);
        this.setFormData = this.setFormData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
            url: `${loris.BaseURL}/examiner/ajax/fetchCertificate.php?identifier=${this.props.examinerID}`,
            dataType: 'json',
            success: function(data) {
                const instruments = data.instruments;
                for (let instrumentID in instruments) {
                    if (instruments.hasOwnProperty(instrumentID)) {
                        formData[instrumentID] = {
                            status: data.instruments[instrumentID].pass,
                            date: data.instruments[instrumentID].date_cert,
                            comments: data.instruments[instrumentID].comment,
                        }
                    }
                }
                self.setState({
                    Data: data,
                    formData: formData,
                    isLoaded: true
                });
            },
            error: function(data, errorCode, errorMsg) {
                self.setState({
                    error: 'An error occurred when loading the form!'
                });
            }
        });
    }

    /**
     * Set the form data with form values
     *
     * @param {string} formElement  name of the selected element
     * @param {string} value        selected value for corresponding form element
     *
     */    
    setFormData(formElement, value) {
        let formData = this.state.formData;
        let split = formElement.split("_");
        let key = split[0];
        let element = split[1];
        formData[key][element] = value
        this.setState({
            formData: formData
        });
    }

    onSubmit(e) {
        e.preventDefault();
    }

    handleSubmit(e) {
        e.preventDefault();
        let formData = this.state.formData;


        let formObject = new FormData();
        for (let testID in formData) {
            if (formData.hasOwnProperty(testID) &&
                JSON.stringify(formData[testID]) !== '{}') {
                if (formData[testID].status === "null") {
                    alert("You may not change a valid status to N/A");
                    return; 
                }
                let instrumentData = JSON.stringify(formData[testID]);
                formObject.append(testID, instrumentData);
            }
        }
        formObject.append('identifier', this.props.examinerID);
        $.ajax({
            type: 'POST',
            url: `${loris.BaseURL}/examiner/ajax/editCertificate.php`,
            data: formObject,
            cache: false,
            contentType: false,
            processData: false,
            success: data => {
                this.setState({
                    updateResult: "success"    
                });
                this.showAlertMessage();
                this.fetchData();
            },
            error: err => {
                if (err.responseText !== "") {
                    var errorMessage = JSON.parse(err.responseText).message;
                    this.setState({
                        updateResult: "error",
                        errorMessage: errorMessage
                    });
                    this.showAlertMessage();
                }
            }
        });
    }

    showAlertMessage() {
        const self = this;
        if (this.refs["alert-message"] === null) {
            return;
        }
        let alertMsg = this.refs["alert-message"];
        $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
            500,
            function() {
                self.setState({
                    updateResult: null
                });
            }
        );
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
        for (let instrumentID in this.state.Data.instruments) {
            let dateRequired = false;
            if (this.state.formData[instrumentID].status === "certified") {
                dateRequired = true;
            }
            if (this.state.Data.instruments.hasOwnProperty(instrumentID)) {
                let instrumentName = this.state.Data.instruments[instrumentID].name;
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
                            />
                        </div>
                        <div className="col-md-3">
                            <DateElement
                                name={instrumentID + "_date"}
                                value={this.state.formData[instrumentID].date}
                                onUserInput={this.setFormData}
                                ref={instrumentID + "_date"}
                                required={dateRequired}
                                minYear={this.state.Data.minYear}
                                maxYear={this.state.Data.maxYear}
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
        for (let result in this.state.Data.certification_history) {
            if (this.state.Data.certification_history.hasOwnProperty(result)) {
                const rowData = (
                    <tr>
                        <td>{this.state.Data.certification_history[result].changeDate}</td>
                        <td>{this.state.Data.certification_history[result].userID}</td>
                        <td>{this.state.Data.certification_history[result].Measure}</td>
                        <td>{this.state.Data.certification_history[result].old}</td>
                        <td>{this.state.Data.certification_history[result].old_date}</td>
                        <td>{this.state.Data.certification_history[result].new}</td>
                        <td>{this.state.Data.certification_history[result].new_date}</td>
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

        let alertMessage = "";
        let alertClass = "alert text-center hide";
        if (this.state.updateResult) {
            if (this.state.updateResult === "success") {
                alertClass = "alert alert-success text-center";
                alertMessage = "Update Successful!";
            } else if (this.state.updateResult === "error") {
                let errorMessage = this.state.errorMessage;
                alertClass = "alert alert-danger text-center";
                alertMessage = errorMessage ? errorMessage : "Failed to update!";
            }
        }

        return (
            <div>
                <Panel
                    id="panel-body"
                    title={"Edit Certification for " + this.state.Data.examinerName}
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

const args = QueryString.get(document.currentScript.src);

$(function() {
    ReactDOM.render(<EditExaminer examinerID={args.identifier}/>, document.getElementById("lorisworkspace"));
});
