import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CandidateDOD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      formData: {},
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };
    this.setFormData = this.setFormData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  componentDidMount() {
    let that = this;
    $.ajax(
      this.props.dataURL,
      {
        dataType: 'json',
        success: function(data) {
          let formData = {
            dod: data.dod,
          };

          // Add parameter values to formData
          Object.assign(formData, data.parameter_values);

          that.setState({
            Data: data,
            isLoaded: true,
            formData: formData,
          });
        },
        error: function(data, errorCode, errorMsg) {
          that.setState({
            error: 'An error occurred when loading the form!',
          });
        },
      }
    );
  }

  setFormData(formElement, value) {
    let formData = JSON.parse(JSON.stringify(this.state.formData));
    formData[formElement] = value;

    this.setState({
      formData: formData,
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    if (!this.state.isLoaded) {
      if (this.state.error !== undefined) {
        return (
          <div className='alert alert-danger text-center'>
            <strong>
              {this.state.error}
            </strong>
          </div>
        );
      }

      return (
        <button className='btn-info has-spinner'>
          Loading
          <span
            className='glyphicon glyphicon-refresh glyphicon-refresh-animate'>
          </span>
        </button>
      );
    }

    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit') &&
      loris.userHasPermission('candidate_dod_edit')) {
      disabled = false;
      updateButton = <ButtonElement label="Update"/>;
    }

    let alertMessage = '';
    let alertClass = 'alert text-center hide';
    if (this.state.updateResult) {
      if (this.state.updateResult === 'success') {
        alertClass = 'alert alert-success text-center';
        alertMessage = 'Update Successful!';
      } else if (this.state.updateResult === 'error') {
        let errorMessage = this.state.errorMessage;
        alertClass = 'alert alert-danger text-center';
        alertMessage = errorMessage ? errorMessage : 'Failed to update!';
      }
    }

    return (
      <div className='row'>
        <div className={alertClass} role='alert' ref='alert-message'>
          {alertMessage}
        </div>
        <FormElement
          name='candidateDOD'
          onSubmit={this.handleSubmit}
          ref='form'
          className='col-md-6'>
          <StaticElement
            label='PSCID'
            text={this.state.Data.pscid}
          />
          <StaticElement
            label='DCCID'
            text={this.state.Data.candID}
          />
          <StaticElement
            label='Disclaimer:'
            text='Any changes to the date of death requires an
            administrator to run the fix_candidate_age script.'
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
      swal('Error!', 'Date of death cannot be later than today!', 'error');
      return;
    }

    if (dob > dod) {
      swal('Error!', 'Date of death must be after date of birth!', 'error');
      return;
    }

    // Set form data and upload the media file
    let self = this;
    let formData = new FormData();
    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key]) {
          formData.append(key, myFormData[key]);
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
          swal('Success!', 'Date of birth updated.', 'success').then((result) => {
            if (result.value) {
              this.fetchData();
            }
          );
          self.showAlertMessage();
        },
        error: function(err) {
          if (err.responseText !== '') {
            let errorMessage = JSON.parse(err.responseText).message;
            self.setState(
              {
                updateResult: 'error',
                errorMessage: errorMessage,
              }
            );
            self.showAlertMessage();
          }
        },
      }
    );
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    let self = this;
    if (this.refs['alert-message'] === null) {
      return;
    }

    let alertMsg = this.refs['alert-message'];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
      500,
      function() {
        self.setState(
          {
            updateResult: null,
          }
        );
      }
    );
  }
}
CandidateDOD.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  action: PropTypes.string,
};
export default CandidateDOD;
