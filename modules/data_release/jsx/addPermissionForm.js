import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import swal from 'sweetalert2';
import {withTranslation} from 'react-i18next';
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
      errorMessage: {},
      isLoaded: false,
      loadedData: 0,
      specificReleaseId: null,
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
    // if data was not provided from manageFileForm, fetch it.
    if (!this.props.data) {
      this.fetchData()
        .then(() => this.setState({isLoaded: true}));
    } else {
      this.setState({
        data: this.props.data,
        fieldOptions: this.props.fieldOptions,
        isLoaded: true,
        specificReleaseId: this.props.specificReleaseId,
        formData: {
          data_release_id: this.props.specificReleaseId,
        },
      });
    }
  }

  /**
   * Render the form in the modal window.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
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
          label={t('User', {ns: 'data_release'})}
          options={this.state.fieldOptions.users}
          onUserInput={this.setFormData}
          ref='userid'
          errorMessage={this.state.errorMessage.Username}
          required={true}
          value={this.state.formData.userid}
          autoSelect={false}
        />
        {this.state.specificReleaseId === null ?
          <>
            <h3>{t('Choose a specific file or an entire release below',
              {ns: 'data_release'})}</h3><br/>
            <SelectElement
              name='data_release_id'
              label={t('Data Release File', {ns: 'data_release'})}
              options={this.state.fieldOptions.filenames}
              onUserInput={this.setFormData}
              ref='data_release_id'
              errorMessage={this.state.errorMessage.Filename}
              required={false}
              value={this.state.formData.data_release_id}
              autoSelect={false}
            />
            <h4>{t('OR', {ns: 'data_release'})}</h4><br/>
            <SelectElement
              name='data_release_version'
              label={t('Data Release Version', {ns: 'data_release'})}
              options={this.state.fieldOptions.versions}
              onUserInput={this.setFormData}
              ref='data_release_version'
              errorMessage={this.state.errorMessage.Version}
              required={false}
              value={this.state.formData.data_release_version}
              autoSelect={false}
            />
          </>
          :
          // If from manageFileForm, don't allow user to change the file
          <SelectElement
            name='data_release_id'
            label={t('Data Release File', {ns: 'data_release'})}
            options={this.state.fieldOptions.filenames}
            onUserInput={this.setFormData}
            ref='data_release_id'
            errorMessage={this.state.errorMessage.Filename}
            required={false}
            value={this.state.formData.data_release_id}
            autoSelect={false}
          />
        }
        <ButtonElement label={t('Add Permission', {ns: 'data_release'})}/>
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
    const {t} = this.props;
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
          text: t('Permission Update Success!', {ns: 'data_release'}),
          title: '',
          type: 'success',
        }).then(function() {
          window.location.assign('/data_release');
        });
      } else {
        let msg = response.statusText ?
          response.statusText :
          t('Submission Error!', {ns: 'data_release'});
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
    const {t} = this.props;
    let isValid = true;

    let formData = this.state.formData;

    let errorMessage = {
      Username: undefined,
      Filename: undefined,
      Version: undefined,
    };

    // make sure a user was selected
    if (!formData.userid) {
      errorMessage.Username = t('You must select a user!',
        {ns: 'data_release'});
      isValid = false;
    }

    // make sure either a file or a version was selected
    if ((!formData.data_release_version && !formData.data_release_id)
      || (formData.data_release_version && formData.data_release_id)) {
      let msg = t('You must select a file OR a version to grant permission on!',
        {ns: 'data_release'});
      errorMessage.Filename = msg;
      errorMessage.Version = msg;
      isValid = false;
    }

    this.setState({errorMessage});
    return isValid;
  }
}

AddPermissionForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  fetchData: PropTypes.func,
  data_release_id: PropTypes.number,
  specificReleaseId: PropTypes.number,
  fieldOptions: PropTypes.object,
  data: PropTypes.object,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['data_release', 'loris'])(AddPermissionForm);
