import React from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mapFormOptions} from './helpers.js';

import Modal from 'Modal';
import Loader from 'Loader';
import {
  SelectElement,
  TextboxElement,
  NumericElement,
  TextareaElement,
  CTA,
} from 'jsx/Form';
import ContainerParentForm from './containerParentForm';

/**
 * Biobank Globals Component
 *
 * @param {object} props - The component's props
 */
function Globals(props) {
  const {current, data, editable, options, specimen, container} = props;
  const updateContainer = () => props.updateContainer(current.container);
  const editContainer = () => props.editContainer(container);

  const specimenTypeField = specimen && (
    <InlineField
      label={this.props.t('Specimen Type', {ns: 'biobank'})}
      value={options.specimen.types[specimen.typeId].label}
    />
  );

  const edit = loris.userHasPermission('biobank_specimen_alter')
    && specimen && (
    () => {
      props.edit('containerType');
      editContainer();
    }
  );
  const containerTypes = mapFormOptions(
    options.container.typesPrimary,
    'label'
  );
  const containerTypeField = (
    <InlineField
      loading={props.loading}
      label={this.props.t('Container Type', {ns: 'biobank'})}
      updateValue={updateContainer}
      clearAll={props.clearAll}
      pencil={true}
      value={options.container.types[container.typeId].label}
      edit={edit}
      editable={editable.containerType}
    >
      <SelectElement
        name='typeId'
        onUserInput={props.setContainer}
        options={containerTypes}
        value={current.container.typeId}
        errorMessage={props.errors.container.typeId}
      />
    </InlineField>
  );

  const poolField = (specimen||{}).poolId ? (
    <InlineField
      label={this.props.t('Pool', {ns: 'biobank'})}
      value={data.pools[specimen.poolId].label}
    />
  ) : null;

  const units = specimen ? mapFormOptions(
    options.specimen.typeUnits[specimen.typeId], 'label'
  ) : null;
  const quantityField = specimen ? (
    <InlineField
      loading={props.loading}
      label={this.props.t('Quantity', {ns: 'biobank'})}
      clearAll={props.clearAll}
      updateValue={()=>props.updateSpecimen(current.specimen)}
      edit={() => props.edit('quantity')}
      editValue={() => props.editSpecimen(specimen)}
      value={Math.round(specimen.quantity * 100) / 100+
            ' '+options.specimen.units[specimen.unitId].label}
      editable={editable.quantity}
    >
      <TextboxElement
        name='quantity'
        onUserInput={props.setSpecimen}
        value={props.current.specimen.quantity}
        errorMessage={props.errors.specimen.quantity}
      />
      <SelectElement
        name='unitId'
        options={units}
        onUserInput={props.setSpecimen}
        value={props.current.specimen.unitId}
        errorMessage={props.errors.specimen.unitId}
      />
    </InlineField>
  ) : null;

  const fTCycleField = () => {
    if (specimen
            && options.specimen.types[specimen.typeId].freezeThaw == 1
    ) {
      // const changeCycle = (value) => {
      //   props.editSpecimen(specimen)
      //   .then(() => {
      //     let cycle = specimen.fTCycle;
      //     cycle = cycle+value;
      //     props.setSpecimen('fTCycle', cycle);
      //   })
      //   .then(()=>props.updateSpecimen(props.current.specimen));
      // };
      // const increaseCycle = () => changeCycle(1);
      // const decreaseCycle = () => changeCycle(-1);
      // const updateFTCycle = loris.userHasPermission('biobank_specimen_edit') ? (
      //   <div>
      //     {specimen.fTCycle > 0 ? (
      //       <div className='action' title='Remove Cycle'>
      //         <span
      //           className='action-button update'
      //           onClick={decreaseCycle}
      //         >
      //           <span className='glyphicon glyphicon-minus'/>
      //         </span>
      //       </div>
      //     ) : null}
      //     <div className='action' title='Add Cycle'>
      //       <span className='action-button update' onClick={increaseCycle}>
      //         <span className='glyphicon glyphicon-plus'/>
      //       </span>
      //     </div>
      //   </div>
      // ) : null;

      const editFTCycle = () => props.edit('fTCycle');
      return (
        <InlineField
          loading={props.loading}
          label={this.props.t('Freeze-Thaw Cycle', {ns: 'biobank'})}
          clearAll={props.clearAll}
          updateValue={() => props.updateSpecimen(props.current.specimen)}
          edit={editFTCycle}
          editValue={() => props.editSpecimen(specimen)}
          value={specimen.fTCycle || 0}
          editable={editable.fTCycle}
        >
          <NumericElement
            name={this.props.t('fTCycle', {ns: 'biobank'})}
            onUserInput={props.setSpecimen}
            value={props.current.specimen.fTCycle}
            errorMessage={props.errors.specimen.fTCycle}
          />
        </InlineField>
      );
    }
  };

  const editTemperature = () => props.edit('temperature');
  const temperatureField = (
    <InlineField
      loading={props.loading}
      label={this.props.t('Temperature', {ns: 'biobank'})}
      clearAll={props.clearAll}
      updateValue={updateContainer}
      edit={!container.parentContainerId && editTemperature}
      editValue={editContainer}
      value={container.temperature + '°'}
      editable={editable.temperature}
    >
      <TextboxElement
        name='temperature'
        onUserInput={props.setContainer}
        value={props.current.container.temperature}
        errorMessage={props.errors.container.temperature}
      />
    </InlineField>
  );

  const stati = mapFormOptions(options.container.stati, 'label');
  const renderCommentsField = () => {
    if (stati[props.current.container.statusId] !== 'Discarded'
            && stati[props.current.container.statusId] !== 'Reserved'
            && stati[props.current.container.statusId] !== 'Dispensed'
            && stati[props.current.container.statusId] !== 'Shipped'
    ) {
      return [];
    }
    return (
      <TextareaElement
        name='comments'
        onUserInput={props.setContainer}
        value={props.current.container.comments}
        required={true}
      />
    );
  };
  const statusField = (
    <InlineField
      loading={props.loading}
      label={this.props.t('Status', {ns: 'biobank'})}
      clearAll={props.clearAll}
      updateValue={updateContainer}
      edit={() => props.edit('status')}
      editValue={editContainer}
      value={options.container.stati[container.statusId].label}
      subValue={container.comments}
      editable={editable.status}
    >
      <SelectElement
        name='statusId'
        options={stati}
        onUserInput={props.setContainer}
        value={props.current.container.statusId}
        errorMessage={props.errors.container.statusId}
      />
      {renderCommentsField()}
    </InlineField>
  );

  const projectField = () => specimen && (
    <InlineField
      label={this.props.t('Project', {ns: 'loris'})}
      value={options.projects[specimen.projectId]}
    />
  );

  const drawField = specimen && (
    <InlineField
      label={this.props.t('Draw Site', {ns: 'biobank'})}
      value={options.centers[
        options.sessions[specimen.sessionId]?.centerId
      ]}
    />
  );

  const centerField = (
    <InlineField
      label={this.props.t('Current Site', {ns: 'biobank'})}
      value={options.centers[container.centerId]}
    />
  );

  const shipmentField = () => {
    if (container.shipmentBarcodes.length !== 0) {
      return (
        <InlineField
          label={this.props.t('Shipment', {ns: 'biobank'})}
          value={container.shipmentBarcodes.slice(-1)[0]}
        />
      );
    }
  };

  const parentSpecimenField = () => {
    if (!specimen) {
      return null;
    }

    const {parentSpecimenIds, parentSpecimenBarcodes} = specimen;
    const value = parentSpecimenIds.length === 0
      ? this.props.t('None', {ns: 'loris'})
      : parentSpecimenBarcodes
        .map((barcode) => <Link to={`/barcode=${barcode}`}>{barcode}</Link>)
        .reduce((prev, curr, index) => [prev, index == 0 ? '' : ', ', curr]);

    return (
      <InlineField
        label={this.props.t('Parent Specimen', {ns: 'biobank'})}
        value={value}
      />
    );
  };

  const parentContainerField = () => {
    if (loris.userHasPermission('biobank_container_view')) {
      // Set Parent Container Barcode Value if it exists
      const parentContainerBarcodeValue = () => {
        if (container.parentContainerId) {
          const barcode = container.parentContainerBarcode;
          if (data.containers[container.parentContainerId]) {
            return <Link to={`/barcode=${barcode}`}>{barcode}</Link>;
          }
          return <div>{barcode}</div>;
        }
      };

      const updateParentContainer = () => {
        if (loris.userHasPermission('biobank_container_update')) {
          return (
            <div>
              <div className='action' title={this.props.t('Move Container', {ns: 'biobank'})}>
                <span
                  className='action-button update'
                  onClick={() => {
                    props.edit('containerParentForm');
                    editContainer();
                  }}
                >
                  <span className='glyphicon glyphicon-chevron-right'/>
                </span>
              </div>
              <div>
                <Modal
                  title={this.props.t('Update Parent Container', {ns: 'biobank'})}
                  onClose={props.clearAll}
                  show={editable.containerParentForm}
                  onSubmit={props.uC}
                >
                  <ContainerParentForm
                    display={true}
                    current={current}
                    container={container}
                    options={options}
                    data={data}
                    setContainer={props.setContainer}
                    setCurrent={props.setCurrent}
                  />
                </Modal>
              </div>
            </div>
          );
        }
      };

      let coordinate;
      if (container.coordinate) {
        coordinate = props.getCoordinateLabel(container);
      }

      return (
        <div className="item">
          <div className='field'>
            Parent Container
            <div className='value'>
              {parentContainerBarcodeValue() || this.props.t('None', {ns: 'biobank'})}
            </div>
            {(parentContainerBarcodeValue && container.coordinate) ?
              this.props.t('Coordinate', {ns: 'biobank'}) + ' ' + coordinate : null}
          </div>
          {updateParentContainer()}
        </div>
      );
    }
  };

  const candidateSessionField = specimen ? (
    <div>
      <InlineField
        label={this.props.t('PSCID', {ns: 'loris'})}
        value={options.candidates[specimen.candidateId].pscid}
        link={loris.BaseURL+'/'+specimen.candidateId}
      />
      <InlineField
        label={this.props.t('Visit Label', {ns: 'loris'})}
        value={options.sessions[specimen.sessionId].label}
        link={
          loris.BaseURL+'/instrument_list/?candID='+
            specimen.candidateId+'&sessionID='+
            specimen.sessionId
        }
      />
    </div>
  ) : null;

  return (
    <div className="globals">
      <div className='list'>
        {specimenTypeField}
        {containerTypeField}
        {poolField}
        {quantityField}
        {fTCycleField()}
        {temperatureField}
        {statusField}
        {projectField()}
        {drawField}
        {centerField}
        {shipmentField()}
        {parentSpecimenField()}
        {parentContainerField()}
        {candidateSessionField}
      </div>
    </div>
  );
}

