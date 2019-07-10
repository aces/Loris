import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FamilyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      formData: {},
      familyMembers: [],
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };
    this.setFormData = this.setFormData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.deleteFamilyMember = this.deleteFamilyMember.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    $.ajax(
      this.props.dataURL,
      {
        dataType: 'json',
        xhr: function() {
          let xhr = new window.XMLHttpRequest();
          xhr.addEventListener(
            'progress',
            function(evt) {
              this.setState({
                loadedData: evt.loaded,
              });
            }.bind(this));
          return xhr;
        }.bind(this),
        success: function(data) {
          this.setState({
            Data: data,
            isLoaded: true,
            familyMembers: data.existingFamilyMembers,
          });
        }.bind(this),
        error: function(data, errorCode, errorMsg) {
          this.setState({
            error: 'An error occurred when loading the form!',
          });
        }.bind(this),
      }
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
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

    let relationshipOptions = {
      'full_sibling': 'Full Sibling',
      'half_sibling': 'Half Sibling',
      '1st_cousin': 'First Cousin',
    };

    let disabled = true;
    let addButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      addButton = <ButtonElement label="Add"/>;
    }

    let candidateList = this.state.Data.candidates;

    let familyMembers = this.state.familyMembers;
    let familyMembersHTML = [];

    for (let key in familyMembers) {
      if (familyMembers.hasOwnProperty(key)) {
        let candID = familyMembers[key].FamilyCandID;
        let relationship = familyMembers[key].Relationship_type;
        let link = '?candID=' + candID + '&identifier=' + candID;

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
            <hr/>
          </div>
        );
        // remove from list of candidates because it can only be added once
        delete candidateList[candID];
      }
    };

    let alertMessage = '';
    let alertClass = 'alert text-center hide';
    if (this.state.updateResult) {
      if (this.state.updateResult === 'success') {
        alertClass = 'alert alert-success text-center';
        alertMessage = 'Update Successful!';
      } else if (this.state.updateResult === 'error') {
        let errorMessage = this.state.errorMessage;
        alertClass = 'alert alert-danger text-center';
        alertMessage = errorMessage ? errorMessage : 'Failed to update!';
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
          <hr/>
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
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    let myFormData = this.state.formData;
    let self = this;
    let formData = new FormData();
    let formRefs = this.refs;

    let familyMembers = this.state.familyMembers;
    let familyMember = {};

    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== '') {
          familyMember[key] = myFormData[key];
          formData.append(key, myFormData[key]);
        }
      }
    }
    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);

    familyMembers.push(familyMember);

    this.setState({
      familyMembers: familyMembers,
    });

    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        self.setState({
          updateResult: 'success',
          formData: {},
        });
        self.showAlertMessage();

        // Iterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(function(ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = '';
          }
        });
        // rerender components
        self.forceUpdate();
      },
      error: function(err) {
        let errorMessage = JSON.parse(err.responseText).message;
        self.setState(
          {
            updateResult: 'error',
            errorMessage: errorMessage,
          }
        );
        self.showAlertMessage();
      },

    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    let self = this;
    if (this.refs['alert-message'] === null) {
      return;
    }

    let alertMsg = this.refs['alert-message'];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
      500,
      function() {
        self.setState(
          {
            updateResult: null,

          }
        );
      });
  }

  deleteFamilyMember(candID, key, candidateList) {
    let familyMembers = this.state.familyMembers;
    delete familyMembers[key];

    // readd to list of possible family members
    candidateList[candID] = candID;

    this.setState({
      familyMembers: familyMembers,
    });

    let myFormData = this.state.formData;
    let self = this;
    let formData = new FormData();
    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== '') {
          formData.append(key, myFormData[key]);
        }
      }
    }
    formData.append('tab', 'deleteFamilyMember');
    formData.append('candID', this.state.Data.candID);
    formData.append('familyDCCID', candID);

    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        self.setState(
          {
            updateResult: 'success',
          });
        self.showAlertMessage();
      },
      error: function(err) {
        if (err.responseText !== '') {
          let errorMessage = JSON.parse(err.responseText).message;
          self.setState(
            {
              updateResult: 'error',
              errorMessage: errorMessage,
            });
          self.showAlertMessage();
        }
      },
    });
  }
}
FamilyInfo.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  candID: PropTypes.string,
  action: PropTypes.string,
};

export default FamilyInfo;
