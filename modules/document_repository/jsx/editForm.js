/* exported DocEditForm */
import Loader from 'Loader';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {
    FormElement,
    TextboxElement,
    TextareaElement,
    SelectElement,
    ButtonElement,
} from 'jsx/Form';

/**
 * Document Edit Form
 *
 * Fetches data corresponding to a given file from Loris backend and
 * displays a form allowing meta information of the media file
 *
 * @author Shen Wang
 * @version 1.0.0
 */
class DocEditForm extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      docData: {},
      formData: {},
      uploadResult: null,
      isLoaded: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Fetch data
   *
   * @return {Promise}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
       const formData = data.docData;
        this.setState({
          data: data,
          docData: data.docData,
          formData: formData,
        });
      })
      .catch((error) => {
        this.setState({error: true});
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
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

    let categoryDisabled =
      !loris.userHasPermission('document_repository_categories');

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
              options={this.state.data.categories}
              onUserInput={this.setFormData}
              hasError={false}
              required={true}
              disabled={categoryDisabled}
              value={this.state.docData.category}
            />
            <SelectElement
              name="forSite"
              label="Site"
              options={this.state.data.sites}
              onUserInput={this.setFormData}
              required={true}
              disabled={true}
              value={this.state.docData.forSite}
            />
            <SelectElement
              name="instrument"
              label="Instrument"
              options={this.state.data.instruments}
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
            {
              loris.userHasPermission('document_repository_hidden') &&
                (<SelectElement
                  name="hiddenFile"
                  label="Restrict access to the file?"
                  options={this.state.data.hiddenFile}
                  sortByValue={false}
                  onUserInput={this.setFormData}
                  value={this.state.docData.hiddenFile}
                />)
            }
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
   *
   * @param {event} e - Form submition event
   */
  handleSubmit(e) {
    e.preventDefault();
    let formData = this.state.docData;
    fetch(this.props.action, {
      method: 'PUT',
      headers: {
            'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify(formData),
    })
    .then((resp) => resp.json())
    .then(()=>{
      swal.fire('Updated Successful!', '', 'success');
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
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default DocEditForm;
