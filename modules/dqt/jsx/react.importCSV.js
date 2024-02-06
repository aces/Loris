/**
 *  The following file handles importing CSV file of either PSCID or DCCID identifiers.
 *  Used for populating the filter of the DQT and to filter out the demographic from the identifiers.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'jsx/Modal';
import Papa from 'papaparse';
import {
    FileElement,
    RadioElement,
    ButtonElement,
} from 'jsx/Form';
/**
 * Import CSV Modal Component
 *
 * The following component displays a modal for extracting
 * PSCID or DCCID identifiers from a CSV file.
 */
class ModalImportCSV extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      csvData: [],
      csvType: 'PSCID',
      csvOperator: 'OR',
    };
    this.submitCandidateData = this.submitCandidateData.bind(this);
    this.handleRadioPress = this.handleRadioPress.bind(this);
    this.getFileCSV = this.getFileCSV.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  /**
   * Store the value of the element in this.state.file
   * Uses papaparse to extract CSV file and data is stored
   * in this.state.csvData of the state.
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  getFileCSV(formElement, value) {
    this.setState({file: value});
    Papa.parse(value, {
      skipEmptyLines: true,
      complete: this.updateData,
    });
  }

  /**
   * The getFileCSV function calls this function when
   * parsing of the CSV file is complete and we store
   * the results in this.state.csvData of the state.
   *
   * @param {object} result - the CSV file data.
   */
  updateData(result) {
    this.setState({csvData: result.data});
  }

  /**
   * Store the value of the element in this.state[formElement].
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  handleRadioPress(formElement, value) {
    const state = Object.assign({}, this.state);
    state[formElement] = value;
    this.setState(state);
  }

  /**
   * The submitCandidateData function is called
   * after the user completes the importing of the
   * CSV file and toggling whether PSCID or DCCID
   * and clicking the submit button.
   *
   */
  submitCandidateData() {
    const type = this.state.csvType;
    const operator = this.state.csvOperator === 'OR' ? 1 : 0;
    const data = this.state.csvData;
    if (this.state.csvData.length > 0) {
      this.props.defineCSVCandidates(type, operator, data);
    }
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <Modal
        title='Import Candidates from CSV'
        show={this.props.showModalCSV}
        onClose={this.props.closeModalCSV}>
        <div className='row' style={{padding: '0 20px 0 20px'}}>
          <FileElement
            name='file'
            id='importCSV'
            onUserInput={this.getFileCSV}
            ref='file'
            label='CSV file'
            required={true}
            value={this.state.file}
          />
          <div style={{paddingBottom: '10px'}}>
            <b>Note:</b>&nbsp;The CSV format should be one column of either
            &nbsp;PSCID or CandID identifiers.
          </div>
          <RadioElement
            name={'csvType'}
            label={'Candidate Type (PSCID or DCCID)'}
            options={{
              PSCID: 'PSCID',
              CandID: 'DCCID',
            }}
            checked={this.state.csvType}
            required={true}
            onUserInput={this.handleRadioPress}
          />
          <RadioElement
            name={'csvOperator'}
            label={'Filter (AND or OR) Operator'}
            options={{
              AND: 'AND',
              OR: 'OR',
            }}
            checked={this.state.csvOperator}
            required={true}
            onUserInput={this.handleRadioPress}
          />
          <ButtonElement
            label='Submit'
            type='submission'
            onUserInput={this.submitCandidateData}
          />
        </div>
      </Modal>
    );
  }
}

ModalImportCSV.propTypes = {
  showModalCSV: PropTypes.bool,
  closeModalCSV: PropTypes.func,
  defineCSVCandidates: PropTypes.func,
};

export default ModalImportCSV;
