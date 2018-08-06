/* exported RBatteryManagerEditForm */

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
      //uploadResult: null,
      isLoaded: false,
      loadedData: 0
    };

    // Bind component instance to custom methods
    this.setFormData = this.setFormData.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.isDuplicate = this.isDuplicate.bind(this);
    this.giveOptions = this.giveOptions.bind(this);
    this.activateEntry = this.activateEntry.bind(this);
    this.editEntry = this.editEntry.bind(this);
     
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
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
        console.log(data);
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
    //Data loading error
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

    var alertMessage = "";
    var alertClass = "alert text-center hide";
    var backURL = loris.BaseURL.concat('/battery_manager/');

    if (this.state.uploadResult) {
      if (this.state.uploadResult === "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Update Successful!";
      } else if (this.state.uploadResult === "error") {
        alertClass = "alert alert-danger text-center";
        alertMessage = "Failed to update the file";
      }
    }

    // Inform users about duplicate entries
    var helpText = (
      <span>
        You cannot edit an entry to have the same values as another entry in the test battery.<br/>
        If the duplicate entry is inactive, you will be given the option to activate it.
      </span>
    );

    return (
      <div>
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        {
          this.state.uploadResult === "success" ?
          <a className="btn btn-primary" href={backURL}>Back to media</a> :
          null
        }
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
            //disabled={true}
            value={this.state.formData.instrument}
          />
          <NumericElement
            name="ageMinDays"
            label="Minimum age"
            onUserInput={this.setFormData}
            ref="ageMinDays"
            required={true}
            min="0"
            max="99999"
            value={this.state.formData.ageMinDays}
          />
          <NumericElement
            name="ageMaxDays"
            label="Maximum age"
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

    var self = this;
    var formData = this.state.formData;

    //$('#mediaEditEl').hide();
    //$("#file-progress").removeClass('hide');

    /*$.ajax({
      type: 'POST',
      url: self.props.action,
      data: JSON.stringify(myFormData),
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var progressbar = $("#progressbar");
            var progresslabel = $("#progresslabel");
            var percent = Math.round((evt.loaded / evt.total) * 100);
            $(progressbar).width(percent + "%");
            $(progresslabel).html(percent + "%");
            progressbar.attr('aria-valuenow', percent);
          }
        }, false);
        return xhr;
      },
      success: function(data) {
        $("#file-progress").addClass('hide');
        self.setState({
          uploadResult: "success"
        });
        self.showAlertMessage();
      },
      error: function(err) {
        console.error(err);
        self.setState({
          uploadResult: "error"
        });
        self.showAlertMessage();
      }

    });*/

    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) {
        console.log(key+": "+formData[key]);
        formObj.append(key, formData[key]);
      } else {
        console.log(key+" has null value");
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
   * If there is no duplicate entry, edit entry
   *
   * @param {string} duplicateEntry returned by server
   */
  giveOptions(duplicateEntry) {
    var formData = this.state.formData;
    console.log(duplicateEntry);
    console.log(JSON.stringify(formData));
        // if duplicate entry exists, convert to JSON
    if (Object.keys(duplicateEntry).length > 0) {
      let duplicateEntryJSON = JSON.parse(duplicateEntry);
      console.log(duplicateEntryJSON);
          // create object with ID of duplicate entry
      let entryID =     duplicateEntryJSON.ID;
      var idObj = new FormData();
      idObj.append("ID", entryID);
      // check if form data and duplicate entry have the same active status
      if (duplicateEntryJSON.Active === formData.active) {
        let errorMessage = "The changes you made are identical to another entry in the table.";
        // check if no changes were made to selected entry and update message
        if (duplicateEntryJSON.ID === formData.id) {
            errorMessage = "You did not make any changes to the current entry.";
        }
        swal({
          title: "Duplicate entry!",
          text: errorMessage,
          type: "error"
        });
      }
      else {
          // if duplicate entry is not active, trigger activate popup
          if (duplicateEntryJSON.Active === 'N') {
              if (formData.active === 'Y') {
                let warningMessage = "The changes you made are identical to another entry in the table, with the exception of the Active status.\n " +
                                     "Would you like to activate the other entry?\n Note: No changes will be made to the current entry.";
                if (duplicateEntryJSON.ID === formData.id) {
                    warningMessage = "You did not make any changes to the current entry except for the Active status.\n " +
                                     "Would you like to activate this entry?";
                }
                swal({
            		title: "Activate entry?",
            		text: warningMessage,
          		type: "warning",
          		showCancelButton: true,
          		confirmButtonText: 'Yes',
          		cancelButtonText: "Cancel",
          		closeOnConfirm: false
       	    	}, function() {
                  // if user confirms activate popup, call activate function with ID
                	this.activateEntry(idObj);
            	}.bind(this));
              }
          }
          // else if duplicate entry is active, trigger error popup
          else if (duplicateEntryJSON.Active === 'Y') {
              if (formData.active === 'N') {
                let warningMessage = "The changes you made are identical to another entry in the table, with the exception of the Active status.\n " +
                                     "Would you like to deactivate the other entry?\n Note: No changes will be made to the current entry.";
                if (duplicateEntryJSON.ID === formData.id) {
                    warningMessage = "You did not make any changes to the current entry except for the Active status.\n " +
                                     "Would you like to deactivate this entry?";
                }  
                swal({
                        title: "Deactivate entry?",
                        text: warningMessage,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                }, function() {
                  // if user confirms activate popup, call activate function with ID
                        this.deactivateEntry(idObj);
                }.bind(this));
              }
          } 
      }
        // if no duplicate entry exists, proceed with edit entry
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
          console.log(data);
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
          console.log(data);
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
      //if (formData[key] !== "") {
        console.log(key+" (edit) : "+formData[key]);
        formObj.append(key, formData[key]);
      //}
    }

    $.ajax({
      type: 'POST',
      url: this.props.edit,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        console.log(data);
        this.setState({
          formData: {} // reset form data after successful entry
        });
        swal({
          title: "Edit Successful!",
          type: "success"
        }, function() {
                 // return to browse tab upon success
          console.log(data);
          window.location.assign(loris.BaseURL + "/battery_manager/");
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
        swal("Could not edit", "", "error");
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
    /*if (value === "") {
      console.log(value);
      formData[formElement] = null;
    } else {
      formData[formElement] = value;
    }*/

    this.setState({
      formData: formData
    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  /*showAlertMessage() {
    var self = this;

    if (this.refs["alert-message"] === null) {
      return;
    }

    var alertMsg = this.refs["alert-message"];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function() {
      self.setState({
        uploadResult: null
      });
    });
  }*/

}

BatteryManagerEditForm.propTypes = {
  DataURL: React.PropTypes.string.isRequired,
  activate: React.PropTypes.string.isRequired,
  deactivate: React.PropTypes.string.isRequired,
  checkForDuplicate: React.PropTypes.string.isRequired,
  edit: React.PropTypes.string.isRequired
};

//var RBatteryManagerEditForm = React.createFactory(BatteryManagerEditForm);

//window.BatteryManagerEditForm = BatteryManagerEditForm;
//window.RBatteryManagerEditForm = RBatteryManagerEditForm;

export default BatteryManagerEditForm;
