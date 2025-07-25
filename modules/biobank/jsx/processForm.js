import React from 'react';
import PropTypes from 'prop-types';
import {
  TextboxElement,
  ButtonElement,
  SelectElement,
  DateElement,
  TimeElement,
  TextareaElement,
  StaticElement,
} from 'jsx/Form';
import {mapFormOptions, clone} from './helpers.js';
import CustomFields from './customFields';

/**
 * Biobank Specimen Process Form
 *
 * @param  {object} props
 * @return {JSX}
 */
const SpecimenProcessForm = (props) => {
  const setProcess = (name, value) => {
    let process = clone(props.process);
    process[name] = value;
    props.setParent(props.processStage, process);
  };

  const setProtocol = (name, value) => {
    let process = clone(props.process);
    process[name] = value;
    process.data = {};
    props.setParent(props.processStage, process);
  };

  const setData = (name, value) => {
    const data = clone(props.process.data);
    if (value instanceof File) {
      data[name] = value.name;
      const files = clone(props.current.files);
      files[value.name] = value;
      props.setCurrent('files', files);
    } else {
      data[name] = value;
    }
    setProcess('data', data);
  };

  const {
    specimen,
    process,
    processStage,
    typeId,
    options,
    errors = {},
    edit,
  } = props;

  const updateButton = specimen && (
    <ButtonElement
      label="Update"
      onUserInput={() => props.updateSpecimen(specimen)}
    />
  );

  let specimenProtocols = {};
  Object.entries(options.specimen.protocols).forEach(
    ([id, protocol]) => {
      // FIXME: I really don't like 'toLowerCase()' function, but it's the
      // only way I can get it to work at the moment.
      const process = options.specimen.processes[protocol.processId].label
        .toLowerCase();
      if (typeId == protocol.typeId && process == processStage
      ) {
        specimenProtocols[id] = protocol.label;
      }
    }
  );

  const renderProtocolFields = () => {
    if (options.specimen.protocolAttributes[process.protocolId]) {
      if (process.data) {
        return <CustomFields
          options={options}
          errors={errors.data || {}}
          attributes={options.specimen.protocolAttributes[process.protocolId]}
          object={process.data}
          setData={setData} />;
      } else {
        setProcess('data', {});
      }
    }
  };

  const specimenTypeUnits = Object.keys(options.specimen.typeUnits[typeId]||{})
    .reduce(
      (result, id) => {
        result[id] = options.specimen.typeUnits[typeId][id].label;
        return result;
      }, {}
    );
  const collectionFields = processStage === 'collection' && [
    <TextboxElement
      name="quantity"
      label="Quantity"
      onUserInput={setProcess}
      required={true}
      value={process.quantity}
      errorMessage={errors.quantity}
    />,
    <SelectElement
      name="unitId"
      label="Unit"
      options={specimenTypeUnits}
      onUserInput={setProcess}
      required={true}
      value={process.unitId}
      errorMessage={errors.unitId}
      autoSelect={true}
    />,
  ];

  const protocolField = !props.hideProtocol && (
    <SelectElement
      name="protocolId"
      label="Protocol"
      options={specimenProtocols}
      onUserInput={setProtocol}
      required={true}
      value={process.protocolId}
      errorMessage={errors.protocolId}
      autoSelect={true}
    />
  );

  const examiners = mapFormOptions(options.examiners, 'label');
  if (typeId && edit === true) {
    return [
      protocolField,
      <SelectElement
        name="examinerId"
        label="Done By"
        options={examiners}
        onUserInput={setProcess}
        required={true}
        value={process.examinerId}
        errorMessage={errors.examinerId}
        autoSelect={true}
      />,
      <DateElement
        name="date"
        label="Date"
        onUserInput={setProcess}
        required={true}
        value={process.date}
        errorMessage={errors.date}
      />,
      <TimeElement
        name="time"
        label="Time"
        onUserInput={setProcess}
        required={true}
        value={process.time}
        errorMessage={errors.time}
      />,
      collectionFields,
      <div className='form-top'/>,
      renderProtocolFields(),
      <TextareaElement
        name="comments"
        label="Comments"
        onUserInput={setProcess}
        value={process.comments}
        errorMessage={errors.comments}
      />,
      updateButton,
    ];
  } else if (edit === false) {
    const protocolAttributes = options.specimen.protocolAttributes[
      process.protocolId
    ] || [];

    const protocolStaticFields = protocolAttributes.map((attribute) => {
      let value = process.data[attribute.id]; // Fetch the corresponding value from process.data

      // Convert boolean values to "Yes" or "No"
      if (value === true) {
        value = 'Yes';
      } else if (value === false) {
        value = 'No';
      }

      return (
        <StaticElement
          key={attribute.id}
          label={attribute.label} // Use the attribute label from the ordered list
          text={value || '—'} // Use an empty string if value is undefined
        />
      );
    });

    const collectionStaticFields = (processStage === 'collection') && (
      <StaticElement
        label='Quantity'
        text={process.quantity+' '+options.specimen.units[process.unitId].label}
      />
    );

    return [
      <StaticElement
        label='Protocol'
        text={options.specimen.protocols[process.protocolId].label}
      />,
      <StaticElement
        label='Site'
        text={options.centers[process.centerId]}
      />,
      <StaticElement
        label='Done By'
        text={options.examiners[process.examinerId].label}
      />,
      <StaticElement
        label='Date'
        text={process.date}
      />,
      <StaticElement
        label='Time'
        text={process.time}
      />,
      collectionStaticFields,
      protocolStaticFields,
      <StaticElement
        label='Comments'
        text={process.comments}
      />,
    ];
  }

  return null;
};

