/**
 * Battery Manager Edit Form
 *
 * Fetches data corresponding to a given entry from Loris backend and
 * displays a form where user can update values in the entry
 *
 * @author Victoria Foing
 *
 * @version 1.0.0
 *
 * */
class BatteryManagerEditForm extends React.Component {
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
    this.handleEdit = this.handleEdit.bind(this);
    this.isDuplicate = this.isDuplicate.bind(this);
    this.giveOptions = this.giveOptions.bind(this);
    this.activateEntry = this.activateEntry.bind(this);
    this.deactivateEntry = this.deactivateEntry.bind(this);
    this.editEntry = this.editEntry.bind(this);
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        // Populate form with current values of entry
        var formData = {
          id: data.batteryData.ID,
          instrument: data.batteryData.Test_name,
          ageMinDays: data.batteryData.AgeMinDays,
          ageMaxDays: data.batteryData.AgeMaxDays,
          stage: data.batteryData.Stage,
          subproject: data.batteryData.SubprojectID,
          visitLabel: data.batteryData.Visit_label,
          forSite: data.batteryData.CenterID,
          firstVisit: data.batteryData.firstVisit,
          instrumentOrder: data.batteryData.instr_order,
          active: data.batteryData.Active
        };
        self.setState({
          Data: data,
          isLoaded: true,
          batteryData: data.batteryData,
          formData: formData
        });
      },
      error: function(error, errorCode, errorMsg) {
        console.error(error, errorCode, errorMsg);
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
        You can activate or deactivate an entry by changing the Active value in the form.<br/><br/>
        You cannot edit an entry to have the same values as another entry.<br/>
        If the edited entry has the same values but a different Active value as another entry,<br/>
        you can activate or deactivate the other entry based on the change you made.<br/>
        In this case, the entry that was originally selected for editing will not be edited.<br/>
      </span>
    );

    return (
      <div>
        <FormElement
          name="batteryEdit"
          onSubmit={this.handleEdit}
          ref="form"
        >
          <h3>Edit entry in Test Battery</h3><br/>
          <StaticElement
            label="Note"
            text={helpText}
          />
          <SelectElement
            name="instrument"
            label="Instrument"
            options={this.state.Data.instruments}
            onUserInput={this.setFormData}
            ref="instrument"
            required={true}
            value={this.state.formData.instrument}
          />
          <NumericElement
            name="ageMinDays"
            label="Minimum age (days)"
            onUserInput={this.setFormData}
            ref="ageMinDays"
            required={true}
            min="0"
            max="99999"
            value={this.state.formData.ageMinDays}
          />
          <NumericElement
            name="ageMaxDays"
            label="Maximum age (days)"
            onUserInput={this.setFormData}
            ref="ageMaxDays"
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
              ref="stage"
              hasError={false}
              required={true}
              value={this.state.formData.stage}
            />
            <SelectElement
              name="subproject"
              label="Subproject"
              options={this.state.Data.subprojects}
              onUserInput={this.setFormData}
              ref="subproject"
              hasError={false}
              required={false}
              value={this.state.formData.subproject}
            />
            <SelectElement
              name="visitLabel"
              label="Visit Label"
              options={this.state.Data.visits}
              onUserInput={this.setFormData}
              ref="visitLabel"
              required={false}
              value={this.state.formData.visitLabel}
            />
            <SelectElement
              name="forSite"
              label="Site"
              options={this.state.Data.sites}
              onUserInput={this.setFormData}
              ref="forSite"
              required={false}
              value={this.state.formData.forSite}
            />
            <SelectElement
              name="firstVisit"
              label="First Visit"
              options={this.state.Data.firstVisits}
              onUserInput={this.setFormData}
              ref="firstVisit"
              required={false}
              value={this.state.formData.firstVisit}
            />
            <NumericElement
              name="instrumentOrder"
              label="Instrument Order"
              onUserInput={this.setFormData}
              ref="instrumentOrder"
              required={false}
              min="0"
              max="127"
              value={this.state.formData.instrumentOrder}
            />
            <SelectElement
              name="active"
              label="Active"
              emptyOption={false}
              options={this.state.Data.active}
              onUserInput={this.setFormData}
              ref="active"
              value={this.state.formData.active}
            />
          <ButtonElement label="Edit entry"/>
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   * Check if edited entry already exists in the tables
   *
   * @param {event} e - Form submission event
   */
  handleEdit(e) {
    e.preventDefault();

    var formData = this.state.formData;

    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) {
        formObj.append(key, formData[key]);
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
   * If there are no changes in the form, give no options
   * If the entry is changed so that it has the same values and Active value as another entry, give no options
   * If only the Active value has been changed, give option to activate or deactivate the current entry depending on the change made
   * If the entry is changed so that it has the same values as another entry but a different Active value,
   * give option to activate or deactivate the other entry depending on the change made
   * If there is no duplicate entry, proceed to edit entry
   *
   * @param {string} duplicateEntry returned by server
   */
  giveOptions(duplicateEntry) {
    let editedEntry = this.state.formData;
    // If duplicate entry exists, convert to JSON
    if (Object.keys(duplicateEntry).length > 0) {
      let duplicateEntryJSON = JSON.parse(duplicateEntry);
          // Create object with ID of duplicate entry
      let entryID = duplicateEntryJSON.ID;
      let idObj = new FormData();
      idObj.append("ID", entryID);
      // Check if edited entry and duplicate entry have the same active status
      if (editedEntry.active === duplicateEntryJSON.Active) {
        // Initialize warning message to notify user about duplicate entry
        let errorMessage = "The changes you made are identical to another entry in the table.";
        // Check if edited entry and duplicate entry are actually the same entry and update warning message
        if (editedEntry.id === duplicateEntryJSON.ID) {
          errorMessage = "You did not make any changes to the current entry.";
        }
        // Give no options
        swal({
          title: "Duplicate entry!",
          text: errorMessage,
          type: "error"
        });
          // If edited entry is active and duplicate entry is not active, trigger activate popup
      } else if (editedEntry.active === 'Y' && duplicateEntryJSON.Active === 'N') {
                // Initialize warning message to notify user about inactive duplicate entry
        let warningMessage = "The changes you made are identical to another entry in the table, with the exception of the Active status.\n " +
                                     "Would you like to activate the other entry?\n Note: No changes will be made to the current entry.";
                // Check if edited entry and duplicate entry are actually the same entry and update warning message
        if (editedEntry.id === duplicateEntryJSON.ID) {
          warningMessage = "You did not make any changes to the current entry except for the Active status.\n " +
                                     "Would you like to activate this entry?";
        }
                // Give option to activate duplicate entry
        swal({
          title: "Activate entry?",
          text: warningMessage,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function() {
                  // If user confirms activate popup, call activate function with ID
          this.activateEntry(idObj);
        }.bind(this));
          // Else if edited entry is not active and duplicate entry is active, trigger deactivate popup
      } else if (editedEntry.active === 'N' && duplicateEntryJSON.Active === 'Y') {
                // Initialize warning message to notify user about active duplicate entry
        let warningMessage = "The changes you made are identical to another entry in the table, with the exception of the Active status.\n " +
                                     "Would you like to deactivate the other entry?\n Note: No changes will be made to the current entry.";
                // Check if edited entry and duplicate entry are actually the same entry and update warning message
        if (editedEntry.id === duplicateEntryJSON.ID) {
          warningMessage = "You did not make any changes to the current entry except for the Active status.\n " +
                                     "Would you like to deactivate this entry?";
        }
                // Give option to deactivate duplicate entry
        swal({
          title: "Deactivate entry?",
          text: warningMessage,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function() {
                  // If user confirms deactivate popup, call deactivate function with ID
          this.deactivateEntry(idObj);
        }.bind(this));
      }
        // If no duplicate entry exists, proceed with edit entry
    } else {
      this.editEntry();
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
          window.location.assign(loris.BaseURL + "/battery_manager/");
        });
      })
      .error(function(data) {
        swal("Could not activate entry", "", "error");
      });
  }

  /**
   * Deactivate duplicate entry in the test battery
   *
   * @param {object} idObj containing id of entry
   */
  deactivateEntry(idObj) {
    $.ajax({
      type: 'POST',
      url: this.props.deactivate,
      data: idObj,
      cache: false,
      contentType: false,
      processData: false
    })
      .done(function(data) {
        swal({
          title: "Deactivated!",
          type: "success"
        }, function() {
          // return to browse tab upon success
          window.location.assign(loris.BaseURL + "/battery_manager/");
        });
      })
      .error(function(data) {
        swal("Could not deactivate entry", "", "error");
      });
  }

  /**
   * Edit entry in the test battery
   */
  editEntry() {
    // create object with form data
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        formObj.append(key, formData[key]);
      }
    }

    $.ajax({
      type: 'POST',
      url: this.props.edit,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        this.setState({
          formData: {} // reset form data after successful entry
        });
        swal({
          title: "Edit Successful!",
          type: "success"
        }, function() {
                 // return to browse tab upon success
          window.location.assign(loris.BaseURL + "/battery_manager/");
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
        swal("Could not edit!", err.responseText, "error");
      }
    });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   * If there is no value, set the form element to null
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    var formData = this.state.formData;

    if (value === "") {
      formData[formElement] = null;
    } else {
      formData[formElement] = value;
    }

    this.setState({
      formData: formData
    });
  }

}

const args = QueryString.get(document.currentScript.src);
$(function() {
  const batteryManagerEditForm = (
    <div className="page-edit-entry">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <BatteryManagerEditForm
            DataURL={`${loris.BaseURL}/battery_manager/ajax/get_form_data.php?form=edit&ID=${args.id}`}
            checkForDuplicate={`${loris.BaseURL}/battery_manager/ajax/add_or_edit_entry.php?action=checkForDuplicate`}
            activate={`${loris.BaseURL}/battery_manager/ajax/change_active_status.php?action=activate`}
            deactivate={`${loris.BaseURL}/battery_manager/ajax/change_active_status.php?action=deactivate`}
            edit={`${loris.BaseURL}/battery_manager/ajax/add_or_edit_entry.php?action=edit`}
          />
        </div>
      </div>
    </div>
  );

  ReactDOM.render(batteryManagerEditForm, document.getElementById("lorisworkspace"));
});
