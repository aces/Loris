/* exported RFamilyInfo */

var FamilyInfo = React.createClass(
  {
    getInitialState: function() {
      return {
        relationshipOptions: {
          "full_sibling": "Full Sibling",
          "half_sibling": "Half Sibling",
          "1st_cousin": "First Cousin"
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
            that.setState(
              {
                Data: data,
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
    setFormData: function(formElement,
    value) {
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
                        glyphicon-refresh-animate"
                    >
                    </span>
                </button>
                );
      }

      var disabled = true;
      var addButton = null;
      if (loris.userHasPermission('candidate_parameter_edit')) {
        disabled = false;
        addButton = <ButtonElement label ="Add" />;
      }

      var familyMembers = [];
      var familyMemberIDs = this.state.Data.familyCandIDs;
      var relationships = this.state.Data.Relationship_types;
      var i = 0;
      var relationship = null;
      for (var key in familyMemberIDs) {
        if (familyMemberIDs.hasOwnProperty(key) &&
                    relationships.hasOwnProperty(key)
                ) {
          relationship = i + "_Relationship_type";

          var link = "?candID=" + familyMemberIDs[key].CandID +
                        "&identifier=" + familyMemberIDs[key].CandID;

          familyMembers.push(
                        <StaticElement
                        label ="Family Member DCCID"
                        text ={<a href={link}>{familyMemberIDs[key].CandID}</a>}
                        />
                    );
          familyMembers.push(
                        <SelectElement
                        label ="Relation Type"
                        name ={relationship}
                        options ={this.state.relationshipOptions}
                        value ={relationships[key].Relationship_type}
                        onUserInput ={this.setFormData}
                        ref ={relationship}
                        disabled ={true}
                        required ={true}
                        />
                    );
          if (loris.userHasPermission('candidate_parameter_edit')) {
            familyMembers.push(
                            <ButtonElement
                            label ="Delete"
                            type ="button"
                            onUserInput ={this.deleteFamilyMember.bind(
                                null,
                                familyMemberIDs[key].CandID,
                                familyMembers,
                                i
                            )}
                            />
                        );
          }
          familyMembers.push(<hr />);

          i++;
        }
      }

      var relationshipRequired = false;
      if (this.state.formData.FamilyCandID !== null &&
                this.state.formData.FamilyCandID !== undefined
            ) {
        relationshipRequired = true;
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
                <div className ={alertClass} role ="alert" ref ="alert-message">
                    {alertMessage}
                </div>

            <FormElement
                name ="familyInfo"
                onSubmit ={this.handleSubmit}
                ref ="form"
                class ="col-md-6"
            >
                <StaticElement
                    label ="PSCID"
                    text ={this.state.Data.pscid}
                />
                <StaticElement
                    label ="DCCID"
                    text ={this.state.Data.candID}
                />
                {familyMembers}
                <SelectElement
                    label ="Family Member ID (DCCID)"
                    name ="FamilyCandID"
                    options ={this.state.Data.candidates}
                    onUserInput ={this.setFormData}
                    ref ="FamilyCandID"
                    disabled ={disabled}
                    required ={false}
                />
                <SelectElement
                label ="Relation Type"
                name ="Relationship_type"
                options ={this.state.relationshipOptions}
                onUserInput ={this.setFormData}
                ref ="Relationship_type"
                disabled ={disabled}
                required ={relationshipRequired}
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
      for (var key in myFormData) {
        if (myFormData.hasOwnProperty(key)) {
          if (myFormData[key] !== "") {
            formData.append(key, myFormData[key]);
          }
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

      var alertMsg = this.refs["alert-message"].getDOMNode();
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
    },
    deleteFamilyMember: function(familyMemberID,
    familyMembers,
    familyID,
    e) {
      e.preventDefault();
      var myFormData = this.state.formData;
      var self = this;
      var formData = new FormData();
      for (var key in myFormData) {
        if (myFormData[key] !== "") {
          formData.append(key, myFormData[key]);
        }
      }

      formData.append('tab', 'deleteFamilyMember');
      formData.append('candID', this.state.Data.candID);
      formData.append('familyDCCID', familyMemberID);
      for (var field in familyMembers) {
        if (familyMembers.hasOwnProperty(field)) {
          if (familyMembers[field].ref !== null) {
            var reference = familyMembers[field].ref.split('_', 1);
            if (reference === familyID) {
              // TODO: remove fields immediately after deletion
              familyMembers[field] = null;
            }
          }
        }
      }

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
    }

  }
);

var RFamilyInfo = React.createFactory(FamilyInfo);
