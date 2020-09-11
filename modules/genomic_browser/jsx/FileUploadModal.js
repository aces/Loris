/* exported  GenomicFileUploadModal, RGenomicFileUploadModal, UploadForm,
             FileTypeSelect, FileInput, TextAreaInput,
             CheckboxInput, ProgressBar
*/

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Genomic file upload modal component
 */
class GenomicFileUploadModal extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      readyForUpload: false,
      submited: false,
      uploadSummary: {},
    };
    this.validateForm = this.validateForm.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
    this.handleUploadSubmit = this.handleUploadSubmit.bind(this);
  }

  /**
   * Is invoked by React before rendering when new props or state are being received.
   * This method is not called for the initial render or when forceUpdate() is used.
   * @param {object} nextProps
   * @param {object} nextState
   * @return {boolean} - If true, re-render the component
   */
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.readyForUpload !== this.state.readyForUpload ||
               nextState.submited !== this.state.submited ||
               nextProps.id !== this.props.id;
  }

  /**
   * Validate form
   * @param {array} requiredInputs
   */
  validateForm(requiredInputs) {
    // this is always returning true... for now
    requiredInputs = requiredInputs || [];
    this.setState({
      readyForUpload: requiredInputs.reduce(
        function(previousValue, currentValue, currentIndex, array) {
          return previousValue;
        }, true),
    });
  }

  /**
   * Reload page
   */
  reloadPage() {
    $('#modalContainer').modal('hide');
    $('#showdata').click();
  }

  /**
   * Handle upload submit
   * @param {object} event
   */
  handleUploadSubmit(event) {
    event.preventDefault();
    let self = this;
    let formData = new FormData(document.getElementById('uploadForm'));

    let xhr = new XMLHttpRequest();
    xhr.previousText = '';
    xhr.onerror = function() {
      console.error('[XHR] Fatal Error.');
    };
    xhr.onreadystatechange = function() {
      let bar = document.getElementById('progressBar');
      try {
        switch (xhr.readyState) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:

            let newResponse = xhr.responseText.substring(
              xhr.previousText.length
            );
            let result = JSON.parse(newResponse);
            bar.innerHTML = String(result.message);
            bar.style.width = result.progress + '%';
            if (result.error !== undefined) {
              bar.className = 'progress-bar progress-bar-danger';
            }

            xhr.previousText = xhr.responseText;
            break;
          case 4:
            self.setState({submited: true});
            break;
          default:
            break;
        }
      } catch (e) {
        console.error('[XHR STATECHANGE] Exception: ' + e);
        bar.innerHTML = 'An error occurred';
        bar.className = 'progress-bcar progress-bar-danger';
        bar.style.width = '100%';
      }
    };
    let url = this.props.baseURL
              + '/genomic_browser/ajax/genomic_file_upload.php';
    xhr.open('POST', url, true);
    xhr.send(formData);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let footerButtons = [];

    if (this.state.submited) {
      footerButtons.push(
        <button
          key="submited"
          className="btn btn-default"
          onClick={this.reloadPage}
          data-dismiss="modal"
        >
          Ok
        </button>);
    } else {
      if (this.state.readyForUpload) {
        footerButtons.push(
          <button
            key="readyForUpload"
            className="btn btn-primary"
            onClick={this.handleUploadSubmit}
            role="button"
            aria-disabled="false"
          >
            Upload
          </button>);
      }

      footerButtons.push(
        <button
          key="cancel"
          className="btn btn-default"
          id="cancelButton"
          role="reset"
          type="reset"
          data-dismiss="modal"
        >
          Cancel
        </button>);
    }
    return (
            <div
              className="modal fade"
              id="fileUploadModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="myModalLabel"
              aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                            >
                              <span aria-hidden="true">&times;</span>
                              <span className="sr-only">Close</span>
                            </button>
                            <h3 className="modal-title" id="myModalLabel">
                              Upload File
                            </h3>
                        </div>
                        <div className="modal-body">
                            <UploadForm
                              baseURL={this.props.baseURL}
                              validate={this.validateForm}
                            />
                        </div>
                        <div className="modal-footer">
                            {footerButtons}
                        </div>
                    </div>
                </div>
            </div>
        );
  }
}
GenomicFileUploadModal.propTypes = {
  baseURL: PropTypes.string.isRequired,
};

let RGenomicFileUploadModal = React.createFactory(GenomicFileUploadModal);


/**
 * Upload form component
 */
class UploadForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      baseURL: '',
      fileType: '',
      useColumnHeaders: true, // Change this to false when we are ready to use Mapping files
    };
    this.handleFileTypeChange = this.handleFileTypeChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  /**
   * Handle file type change
   * @param {*} event
   */
  handleFileTypeChange(event) {
    event.preventDefault();
    this.setState({fileType: event.target.value});
  }

  /**
   * Handle checkbox change
   * @param {*} event
   */
  handleCheckboxChange(event) {
    if (event.target.name === 'pscidColumn') {
      this.setState({useColumnHeaders: !this.state.useColumnHeaders});
    }
  }

  /**
   * Called by React every time a re-render is required
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentWillUpdate(prevProps, prevState) {
    this.props.validate();
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let instructions = [];
    let inputs = [];

    inputs.push(
      <FileTypeSelect
        key="fileType"
        baseURL={this.props.baseURL}
        multiple={false}
        onFileTypeChange={this.handleFileTypeChange}
        name="fileType"
        label="File type:"
      />
    );

    switch (this.state.fileType) {
      case 'Methylation beta-values':
        inputs.push(<FileInput key="fileData" name="fileData" label="File :"/>);
        inputs.push(
          <TextAreaInput
            key="description"
            name="description"
            label="Description :"
          />
        );
        if (!this.state.useColumnHeaders) {
          inputs.push(
            <FileInput
              key="fileMapping"
              name="fileMapping"
              label="Mapping :"
            />
          );
        }
        inputs.push(
          <CheckboxInput
            key="pscidColumn"
            handleChange={this.handleCheckboxChange}
            checked={this.state.useColumnHeaders}
            name="pscidColumn"
          />
        );
        inputs.push(
          <ProgressBar
            key="progressbar"
            name="progressbar"
            label="Progress :"
          />
        );
        break;
      case 'Other':
        inputs.push(<FileInput key="fileData" name="fileData" label="File :"/>);
        inputs.push(
          <TextAreaInput
            key="description"
            name="description"
            label="Description :"
          />
        );
        inputs.push(
          <ProgressBar
            key="progressbar"
            name="progressbar"
            label="Progress :"
          />
        );
        break;
      default:
        // noop
    }

    return (
      <form
        name="uploadForm"
        id="uploadForm"
        encType="multipart/form-data"
        method="POST"
      >
          <div className="row">
              {instructions}
              {inputs}
          </div>
      </form>
    );
  }
}
UploadForm.defaultProps = {
  validate: null,
};
UploadForm.propTypes = {
  validate: PropTypes.func,
};


/**
 * File type select component
 */
