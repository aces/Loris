import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mapFormOptions} from './helpers.js';

import Modal from 'Modal';
import Loader from 'Loader';
import ContainerParentForm from './containerParentForm';

/**
 * Biobank Globals Component
 *
 * @param {object} props
 * @return {*}
 **/
function Globals(props) {
  const {current, data, editable, options, specimen, container} = props;
  const updateContainer = () => props.updateContainer(current.container);
  const editContainer = () => props.editContainer(container);

  const specimenTypeField = specimen && (
    <InlineField
      label='Specimen Type'
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
      label={'Container Type'}
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
      label='Pool'
      value={data.pools[specimen.poolId].label}
    />
  ) : null;

  const units = specimen ? mapFormOptions(
    options.specimen.typeUnits[specimen.typeId], 'label'
  ) : null;
  const quantityField = specimen ? (
    <InlineField
      loading={props.loading}
      label='Quantity'
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
        && options.specimen.types[specimen.typeId].freezeThaw == 1) {
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
      // const updateFTCycle = loris.userHasPermission('biobank_specimen_update') ? (
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
          label={'Freeze-Thaw Cycle'}
          clearAll={props.clearAll}
          updateValue={() => props.updateSpecimen(props.current.specimen)}
          edit={editFTCycle}
          editValue={() => props.editSpecimen(specimen)}
          value={specimen.fTCycle || 0}
          editable={editable.fTCycle}
        >
          <NumericElement
            name='fTCycle'
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
      label={'Temperature'}
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
    if (stati[props.current.container.statusId] !== 'Discarded' &&
        stati[props.current.container.statusId] !== 'Dispensed' &&
        stati[props.current.container.statusId] !== 'Shipped') {
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
      label={'Status'}
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

  const projectField = (
    <InlineField
      loading={props.loading}
      label='Projects'
      clearAll={props.clearAll}
      updateValue={updateContainer}
      edit={() => props.edit('project')}
      editValue={editContainer}
      value={container.projectIds.length !== 0 ?
       container.projectIds
         .map((id) => options.projects[id])
         .join(', ') : 'None'}
      editable={editable.project}
    >
      <SelectElement
        name='projectIds'
        options={props.options.projects}
        onUserInput={props.setContainer}
        multiple={true}
        emptyOption={false}
        value={props.current.container.projectIds}
        errorMessage={props.errors.container.projectIds}
      />
    </InlineField>
  );

  const optSes = options.sessionCenters[specimen.sessionId].centerId;
  const drawField = specimen && (
    <InlineField
      label='Draw Site'
      value={options.centers[optSes]}
    />
  );

  const centerField = (
    <InlineField
      label='Current Site'
      value={options.centers[container.centerId]}
    />
  );

  const shipmentField = () => {
    if (container.shipmentBarcodes.length !== 0) {
      return (
        <InlineField
          label='Shipment'
          value={container.shipmentBarcodes.slice(-1)[0]}
        />
      );
    }
  };

  const parentSpecimenField = () => {
    if ((specimen||{}).parentSpecimenIds) {
      const parentSpecimenBarcodes = Object.values(specimen.parentSpecimenIds)
      .map((id) => {
        const barcode = data.containers[data.specimens[id].containerId].barcode;
        return <Link to={`/barcode=${barcode}`}>{barcode}</Link>;
      })
      .reduce((prev, curr) => [prev, ', ', curr]);

      return (
        <InlineField
          label={'Parent Specimen'}
          value={parentSpecimenBarcodes || 'None'}
        />
      );
    }
  };

  // TODO: Find a way to make this conform to the GLOBAL ITEM structure.
  const parentContainerField = () => {
    if (loris.userHasPermission('biobank_container_view')) {
      // Set Parent Container Barcode Value if it exists
      const parentContainerBarcodeValue = () => {
        if (container.parentContainerId) {
          const barcode = data.containers[
                          container.parentContainerId
                        ].barcode;
          return <Link to={`/barcode=${barcode}`}>{barcode}</Link>;
        }
      };

      const updateParentContainer = () => {
        if (loris.userHasPermission('biobank_container_update')) {
          return (
            <div>
              <div className='action' title='Move Container'>
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
                  title='Update Parent Container'
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
              {parentContainerBarcodeValue() || 'None'}
            </div>
            {(parentContainerBarcodeValue && container.coordinate) ?
            'Coordinate '+ coordinate : null}
          </div>
          {updateParentContainer()}
        </div>
      );
    }
  };

  const candidateSessionField = specimen ? (
    <div>
      <InlineField
        label='PSCID'
        value={options.candidates[specimen.candidateId].pscid}
        link={loris.BaseURL+'/'+specimen.candidateId}
      />
      <InlineField
        label='Visit Label'
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
        {projectField}
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

Globals.propTypes = {
};

/**
 * Inline Field
 *
 * @param {object} props
 * @return {*}
 **/
function Item(props) {
  return <div className="item">{props.children}</div>;
}

/**
 * Inline Field
 *
 * @param {object} props
 * @return {*}
 **/
function InlineField(props) {
  const fields = React.Children.map(props.children, (child) => {
    return (
      <div style={{flex: '1 0 25%', minWidth: '90px'}}>
        {React.cloneElement(child, {inputClass: 'col-lg-11'})}
      </div>
    );
  });

  // loris.userHasPermission('biobank_container_update') should determine if 'edit'
  // can be passed in the first place.
  const editButton = props.edit instanceof Function && !props.editable && (
    <div className='action' title={'Update '+props.label}>
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
        <Button
          label="Update"
          onClick={props.updateValue}
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

InlineField.propTypes = {
  clearAll: PropTypes.func,
  specimen: PropTypes.object,
  updateValue: PropTypes.func,
  subValue: PropTypes.string,
  className: PropTypes.string,
};

export default Globals;
