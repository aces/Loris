import React from 'react';
import PropTypes from 'prop-types';
import SpecimenProcessForm from './processForm';

import {
  FormElement,
} from 'jsx/Form';

import {clone} from './helpers.js';

/**
 * Biobank Specimen
 *
 * @param  {object} props the props!
 * @return {JSX}
 */
function BiobankSpecimen(props) {
  const {current, editable, errors, options, specimen, container} = props;

  const addProcess = async (process) => {
    const newSpecimen = clone(specimen);
    newSpecimen[process] = {centerId: container.centerId};
    await props.editSpecimen(newSpecimen);
    props.edit(process);
  };

  const alterProcess = (process) => {
    props.editSpecimen(specimen)
      .then(() => props.edit(process));
  };

  return (
    <div className="processing">
      <Processes
        addProcess={addProcess}
        alterProcess={alterProcess}
        specimen={specimen}
        editable={editable}
        clearAll={props.clearAll}
        current={current}
        errors={errors}
        options={options}
        setCurrent={props.setCurrent}
        setSpecimen={props.setSpecimen}
        updateSpecimen={props.updateSpecimen}
      >
        <ProcessPanel process='collection'/>
        <ProcessPanel process='preparation'/>
        <ProcessPanel process='analysis'/>
      </Processes>
    </div>
  );
}


// Specimen.propTypes
BiobankSpecimen.propTypes = {
  current: PropTypes.shape({
    container: PropTypes.shape({
      centerId: PropTypes.number,
    }).isRequired,
    specimen: PropTypes.shape({
      // Define specimen-specific properties as needed
    }).isRequired,
  }).isRequired,
  editable: PropTypes.shape({
    // Define editable-specific properties as needed
  }).isRequired,
  errors: PropTypes.shape({
    // Define errors-specific properties as needed
  }).isRequired,
  options: PropTypes.shape({
    // Define options-specific properties as needed
  }).isRequired,
  specimen: PropTypes.shape({
    // Define specimen-specific properties as needed
  }).isRequired,
  container: PropTypes.shape({
    centerId: PropTypes.number,
  }).isRequired,
  editSpecimen: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setSpecimen: PropTypes.func.isRequired,
  updateSpecimen: PropTypes.func.isRequired,
};

/**
 * React component to display processes
 *
 * @param {object} props - React props
 * @return {JSX}
 */
function Processes(props) {
  return React.Children.map(
    props.children, (child) => {
      return React.cloneElement(child, {...props});
    }
  );
}

/**
 * React component to display a panel of processes
 *
 * @param {object} props - React props
 * @return {JSX}
 */
function ProcessPanel(props) {
  const {editable, process, current, specimen, options} = props;

  const alterProcess = () => {
    if (loris.userHasPermission('biobank_specimen_alter')) {
      return (
        <span
          className={editable[process] ? null : 'glyphicon glyphicon-pencil'}
          onClick={editable[process] ? null : () => props.alterProcess(process)}
        />
      );
    }
  };

  const cancelAlterProcess = () => {
    if (editable[process]) {
      return (
        <a
          className="pull-right"
          style={{cursor: 'pointer'}}
          onClick={props.clearAll}
        >
            Cancel
        </a>
      );
    }
  };

  const protocolExists = Object.values(options.specimen.protocols).find(
    (protocol) => {
      return protocol.typeId == specimen.typeId &&
            options.specimen.processes[protocol.processId].label ==
            process.replace(/^\w/, (c) => c.toUpperCase());
    }
  );

  let panel = null;
  if (protocolExists
        && !specimen[process]
        && !editable[process]
        && loris.userHasPermission('biobank_specimen_update')
  ) {
    const addProcess = () => props.addProcess(process);
    panel = (
      <div className='panel specimen-panel inactive'>
        <div className='add-process' onClick={addProcess}>
          <span className='glyphicon glyphicon-plus'/>
        </div>
        <div>ADD {process.toUpperCase()}</div>
      </div>
    );
  }

  const form = (
    <FormElement>
      <SpecimenProcessForm
        current={current}
        errors={props.errors.specimen[process]}
        edit={editable[process]}
        specimen={current.specimen}
        options={options}
        process={
          editable[process] ?
            current.specimen[process] :
            specimen[process]
        }
        processStage={process}
        setCurrent={props.setCurrent}
        setParent={props.setSpecimen}
        typeId={editable[process] ? current.specimen.typeId : specimen.typeId}
        updateSpecimen={props.updateSpecimen}
      />
    </FormElement>
  );

  if (specimen[process] || editable[process]) {
    panel = (
      <div className='panel specimen-panel panel-default'>
        <div className='panel-heading'>
          <div className={'lifecycle-node '+process}>
            <div className='letter'>
              {process.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className='title'>
            {process.replace(/^\w/, (c) => c.toUpperCase())}
          </div>
          {alterProcess()}
        </div>
        <div className='panel-body'>
          {form}
          {cancelAlterProcess()}
        </div>
      </div>
    );
  }

  return panel;
}

export default BiobankSpecimen;
