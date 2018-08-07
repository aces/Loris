/**
 * Battery Manager Add Form
 *
 * Module component rendering Add tab
 *
 * @author Victoria Foing
 *
 */
class BatteryManagerAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      isLoaded: false,
      loadedData: 0
    };

    // Bind component instance to custom methods
    this.setFormData = this.setFormData.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.isDuplicate = this.isDuplicate.bind(this);
    this.giveOptions = this.giveOptions.bind(this);
    this.activateEntry = this.activateEntry.bind(this);
    this.addEntry = this.addEntry.bind(this);
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className="alert alert-danger text-center">
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    // Inform users about duplicate entries
    var helpText = (
      <span>
        You cannot add an entry if it has a duplicate entry in the test battery.<br/>
        If the duplicate entry is inactive, you will be given the option to activate it.
      </span>
    );

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="batteryAdd"
            onSubmit={this.handleAdd}
            ref="form"
          >
            <h3>Add entry to Test Battery</h3><br/>
            <StaticElement
              label="Note"
              text={helpText}
            />
            <SearchableDropdown
              name="instrument"
              label="Instrument"
              placeHolder="Search for instrument"
              options={this.state.Data.instruments}
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.instrument}
            />
            <NumericElement
              name="ageMinDays"
              label="Minimum age (days)"
              onUserInput={this.setFormData}
              required={true}
              min="0"
              max="99999"
              value={this.state.formData.ageMinDays}
            />
            <NumericElement
              name="ageMaxDays"
              label="Maximum age (days)"
              onUserInput={this.setFormData}
              required={true}
              min="0"
              max="99999"
              value={this.state.formData.ageMaxDays}
            />
            <SelectElement
              name="stage"
              label="Stage"
              options={this.state.Data.stages}
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.stage}
            />
            <SelectElement
              name="subproject"
              label="Subproject"
              options={this.state.Data.subprojects}
              onUserInput={this.setFormData}
              required={false}
              value={this.state.formData.subproject}
            />
            <SelectElement
              name="visitLabel"
              label="Visit Label"
              options={this.state.Data.visits}
              onUserInput={this.setFormData}
              required={false}
              value={this.state.formData.visitLabel}
            />
            <SearchableDropdown
              name="forSite"
              label="Site"
              placeHolder="Search for site"
              options={this.state.Data.sites}
              strictSearch={true}
              onUserInput={this.setFormData}
              required={false}
              value={this.state.formData.forSite}
            />
            <SelectElement
              name="firstVisit"
              label="First Visit"
              options={this.state.Data.firstVisits}
              onUserInput={this.setFormData}
              required={false}
              value={this.state.formData.firstVisit}
            />
            <NumericElement
              name="instrumentOrder"
              label="Instrument Order"
              onUserInput={this.setFormData}
              required={false}
              min="0"
              max="127" // max value allowed by default column type of instr_order
              value={this.state.formData.instrumentOrder}
            />
            <ButtonElement label="Add entry"/>
          </FormElement>
        </div>
      </div>
    );
  }

/** *******************************************************************************
 *                      ******     Helper methods     *******
 *********************************************************************************/

  /**
   * Handle form submission
   * Check if entry the user is trying to add already exists in the table
   *
   * @param {object} e - Form submission event
   */
  handleAdd(e) {
    e.preventDefault();

    let formData = this.state.formData;

    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        console.log(key+": "+formData[key]);
        formObj.append(key, formData[key]);
      } else if (formData[key] === null) {
        console.log(key+" has no value");
      }
    }
     // Check if entry the user is trying to add already exists in the table
     // Pass in callback function to call after check for duplicate
    this.isDuplicate(formObj, this.giveOptions);
  }

 /*
  * Check if entry the user is trying to add already exists in the table
  */
  isDuplicate(formObj, callback) {
    $.ajax({
      type: 'POST',
      url: this.props.checkForDuplicate,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: callback,
      error: function(err) {
        console.error(err);
        swal("Could not check", "", "error");
      }
    });
  }

  /**
   * Give options depending on duplicate entry:
   * If there is an inactive duplicate entry, give option to activate it
   * If there is an active duplicate entry, give no options
   * If there is no duplicate entry, add entry
   *
   * @param {string} duplicateEntry returned by server
   */
  giveOptions(duplicateEntry) {
        // if duplicate entry exists, convert to JSON
    console.log(duplicateEntry);
    if (Object.keys(duplicateEntry).length > 0) {
      let duplicateEntryJSON = JSON.parse(duplicateEntry);
          // if duplicate entry is not active, trigger activate popup
      if (duplicateEntryJSON.Active === 'N') {
        swal({
          title: "Deactivated entry!",
          text: "A deactivated entry with these values already exists!\n Would you like to reactivate this entry?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function() {
                    // create object with ID of duplicate entry
          let entryID = duplicateEntryJSON.ID;
          let idObj = new FormData();
          idObj.append("ID", entryID);
                  // if user confirms activate popup, call activate function with ID
          this.activateEntry(idObj);
        }.bind(this));
          // else if duplicate entry is active, trigger error popup
      } else if (duplicateEntryJSON.Active === 'Y') {
        swal({
          title: "Duplicate entry!",
          text: "This entry already exists in the database",
          type: "error"
        });
      }
        // if no duplicate entry exists, proceed with add entry
    } else {
      this.addEntry();
    }
  }

  /**
   * Activate duplicate entry in the test battery
   *
   * @param {object} idObj containing id of entry
   */
  activateEntry(idObj) {
    $.ajax({
      type: 'POST',
      url: this.props.activate,
      data: idObj,
      cache: false,
      contentType: false,
      processData: false
    })
      .done(function(data) {
        swal({
          title: "Activated!",
          type: "success"
        }, function() {
          // return to browse tab upon success
          console.log(data);
          window.location.assign(loris.BaseURL + "/battery_manager/");
          console.log(data);
        });
      })
      .error(function(data) {
        swal("Could not activate entry", "", "error");
      });
  }

  /**
   * Add entry to the test battery
   */
  addEntry() {
    // create object with form data
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        formObj.append(key, formData[key]);
      }
    }

    $.ajax({
      type: 'POST',
      url: this.props.add,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: function() {
        this.setState({
          formData: {} // reset form data after successful entry
        });
        swal({
          title: "Entry Successful!",
          type: "success"
        }, function() {
                 // return to browse tab upon success
          window.location.assign(loris.BaseURL + "/battery_manager/");
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
        swal("Could not insert!", err.responseText, "error");
      }
    });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData: formData
    });
  }
}

BatteryManagerAddForm.propTypes = {
  DataURL: React.PropTypes.string.isRequired,
  add: React.PropTypes.string.isRequired,
  activate: React.PropTypes.string.isRequired,
  checkForDuplicate: React.PropTypes.string.isRequired
};

export default BatteryManagerAddForm;
