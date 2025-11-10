import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  TextboxElement,
  DateElement,
} from 'jsx/Form';
import Modal from 'Modal';
import LifeCycle from './lifeCycle.js';
import SpecimenForm from './specimenForm.js';
import {clone} from './helpers.js';

import Swal from 'sweetalert2';

/**
 * React component to display a header.
 */
class Header extends Component {
  /**
   * Render react component
   *
   * @return {JSX}
   */
  render() {
    const {options, container, specimen, editable, current} = this.props;
    const updateContainer = () =>
      Promise.resolve(
        this.props.updateContainer(current.container)
      );

    const status = options.container.stati[container.statusId].label;
    const renderActionButton = () => {
      if (status == 'Available'
                && specimen.quantity > 0
                && !specimen.poolId
      ) {
        const openAliquotForm = () => this.props.edit('aliquotForm');
        return (
          <div className='action-button add' onClick={openAliquotForm}>
                +
          </div>
        );
      } else {
        return <div className='action-button disabled'>+</div>;
      }
    };
    const addAliquotForm = () => {
      if (specimen && loris.userHasPermission('biobank_specimen_create')) {
        return (
          <div>
            <div className='action' title='Make Aliquots'>
              {renderActionButton()}
            </div>
            <SpecimenForm
              title='Add Aliquots'
              parent={[{specimen: specimen, container: container}]}
              options={this.props.options}
              data={this.props.data}
              current={this.props.current}
              increaseCoordinate={this.props.increaseCoordinate}
              show={editable.aliquotForm}
              onClose={this.props.clearAll}
              setSpecimen={this.props.setSpecimen}
              onSubmit={this.props.createSpecimens}
            />
          </div>
        );
      }
    };

    const alterLotNumber = () => {
      if (loris.userHasPermission('biobank_specimen_alter')) {
        return (
          <div className='action' title='Alter Lot Number'>
            <span
              style={{color: 'grey'}}
              className='glyphicon glyphicon-pencil'
              onClick={() => {
                this.props.edit('lotForm');
                this.props.editContainer(this.props.container);
              }}
            />
          </div>
        );
      }
    };

    const alterExpirationDate = () => {
      if (loris.userHasPermission('biobank_specimen_alter')) {
        return (
          <div className='action' title='Alter Expiration Date'>
            <span
              style={{color: 'grey'}}
              className='glyphicon glyphicon-pencil'
              onClick={() => {
                this.props.edit('expirationForm');
                this.props.editContainer(this.props.container);
              }}
            />
          </div>
        );
      }
    };

    const lotForm = (
      <Modal
        title='Edit Lot Number'
        onClose={this.props.clearAll}
        show={editable.lotForm}
        onSubmit={updateContainer}
      >
        <TextboxElement
          name='lotNumber'
          label='Lot Number'
          onUserInput={this.props.setContainer}
          value={current.container.lotNumber}
        />
      </Modal>
    );

    const expirationForm = (
      <Modal
        title='Edit Expiration Date'
        onClose={this.props.clearAll}
        show={editable.expirationForm}
        onSubmit={updateContainer}
      >
        <DateElement
          name='expirationDate'
          label='Expiration Date'
          onUserInput={this.props.setContainer}
          value={current.container.expirationDate}
        />
      </Modal>
    );

    const parentBarcodes = this.props.getParentContainerBarcodes(container);
    const barcodePathDisplay = this.props.getBarcodePathDisplay(parentBarcodes);
    const printBarcode = () => {
      const labelParams = [{
        barcode: specimen.barcode,
        type: options.specimen.types[specimen.typeId].label,
        pscid: specimen.candidatePSCID,
        sampleNumber: specimen.sampleNumber,
      }];
      this.props.printLabel(labelParams)
        .then(() => (Swal.fire('Print Barcode Number: ' + container.barcode)));
    };

    return (
      <div className="specimen-header">
        <div className='specimen-title'>
          <div className='barcode'>
            Barcode
            <div className='value'>
              <strong>{container.barcode}</strong>
            </div>
            <span className='barcodePath'>
              Address: {barcodePathDisplay} <br/>
              Lot Number: {container.lotNumber} {alterLotNumber()}<br/>
              Expiration Date: {container.expirationDate}{alterExpirationDate()}
            </span>
            {lotForm}
            {expirationForm}
          </div>
          <div className='action' title='Print Barcode'>
            <div className='action-button update' onClick={printBarcode}>
              <span className='glyphicon glyphicon-print'/>
            </div>
          </div>
          {addAliquotForm()}
          <ContainerCheckout
            container={container}
            current={current}
            editContainer={this.props.editContainer}
            setContainer={this.props.setContainer}
            updateContainer={this.props.updateContainer}
          />
        </div>
        <LifeCycle
          specimen={specimen}
          centers={options.centers}
        />
      </div>
    );
  }
}

// Header.propTypes
Header.propTypes = {
  options: PropTypes.shape({
    container: PropTypes.shape({
      stati: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      typesNonPrimary: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
    specimen: PropTypes.shape({
      typeUnits: PropTypes.string,
      types: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  container: PropTypes.shape({
    statusId: PropTypes.number.isRequired,
    barcode: PropTypes.string.isRequired,
    lotNumber: PropTypes.string,
    expirationDate: PropTypes.string,
    parentContainerId: PropTypes.number,
    coordinate: PropTypes.string,
  }).isRequired,
  specimen: PropTypes.shape({
    barcode: PropTypes.string,
    candidatePSCID: PropTypes.string,
    sampleNumber: PropTypes.string,
    quantity: PropTypes.number,
    poolId: PropTypes.number,
    typeId: PropTypes.number.isRequired,
  }).isRequired,
  editable: PropTypes.shape({
    aliquotForm: PropTypes.func.isRequired,
    lotForm: PropTypes.func.isRequired,
    expirationForm: PropTypes.func.isRequired,
  }).isRequired,
  current: PropTypes.shape({
    container: PropTypes.shape({
      parentContainerId: PropTypes.number,
      coordinate: PropTypes.string,
      lotNumber: PropTypes.string,
      expirationDate: PropTypes.string,
    }).isRequired,
    specimen: PropTypes.shape({
      typeId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  data: PropTypes.obj,
  setContainer: PropTypes.func.isRequired,
  updateContainer: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  increaseCoordinate: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  setSpecimen: PropTypes.func.isRequired,
  createSpecimens: PropTypes.func.isRequired,
  editContainer: PropTypes.func.isRequired,
  printLabel: PropTypes.func.isRequired,
  getParentContainerBarcodes: PropTypes.func.isRequired,
  getBarcodePathDisplay: PropTypes.func.isRequired,
};

/**
 * Biobank Container Checkout
 *
 * @param  {object} props
 * @return {JSX}
 */
function ContainerCheckout(props) {
  const checkoutContainer = () => {
    const container = clone(props.container);
    container.parentContainerId = null;
    container.coordinate = null;
    props.updateContainer(container);
  };

  return (loris.userHasPermission('biobank_container_update') &&
      props.container.parentContainerId) ? (
      <div className='action'>
        <div
          className='action-button update'
          title='Checkout Container'
          onClick={checkoutContainer}
        >
          <span className='glyphicon glyphicon-share'/>
        </div>
      </div>
    ) : null;
}

// ContainerCheckout.propTypes
ContainerCheckout.propTypes = {
  editContainer: PropTypes.func.isRequired,
  container: PropTypes.shape({
    parentContainerId: PropTypes.number,
  }).isRequired,
  setContainer: PropTypes.func.isRequired,
  updateContainer: PropTypes.func.isRequired,
};

export default Header;
