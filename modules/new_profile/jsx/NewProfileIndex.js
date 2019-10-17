import Panel from 'Panel';
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
    if (!this.validateMatchDate()) {
      console.error('something wong');
      return;
    }

    const formdata = this.state.formData;
    const payload = {
      Candidate: {
        DoB: formdata.dobDate || null,
        EDC: formdata.edcDate || null,
        PSCID: formdata.pscid || null,
        Sex: formdata.sex || null,
        Project: formdata.project || null,
        Site: formdata.site || null,
      },
    };

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
    .then((resp) => resp.json())
    .then((json) => {
      if (json.error) {
        throw json.error;
      }

      this.setState({
        newData: json,
        isCreated: true,
      });
    })
    .catch((error) => {
      console.error(error);
      swal('Error!', error, 'error');
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
          <SelectElement
            name = "sex"
            label = "Sex"
            options = {this.state.configData.sex}
            onUserInput = {this.setFormData}
            value = {this.state.formData.sex}
            required = {true}
          />
          {edc}
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
          />
        </FormElement>
      );
    } else {
      profile = (
        <div>
          <p>New candidate created. DCCID: {this.state.newData.CandID} PSCID: {this.state.newData.PSCID}</p>
          <p><a href = {'/' + this.state.newData.CandID}> Access this candidate </a></p>
          <p><a href = "/new_profile/" > Recruit another candidate </a></p>
        </div>
      );
    }
    return (
      <div className="container col-md-5">
        <Panel title="Create a new profile">
          {profile}
        </Panel>
      </div>
    );
  }
}
window.addEventListener('load', () => {
  ReactDOM.render(
    <NewProfileIndex
      dataURL = {`${loris.BaseURL}/new_profile/?format=json`}
      submitURL = {`${loris.BaseURL}/api/v0.0.2/candidates`}
      hasPermission = {loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
