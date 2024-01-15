import PropTypes from 'prop-types';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  SelectElement,
  TextboxElement,
} from 'jsx/Form';

/**
 * Document Edit Category Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to edit a category
 *
 * @author Pierre PAC SOO
 * @version 1.0.0
 *
 * */
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
    // Data loading error
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (<Loader/>);
    }

    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('document_repository_categories')) {
      disabled = false;
      updateButton = <ButtonElement label="Edit Category"/>;
    }

    let errorSameParent = false;

    if (
      this.state.formData.categoryID==this.state.formData.newParentID
      && this.state.formData.categoryID!=null
      ) {
      errorSameParent = true;
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="categoryEdit"
            onSubmit={this.handleSubmit}
          >
            <h3>Change Name of a category</h3><br/>
            <SelectElement
              name="categoryID"
              label="Category Name:"
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              required={true}
              disabled={disabled}
              hasError={false}
              value={this.state.formData.categoryID}
            />
            <TextboxElement
              name="categoryNameChange"
              label="New Name for Category"
              onUserInput={this.setFormData}
              required={true}
              disabled={disabled}
              value={this.state.formData.categoryNameChange}
            />
            <SelectElement
              name="newParentID"
              label="New Parent:"
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              required={false}
              disabled={disabled}
              hasError={errorSameParent}
              errorMessage={'Cannot be equal to itself'}
              value={this.state.formData.newParentID}
            />
            {updateButton}
          </FormElement>
        </div>
      </div>
    );
  }

  /** *******************************************************************************
   *                      ******     Helper methods     *******
   *********************************************************************************/


  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    if (
      this.state.formData.categoryID==this.state.formData.newParentID
      && this.state.formData.categoryID!=null
    ) {
      swal.fire('New parent cannot be equal to itself', '', 'error');
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
      swal.fire('New parent cannot be equal to itself', '', 'error');
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
            msg = 'Edit error!';
        }
        this.setState({
          errorMessage: msg,
        });
        swal.fire(msg, '', 'error');
        console.error(msg);
      } else {
          swal.fire({
            text: 'Edited Successful!',
            title: '',
            type: 'success',
          }).then(function() {
            window.location.assign('/document_repository');
          });
      }
    }).catch( (error) => {
      let msg = error.message ? error.message : 'Edit error!';
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
};

export default EditDocCategoryForm;
