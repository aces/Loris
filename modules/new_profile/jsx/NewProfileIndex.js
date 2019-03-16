import Panel from 'Panel';
import Loader from 'Loader';
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
      data: {},
      configData: {},
      formData: {},
      newData: {},
      isLoaded: false,
      isCreated: false,
      errMessage: '',
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
      .then((data) => this.setState({configData: data}))
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
    const data = this.state.formData;
    let dateMatch = false;
    if (data.dateTaken == data.dateTakenConfirm) {
      dateMatch = true;
    }
    let edcMatch = true;
    if (this.state.configData['edc'] === 'true' &&
         data.edcDateTaken !== data.edcDateTakenConfirm
       ) {
 edcMatch = false;
}
    return dateMatch && edcMatch;
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submition event
   */
  handleSubmit(e) {
    e.preventDefault();
    const match = this.validateMatchDate();
    if (!match) {
      this.setState({
        errMessage: 'Date of Birth or EDC fields must match',
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
      fetch(this.props.submitURL, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: formObject,
        })
      .then((resp) => resp.json())
      .then((data) => {
        this.setState({newData: data});
        this.setState({isCreated: true});
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
    let formData = JSON.parse(JSON.stringify(this.state.formData));
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
    let project = null;
    let pscid = null;
    if (this.state.configData['useProject'] === 'true') {
      project =
        <SelectElement
          name = "project"
          label = "Project"
          options = {this.state.configData.project}
          onUserInput = {this.setFormData}
          value = {this.state.formData.project}
          required = {true}
        />;
    }
    if (this.state.configData['edc'] === 'true') {
      edc =
        <div>
          <DateElement
            name = "edcDateTaken"
            label = "Expected Date of Confinement"
            minYear = "2000"
            maxYear = "2017"
            onUserInput = {this.setFormData}
            value = {this.state.formData.edcDateTaken}
            required = {true}
          />
          <DateElement
            name = "edcDateTakenConfirm"
            label = "Confirm EDC"
            minYear = "2000"
            maxYear = "2017"
            onUserInput = {this.setFormData}
            value = {this.state.formData.edcDateTakenConfirm}
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
    if (!this.state.isCreated) {
      profile =
        <FormElement
          name = "newProfileForm"
          onSubmit = {this.handleSubmit}
        >
          <label className = "error">
            {this.state.errMessage}
          </label>
          <DateElement
            name = "dateTaken"
            label = "Date of Birth"
            minYear = "2000"
            maxYear = "2017"
            onUserInput = {this.setFormData}
            value = {this.state.formData.dateTaken}
            required = {true}
          />
          <DateElement
            name = "dateTakenConfirm"
            label = "Date of Birth Confirm"
            minYear = "2000"
            maxYear = "2017"
            onUserInput = {this.setFormData}
            value = {this.state.formData.dateTakenConfirm}
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
          <SelectElement
            name = "site"
            label = "Site"
            options = {this.state.configData.site}
            onUserInput = {this.setFormData}
            value = {this.state.formData.site}
            required = {true}
          />
          {pscid}
          {project}
          <ButtonElement label = "Create" id = "button"/>
        </FormElement>;
    } else {
      profile =
        <div>
          <p>New candidate created.DCCID:{this.state.newData.candID} PSCID: {this.state.newData.pscid} </p>
          <p><a href = {'/' + this.state.newData.candID}> Access this candidate </a></p>
          <p><a href = "/new_profile/" > Recruit another candidate </a></p>
        </div>;
    }
    return (<Panel title="Create a new profile">{profile}</Panel>);
  }
}
window.addEventListener(
  'load',
  () => {
    ReactDOM.render(
      <NewProfileIndex dataURL = {`${loris.BaseURL}/new_profile/?format=json`}
        submitURL = {`${loris.BaseURL}/new_profile/AddProfile`}
        hasPermission = {loris.userHasPermission}
      />,
      document.getElementById('lorisworkspace'));
  }
);
