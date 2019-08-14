import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Modal from 'Modal';
import Globals from './globals.js';
import SpecimenProcessForm from './processForm';
import BiobankSpecimenForm from './specimenForm.js';
import LifeCycle from './lifeCycle.js';
import ContainerCheckout from './containerCheckout.js';

/**
 * Biobank Specimen
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */
class BiobankSpecimen extends Component {
  constructor() {
    super();
    this.openAliquotForm = this.openAliquotForm.bind(this);
    this.addPreparation = this.addPreparation.bind(this);
    this.addAnalysis = this.addAnalysis.bind(this);
    this.alterCollection = this.alterCollection.bind(this);
    this.alterPreparation = this.alterPreparation.bind(this);
    this.alterAnalysis = this.alterAnalysis.bind(this);
    this.submitAliquotForm = this.submitAliquotForm.bind(this);
  }

  addPreparation() {
    this.addProcess('preparation');
  }

  addAnalysis() {
    this.addProcess('analysis');
  }

  addProcess(process) {
    this.props.editSpecimen(this.props.target.specimen)
    .then(() => {
      const specimen = this.props.current.specimen;
      specimen[process] = {centerId: this.props.target.container.centerId};
      this.props.setCurrent('specimen', specimen);
    })
    .then(() => this.props.edit(process));
  }

  alterCollection() {
    this.alterProcess('collection');
  }

  alterPreparation() {
    this.alterProcess('preparation');
  }

  alterAnalysis() {
    this.alterProcess('preparation');
  }

  alterProcess(process) {
    this.props.editSpecimen(this.props.target.specimen)
    .then(() => this.props.edit(process));
  }

  openAliquotForm() {
    this.props.edit('aliquotForm')
    .then(() => this.props.editSpecimen(this.props.target.specimen))
    .then(() => this.props.addListItem('specimen'));
  }

  submitAliquotForm() {
    this.props.createSpecimens()
    .then(() => this.props.updateSpecimen(this.props.current.specimen))
    .then(() => this.props.clearAll());
  }