// Globals.propTypes
Globals.propTypes = {
  t: PropTypes.func.isRequired,
  current: PropTypes.shape({
    container: PropTypes.shape({
      parentContainerId: PropTypes.number,
      typeId: PropTypes.number.isRequired,
      coordinate: PropTypes.string,
      statusId: PropTypes.number,
      temperature: PropTypes.number,
      lotNumber: PropTypes.string,
      expirationDate: PropTypes.string,
      comments: PropTypes.string,
    }).isRequired,
    specimen: PropTypes.shape({
      poolId: PropTypes.number,
      typeId: PropTypes.number.isRequired,
      fTCycle: PropTypes.string,
      projectId: PropTypes.number,
      sessionId: PropTypes.number,
      candidateId: PropTypes.number,
      quantity: PropTypes.number,
      unitId: PropTypes.number,
      parentSpecimenIds: PropTypes.arrayOf(PropTypes.number),
      parentSpecimenBarcodes: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,

  data: PropTypes.shape({
    pools: PropTypes.array.isRequired,
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        parentContainerId: PropTypes.number,
        coordinate: PropTypes.string,
        typeId: PropTypes.number.isRequired,
        shipmentBarcodes: PropTypes.arrayOf(PropTypes.string),
        centerId: PropTypes.number,
        parentContainerBarcode: PropTypes.string,
        statusId: PropTypes.number, // Added
        temperature: PropTypes.number, // Added
        comments: PropTypes.string, // Added
      })
    ).isRequired,
  }).isRequired,

  editable: PropTypes.shape({
    containerType: PropTypes.func.isRequired,
    fTCycle: PropTypes.func.isRequired,
    quantity: PropTypes.func.isRequired,
    containerParentForm: PropTypes.func.isRequired,
    temperature: PropTypes.func.isRequired, // Added
    status: PropTypes.func.isRequired, // Added
  }).isRequired,

  options: PropTypes.shape({
    specimen: PropTypes.shape({
      typeUnits: PropTypes.string,
      units: PropTypes.string, // Added
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
      attributes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
      protocols: PropTypes.arrayOf(PropTypes.string),
      protocolAttributes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
    }).isRequired,
    container: PropTypes.shape({
      typesPrimary: PropTypes.arrayOf(PropTypes.string).isRequired,
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      typesNonPrimary: PropTypes.arrayOf(PropTypes.string).isRequired,
      stati: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      candidates: PropTypes.arrayOf(PropTypes.string),
      sessions: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    projects: PropTypes.arrayOf(PropTypes.string).isRequired,
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
    candidates: PropTypes.arrayOf(PropTypes.string),
    sessions: PropTypes.arrayOf(PropTypes.string),
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
      })
    ), // Assuming based on errors
  }).isRequired,

  specimen: PropTypes.shape({
    typeId: PropTypes.number.isRequired,
    poolId: PropTypes.number,
    fTCycle: PropTypes.string,
    projectId: PropTypes.number,
    sessionId: PropTypes.number,
    candidateId: PropTypes.number,
    quantity: PropTypes.number,
    unitId: PropTypes.number,
    parentSpecimenIds: PropTypes.arrayOf(PropTypes.number),
    parentSpecimenBarcodes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  container: PropTypes.shape({
    centerId: PropTypes.number,
    shipmentBarcodes: PropTypes.arrayOf(PropTypes.string),
    parentContainerId: PropTypes.number,
    coordinate: PropTypes.string,
    typeId: PropTypes.number.isRequired,
    parentContainerBarcode: PropTypes.string,
    statusId: PropTypes.number, // Added
    temperature: PropTypes.number, // Added
    comments: PropTypes.string, // Added
  }).isRequired,

  updateContainer: PropTypes.func.isRequired,
  editContainer: PropTypes.func.isRequired,
  setContainer: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  editSpecimen: PropTypes.func.isRequired,
  updateSpecimen: PropTypes.func.isRequired,
  getCoordinateLabel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  clearAll: PropTypes.func.isRequired,
  setCheckoutList: PropTypes.func.isRequired,
  setListItem: PropTypes.func.isRequired,
  createSpecimens: PropTypes.func.isRequired,
  increaseCoordinate: PropTypes.func.isRequired,
  getParentContainerBarcodes: PropTypes.func.isRequired,
  getBarcodePathDisplay: PropTypes.func.isRequired,
  setSpecimen: PropTypes.func.isRequired,
  uC: PropTypes.any.isRequired, // Added based on error

  errors: PropTypes.shape({
    container: PropTypes.shape({
      typeId: PropTypes.string,
      temperature: PropTypes.string, // Added
      statusId: PropTypes.string, // Added
      comments: PropTypes.string, // Added
    }),
    specimen: PropTypes.shape({
      quantity: PropTypes.string,
      unitId: PropTypes.string,
      fTCycle: PropTypes.string,
      projectId: PropTypes.string,
      candidateId: PropTypes.string,
      sessionId: PropTypes.string,
    }),
  }).isRequired,
};

/**
 * Item of the Inline Field
 *
 * @param  {object} props
 * @return {JSX}
 */
function Item(props) {
  return <div className="item">{props.children}</div>;
}

Item.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Inline Field
 *
 * @param  {object} props
 * @return {JSX}
 */
function InlineField(props) {
  const fields = React.Children.map(
    props.children, (child) => {
      return (
        <div style={{flex: '1 0 25%', minWidth: '90px'}}>
          {React.cloneElement(child, {inputClass: 'col-lg-11'})}
        </div>
      );
    }
  );

  // loris.userHasPermission('biobank_container_update') should determine if 'edit'
  // can be passed in the first place.
  const editButton = props.edit instanceof Function && !props.editable && (
    <div className='action' title={this.props.t('Update', {ns: 'biobank'})+' '+props.label}>
      <span
        className={
          props.pencil
            ? 'glyphicon glyphicon-pencil'
            : 'action-button update'
        }
        onClick={() => {
          props.edit();
          props.editValue();
        }}
      >
        {!props.pencil && <span className='glyphicon glyphicon-chevron-right'/>}
      </span>
    </div>
  );

  const loader = props.loading && (
    <React.Fragment>
      <div style={{flex: '0 1 15%', margin: '0 1%'}}>
        <Loader size={20}/>
      </div>
      <div style={{flex: '0 1 15%', margin: '0 1%'}}>
        <h5 className='animate-flicker'>Saving...</h5>
      </div>
    </React.Fragment>
  );

  const submitButton = !props.loading && (
    <React.Fragment>
      <div style={{flex: '0 1 15%', margin: '0 1%'}}>
        <CTA
          label={this.props.t('Update', {ns: 'biobank'})}
          onUserInput={props.updateValue}
        />
      </div>
      <div style={{flex: '0 1 15%', margin: '0 1%'}}>
        <a onClick={props.clearAll} style={{cursor: 'pointer'}}>
          Cancel
        </a>
      </div>
    </React.Fragment>
  );

  const value = props.link ? (
    <a href={props.link}>{props.value}</a>
  ) : props.value;

  const renderField = props.editable ? (
    <div className='field'>
      {props.label}
      <div className='inline-field'>
        {fields}
        {submitButton}
        {loader}
      </div>
    </div>
  ) : (
    <div className="field">
      {props.label}
      {props.pencil && editButton}
      <div className='value'>
        {value}
      </div>
      {props.subValue}
    </div>
  );

  return (
    <Item>
      {renderField}
      {!props.pencil && editButton}
    </Item>
  );
}

// InlineField.propTypes
InlineField.propTypes = {
  clearAll: PropTypes.func,
  updateValue: PropTypes.func,
  subValue: PropTypes.string,
  children: PropTypes.node.isRequired,
  edit: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  pencil: PropTypes.node.isRequired,
  editValue: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  link: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default withTranslation(['biobank', 'loris'])(Globals);
