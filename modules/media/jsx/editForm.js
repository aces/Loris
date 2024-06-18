/* exported RMediaEditForm */

/**
 * Media Edit Form
 *
 * Fetches data corresponding to a given file from Loris backend and
 * displays a form allowing meta information of the media file
 *
 * @author Alex Ilea
 * @version 1.0.0
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {
    FormElement,
    TextareaElement,
    SelectElement,
    DateElement,
    FileElement,
    ButtonElement,
} from 'jsx/Form';
/**
 * Media Edit Form component
 */
class MediaEditForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
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

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    fetch(this.props.DataURL, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        this.setState({
          error: 'An error occurred when loading the form!',
        });
        return;
      }

      response.json().then((data) => {
        let formData = {
          idMediaFile: data.mediaData.id,
          dateTaken: data.mediaData.dateTaken,
          comments: data.mediaData.comments,
          hideFile: data.mediaData.hideFile,
          language: data.mediaData.language,
        };

        this.setState({
          Data: data,
          isLoaded: true,
          mediaData: data.mediaData,
          formData: formData,
        });
      });
    }).catch((error) => {
      console.error(error);
      this.setState({
        error: 'An error occurred when loading the form!',
      });
    });
  }

  /**
   * Renders the React component.
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
          <SelectElement
            name='language'
            id='language_id'
            label='Language'
            options={this.state.Data.language}
            onUserInput={this.setFormData}
            value={this.state.formData.language}
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
          <ButtonElement
            label='Update File'
            onUserInput = {() => {}}
          />
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

    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (xhr.status < 400) {
        swal.fire('Upload Successful!', '', 'success');
        this.props.fetchData();
      } else {
        console.error(xhr.status + ': ' + xhr.statusText);
        let msg = 'Error updating file';
        if (xhr.response) {
          const resp = JSON.parse(xhr.response);
          if (resp.message) {
            msg = resp.message;
          }
        }
        console.error(msg);
        swal.fire(msg, '', 'error');
      }
    }, false);

    xhr.addEventListener('error', () => {
      console.error(xhr.status + ': ' + xhr.statusText);
      let msg = xhr.response.message || 'Error updating file';
      console.error(msg);
      swal.fire(msg, '', 'error');
    }, false);

    xhr.open('POST', this.props.action);
    xhr.send(JSON.stringify(this.state.formData));
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
  fetchData: PropTypes.func,
};

export default MediaEditForm;
