import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  StaticElement,
  DateElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Candidate date of death component
 */
class CandidateDOD extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      formData: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      .then((data) => this.setState({data: data, formData: data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Set form data
   *
   * @param {string} formElement
   * @param {*} value
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    let dateFormat = this.state.data.dodFormat;
    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_dod_edit')) {
      disabled = false;
      updateButton = <ButtonElement label="Update"/>;
    }

    return (
      <div className='row'>
        <FormElement
          name='candidateDOD'
          onSubmit={this.handleSubmit}
          ref='form'
          class='col-md-6'>
          <StaticElement
            label='PSCID'
            text={this.state.data.pscid}
          />
          <StaticElement
            label='DCCID'
            text={this.state.data.candID}
          />
          <StaticElement
            label='Disclaimer:'
            text='Any changes to the date of death requires an
            administrator to run the fix_candidate_age script.'
            class='form-control-static text-danger bg-danger col-sm-10'
          />
          <DateElement
            label='Date Of Death:'
            name='dod'
            dateFormat={dateFormat}
            value={this.state.formData.dod}
            onUserInput={this.setFormData}
            disabled={disabled}
            required={true}
          />
          {updateButton}
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    let dod = this.state.formData.dod ?
      this.state.formData.dod : null;
    let dob = this.state.data.dob ?
      this.state.data.dob : null;

    if (dod > today) {
      swal.fire({
        title: 'Invalid date',
        text: 'Date of death cannot be later than today!',
        type: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (dob > dod) {
      swal.fire({
        title: 'Invalid date',
        text: 'Date of death must be after date of birth!',
        type: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Set form data and upload the media file
    let formData = this.state.formData;
    let formObject = new FormData();
    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (formData[key] !== '') {
          formObject.append(key, formData[key]);
        }
      }
    }

    formObject.append('tab', this.props.tabName);

    fetch(this.props.action, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    }
    ).then((resp) => resp.text()
    ).then((result) => {
      swal.fire({
            title: 'Success!',
            text: 'Date of death updated!',
            type: 'success',
            confirmButtonText: 'OK',
      });
      if (result.value) {
        this.fetchData();
      }
    }).catch((error) => {
        console.error(error);
        swal.fire({
          title: 'Error!',
          text: 'Something went wrong.',
          type: 'error',
          confirmButtonText: 'OK',
        });
      });
  }
}
CandidateDOD.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  action: PropTypes.string,
};
export default CandidateDOD;
