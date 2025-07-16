import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {FileElement} from 'jsx/Form';
import {RadioElement} from '../../../jsx/Form';

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
      submitted: false,
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
    this.setState({
      selectedDataFile: file,
    });
    this.props.setSelectedDataFile(file);
  }


  /**
   * Update selectedDataFile on file selection
   * @param {string} element - Element name
   * @param {string} file
   * @param option
   */
  handleRadioChange(element, option) {
    this.setState({
      createParticipants: option,
    });
    this.props.setAction(option);
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
    // console.log('multi: ', this.isMultiInstrument);
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
                (
                  !this.isMultiInstrument ||
                  this.state.selectedInstruments.length === 1
                )
                  ? `Upload csv file for ${this.state.selectedInstruments[0]}`
                  : 'Upload csv file for any number of instruments'
              }
              onUserInput={this.dataFileSelected}
              value={this.state.selectedDataFile}
              required={true}
            />
          </div>
        </div>

        {/* {*/}
        {/*  this.isMultiInstrument && (*/}
        {/*    <div style={{display: 'flex', justifyContent: 'center'}}>*/}
        {/*      Select instruments*/}
        {/*    </div>*/}
        {/*  )*/}
        {/* }*/}

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <RadioElement
            name={'create_participants'}
            label={'Validation'}
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
                  ? `instrument=${this.state.selectedInstruments[0]}`
                  : this.state.selectedInstruments.map(
                    (instrumentName) => `instruments=${instrumentName}`
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


        {/* <div style={{display: 'flex', justifyContent: 'center'}}>*/}
        {/*  <button*/}
        {/*    className='btn btn-primary'*/}
        {/*    style={{marginTop: '5px'}}*/}
        {/*    disabled={*/}
        {/*      this.state.submitted ||*/}
        {/*      this.state.selectedDataFile === null ||*/}
        {/*      this.state.selectedInstruments.length === 0*/}
        {/*    }*/}
        {/*    onClick={() => {*/}
        {/*      // if (*/}
        {/*      //   this.state.selectedDataFile === null ||*/}
        {/*      //   this.state.selectedInstruments.length === 0*/}
        {/*      // ) {*/}
        {/*      //   e.preventDefault();*/}
        {/*      //   return;*/}
        {/*      // }*/}
        {/*      this.setState({*/}
        {/*        submitted: true*/}
        {/*      });*/}

        {/*      if (!this.isMultiInstrument || this.state.selectedInstruments.length === 1) {*/}
        {/*        this.uploadInstrumentData(this.state.selectedInstruments[0])*/}
        {/*          .then(() => {*/}
        {/*            // this.setState({*/}
        {/*            //   selectedDataFile: null,*/}
        {/*            // });*/}
        {/*            // document.getElementById(this.containerID).parentElement.remove();*/}
        {/*          })*/}
        {/*          .finally(() => {*/}
        {/*            this.setState({*/}
        {/*              submitted: false,*/}
        {/*            });*/}
        {/*            document.getElementById(this.containerID)*/}
        {/*              .parentElement.parentElement.parentElement.parentElement*/}
        {/*              .remove();*/}

        {/*          });*/}
        {/*      } else {*/}
        {/*        console.error('Multi instrument not yet implemented');*/}
        {/*      }*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Submit*/}
        {/*  </button>*/}
        {/* </div>*/}
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
};

export default InstrumentDataUploadModal;
