import Loader from 'Loader';
import swal from 'sweetalert2';
import {createRoot} from 'react-dom/client';
import React from 'react';
import PropTypes from 'prop-types';
import {
    SelectElement,
    DateElement,
    TextboxElement,
    FormElement,
    ButtonElement,
    FieldsetElement,
} from 'jsx/Form';

/**
 * New Profile Form
 *
 * Create a new profile form
 *
 * @author  Shen Wang
 * @version 1.0.0
 */
class NewProfileIndex extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      configData: {},
      formData: {},
      isLoaded: false,
      error: false,
      submitDisabled: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
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
      swal.fire('Error!', 'Date of Birth fields must match', 'error');
    } else if (this.state.configData['edc'] === 'true' &&
         (formData.edcDate !== formData.edcDateConfirm)
    ) {
      swal.fire('Error!', 'EDC fields must match', 'error');
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
      return;
    }
    const formData = this.state.formData;
    const configData = this.state.configData;

    let candidateObject = {
      'Candidate': {
        'Project': formData.project,
        // 'PSCID' : conditionally included below
        // 'EDC' : conditionally included below
        'DoB': formData.dobDate,
        'Sex': formData.sex,
        'Site': configData.site[formData.site],
      },
    };

    if (this.state.configData['edc'] === 'true') {
      candidateObject.Candidate.EDC = formData.edcDate;
    }
    if (this.state.configData['pscidSet'] === 'true') {
      candidateObject.Candidate.PSCID = formData.pscid;
    }

    // disable button to prevent form resubmission.
    this.setState({submitDisabled: true});

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: JSON.stringify(candidateObject),
    })
    .then((resp) => {
      if (resp.ok && resp.status === 201) {
        resp.json().then((data) => {
          swal.fire({
            type: 'success',
            title: 'New Candidate Created',
            html: 'DCCID: ' + data.CandID + ' '
                  + 'PSCID: ' + data.PSCID + ' ',
            confirmButtonText: 'Access Profile',
            // Repurpose "cancel" as "recruit another candidate".
            // Use the same colour for both buttons, since one
            // isn't more "right" than the other.
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Recruit another candidate',
          }).then((result) => {
            // Go to the candidate profile or reload the page, depending
            // on whether the user clicked on 'Access Profile' or
            // 'Recruit another candidate' respectively
            window.location.href = result.value === true
                ? '/' + data.CandID
                : window.location.href;
          });
        } )
        .catch((error) => {
          swal.fire({
            type: 'error',
            title: 'Error!',
            text: error,
          });
          console.error(error);
        });
      } else {
        resp.json().then((message) => {
          // enable button for form resubmission.
          this.setState({submitDisabled: false});
          swal.fire('Error!', message.error, 'error');
        }).catch((error) => {
          swal.fire({
            type: 'error',
            title: 'Error!',
            text: error,
          });
          console.error(error);
        });
      }
    })
    .catch((error) => {
      swal.fire({
        type: 'error',
        title: 'Error!',
        text: error,
      });
      console.error(error);
    });
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

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // If error occurs, return a message.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    let edc = null;
    let pscid = null;
    let site = null;
    let minYear = this.state.configData.minYear;
    let thisYear = (new Date()).getFullYear();
    let dobMaxYear = this.state.configData.maxYear;
    if (!(dobMaxYear) || (dobMaxYear > thisYear)) {
      dobMaxYear = thisYear;
    }
    let dateFormat = this.state.configData.dobFormat;
    let requireBirthDate = true;

    if (this.state.configData['edc'] === 'true') {
      requireBirthDate = false;
      edc =
        <div>
          <DateElement
            name = "edcDate"
            label = "Expected Date of Confinement"
            minYear = {minYear}
            maxYear = {this.state.configData.maxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.edcDate}
            required = {true}
          />
          <DateElement
            name = "edcDateConfirm"
            label = "Confirm EDC"
            minYear = {minYear}
            maxYear = {this.state.configData.maxYear}
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
    if (this.state.configData.site && this.state.configData.site.length !== 0) {
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
    const profile = (
      <FormElement
        name = "newProfileForm"
        onSubmit = {this.handleSubmit}
      >
        <DateElement
          name = "dobDate"
          label = "Date of Birth"
          minYear = {minYear}
          maxYear = {dobMaxYear}
          dateFormat = {dateFormat}
          onUserInput = {this.setFormData}
          value = {this.state.formData.dobDate}
          required = {requireBirthDate}
        />
        <DateElement
          name = "dobDateConfirm"
          label = "Date of Birth Confirm"
          minYear = {minYear}
          maxYear = {dobMaxYear}
          dateFormat = {dateFormat}
          onUserInput = {this.setFormData}
          value = {this.state.formData.dobDateConfirm}
          required = {requireBirthDate}
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
        <ButtonElement
          name = "fire_away"
          label = "Create"
          id = "button"
          type = "submit"
          disabled={this.state.submitDisabled}
        />
      </FormElement>
    );
    return (
      <FieldsetElement legend={'Create a New Profile'}>
        {profile}
      </FieldsetElement>
    );
  }
}
NewProfileIndex.propTypes = {
  dataURL: PropTypes.string,
  submitURL: PropTypes.string,
};

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <NewProfileIndex
      dataURL = {`${loris.BaseURL}/new_profile/?format=json`}
      submitURL = {`${loris.BaseURL}/api/v0.0.3/candidates/`}
      hasPermission = {loris.userHasPermission}
    />
  );
});
