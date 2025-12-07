import PropTypes from 'prop-types';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  TextboxElement,
  TextareaElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import hiStrings from '../locale/hi/LC_MESSAGES/document_repository.json';
import jaStrings from '../locale/ja/LC_MESSAGES/document_repository.json';

/**
 * Category Creation Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to create a category
 *
 * @author Shen Wang
 * @version 1.0.0
 */
class DocCategoryForm extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      formData: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Fetch data
   *
   * @return {Promise}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data: data, isLoaded: true}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // Data loading error
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (<Loader/>);
    }

    let disabled = true;
    let addButton = null;
    if (loris.userHasPermission('document_repository_categories')) {
      disabled = false;
      addButton = <ButtonElement label={t('Add Category',
        {ns: 'document_repository'})}/>;
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="docUpload"
            fileUpload={true}
            onSubmit={this.handleSubmit}
          >
            <h3>{t('Add a category',
              {ns: 'document_repository'})}</h3><br/>
            <TextboxElement
              name="categoryName"
              label={t('Category Name',
                {ns: 'document_repository'})}
              onUserInput={this.setFormData}
              required={true}
              disabled={disabled}
              value={this.state.formData.categoryName}
            />
            <SelectElement
              name="parentId"
              label={t('Parent', {ns: 'document_repository'})}
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              disabled={disabled}
              value={this.state.formData.parentId}
            />
            <TextareaElement
              name="comments"
              label={t('Comments', {ns: 'document_repository'})}
              onUserInput={this.setFormData}
              disabled={disabled}
              value={this.state.formData.comments}
            />
            {addButton}
          </FormElement>
        </div>
      </div>
    );
  }

  /**
   * *******************************************************************************
   *                      ******     Helper methods     *******
   ********************************************************************************
   */

  /**
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    this.uploadFile();
  }

  /**
   * Uploads the file to the server
   */
  uploadFile() {
    // Set form data and upload the media file
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObj.append(key, formData[key]);
      }
    }

    fetch(this.props.action, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObj,
    })
      .then((resp) => {
        if (resp.ok) {
          this.props.refreshPage();
          this.fetchData();
          // refresh the upload page
          this.props.newCategoryState();
          this.setState({
            formData: {}, // reset form data after successful file upload
          });
          swal.fire('Category Successfully Added!',
            '', 'success');
        } else {
          resp.json().then((data) => {
            swal.fire('Could not add category!',
              data.error, 'error');
          }).catch((error) => {
            console.error(error);
            swal.fire(
              'Unknown Error!',
              'Please report the issue or contact your administrator.',
              'error'
            );
          });
        }
      });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;

    this.setState({formData});
  }
}

DocCategoryForm.propTypes = {
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  refreshPage: PropTypes.func,
  newCategoryState: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(
  ['document_repository', 'loris'])(DocCategoryForm);

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'document_repository', hiStrings);
  i18n.addResourceBundle('ja', 'document_repository', jaStrings);

  const element = document.getElementById('lorisworkspace');
  if (!element) {
    throw new Error('Missing lorisworkspace');
  }
});
