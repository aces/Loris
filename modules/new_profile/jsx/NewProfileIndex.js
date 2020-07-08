import Loader from 'Loader';
import swal from 'sweetalert2';

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
      this.setState({
        isCreated: false,
      });
    } else {
      let formData = this.state.formData;
      let formObject = new FormData();
      for (let key in formData) {
        if (formData[key] !== '') {
          formObject.append(key, formData[key]);
        }
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
            this.setState({isCreated: true});
          });
        } else {
          resp.json().then((message) => {
            // enable button for form resubmission.
            this.setState({submitDisabled: false});
            swal.fire('Error!', message, 'error');
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
    return (
      <FieldsetElement legend={'Create a New Profile'}>
        {profile}
      </FieldsetElement>
    );
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
