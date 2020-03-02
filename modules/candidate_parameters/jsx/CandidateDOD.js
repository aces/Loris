import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';

class CandidateDOD extends Component {
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

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data: data, formData: data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  render() {
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader/>;
    }

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
      swal({
        title: 'Invalid date',
        text: 'Date of death cannot be later than today!',
        type: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (dob > dod) {
      swal({
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
      swal({
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
        swal({
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
