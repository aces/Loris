import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'jsx/Modal';
import Papa from 'papaparse';

class ModalUploadCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      csvData: [],
      csvType: 'PSCID'
    };
    this.handleCandidateType = this.handleCandidateType.bind(this);
    this.submitCandidateData = this.submitCandidateData.bind(this);
    this.getFileCSV = this.getFileCSV.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  /**
   * Store the value of the element in this.state.upload.formData
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

  updateData(result) {
    const data = result.data;
    console.log(data);
    this.setState({csvData: data});
  }

  handleCandidateType(formElement, value) {
    const state = Object.assign({}, this.state);
    state.csvType = value;
    console.log(value);
    this.setState(state);
  }

  submitCandidateData() {
    console.log('submitCandidateData called');
    const type = this.state.csvType;
    const data = this.state.csvData;
    if (this.state.csvData.length > 0) {
      console.log('yay');
      this.props.defineCSVCandidates(type, data);
    }
  }

  render() {
    return (
      <Modal
        title='Import Candidates from CSV'
        show={this.props.showModalCSV}
        onClose={this.props.closeModalCSV}>
        <div className='row' style={{padding: '0 20px 0 20px'}}>
          <FileElement
            name='file'
            id='uploadCSV'
            onUserInput={this.getFileCSV}
            ref='file'
            label='CSV file'
            required={true}
            value={this.state.csv}
          />
          <RadioElement
            name={'csvTypeRadio'}
            label={'Candidate Type (PSCID or DCCID)'}
            options={{
              PSCID: 'PSCID',
              CandID: 'DCCID',
            }}
            checked={this.state.csvType}
            required={true}
            onUserInput={this.handleCandidateType}
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

ModalUploadCSV.propTypes = {
  showModalCSV: PropTypes.bool,
  closeModalCSV: PropTypes.func,
  defineCSVCandidates: PropTypes.func,
};

export default ModalUploadCSV;