class FileTypeSelect extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      availableFileType: [],
    };
    this.getGenomicFileType = this.getGenomicFileType.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.getGenomicFileType();
  }

  /**
   * Get genomic file type
   */
  getGenomicFileType() {
    let self = this;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      try {
        switch (xhr.readyState) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            xhr.previousText = xhr.responseText;
            break;
          case 4:
            let fileType = [{genomicFileType: ''}]
              .concat(
                JSON.parse(xhr.responseText)
              );
            self.setState({availableFileType: fileType});
            break;
          default:
            break;
        }
      } catch (e) {
        console.error('Exception: ' + e);
      }
    };
    let url = this.props.baseURL
              + '/AjaxHelper.php'
              + '?Module=genomic_browser'
              + '&script=get_genomic_file_type.php';
    xhr.open('POST', url, true);
    xhr.send();
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let options = this.state.availableFileType.map(function(e) {
      return (
        <option key={e.genomicFileType} value={e.genomicFileType}>
          {e.genomicFileType}
        </option>
      );
    });

    return (
            <div className="col-xs-12 form-group">
                <label htmlFor={this.props.name} className="col-xs-3">
                  {this.props.label}
                  <font color="red">
                    <sup> *</sup>
                  </font>
                </label>
                <div className="col-xs-9">
                    <select
                      name={this.props.name}
                      id={this.props.name}
                      className="form-fields form-control input-sm"
                      onChange={this.props.onFileTypeChange}
                    >
                      {options}
                    </select>
                </div>
            </div>
        );
  }
}
FileTypeSelect.propTypes = {
  baseURL: PropTypes.string,
  onFileTypeChange: PropTypes.func,
  getFileType: PropTypes.func,
};
FileTypeSelect.defaultProps = {
  baseURL: '',
  onFileTypeChange: null,
  getFileType: null,
};


/**
 * File input component
 */
class FileInput extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="col-xs-12 form-group">
          <label className="col-xs-3" htmlFor={this.props.name}>
            {this.props.label}
          </label>
          <div className="col-xs-9">
              <input
                type="file"
                name={this.props.name}
                id={this.props.name}
                onChange={this.handleChange}
                className="fileUpload"
              />
          </div>
      </div>
    );
  }
}
FileInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};


/**
 * Text area input component
 */
class TextAreaInput extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="col-xs-12 form-group">
          <label className="col-xs-3" htmlFor={this.props.name}>
            {this.props.label}
          </label>
          <div className="col-xs-9">
              <textarea
                cols="20"
                rows="3"
                name={this.props.name}
                onChange={this.handleChange}
                id={this.props.name}
                style={{border: '2px inset'}}
                className="ui-corner-all form-fields form-control input-sm"
              />
          </div>
      </div>
    );
  }
}
TextAreaInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};


/**
 * Checkbox input component
 */
class CheckboxInput extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked || false,
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
        // Add onClick={this.props.handleChange}  and checked={this.state.checked} when we support Mapping files
    return (
      <div className="form-group col-sm-12">
          <label className="col-xs-3"></label>
          <div className="col-xs-9">
              <input
                className="user-success"
                name={this.props.name}
                id={this.props.name}
                type="checkbox"
                defaultChecked="true"
                style={{marginRight: '1em'}}
              />
              Use PSCID in column headers
              {this.props.label}
          </div>
      </div>
    );
  }
}
CheckboxInput.propTypes = {
  name: PropTypes.string,
};


/**
 * ProgressBar component
 */
class ProgressBar extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="col-xs-12 form-group">
          <label className="col-xs-3" htmlFor={this.props.name}>
            {this.props.label}
          </label>
          <div className="col-xs-9">
              <div className="progress" style={{height: '20px'}}>
                  <div
                    className="progress-bar progress-bar-success"
                    id="progressBar"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
              </div>
          </div>
      </div>
    );
  }
}
ProgressBar.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};

window.GenomicFileUploadModal = GenomicFileUploadModal;
window.RGenomicFileUploadModal = RGenomicFileUploadModal;
window.UploadForm = UploadForm;
window.FileTypeSelect = FileTypeSelect;
window.FileInput = FileInput;
window.TextAreaInput = TextAreaInput;
window.CheckboxInput = CheckboxInput;
window.ProgressBar = ProgressBar;

export default {
  GenomicFileUploadModal,
  RGenomicFileUploadModal,
  UploadForm,
  FileTypeSelect,
  FileInput,
  TextAreaInput,
  CheckboxInput,
  ProgressBar,
};
