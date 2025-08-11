import React, {Component} from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {FileElement, RadioElement} from 'jsx/Form';
import InputLabel from 'jsx/form/InputLabel';

/**
 * Instrument Upload Form component
 */
class InstrumentDataUploadModal extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.containerID = 'upload-data-form-container';
    this.isMultiInstrument = this.props.instrumentList.length > 1;
    this.state = {
      selectedDataFile: null,
      selectedInstruments: this.isMultiInstrument
        ? []
        : this.props.instrumentList,
      createParticipants: null,
    };

    this.dataFileSelected = this.dataFileSelected.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.displayResponse = this.displayResponse.bind(this);
  }

  /**
   * Update selectedDataFile on file selection
   * @param {string} element - Element name
   * @param {string} file
   */
  dataFileSelected(element, file) {
    this.props.setSelectedDataFile(file);
    this.setState({
      selectedDataFile: file,
    });
  }


  /**
   * Update selectedDataFile on file selection
   * @param {string} element - Element name
   * @param {string} file
   * @param option
   */
  handleRadioChange(element, option) {
    this.props.setAction(option);
    this.setState({
      createParticipants: option,
    });
  }

  /**
   * Display upload response
   * @param data    Response data
   */
  displayResponse = (data) => {
    if (data.success) {
      swal.fire({
        title: 'Upload Successful!',
        type: 'success',
        text: data.message,
      });
    } else {
      let message = '<div style="overflow-y: scroll; max-height: 50vh;">';
      if (Array.isArray(data.message)) {
        message += `<br/># Errors: ${data.message.length}<br/><br/>`;
        data.message.forEach((error) => {
          message += (JSON.stringify(error) + '<br/>');
        });
      } else {
        message += data.message;
      }
      message += '</div>';
      throw new Error(message);
    }
  }

  /**
   * Renders the React component.
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div id={this.containerID}>
        <div
          className="row"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <div className='col-sm-11'>
            <FileElement
              name={'instrument_data_file'}
              label={
                'Upload csv file for ' + ((
                  !this.isMultiInstrument ||
                  this.state.selectedInstruments.length === 1
                )
                  ? `${this.state.selectedInstruments[0]?.value ?? this.state.selectedInstruments[0]}`
                  : 'targeted instruments'
                )
              }
              onUserInput={this.dataFileSelected}
              value={this.state.selectedDataFile}
              required={true}
            />
          </div>
        </div>

         {
          this.isMultiInstrument && (
            <div
              className="row"
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div className='col-sm-11'>
                <div className="row form-group">
                  <InputLabel
                    label={'Targeted instruments'}
                    required={this.isMultiInstrument}
                  />
                  <Select
                    id={'select-instruments'}
                    className={'col-sm-9'}
                    isMulti={true}
                    options={this.props.instrumentList.map(i => { return {value: i, label: i}; })}
                    value={this.state.selectedInstruments}
                    onChange={(newList) => {
                      this.setState({
                        selectedInstruments: newList,
                      }, () => {
                        this.props.setSelectedInstruments(this.state.selectedInstruments)
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )
         }

        <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
          <div className='col-sm-11'>
            <RadioElement
              name={'create_participants'}
              label={'Participant validation'}
              options={{
                VALIDATE_SESSIONS: 'All participants and visits exist',
                CREATE_SESSIONS: 'Some participants or visits may not exist',
              }}
              checked={this.state.createParticipants}
              onUserInput={this.handleRadioChange}
              verticalOptions={false}
              noWrap={true}
              required={true}
            />
          </div>
        </div>


        <div style={{display: 'flex', justifyContent: 'center'}}>
          <a
            className={`btn btn-default${this.state.createParticipants === null
              ? ' disabled'
              : ''
            }`}
            href={
              loris.BaseURL.concat('/instrument_manager/instrument_data/?') + (
                (
                  !this.isMultiInstrument ||
                  this.state.selectedInstruments.length === 1
                )
                  ? `instrument=${
                  this.state.selectedInstruments[0].value
                    ?? this.state.selectedInstruments[0]
                }`
                  : this.state.selectedInstruments.map(
                    (instrumentName) => `instruments[]=${instrumentName.value}`
                  ).join('&') // TODO: Reconsider (max URL length)
              ) +
              `&action=${this.state.createParticipants}`
            }
            target={'_blank'}
          >
            <span className="glyphicon glyphicon-download-alt"></span>
            &nbsp;Download Expected Template
          </a>
        </div>
      </div>
    );
  }
}

InstrumentDataUploadModal.defaultProps = {
  instrumentList: [],
};

InstrumentDataUploadModal.propTypes = {
  instrumentList: PropTypes.array.isRequired,
  setSelectedDataFile: PropTypes.func,
  setAction: PropTypes.func,
  setSelectedInstruments: PropTypes.func,
};

export default InstrumentDataUploadModal;
