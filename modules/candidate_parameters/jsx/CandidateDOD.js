import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import 'I18nSetup';
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
    const {t} = this.props;
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.', {ns: 'loris'})}</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    let dateFormat = this.state.data.dodFormat;
    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_dod_edit')) {
      disabled = false;
      updateButton = <ButtonElement label={t('Update', {ns: 'loris'})}/>;
    }

    return (
      <div className='row'>
        <FormElement
          name='candidateDOD'
          onSubmit={this.handleSubmit}
          ref='form'
          class='col-md-6'>
          <StaticElement
            label={t('PSCID', {ns: 'loris'})}
            text={this.state.data.pscid}
          />
          <StaticElement
            label={t('DCCID', {ns: 'loris'})}
            text={this.state.data.candID}
          />
          <StaticElement
            label={t('Disclaimer:', {ns: 'candidate_parameters'})}
            text={t('Any changes to the date of death requires an administrator '
                 + 'to run the fix_candidate_age script.', {ns: 'candidate_parameters'})}
            class='form-control-static text-danger bg-danger col-sm-10'
          />
          <DateElement
            label={t('Date Of Death:', {ns: 'candidate_parameters'})}
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
    const {t} = this.props;
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
        title: t('Invalid date', {ns: 'candidate_parameters'}),
        text: t('Date of death cannot be later than today!', {ns: 'candidate_parameters'}),
        type: 'error',
        confirmButtonText: t('OK', {ns: 'loris'}),
      });
      return;
    }

    if (dob > dod) {
      swal.fire({
        title: t('Invalid date', {ns: 'candidate_parameters'}),
        text: t('Date of death must be after date of birth!', {ns: 'candidate_parameters'}),
        type: 'error',
        confirmButtonText: t('OK', {ns: 'loris'}),
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
        title: t('Success!', {ns: 'loris'}),
        text: t('Date of death updated!', {ns: 'candidate_parameters'}),
        type: 'success',
        confirmButtonText: t('OK', {ns: 'loris'}),
      });
      if (result.value) {
        this.fetchData();
      }
    }).catch((error) => {
      console.error(error);
      swal.fire({
        title: t('Error!', {ns: 'loris'}),
        text: t('Something went wrong.', {ns: 'candidate_parameters'}),
        type: 'error',
        confirmButtonText: t('OK', {ns: 'loris'}),
      });
    });
  }
}
CandidateDOD.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  action: PropTypes.string,
};
export default withTranslation(['candidate_parameters', 'loris'])(CandidateDOD);
