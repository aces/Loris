import PropTypes from 'prop-types';
import Loader from 'Loader';
/**
 * Document Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload a doc file
 *
 * @author Shen Wang
 * @version 1.0.0
 *
 * */
class DocCategoryForm extends React.Component {
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

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data: data, isLoaded: true}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  render() {
    // Data loading error
    if (this.state.error) {
       return <h3>An error occured while loading the page.</h3>;
     }
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (<Loader/>);
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="docUpload"
            fileUpload={true}
            onSubmit={this.handleSubmit}
          >
            <h3>Add a category</h3><br/>
            <TextboxElement
              name="categoryName"
              label="Category Name"
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.categoryName}
            />
            <SelectElement
              name="parentId"
              label="Parent"
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              hasError={false}
              value={this.state.formData.parentId}
            />
            <TextareaElement
              name="comments"
              label="Comments"
              onUserInput={this.setFormData}
              value={this.state.formData.comments}
            />
            <ButtonElement label="Add Category"/>
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
    this.uploadFile();
  }
  /*
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
    .then((resp) => resp.json())
    .then(()=>{
        this.props.refreshPage();
        this.fetchData();
        // refresh the upload page
        this.props.newCategoryState();
        this.setState({
          formData: {}, // reset form data after successful file upload
        });
        swal('Add Successful!', '', 'success');
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
};

export default DocCategoryForm;
