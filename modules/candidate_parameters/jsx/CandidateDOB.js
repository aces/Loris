import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';

class CandidateDOB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      formData: {
        dob: null,
      },
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
    if (loris.userHasPermission('candidate_dob_edit')) {
        disabled = false;
        updateButton = <ButtonElement label='Update' />;
    }
    return (
      <div className='row'>
        <FormElement
          name='candidateDOB'
          onSubmit={this.handleSubmit}
          ref='form'
          class='col-md-6'
        >
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
            text={'Any changes to the date of birth requires an administrator '
                 + 'to run the fix_candidate_age script.'}
            class='form-control-static text-danger bg-danger col-sm-10'
          />
          <DateElement
            label='Date Of Birth:'
            name='dob'
            value={this.state.formData.dob}
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

    let dob = this.state.formData.dob ?
      this.state.formData.dob : null;
    if (dob > today) {
      swal({
        title: 'Error!',
        text: 'Date of birth cannot be later than today!',
        type: 'error',
        confrimButtonText: 'OK',
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
    })
    .then((resp) => {
        if (resp.ok && resp.status === 200) {
          swal({
            title: 'Success!',
            text: 'Date of birth updated!',
            type: 'success',
            confrimButtonText: 'OK',
          });
          if (result.value) {
              this.fetchData();
          }
        } else {
          swal({
            title: 'Error!',
            text: 'Something went wrong.',
            type: 'error',
            confrimButtonText: 'OK',
          });
        }
    })
    .catch((error) => {
        console.error(error);
    });
  }
}
CandidateDOB.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  action: PropTypes.string,
};
export default CandidateDOB;
