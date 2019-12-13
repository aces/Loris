import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'jsx/Modal';

class ModalUploadCSV extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Modal
                    title='Define Candidates by Uploading CSV'
                    show={this.props.showModalCSV}
                    onClose={this.props.closeModalCSV}
                >
                    <div className={'row'}>
                        <ButtonElement
                            label='PSCID'
                            removeRow={true}
                            buttonStyle={{
                                width: '100%'
                            }}
                            columnSize='col-xs-6'
                            onUserInput={() => this.props.defineCSVCandidates('PSCID')}
                        />
                        <ButtonElement
                            label='DCCID'
                            removeRow={true}
                            buttonStyle={{
                                width: '100%'
                            }}
                            columnSize='col-xs-6'
                            onUserInput={() => this.props.defineCSVCandidates('DCCID')}
                        />
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
ModalUploadCSV.propTypes = {
    showModalCSV: PropTypes.bool,
    closeModalCSV: PropTypes.func,
    defineCSVCandidates: PropTypes.func,
};

export default ModalUploadCSV;
