import PropTypes from 'prop-types';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  SelectElement,
} from 'jsx/Form';

/**
 * Document Delete category Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to delete a category
 *
 * @author Rolando Acosta
 * @version 1.0.0
 *
 * */
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
    let deleteButton = null;
    if (loris.userHasPermission('document_repository_categories')) {
      disabled = false;
      deleteButton = <ButtonElement label="Delete Category"/>;
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="categoryEdit"
            onSubmit={this.handleSubmit}
          >
            <h3>Delete a category</h3><br/>
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
            {deleteButton}
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
    this.deleteCategory();
  }

  /*
   * Delete the Category.
   */
  deleteCategory() {
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
            msg = 'Delete error!';
        }
        this.setState({
          errorMessage: msg,
        });
        swal.fire(msg, '', 'error');
        console.error(msg);
      } else {
          swal.fire({
            text: 'Delete Successful!',
            title: '',
            type: 'success',
          }).then(function() {
            window.location.assign('/document_repository');
          });
      }
    }).catch( (error) => {
      let msg = error.message ? error.message : 'Delete error!';
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
};

export default DeleteDocCategoryForm;
