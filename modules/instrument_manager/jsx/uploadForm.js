import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {FileElement} from 'jsx/Form';
import {SelectElement} from '../../../jsx/Form';

/**
 * Instrument Upload Form component
 */
class InstrumentUploadForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null,
      selectedInstrument: '',
    };

    this.instrumentFileSelected = this.instrumentFileSelected.bind(this);
    this.uploadInstrument = this.uploadInstrument.bind(this);
    this.getInstrumentOptions = this.getInstrumentOptions.bind(this);
  }

  /**
   * Update selectedFile on file selection
   *
   * @param {string} element - Element name
   * @param {string} file
   */
  instrumentFileSelected(element, file) {
    this.setState({
      selectedFile: file,
    });
  }

  /**
   * Upload instrument
   */
  uploadInstrument() {
    const data = new FormData();
    data.append('install_file', this.state.selectedFile);

    fetch(this.props.action, {
      method: 'POST',
      credentials: 'same-origin',
      body: data,
    })
      .then((resp) => {
        if (resp.status == 201) {
          swal.fire({
            title: 'Installation Successful!',
            type: 'success',
          }).then(function() {
            window.location.assign(loris.BaseURL + '/instrument_manager/');
          });
        }
        return resp.json();
      })
      .then((data) => {
        if (data.message) {
          swal.fire({
            title: 'Upload Successful!',
            type: 'success',
            text: data.message,
          }).then(function() {
            window.location.assign(loris.BaseURL + '/instrument_manager/');
          });
        }
        if (data.error) {
          swal.fire({
            title: 'An error occurred',
            type: 'error',
            text: data.error,
          });
        }
      })
      .catch((error) => {
        this.setState({error: true});
      });
  }

  getInstrumentOptions() {
    const instruments = {};
    if (this.props.data) {
      this.props.data.Data.map((instrument) => {
        const instrumentName = instrument[0];
        instruments[instrumentName] = instrumentName;
      });
    }
    return instruments;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const disabled = () => this.state.selectedFile === null;
    const instrumentSelected = this.state.selectedInstrument !== '';

    return (
      <>
        <div className="row">
          <div className="col-xs-4">
            <UploadPanel
              title={'Upload Instrument'}
            >
              <FileElement
                name='install_file'
                label='Instrument file'
                onUserInput={this.instrumentFileSelected}
                value={this.state.selectedFile}
              />
              <button
                className="btn btn-default"
                onClick={this.upload}
                disabled={disabled()}
              >
                Install
              </button>
            </UploadPanel>
          </div>
        {/* </div> */}
        {/* <div className="row"> */}
          <div className="col-xs-4">
            <UploadPanel
              title={'Upload Instrument Data'}
            >
              <div className="row">
                <SelectElement
                  name={'select_instrument'}
                  options={this.getInstrumentOptions()}
                  label={'Select Instrument'}
                  value={this.state.selectedInstrument}
                  onUserInput={(e, value) => this.setState({
                    ...this.state,
                    selectedInstrument: value,
                  })}
                  emptyOption={true}
                  sortByValue={true}
                />
              </div>
              <div className="row">
                <FileElement
                  name='install_data_file'
                  label='Instrument Data File (.csv)'
                  onUserInput={this.instrumentFileSelected}
                  value={this.state.selectedFile}
                />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button
                  className="btn btn-default"
                  onClick={() => {}}
                  disabled={!instrumentSelected}
                >
                  Upload Data
                </button>
                <a
                  className="btn btn-default"
                  disabled={!instrumentSelected}
                  href={`${this.props.action}?instrument=${this.state.selectedInstrument}`}
                >
                    Download Expected Template
                </a>
              </div>
            </UploadPanel>
          </div>
        </div>
      </>
    );
  }
}

InstrumentUploadForm.propTypes = {
  action: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
export default InstrumentUploadForm;

/**
 * Create a componenet to select permissions from a list of available
 * permissions.
 *
 * @param {object} props - react props
 * @return {JSX.Element}
 */
function UploadPanel(props) {
  const children = React.Children.toArray(props.children);
  return <div className="panel panel-primary">
    <div className="panel-heading">
      {props.title}
    </div>
    <div className="panel-body">
      <div className="col-xs-12">
        {children}
      </div>
    </div>
  </div>;
}

UploadPanel.propTypes = {
  children: PropTypes.array,
  title: PropTypes.string,
};


