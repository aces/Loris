import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Add Permission Form
 *
 * Module component rendering the add permission form modal window
 */
class AddPermissionForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      fieldOptions: {},
      formData: {},
      hasError: {},
      errorMessage: {},
      isLoaded: false,
      loadedData: 0,
    };

    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then(
        (data) => this.setState({
          data: data.Data,
          fieldOptions: data.fieldOptions,
        })
      )
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Render the form in the modal window.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className='alert alert-danger text-center'>
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (<Loader/>);
    }

    return (
      <FormElement
        name='addPermission'
        onSubmit={this.handleSubmit}
      >
        <SelectElement
          name='userid'
          label='User'
          options={this.state.fieldOptions.users}
          onUserInput={this.setFormData}
          ref='userid'
          hasError={this.state.hasError.Username}
          errorMessage={this.state.errorMessage.Username}
          required={true}
          value={this.state.formData.userid}
        />
        <h3>Choose a specific file or an entire release below</h3><br/>
        <SelectElement
          name='data_release_id'
          label='Data Release File'
          options={this.state.fieldOptions.filenames}
          onUserInput={this.setFormData}
          ref='data_release_id'
          hasError={this.state.hasError.Filename}
          errorMessage={this.state.errorMessage.Filename}
          required={false}
          value={this.state.formData.data_release_id}
        />
        <h4>OR</h4><br/>
        <SelectElement
          name='data_release_version'
          label='Data Release Version'
          options={this.state.fieldOptions.versions}
          onUserInput={this.setFormData}
          ref='data_release_version'
          hasError={this.state.hasError.Version}
          errorMessage={this.state.errorMessage.Version}
          required={false}
          value={this.state.formData.data_release_version}
        />
        <ButtonElement label='Add Permission'/>
      </FormElement>
    );
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;

    if (value === '') {
      formData[formElement] = null;
    } else {
      formData[formElement] = value;
    }

    this.setState({
      formData: formData,
    });
  }

  /**
   * Handles submission of the form
   *
   */
  handleSubmit() {
    let myFormData = this.state.formData;
    let formObj = new FormData();
    for (let key in myFormData) {
      if (myFormData[key] !== '') {
        formObj.append(key, myFormData[key]);
      }
    }

    // validate the form data
    if (!this.isValidFormData()) {
      return;
    }

    // fetch API to update the permission
    fetch(this.props.action, {
      method: 'post',
      body: formObj,
    }).then( (response) => {
      if (response.ok) {
        swal.fire({
          text: 'Permission Update Success!',
          title: '',
          type: 'success',
        }).then(function() {
          window.location.assign('/data_release');
        });
        this.props.fetchData();
      } else {
        let msg = response.statusText ?
          response.statusText :
          'Submission Error!';
        swal.fire(msg, '', 'error');
        console.error(msg);
      }
    });
  }

  /**
   * Validate the information submitted by the user.
   *
   * @return {boolean} true if the form data is valid, false otherwise
   */
  isValidFormData() {
    let isValid = true;

    let formData = this.state.formData;

    let errorMessage = {
      Username: undefined,
      Filename: undefined,
      Version: undefined,
    };

    let hasError = {
      Username: false,
      Filename: false,
      Version: false,
    };

    // make sure a user was selected
    if (!formData.userid) {
      errorMessage.Username = 'You must select a user!';
      hasError.Username = true;
      isValid = false;
    }

    // make sure either a file or a version was selected
    if ((!formData.data_release_version && !formData.data_release_id)
      || (formData.data_release_version && formData.data_release_id)) {
      let msg = 'You must select a file OR a version to grant permission on!';
      errorMessage.Filename = msg;
      errorMessage.Version = msg;
      hasError.Filename = true;
      hasError.Version = true;
      isValid = false;
    }

    this.setState({errorMessage, hasError});
    return isValid;
  }
}

AddPermissionForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  fetchData: PropTypes.func,
};

export default AddPermissionForm;
