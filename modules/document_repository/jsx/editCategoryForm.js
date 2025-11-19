import PropTypes from 'prop-types';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  SelectElement,
  TextboxElement,
} from 'jsx/Form';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/document_repository.json';

/**
 * Document Edit Category Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to edit a category
 *
 * @author Pierre PAC SOO
 * @version 1.0.0
 */
class EditDocCategoryForm extends React.Component {
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
    let updateButton = null;
    if (loris.userHasPermission('document_repository_categories')) {
      disabled = false;
      updateButton = <ButtonElement label={t('Edit Category',
        {ns: 'document_repository'})}/>;
    }

    let errorSameParent = null;

    if (
      this.state.formData.categoryID==this.state.formData.newParentID
      && this.state.formData.categoryID!=null
    ) {
      errorSameParent = t('Cannot be equal to itself',
        {ns: 'document_repository'});
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="categoryEdit"
            onSubmit={this.handleSubmit}
          >
            <h3>{t('Change Name of a category',
              {ns: 'document_repository'})}</h3><br/>
            <SelectElement
              name="categoryID"
              label={t('Category Name:', {ns: 'document_repository'})}
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              required={true}
              disabled={disabled}
              value={this.state.formData.categoryID}
            />
            <TextboxElement
              name="categoryNameChange"
              label={t('New Name for Category',
                {ns: 'document_repository'})}
              onUserInput={this.setFormData}
              required={true}
              disabled={disabled}
              value={this.state.formData.categoryNameChange}
            />
            <SelectElement
              name="newParentID"
              label={t('New Parent:', {ns: 'document_repository'})}
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              required={false}
              disabled={disabled}
              errorMessage={errorSameParent}
              value={this.state.formData.newParentID}
            />
            {updateButton}
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
    const {t} = this.props;
    if (
      this.state.formData.categoryID==this.state.formData.newParentID
      && this.state.formData.categoryID!=null
    ) {
      swal.fire(t('New parent cannot be equal to itself',
        {ns: 'document_repository'}), '', 'error');
    } else {
      this.editCategory();
    }
  }
  /**
   * Edits the category the server
   */
  editCategory() {
    // Set form data and upload the media file
    let formData = this.state.formData;
    let formObj = new FormData();

    if (
      formData.categoryID==formData.newParentID
      && formData.categoryID!=null
    ) {
      swal.fire(this.props.t('New parent cannot be equal to itself',
        {ns: 'document_repository'}), '', 'error');
    }

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
          msg = this.props.t('Edit error!',
            {ns: 'document_repository'});
        }
        this.setState({
          errorMessage: msg,
        });
        swal.fire(msg, '', 'error');
        console.error(msg);
      } else {
        swal.fire({
          text: this.props.t('Edited Successful!',
            {ns: 'document_repository'}),
          title: '',
          type: 'success',
        }).then(function() {
          window.location.assign('/document_repository');
        });
      }
    }).catch( (error) => {
      let msg = error.message ? error.message :
        this.props.t('Edit error!', {ns: 'document_repository'});
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

EditDocCategoryForm.propTypes = {
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  t: PropTypes.func,
};

export default withTranslation(
  ['document_repository', 'loris'])(EditDocCategoryForm);

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'document_repository', hiStrings);

  const element = document.getElementById('lorisworkspace');
  if (!element) {
    throw new Error('Missing lorisworkspace');
  }
});
