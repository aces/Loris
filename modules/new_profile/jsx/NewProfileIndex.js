import Panel from 'Panel';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {OpenScienceIdentity} from '../js/open_science_identity.js';

/**
 * New Profile Form
 *
 * Create a new profile form
 *
 * @author  Shen Wang
 * @version 1.0.0
 * */
class NewProfileIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configData: {},
      formData: {},
      newData: {},
      isLoaded: false,
      isCreated: false,
      error: false,
      submitDisabled: false,
      hashRequired: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL,
      {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({configData: data.fieldOptions}))
      .catch((error) => {
        this.setState({error: true});
      });
  }
  /**
   * It checks the date of birth and Expected Date of Confinement,
   * the date fields must match.
   * If match, this function will return true.
   *
   * @return {boolean}
   */
  validateMatchDate() {
    let validate = false;
    const formData = this.state.formData;
    if (formData.dobDate !== formData.dobDateConfirm) {
      swal('Error!', 'Date of Birth fields must match', 'error');
    } else if (this.state.configData['edc'] === 'true' &&
         (formData.edcDate !== formData.edcDateConfirm)
    ) {
      swal('Error!', 'EDC fields must match', 'error');
    } else {
      validate = true;
    }
    return validate;
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    const match = this.validateMatchDate();
    if (!match) {
      this.setState({
        isCreated: false,
      });
    } else {
      let formData = this.state.formData;
      let guid = '';
      // Check if GUID fields submitted and generate hash
      if (
        formData.firstName
        && formData.middleName
        && formData.lastName
        && formData.placeOfBirth
      ) {
        let id = new OpenScienceIdentity({
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          city_of_birth: formData.placeOfBirth,
          birth_day: formData.dobDate,
          gender: formData.sex,
        });
        try {
          guid = id.toSignature();
        } catch (exception) {
          alert(exception);
          return;
        }
      }
      let formObject = new FormData();
      for (let key in formData) {
        // unset PII fields from formData
        if (
          formData[key] !== ''
          && key !== 'firstName'
          && key !== 'middleName'
          && key !== 'lastName'
          && key !== 'placeOfBirth'
        ) {
          formObject.append(key, formData[key]);
        }
      }
      if (guid !== '') {
        formObject.append('GUID', guid);
      }
      formObject.append('fire_away', 'New Candidate');
      // disable button to prevent form resubmission.
      this.setState({submitDisabled: true});

      fetch(this.props.submitURL, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: formObject,
      })
        .then((resp) => {
          if (resp.ok && resp.status === 201) {
            resp.json().then((data) => {
              this.setState({newData: data});
              if (data.piiToken && data.piiCandidateURL) {
                fetch(data.piiCandidateURL, {
                  method: 'POST',
                  cache: 'no-cache',
                  credentials: 'same-origin',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    first_name: formData.firstName,
                    middle_name: formData.middleName,
                    last_name: formData.lastName,
                    city_of_birth: formData.placeOfBirth,
                    birth_day: formData.dobDate,
                    sex: formData.sex === 'Male' ? 'M' : formData.sex === 'Female' ? 'F' : '',
                    guid: guid,
                    one_time_token: data.piiToken,
                  }),
                }).then((resp) => {
                  console.log(resp);
                  if (resp.ok && resp.status === 200) {
                    resp.json().then(
                      (data) => {
                        if (data.condition === 'duplicate patient') {
                          console.log('DUPLICATE');
                        } else {
                          console.log('NEW');
                        }
                      });
                  } else {
                    swal(
                      'Error!',
                      'There was an error submitting the data to the PII system. Make sure all necessarily configurations are properly set.',
                      'error'
                    );
                  }
                })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                this.setState({isCreated: true});
              }
            });
          } else {
            resp.json().then((message) => {
              // enable button for form resubmission.
              this.setState({submitDisabled: false});
              swal('Error!', message, 'error');
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[formElement] = value;

    this.setState({formData: formData});
  }

  render() {
    // If error occurs, return a message.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    let profile = null;
    let edc = null;
    let pscid = null;
    let site = null;
    let GUIDform = null;
    let minYear = this.state.configData.minYear;
    let maxYear = this.state.configData.maxYear;
    let dateFormat = this.state.configData.dobFormat;

    if (this.state.configData['edc'] === 'true') {
      edc =
        <div>
          <DateElement
            name = "edcDate"
            label = "Expected Date of Confinement"
            minYear = {minYear}
            maxYear = {maxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.edcDate}
            required = {true}
          />
          <DateElement
            name = "edcDateConfirm"
            label = "Confirm EDC"
            minYear = {minYear}
            maxYear = {maxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.edcDateConfirm}
            required = {true}
          />
        </div>;
    }
    if (this.state.configData['pscidSet'] === 'true') {
      pscid =
        <TextboxElement
          name = "pscid"
          label = "PSCID"
          onUserInput = {this.setFormData}
          value = {this.state.formData.pscid}
          required = {true}
        />;
    }
    if (this.state.configData['site'] !== null) {
      site =
        <SelectElement
          name = "site"
          label = "Site"
          options = {this.state.configData.site}
          onUserInput = {this.setFormData}
          value = {this.state.formData.site}
          required = {true}
        />;
    }
    if (this.state.configData['guidProjects'].includes(
      this.state.configData.project[this.state.formData.project])
    ) {
      GUIDform =
        <div>
          <TextboxElement
            name = "firstName"
            label = "First Name"
            onUserInput = {this.setFormData}
            value = {this.state.formData.firstName}
            required = {true}
          />
          <TextboxElement
            name = "middleName"
            label = "Middle Name"
            onUserInput = {this.setFormData}
            value = {this.state.formData.middleName}
            required = {true}
          />
          <TextboxElement
            name = "lastName"
            label = "Last Name"
            onUserInput = {this.setFormData}
            value = {this.state.formData.lastName}
            required = {true}
          />
          <TextboxElement
            name = "placeOfBirth"
            label = "Place of Birth (City, Municipality)"
            onUserInput = {this.setFormData}
            value = {this.state.formData.placeOfBirth}
            required = {true}
          />
        </div>;
    }
    if (!this.state.isCreated) {
      profile = (
        <FormElement
          name = "newProfileForm"
          onSubmit = {this.handleSubmit}
        >
          <DateElement
            name = "dobDate"
            label = "Date of Birth"
            minYear = {minYear}
            maxYear = {maxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.dobDate}
            required = {true}
          />
          <DateElement
            name = "dobDateConfirm"
            label = "Date of Birth Confirm"
            minYear = {minYear}
            maxYear = {maxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.dobDateConfirm}
            required = {true}
          />
          {edc}
          <SelectElement
            name = "sex"
            label = "Sex"
            options = {this.state.configData.sex}
            onUserInput = {this.setFormData}
            value = {this.state.formData.sex}
            required = {true}
          />
          {site}
          {pscid}
          <SelectElement
            name = "project"
            label = "Project"
            options = {this.state.configData.project}
            onUserInput = {this.setFormData}
            value = {this.state.formData.project}
            required = {true}
          />
          {GUIDform}
          <ButtonElement
            name = "fire_away"
            label = "Create"
            id = "button"
            type = "submit"
            disabled={this.state.submitDisabled}
          />
        </FormElement>
      );
    } else {
      profile = (
        <div>
          <p>New candidate created. DCCID: {this.state.newData.candID} PSCID: {this.state.newData.pscid} </p>
          <p><a href = {'/' + this.state.newData.candID}> Access this candidate </a></p>
          <p><a href = "/new_profile/" > Recruit another candidate </a></p>
        </div>
      );
    }
    return (<Panel title="Create a new profile">{profile}</Panel>);
  }
}
window.addEventListener('load', () => {
  ReactDOM.render(
    <NewProfileIndex
      dataURL = {`${loris.BaseURL}/new_profile/?format=json`}
      submitURL = {`${loris.BaseURL}/new_profile/`}
      hasPermission = {loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
