import Loader from 'Loader';

/**
 * Family Info Component.
 *
 * Renders the contents of the FamilyInfo tab, consisting of the FormElement component
 */

class FamilyInfo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      familyMembers: [],
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.deleteFamilyMember = this.deleteFamilyMember.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   */
  fetchData() {
    $.ajax(this.props.dataURL, {
      method: 'GET',
      dataType: 'json',
      success: data => {
        this.setState({
          Data: data,
          isLoaded: true,
          familyMembers: data.existingFamilyMembers
        });
      },
      error: error => {
        this.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    let myFormData = this.state.formData;
    let formData = new FormData();
    let formRefs = this.refs;

    let familyMembers = this.state.familyMembers;
    let familyMember = {};

    for (let key in myFormData) {
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
      url: this.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        this.setState({
          updateResult: "success",
          formData: {}
        });
        this.showAlertMessage();
        // Iterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(ref => {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = "";
          }
        });
        // Rerender components
        this.forceUpdate();
      },
      error: error => {
        let errorMessage = JSON.parse(error.responseText).message;
        this.setState({
          updateResult: "error",
          errorMessage: errorMessage
        });
        this.showAlertMessage();
      }
    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    if (this.refs["alert-message"] === null) {
      return;
    }
    let alertMsg = this.refs["alert-message"];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
      500,
      () => {
        this.setState({
          updateResult: null
        });
      }
    );
  }

  deleteFamilyMember(candID, key, candidateList) {
    let familyMembers = this.state.familyMembers;
    delete familyMembers[key];

    // Readd to list of possible family members
    candidateList[candID] = candID;

    this.setState({
      familyMembers: familyMembers
    });

    let myFormData = this.state.formData;
    let formData = new FormData();
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
      url: this.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        this.setState({
          updateResult: "success"
        });
        this.showAlertMessage();
      },
      error: error => {
        if (error.responseText !== "") {
          let errorMessage = JSON.parse(error.responseText).message;
          this.setState({
            updateResult: "error",
            errorMessage: errorMessage
          });
          this.showAlertMessage();
        }
      }
    });
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    let relationshipOptions = {
      "full_sibling": "Full Sibling",
      "half_sibling": "Half Sibling",
      "1st_cousin": "First Cousin"
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
        let link = "?candID=" + candID + "&identifier=" + candID;

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
        // Remove from list of candidates because it can only be added once
        delete candidateList[candID];
      }
    }

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
  }
}

FamilyInfo.propTypes = {
  dataURL: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired,
  tabName: React.PropTypes.string
};

export default FamilyInfo;
