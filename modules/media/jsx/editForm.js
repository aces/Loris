/* exported RMediaEditForm */

/**
 * Media Edit Form
 *
 * Fetches data corresponding to a given file from Loris backend and
 * displays a form allowing meta information of the media file
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

class MediaEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      uploadResult: null,
      isLoaded: false,
      loadedData: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
  }

  componentDidMount() {
    let self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        let formData = {
          idMediaFile: data.mediaData.id,
          forSite: data.mediaData.forSite,
          dateTaken: data.mediaData.dateTaken,
          comments: data.mediaData.comments,
          hideFile: data.mediaData.hideFile,
        };

        self.setState({
          Data: data,
          isLoaded: true,
          mediaData: data.mediaData,
          formData: formData,
        });
      },
      error: function(error, errorCode, errorMsg) {
        console.error(error, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!',
        });
      },
    });
  }

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
      return (
        <button className='btn-info has-spinner'>
          Loading
          <span
            className='glyphicon glyphicon-refresh glyphicon-refresh-animate'>
          </span>
        </button>
      );
    }

    return (
      <div>
        <FormElement
          name='mediaEdit'
          onSubmit={this.handleSubmit}
          ref='form'
        >
          <SelectElement
            name='pscid'
            label='PSCID'
            options={this.state.Data.candidates}
            onUserInput={this.setFormData}
            ref='pscid'
            required={true}
            disabled={true}
            value={this.state.mediaData.pscid}
          />
          <SelectElement
            name='visitLabel'
            label='Visit Label'
            options={this.state.Data.visits}
            onUserInput={this.setFormData}
            ref='visitLabel'
            required={true}
            disabled={true}
            value={this.state.mediaData.visitLabel}
          />
          <SelectElement
            name='forSite'
            label='Site'
            options={this.state.Data.sites}
            onUserInput={this.setFormData}
            ref='forSite'
            disabled={true}
            value={this.state.mediaData.forSite}
          />
          <SelectElement
            name='instrument'
            label='Instrument'
            options={this.state.Data.instruments}
            onUserInput={this.setFormData}
            ref='instrument'
            disabled={true}
            value={this.state.mediaData.instrument}
          />
          <DateElement
            name='dateTaken'
            label='Date of Administration'
            minYear={this.state.Data.startYear}
            maxYear={this.state.Data.endYear}
            onUserInput={this.setFormData}
            ref='dateTaken'
            value={this.state.formData.dateTaken}
          />
          <TextareaElement
            name='comments'
            label='Comments'
            onUserInput={this.setFormData}
            ref='comments'
            value={this.state.formData.comments}
          />
          <FileElement
            name='file'
            id='mediaEditEl'
            onUserInput={this.setFormData}
            required={true}
            disabled={true}
            ref='file'
            label='Uploaded file'
            value={this.state.mediaData.fileName}
          />
          <SelectElement
            name='hideFile'
            label='Hide File'
            emptyOption={false}
            options={['No', 'Yes']}
            onUserInput={this.setFormData}
            ref='hideFile'
            value={this.state.formData.hideFile}
          />
          <ButtonElement label='Update File'/>
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    let self = this;
    let myFormData = this.state.formData;

    $('#mediaEditEl').hide();
    $('#file-progress').removeClass('hide');

    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: JSON.stringify(myFormData),
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            let progressbar = $('#progressbar');
            let progresslabel = $('#progresslabel');
            let percent = Math.round((evt.loaded / evt.total) * 100);
            $(progressbar).width(percent + '%');
            $(progresslabel).html(percent + '%');
            progressbar.attr('aria-valuenow', percent);
          }
        }, false);
        return xhr;
      },
      success: (data) => {
        $('#file-progress').addClass('hide');
        swal.fire('Upload Successful!', '', 'success');
        this.props.fetchData();
      },
      error: function(err) {
        let msg = err.responseJSON.message || 'Error updating file';
        swal.fire(msg, '', 'error');
        console.error(err);
      },
    });
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
}

MediaEditForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default MediaEditForm;
