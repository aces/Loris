import ViewSurveysIndex from './ViewSurveysIndex';

/**
 * ParentPortalIndex
 *
 * Create a parent portal form
 *
 * @author  Shen Wang
 * @version 1.0.0
 */
class ParentPortalIndex extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      configData: {},
      formData: {
        parentID: props.parentID,
      },
      survey_data: {},
      view_surveys: false,
      error: false,
      errorMsg: '',
      submitDisabled: false,
    };
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    this.setState({errorMsg: ''});
    // Set form data and upload the media file
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
    .then((resp) => {
      if (resp.ok) {
            resp.json().then((data) => {
            this.setState({survey_data: data});
            this.setState({view_surveys: true});
          });
      } else {
      this.setState({errorMsg: 'No Surveys Found With The Above Information.'});
      }
        }).catch((error) => {
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
    if (!this.state.view_surveys) {
     return (
      <FieldsetElement legend={'Go To Parent Portal'}>
        <FormElement
          name = "newProfileForm"
            onSubmit={this.handleSubmit}
        >
           <TextboxElement
            name = "parentID"
            label = "Enter ParentID:"
            onUserInput = {this.setFormData}
            value = {this.state.formData.parentID}
            required = {true}
            />
           <TextboxElement
            name = "email"
            label = "Enter Email:"
            onUserInput = {this.setFormData}
            value = {this.state.formData.email}
            required = {true}
            />
           <div style={{color: 'red'}}>{this.state.errorMsg}</div>
           <ButtonElement
            name = "fire_away"
            label = "Go To Parent Portal"
            id = "button"
            type = "submit"
            />
          </FormElement>
        </FieldsetElement>
     );
    } else {
      return (
       <ViewSurveysIndex
         id = {this.state.formData.parentID}
         data = {this.state.survey_data}
       />
      );
    }
  }
}
window.addEventListener('load', () => {
const urlParams = new URLSearchParams(window.location.search);
const parentid = urlParams.get('id');
  ReactDOM.render(
    <ParentPortalIndex
      parentID = {parentid}
      submitURL = {`${loris.BaseURL}/parent_portal/survey_handle`}
    />,
    document.getElementById('lorisworkspace')
  );
});
