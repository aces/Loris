/* exported DocEditForm */
import Loader from 'Loader';
import PropTypes from 'prop-types';
/**
 * Document Edit Form
 *
 * Fetches data corresponding to a given file from Loris backend and
 * displays a form allowing meta information of the media file
 *
 * @author Shen Wang
 * @version 1.0.0
 *
 * */
class DocEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      docData: {},
      formData: {},
      uploadResult: null,
      isLoaded: false,
      loadedData: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    return fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
       const formData = data.docData;
        this.setState({
          Data: data,
          docData: data.docData,
          formData: formData,
        });
      })
      .catch((error) => {
        this.setState({error: true});
    });
  }

  render() {
    // Data loading error
    if (this.state.error) {
       return <h3>An error occured while loading the page.</h3>;
     }
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <Loader/>
      );
    }

    return (
        <div>
        <FormElement
          name="docEdit"
          onSubmit={this.handleSubmit}
        >
          <h3>Edit Document Repository File</h3>
          <br />
            <SelectElement
              name="category"
              label="Category"
              options={this.state.Data.categories}
              onUserInput={this.setFormData}
              hasError={false}
              required={true}
              disabled={true}
              value={this.state.docData.category}
            />
            <SelectElement
              name="forSite"
              label="Site"
              options={this.state.Data.sites}
              onUserInput={this.setFormData}
              required={true}
              disabled={true}
              value={this.state.docData.forSite}
            />
            <SelectElement
              name="instrument"
              label="Instrument"
              options={this.state.Data.instruments}
              onUserInput={this.setFormData}
              value={this.state.docData.instrument}
            />
            <TextboxElement
              name="pscid"
              label="PSCID"
              onUserInput={this.setFormData}
              disable = {true}
              value={this.state.docData.pscid}
            />
            <TextboxElement
              name="visitLabel"
              label="Visit Label"
              onUserInput={this.setFormData}
              value={this.state.docData.visitLabel}
            />
            <TextareaElement
              name="comments"
              label="Comments"
              onUserInput={this.setFormData}
              value={this.state.docData.comments}
            />
            <TextboxElement
              name="version"
              label="Version"
              onUserInput={this.setFormData}
              value={this.state.docData.version}
            />
          <ButtonElement label="Update File"/>
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   * @param {event} e - Form submition event
   */
  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.docData;
    let formObject= new FormData();
    for (let key in formData) {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        formObject.append(key, formData[key]);
      }
    }
   fetch(this.props.action, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => resp.json())
    .then(()=>{
      swal('Updated Successful!', '', 'success');
      this.props.refreshPage();
      this.fetchData();
    });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let docData = this.state.docData;
      docData[formElement] = value;
    this.setState({
      docData: docData,
    });
  }
}

DocEditForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

let RDocEditForm = React.createFactory(DocEditForm);

window.DocEditForm = DocEditForm;
window.RDocEditForm = RDocEditForm;

export default DocEditForm;
