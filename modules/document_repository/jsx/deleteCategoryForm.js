import PropTypes from 'prop-types';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  SelectElement,
} from 'jsx/Form';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/document_repository.json';
import jaStrings from '../locale/ja/LC_MESSAGES/document_repository.json';

/**
 * Document Delete category Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to delete a category
 *
 * @author Rolando Acosta
 * @version 1.0.0
 */
class DeleteDocCategoryForm extends React.Component {
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
   * @return {Promise<void>}
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
    let deleteButton = null;
    if (loris.userHasPermission('document_repository_categories')) {
      disabled = false;
      deleteButton = <ButtonElement label={t('Delete Category',
        {ns: 'document_repository'})}/>;
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="categoryEdit"
            onSubmit={this.handleSubmit}
          >
            <h3>{t('Delete a category', {ns: 'document_repository'})}</h3><br/>
            <SelectElement
              name="categoryID"
              label={t('Category Name:', {ns: 'document_repository'})}
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              required={true}
              disabled={disabled}
              value={this.state.formData.categoryID}
            />
            {deleteButton}
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
    this.deleteCategory();
  }

  /*
   * Delete the Category.
   */
  deleteCategory() {
    const {t} = this.props;
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
    }).then(async (response) => {
      if (!response.ok) {
        const body = await response.json();
        let msg;
        if (body && body.error) {
          msg = body.error;
        } else if (response.statusText) {
          msg = response.statusText;
        } else {
          msg = t('Delete error!', {ns: 'document_repository'});
        }
        this.setState({
          errorMessage: msg,
        });
        swal.fire(msg, '', 'error');
        console.error(msg);
      } else {
        swal.fire({
          text: t('Delete Successful!', {ns: 'document_repository'}),
          title: '',
          type: 'success',
        }).then(function() {
          window.location.assign('/document_repository');
        });
      }
    }).catch( (error) => {
      let msg = error.message ? error.message : t('Delete error!',
        {ns: 'document_repository'});
      this.setState({
        errorMessage: msg,
        uploadProgress: -1,
      });
      swal.fire(msg, '', 'error');
      console.error(error);
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

DeleteDocCategoryForm.propTypes = {
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  t: PropTypes.func,
};

export default withTranslation(
  ['document_repository', 'loris'])(DeleteDocCategoryForm);

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'document_repository', hiStrings);
  i18n.addResourceBundle('ja', 'document_repository', jaStrings);

  const element = document.getElementById('lorisworkspace');
  if (!element) {
    throw new Error('Missing lorisworkspace');
  }
});
