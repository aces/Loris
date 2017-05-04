var FamilyInfo = React.createClass({
  getInitialState: function() {
    return {
      Data: [],
      formData: {},
      familyMembers: [],
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
                that.setState({
                  loadedData: evt.loaded
                });
              });
          return xhr;
        },
        success: function(data) {
          that.setState({
            Data: data,
            isLoaded: true,
            familyMembers: data.existingFamilyMembers
          });
        },
        error: function(data, errorCode, errorMsg) {
          that.setState({
            error: 'An error occurred when loading the form!'
          });
        }
      }
      );
  },
  setFormData: function(formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  },
  onSubmit: function(e) {
    e.preventDefault();
  },
  render: function() {
    if (!this.state.isLoaded) {
      if (this.state.error !== undefined) {
        return (
            <div className="alert alert-danger text-center">
              <strong>
                {this.state.error}
              </strong>
            </div>
          );
      }

      return (
        <button className="btn-info has-spinner">
          Loading
          <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
        );
    }

    var relationshipOptions = {
      "full_sibling": "Full Sibling",
      "half_sibling": "Half Sibling",
      "1st_cousin": "First Cousin"
    };

    var disabled = true;
    var addButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      addButton = <ButtonElement label="Add"/>;
    }

    var candidateList = this.state.Data.candidates;

    var familyMembers = this.state.familyMembers;
    var familyMembersHTML = [];

    for (var key in familyMembers) {
      if (familyMembers.hasOwnProperty(key)) {
        var candID = familyMembers[key].FamilyCandID;
        var relationship = familyMembers[key].Relationship_type;
        var link = "?candID=" + candID + "&identifier=" + candID;

        familyMembersHTML.push(
          <div key={key}>
              <StaticElement
                  label="Family Member DCCID"
                  text={<a href={link}>{candID}</a>}
              />
              <StaticElement
                  label="Relation Type"
                  text={relationshipOptions[relationship]}
              />
              <ButtonElement
                  label="Delete"
                  type="button"
                  onUserInput={this.deleteFamilyMember.bind(null, candID, key, candidateList)}
              />
              <hr />
          </div>
        );
          // remove from list of candidates because it can only be added once
        delete candidateList[candID];
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
        <div className="row">
          <div className={alertClass} role="alert" ref="alert-message">
            {alertMessage}
          </div>
          <FormElement
            name="familyInfo"
            onSubmit={this.handleSubmit}
            ref="form"
            class="col-md-6"
          >
            <StaticElement
              label="PSCID"
              text={this.state.Data.pscid}
            />
            <StaticElement
              label="DCCID"
              text={this.state.Data.candID}
            />
              <hr />
              {familyMembersHTML}
            <SelectElement
              label="Family Member ID (DCCID)"
              name="FamilyCandID"
              options={candidateList}
              onUserInput={this.setFormData}
              ref="FamilyCandID"
              disabled={disabled}
              required={true}
              value={this.state.formData.FamilyCandID}
            />
            <SelectElement
              label="Relation Type"
              name="Relationship_type"
              options={relationshipOptions}
              onUserInput={this.setFormData}
              ref="Relationship_type"
              disabled={disabled}
              required={true}
              value={this.state.formData.Relationship_type}
            />
            {addButton}
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
    var self = this;
    var formData = new FormData();
    var formRefs = this.refs;

    var familyMembers = this.state.familyMembers;
    var familyMember = {};

    for (var key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== "") {
          familyMember[key] = myFormData[key];
          formData.append(key, myFormData[key]);
        }
      }
    }

    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);

    familyMembers.push(familyMember);

    this.setState({
      familyMembers: familyMembers
    });

    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        self.setState({
          updateResult: "success",
          formData: {}
        });
        self.showAlertMessage();

              // Iterates through child components and resets state
              // to initial state in order to clear the form
        Object.keys(formRefs).map(function(ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = "";
          }
        });
              // rerender components
        self.forceUpdate();
      },
      error: function(err) {
        var errorMessage = JSON.parse(err.responseText).message;
        self.setState(
          {
            updateResult: "error",
            errorMessage: errorMessage
          }
            );
        self.showAlertMessage();
      }

    });
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
        });
  },
  deleteFamilyMember: function(candID, key, candidateList) {
    var familyMembers = this.state.familyMembers;
    delete familyMembers[key];

      // readd to list of possible family members
    candidateList[candID] = candID;

    this.setState({
      familyMembers: familyMembers
    });

    var myFormData = this.state.formData;
    var self = this;
    var formData = new FormData();
    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== "") {
          formData.append(key, myFormData[key]);
        }
      }
    }

    formData.append('tab', 'deleteFamilyMember');
    formData.append('candID', this.state.Data.candID);
    formData.append('familyDCCID', candID);

    $.ajax({
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
          });
        self.showAlertMessage();
      },
      error: function(err) {
        if (err.responseText !== "") {
          var errorMessage = JSON.parse(err.responseText).message;
          self.setState(
            {
              updateResult: "error",
              errorMessage: errorMessage
            });
          self.showAlertMessage();
        }
      }
    });
  }

});

export default FamilyInfo;