  render() {
    const {current, data, editable, errors, options, target} = this.props;

    const status = options.container.stati[target.container.statusId].label;
    const renderActionButton = () => {
      if (status == 'Available' && target.specimen.quantity > 0 && !target.specimen.poolId) {
        return (
          <div className='action-button add' onClick={this.openAliquotForm}>
            +
          </div>
        );
      } else {
        return <div className='action-button disabled'>+</div>;
      }
    };
    const addAliquotForm = () => {
      if (loris.userHasPermission('biobank_specimen_create')) {
        return (
          <div>
            <div className='action' title='Make Aliquots'>
              {renderActionButton()}
            </div>
            <div>
              <Modal
                title="Add Aliquots"
                onClose={this.props.clearAll}
                show={editable.aliquotForm}
                onSubmit={this.submitAliquotForm}
              >
                <FormElement>
                  <BiobankSpecimenForm
                    parent={[target]}
                    options={options}
                    data={data}
                    current={current}
                    errors={errors}
                    mapFormOptions={this.props.mapFormOptions}
                    toggleCollapse={this.props.toggleCollapse}
                    setCurrent={this.props.setCurrent}
                    setSpecimen={this.props.setSpecimen}
                    setListItem={this.props.setListItem}
                    addListItem={this.props.addListItem}
                    copyListItem={this.props.copyListItem}
                    removeListItem={this.props.removeListItem}
                  />
                </FormElement>
              </Modal>
            </div>
          </div>
        );
      }
    };

    /**
     * Collection Form
     */

    const alterCollection = () => {
      if (loris.userHasPermission('biobank_specimen_alter')) {
        return (
          <span
            className={editable.collection ? null : 'glyphicon glyphicon-pencil'}
            onClick={editable.collection ? null : this.alterCollection}
          />
        );
      }
    };

    const cancelAlterCollection = () => {
      if (editable.collection) {
        return (
          <a className="pull-right" style={{cursor: 'pointer'}} onClick={this.props.clearAll}>
            Cancel
          </a>
        );
      }
    };

    const collectionPanel = (
      <div className='panel specimen-panel panel-default'>
          <div className='panel-heading'>
            <div className='lifecycle-node collection'>
              <div className='letter'>C</div>
            </div>
            <div className='title'>
              Collection
            </div>
            {alterCollection()}
          </div>
          <div className='panel-body'>
            <FormElement>
              <SpecimenProcessForm
                current={current}
                errors={errors.specimen.process}
                edit={editable.collection}
                specimen={current.specimen}
                mapFormOptions={this.props.mapFormOptions}
                options={options}
                process={editable.collection ? current.specimen.collection : target.specimen.collection}
                processStage={'collection'}
                setCurrent={this.props.setCurrent}
                setParent={this.props.setSpecimen}
                typeId={editable.collection ? current.specimen.typeId : target.specimen.typeId}
                updateSpecimen={this.props.updateSpecimen}
              />
            </FormElement>
            {cancelAlterCollection()}
          </div>
      </div>
    );

    /**
     * Preparation Form
     */

    const alterPreparation = () => {
      if (loris.userHasPermission('biobank_specimen_alter')) {
        return (
          <span
            className={editable.preparation ? null : 'glyphicon glyphicon-pencil'}
            onClick={editable.preparation ? null : this.alterPreparation}
          />
        );
      }
    };

    const cancelAlterPreparation = () => {
      if (editable.preparation) {
        return (
          <a className="pull-right" style={{cursor: 'pointer'}} onClick={this.props.clearAll}>
            Cancel
          </a>
        );
      }
    };

    const preparationPanel = () => {
      const protocolExists = Object.values(options.specimen.protocols).find(
        (protocol) => {
          return protocol.typeId == target.specimen.typeId &&
          options.specimen.processes[protocol.processId].label == 'Preparation';
        }
      );
      if (protocolExists &&
          !target.specimen.preparation &&
          !editable.preparation &&
          loris.userHasPermission('biobank_specimen_update')) {
        return (
          <div className='panel specimen-panel inactive'>
            <div className='add-process' onClick={this.addPreparation}>
              <span className='glyphicon glyphicon-plus'/>
            </div>
            <div>ADD PREPARATION</div>
          </div>
        );
      } else if (target.specimen.preparation || editable.preparation) {
        return (
          <div className='panel specimen-panel panel-default'>
              <div className='panel-heading'>
                <div className='lifecycle-node collection'>
                  <div className='letter'>P</div>
                </div>
                <div className='title'>
                  Preparation
                </div>
                {alterPreparation()}
              </div>
              <div className='panel-body'>
                <FormElement>
                  <SpecimenProcessForm
                    current={current}
                    errors={errors.specimen.process}
                    edit={editable.preparation}
                    specimen={current.specimen}
                    mapFormOptions={this.props.mapFormOptions}
                    options={options}
                    process={editable.preparation ? current.specimen.preparation : target.specimen.preparation}
                    processStage={'preparation'}
                    setCurrent={this.props.setCurrent}
                    setParent={this.props.setSpecimen}
                    typeId={editable.preparation ? current.specimen.typeId : target.specimen.typeId}
                    updateSpecimen={this.props.updateSpecimen}
                  />
                </FormElement>
                {cancelAlterPreparation()}
              </div>
          </div>
        );
      }
    };

    /**
     * Analysis Form
     */

    const alterAnalysis = () => {
      if (loris.userHasPermission('biobank_specimen_alter')) {
        return (
          <span
            className={editable.analysis ? null : 'glyphicon glyphicon-pencil'}
            onClick={editable.analysis ? null : this.alterAnalysis}
          />
        );
      }
    };

    const cancelAlterAnalysis = () => {
      if (editable.analysis) {
        return (
          <a className="pull-right" style={{cursor: 'pointer'}} onClick={this.props.clearAll}>
            Cancel
          </a>
        );
      }
    };

    const analysisPanel = () => {
      const protocolExists = Object.values(options.specimen.protocols).find(
        (protocol) => {
          return protocol.typeId == target.specimen.typeId &&
          options.specimen.processes[protocol.processId].label == 'Analysis';
        }
      );
      if (protocolExists &&
          !target.specimen.preparation &&
          !editable.analysis &&
          loris.userHasPermission('biobank_specimen_update')) {
        return (
          <div className='panel specimen-panel inactive'>
            <div className='add-process' onClick={this.addAnalysis}>
              <span className='glyphicon glyphicon-plus'/>
            </div>
            <div>ADD ANALYSIS</div>
          </div>
        );
      } else if (target.specimen.analysis || editable.analysis) {
        return (
          <div className='panel specimen-panel panel-default'>
              <div className='panel-heading'>
                <div className='lifecycle-node collection'>
                  <div className='letter'>A</div>
                </div>
                <div className='title'>
                  Analysis
                </div>
                {alterAnalysis()}
              </div>
              <div className='panel-body'>
                <FormElement>
                  <SpecimenProcessForm
                    current={current}
                    errors={errors.specimen.process}
                    edit={editable.analysis}
                    specimen={current.specimen}
                    mapFormOptions={this.props.mapFormOptions}
                    options={options}
                    process={editable.analysis ? current.specimen.analysis : target.specimen.analysis}
                    processStage={'analysis'}
                    setCurrent={this.props.setCurrent}
                    setParent={this.props.setSpecimen}
                    typeId={editable.analysis ? current.specimen.typeId : target.specimen.typeId}
                    updateSpecimen={this.props.updateSpecimen}
                  />
                </FormElement>
                {cancelAlterAnalysis()}
              </div>
          </div>
        );
      }
    };

    let globals = (
      <Globals
        specimen={current.specimen}
        container={current.container}
        data={data}
        target={target}
        options={options}
        errors={errors}
        editable={editable}
        edit={this.props.edit}
        clearAll={this.props.clearAll}
        mapFormOptions={this.props.mapFormOptions}
        setSpecimen={this.props.setSpecimen}
        editSpecimen={this.props.editSpecimen}
        updateSpecimen={this.props.updateSpecimen}
        setContainer={this.props.setContainer}
        editContainer={this.props.editContainer}
        updateContainer={this.props.updateContainer}
        getCoordinateLabel={this.props.getCoordinateLabel}
      />
    );

    const parentBarcodes = this.props.getParentContainerBarcodes(target.container);
    const barcodePathDisplay = this.props.getBarcodePathDisplay(parentBarcodes);
    return (
      <div id='specimen-page'>
        <div className="specimen-header">
          <div className='specimen-title'>
            <div className='barcode'>
              Barcode
              <div className='value'>
                <strong>{target.container.barcode}</strong>
              </div>
              <span className='barcodePath'>
                Address: {barcodePathDisplay} <br/>
                Lot Number: {target.container.lotNumber} <br/>
                Expiration Date: {target.container.expirationDate}
              </span>
            </div>
            {addAliquotForm()}
            <ContainerCheckout
              container={target.container}
              current={current}
              editContainer={this.props.editContainer}
              setContainer={this.props.setContainer}
              updateContainer={this.props.updateContainer}
            />
          </div>
          <LifeCycle
            specimen={target.specimen}
            centers={options.centers}
          />
        </div>
        <div className='summary'>
          {globals}
          <div className="processing">
            {collectionPanel}
            {preparationPanel()}
            {analysisPanel()}
          </div>
        </div>
      </div>
    );
  }
}

BiobankSpecimen.propTypes = {
  specimenPageDataURL: PropTypes.string.isRequired,
};

export default BiobankSpecimen;