// ProcessForm.propTypes
SpecimenProcessForm.propTypes = {
  edit: PropTypes.bool,
  process: PropTypes.shape({
    data: PropTypes.object,
    protocolId: PropTypes.number,
    quantity: PropTypes.number,
    unitId: PropTypes.number,
    examinerId: PropTypes.number,
    date: PropTypes.string,
    time: PropTypes.string,
    comments: PropTypes.string,
    centerId: PropTypes.number,
  }).isRequired,
  processStage: PropTypes.string.isRequired,
  current: PropTypes.shape({
    files: PropTypes.array,
  }).isRequired,
  setCurrent: PropTypes.func.isRequired,
  typeId: PropTypes.number.isRequired,
  options: PropTypes.shape({
    specimen: PropTypes.shape({
      typeUnits: PropTypes.string,
      types: PropTypes.arrayOf(PropTypes.string),
      attributes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
      units: PropTypes.obj,
      protocols: PropTypes.arrayOf(PropTypes.string),
      processes: PropTypes.arrayOf(PropTypes.string),
      protocolAttributes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
    }).isRequired,
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
    candidates: PropTypes.arrayOf(PropTypes.string),
    candidateSessions: PropTypes.arrayOf(PropTypes.string),
    sessions: PropTypes.arrayOf(PropTypes.string),
    examiners: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  specimen: PropTypes.object.isRequired,
  errors: PropTypes.shape({
    data: PropTypes.obj,
    quantity: PropTypes.string,
    unitId: PropTypes.string,
    protocolId: PropTypes.string,
    examinerId: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    comments: PropTypes.string,
    container: PropTypes.shape({
      typeId: PropTypes.string,
    }),
  }).isRequired,
  hideProtocol: PropTypes.bool,
  increaseCoordinate: PropTypes.func.isRequired,
  createSpecimens: PropTypes.func.isRequired,
  printLabel: PropTypes.func.isRequired,
  getParentContainerBarcodes: PropTypes.func.isRequired,
  getBarcodePathDisplay: PropTypes.func.isRequired,
  setParent: PropTypes.func.isRequired,
  updateSpecimen: PropTypes.func.isRequired,
};

export default SpecimenProcessForm;
