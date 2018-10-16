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
    this.addEntry = this.addEntry.bind(this);
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
        Editing an entry will deactivate the current entry and create a new entry.<br/>
        You cannot edit an entry to have the same values as another active entry.<br/>
        If the edited entry has the same values as another deactivated entry,<br/>
        you can activate the other entry and deactivate the current entry.<br/>
       <br/>
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
   * Give options depending on edits in the form:
   * If there are no edits in the form, give no options
   * If the edited entry becomes the same as another active entry, give no options
   * If the edited entry becomes the same as another deactivated entry,
   * give option to activate the other entry and deactivate the current entry
   * If there is no duplicate entry, proceed to edit
   *
   * @param {string} duplicate returned by server
   */
  giveOptions(duplicate) {
    let formData = this.state.formData;
    // Create object with ID of current entry to pass to functions later
    let currentEntry = new FormData();
    currentEntry.append("ID", formData.id)
    // If there is a duplicate entry, process options
    if (Object.keys(duplicate).length > 0) {
      // Convert duplicate entry to JSON
      let duplicateEntryJSON = JSON.parse(duplicate);
      // Create object with ID of duplicate entry to pass to functions later
      let duplicateEntry = new FormData(); 
      duplicateEntry.append("ID", duplicateEntryJSON.ID);
      // If there are no edits in the form, show error
      if (formData.id === duplicateEntryJSON.ID) {
          swal({
            title: "Duplicate entry!",
            text: "You did not make any changes to the current entry.",
            type: "error"
          });
      } else {
         // If the edited entry becomes the same as another active entry, show error
         if (duplicateEntryJSON.Active === 'Y') {
             swal({
               title: "Duplicate entry!",
               text: "This entry already already exists in the database.",
               type: "error"
             });
         // If the edited entry becomes the same as another deactivated entry,
         // show warning with option to activate other entry and deactivate current entry
         } else if (duplicateEntryJSON.Active === 'N') {
             swal({
               title: "Deactivated entry!",
               text: "A deactivated entry with these values already exists!\n Would you like to reactivate this entry and deactivate the current one?",
               type: "warning",
               showCancelButton: true,
               confirmButtonText: 'Yes',
               cancelButtonText: 'Cancel',
               closeOnConfirm: false
             }, function() {
               // Call activate function which will activate the other duplicate entry and deactivate the current entry
               this.activateEntry(duplicateEntry, currentEntry);
             }.bind(this));
         } 
      }
    }
     // If there is no duplicate, proceed with edit (which adds new entry and deactivates current entry)
     else {
      // Create object with form data
      let newEntry = new FormData();
      for (let key in formData) {
        if (formData.hasOwnProperty(key)) {
          newEntry.append(key, formData[key]);
        }
      }
      // Call add function, which will add the new entry and deactivate the current entry
      this.addEntry(newEntry, currentEntry);
    }
  }

  /**
   * Activate duplicate entry in Test Battery
   * If successful, call deactivate function for current entry
   *
   * @param {object} containing id of duplicate entry to be activated
   * @param {object} containing id of entry to be deactivated
   */
  activateEntry(duplicateEntry, currentEntry) {
    // POST request to activate duplicate entry
    $.ajax({
      type: 'POST',
      url: this.props.activate,
      data: duplicateEntry,
      cache: false,
      contentType: false,
      processData: false,
    })
      .done(function(data) {
           // If successful activation, call deactivate function for current entry
           this.deactivateEntry(currentEntry);
        }.bind(this))
        // If unsuccessful activation, display error message and prevent deactivate function from being called
        .error(function(data) {
          swal("Could not activate other entry","","error");
        });
  }

  /**
   * Add new entry to Test Battery
   * If successful, call deactivate function for current entry
   *
   * @param {object} containing entry to be added
   * @param {object} containing entry of id to be deactivated
   */
  addEntry(newEntry, currentEntry) {
    // POST request to add new entry
    $.ajax({
      type: 'POST',
      url: this.props.add,
      data: newEntry,
      cache: false,
      contentType: false,
      processData: false,
    })
      .done(function(data) {
           // If successful insertion, call deactivate function for current entry
           this.deactivateEntry(currentEntry);
        }.bind(this))
        // If unsuccessful insertion, display error message and prevent deactivate function from being called
        .error(function(data) {
          swal("Could not add new entry","","error");
        });
  }
  /**
   * Deactivate entry in the Test Battery
   * If successful, display final success message and return to Browse tab
   *
   * @param {object} containing id of entry to be deactivated
   */
  deactivateEntry(currentEntry) {
        // POST request to deactivate current entry
        $.ajax({
          type: 'POST',
          url: this.props.deactivate,
          data: currentEntry,
          cache: false,
          contentType: false,
          processData: false,
        })
          .done(function(data) {
             // If successful deactivation, display final success message
             swal({
               title: "Edit successful!", 
               type: "success"
             }, function() {
                // Return to browse tab upon success
                window.location.assign(loris.BaseURL + "/battery_manager/");
              }.bind(this));
            })
            // If unsucessful deactivation, display error message and keep user on edit form
            .error(function(data) {
              swal("Could not deactivate current entry","","error");
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
            checkForDuplicate={`${loris.BaseURL}/battery_manager/ajax/add_entry.php?action=checkForDuplicate`}
            activate={`${loris.BaseURL}/battery_manager/ajax/change_active_status.php?action=activate`}
            deactivate={`${loris.BaseURL}/battery_manager/ajax/change_active_status.php?action=deactivate`}
            add={`${loris.BaseURL}/battery_manager/ajax/add_entry.php?action=add`}
          />
        </div>
      </div>
    </div>
  );

  ReactDOM.render(batteryManagerEditForm, document.getElementById("lorisworkspace"));
});
