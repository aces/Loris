import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import FilterableDataTable from 'FilterableDataTable';
import {UseShipment} from './Shipment';
// import Container from './Container';
import Modal from 'Modal';

import {
  StaticElement,
  TextboxElement,
  SelectElement,
  DateElement,
  TimeElement,
  TextareaElement,
  TagsElement,
} from 'jsx/Form';

import {get} from './helpers.js';


/**
 * Returns a JSX component for the shipment tab of the module
 *
 * @param {object} props - the parameters
 * @param {object} props.data - the data to display
 * @param {function} props.setData - a callback to set data
 * @param {object} props.options - values for select options?
 * @return {JSX}
 */
function ShipmentTab({
  data,
  setData,
  options,
}) {
  const [show, setShow] = useState(false);
  const [shipments, setShipments] = useState({});
  const users = {};

  // TODO: There has to be a better way to query this.
  Object.values(options.users).forEach((user) => {
    users[user.label] = user.label;
  });

  // TODO: Look into this for standardization:
  // https://www.robinwieruch.de/react-hooks-fetch-data
  useEffect(() => {
    const fetchData = async () => {
      setShipments(await get(`${loris.BaseURL}/biobank/shipments/`));
    };
    fetchData();
  }, []);

  const updateShipments = (updatedShipments) => {
    updatedShipments.forEach((shipment) => {
      setShipments({
        ...shipments,
        [shipment.barcode]: shipment,
      });
    });
  };

  const mapShipmentColumns = (column, value) => {
    switch (column) {
    case 'Origin Center':
      return options.centers[value];
    case 'Destination Center':
      return options.centers[value];
    default:
      return value;
    }
  };

  const formatShipmentColumns = (column, value, row) => {
    value = mapShipmentColumns(column, value);
    switch (column) {
    case 'Barcode':
      return (
        <td>
          <TriggerableModal
            label={value}
            title={value+' Information'}
          >
            <ShipmentInformation
              shipment={shipments[value]}
              centers={options.centers}
            />
          </TriggerableModal>
        </td>
      );
    case 'Actions':
      if (row['Status'] !== 'received') {
        return (
          <td>
            <ReceiveShipment
              shipment={shipments[row['Barcode']]}
              users={users}
              updateShipments={updateShipments}
              setData={setData}
            />
          </td>
        );
      }
      return <td></td>;
    default:
      return <td>{value}</td>;
    }
  };

  const shipmentData = Object.values(shipments).map((shipment) => {
    return [
      shipment.id,
      shipment.barcode,
      shipment.type,
      shipment.status,
      shipment.originCenterId,
      shipment.destinationCenterId,
    ];
  });

  const fields = [
    {label: 'ID', show: false},
    {label: 'Barcode', show: true, filter: {
      name: 'barcode',
      type: 'text',
    }},
    {label: 'Type', show: true, filter: {
      name: 'type',
      type: 'select',
      options: options.shipment.types,
    }},
    {label: 'Status', show: true, filter: {
      name: 'status',
      type: 'select',
      options: options.shipment.statuses,
    }},
    {label: 'Origin Center', show: true, filter: {
      name: 'originCenterId',
      type: 'select',
      options: options.centers,
    }},
    {label: 'Destination Center', show: true, filter: {
      name: 'destinationCenterId',
      type: 'select',
      options: options.centers,
    }},
    {label: 'Actions', show: true},
  ];

  const actions = [
    {
      name: 'addShipment',
      label: 'Add Shipment',
      action: () => setShow(true),
    },
  ];

  const forms = [
    <CreateShipment
      show={show}
      setShow={setShow}
      data={data}
      centers={options.centers}
      types={options.shipment.types}
      users={users}
      updateShipments={updateShipments}
      setData={setData}
    />,
  ];

  return (
    <>
      {forms}
      <FilterableDataTable
        data={shipmentData}
        fields={fields}
        actions={actions}
        getMappedCell={mapShipmentColumns}
        getFormattedCell={formatShipmentColumns}
      />
    </>
  );
}

// ShipmentTab.propTypes
ShipmentTab.propTypes = {
  // Data prop: Contains nested data objects
  data: PropTypes.shape({
    data: PropTypes.object.isRequired, // Define more specific shape if possible
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        // Add other container-specific properties if necessary
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        // Add other specimen-specific properties if necessary
      })
    ).isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,

  // Function to set data
  setData: PropTypes.func.isRequired,

  // Options prop: Configuration options for shipment, specimen, container, etc.
  options: PropTypes.shape({
    shipment: PropTypes.shape({
      statuses: PropTypes.object,
      types: PropTypes.object,
    }),
    specimen: PropTypes.shape({
      units: PropTypes.string.isRequired, // Added based on error
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    container: PropTypes.shape({
      typesPrimary: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      stati: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    diagnoses: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
      })
    ),
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
    projects: PropTypes.arrayOf(PropTypes.string).isRequired,
    candidates: PropTypes.arrayOf(PropTypes.string).isRequired,
    users: PropTypes.object,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,

  // Functional props
  increaseCoordinate: PropTypes.func.isRequired,
  createSpecimens: PropTypes.func.isRequired,

  // Other props (ensure these are actually used in the component)
  loading: PropTypes.bool.isRequired,

  // History prop: For navigation
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  // UI Control props
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};

/**
 * Returns some dom elements with information about a shipment
 *
 * @param {object} props - The parameters
 * @param {object} props.shipment - the shipment
 * @param {object} props.centers - centers
 * @return {JSX}
 */
function ShipmentInformation({
  shipment,
  centers,
}) {
  const logs = shipment.logs.map((log, i) => {
    return (
      <>
        <h4>Shipment Log {i+1}</h4>
        <HorizontalRule/>
        <StaticElement
          label='Center'
          text={centers[log.centerId]}
        />
        <StaticElement
          label='Status'
          text={log.status}
        />
        <StaticElement
          label='Temperature'
          text={log.temperature}
        />
        <StaticElement
          label='Date'
          text={log.date}
        />
        <StaticElement
          label='Time'
          text={log.time}
        />
        <StaticElement
          label='User'
          text={log.user}
        />
        <StaticElement
          label='Comments'
          text={log.comments}
        />
      </>
    );
  });

  const containerBarcodes = shipment.containerBarcodes.map((barcode, i) => {
    return (
      <Link
        key={i}
        to={`/barcode=${barcode}`}
      >
        {barcode}
      </Link>
    );
  }).reduce((prev, curr) => [prev, ', ', curr]);
  return (
    <>
      <StaticElement
        label='Barcode'
        text={shipment.barcode}
      />
      <StaticElement
        label='Type'
        text={shipment.type}
      />
      <StaticElement
        label='Containers'
        text={containerBarcodes}
      />
      <StaticElement
        label='Origin Center'
        text={centers[shipment.logs[0].centerId]}
      />
      <StaticElement
        label='Destination Center'
        text={centers[shipment.destinationCenterId]}
      />
      {logs}
    </>
  );
}

ShipmentInformation.propTypes = {
  // Shipment prop: Contains shipment details
  shipment: PropTypes.shape({
    barcode: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    logs: PropTypes.arrayOf(
      PropTypes.shape({
        centerId: PropTypes.number,
        temperature: PropTypes.number,
        date: PropTypes.string,
        time: PropTypes.string,
        user: PropTypes.string,
        comments: PropTypes.string,
      })
    ).isRequired,
    containerBarcodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    destinationCenterId: PropTypes.number.isRequired,
  }).isRequired,

  // Centers prop: Array of centers
  centers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/**
 * Modal form to create a shipment
 *
 * @param {object} props all the properties
 * @param {boolean} props.show
 * @param {object} props.data - the default data
 * @param {object} props.centers - the centers
 * @param {object} props.types - the types of shipments
 * @param {object} props.users - a list of selectable users
 * @param {function} props.updateShipments - an update callback
 * @param {function} props.setData - an update callback
 * @param {function} props.setShow
 * @return {JSX}
 */
function CreateShipment({
  show,
  setShow,
  data,
  centers,
  types,
  users,
  updateShipments,
  setData,
}) {
  const logIndex = 0;
  const handler = new UseShipment();
  const shipment = handler.getShipment();
  const errors = handler.getErrors();
  const onSubmit = async () => {
    const entities = await handler.post();
    updateShipments(entities.shipments);
    await setData('containers', entities.containers);
  };
  const onClose = () => {
    handler.clear();
    setShow(false);
  };

  // Use a ref to keep track of the previous value of 'show'
  const prevShowRef = useRef();

  useEffect(() => {
    const prevShow = prevShowRef.current;

    // Check if 'show' has changed from false to true
    if (!prevShow && show) {
      handler.addLog({status: 'created'});
    }

    // Update the ref with the current value of 'show' for the next render
    prevShowRef.current = show;
  }, [show]);

  // If the associated shipments containers change, update the site of the log.
  useEffect(() => {
    if (shipment.containerIds.length === 1) {
      const container = data.containers[shipment.containerIds[0]];
      handler.setLog('centerId', container.centerId, logIndex);
    }
  }, [shipment.containerIds]);

  return (
    <Modal
      show={show}
      title='Create Shipment'
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <StaticElement
        label='Note'
        text='Any container or specimen added to this form will be
        dissassociated from its parent. Any children of the containers listed
        will also be added to the shipment.'
      />
      <TextboxElement
        name='barcode'
        label='Barcode'
        onUserInput={handler.set}
        value={shipment.barcode}
        errorMessage={errors.barcode}
        required={true}
      />
      <SelectElement
        name='type'
        label='Container Type'
        onUserInput={handler.set}
        value={shipment.type}
        options={types}
        errorMessage={errors.type}
        required={true}
      />
      <TagsElement
        name='barcode'
        label="Container"
        items={shipment.containerIds}
        handleAdd={handler.setContainerIds}
        options={data.containers}
        useSearch={true}
        errorMessage={errors.containerIds}
      />
      <SelectElement
        name='destinationCenterId'
        label='Destination Center'
        onUserInput={handler.set}
        value={shipment.destinationCenterId}
        options={centers}
        errorMessage={errors.destinationCenter}
        required={true}
      />
      <ShipmentLogForm
        log={shipment.logs[logIndex]}
        setLog={(name, value) => handler.setLog(name, value, logIndex)}
        errors={errors.logs[logIndex]}
        users={users}
      />
    </Modal>
  );
}

CreateShipment.propTypes = {
  // UI Control props
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,

  // Data prop: Contains containers and other data
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        // Add other container-specific properties if necessary
      })
    ).isRequired,
    // Add other data-specific properties if necessary
  }).isRequired,

  // Centers prop: Array of centers
  centers: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Types prop: Array of shipment types
  types: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,

  // Users prop: Array of users
  users: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Functional props
  updateShipments: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,

  // Additional props based on errors
  // Ensure all necessary props are included
};

/**
 * React Component for a received shipment
 *
 * @param {object} props - The parameters
 * @param {object} props.shipment - the shipment
 * @param {object} props.users - the users for the dropdown
 * @param {function} props.updateShipments - an update callback
 * @param {function} props.setData - a callback for setting data
 * @return {JSX}
 */
function ReceiveShipment({
  shipment,
  users,
  updateShipments,
  setData,
}) {
  const handler = new UseShipment(shipment);
  const logIndex = handler.getShipment().logs.length-1;
  const onSuccess = ({shipments, containers}) => {
    updateShipments(shipments);
    setData('containers', containers);
  };

  const onOpen = () => {
    handler.addLog(
      {status: 'received', centerId: shipment.destinationCenterId}
    );
  };

  // TODO: At the top of this form, it wouldn't hurt to have a ShipmentSummary
  // to display the pertinent information from the shipment!
  return (
    <TriggerableModal
      label='Receive Shipment'
      title={'Receive Shipment '+shipment.barcode}
      onUserInput={onOpen}
      onSubmit={handler.post}
      onSuccess={onSuccess}
      onClose={handler.clear}
    >
      <ShipmentLogForm
        log={handler.getShipment().logs[logIndex]}
        setLog={(name, value) => handler.setLog(name, value, logIndex)}
        errors={handler.getErrors().logs[logIndex]}
        users={users}
      />
    </TriggerableModal>
  );
}

ReceiveShipment.propTypes = {
  // Shipment prop: Contains shipment details
  shipment: PropTypes.shape({
    barcode: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    destinationCenterId: PropTypes.number.isRequired,
    logs: PropTypes.arrayOf(
      PropTypes.shape({
        centerId: PropTypes.number,
        temperature: PropTypes.number,
        date: PropTypes.string,
        time: PropTypes.string,
        user: PropTypes.string,
        comments: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,

  // Users prop: Array of users
  users: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Functional props
  updateShipments: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};

/**
 * Return a form for the shipment log
 *
 * @param {object} props - the parameters
 * @param {object} props.log - the log
 * @param {function} props.setLog - a callback for when the log is set
 * @param {object} props.errors - a list of errors
 * @param {object} props.users - a list of selectable users
 * @return {JSX}
 */
function ShipmentLogForm({
  log,
  setLog,
  errors = {},
  users,
}) {
  return (
    <>
      <TextboxElement
        name='temperature'
        label='Temperature'
        onUserInput={setLog}
        value={log.temperature}
        errorMessage={errors.temperature}
        required={true}
      />
      <DateElement
        name='date'
        label='Date'
        onUserInput={setLog}
        value={log.date}
        errorMessage={errors.date}
        required={true}
      />
      <TimeElement
        name='time'
        label='Time'
        onUserInput={setLog}
        value={log.time}
        errorMessage={errors.time}
        required={true}
      />
      <SelectElement
        name='user'
        label='Done by'
        onUserInput={setLog}
        value={log.user}
        options={users}
        errorMessage={errors.user}
        required={true}
      />
      <TextareaElement
        name='comments'
        label='Comments'
        onUserInput={setLog}
        value={log.comments}
        errorMessage={errors.comments}
      />
    </>
  );
}

ShipmentLogForm.propTypes = {
  // Log prop: Contains log details
  log: PropTypes.shape({
    temperature: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    comments: PropTypes.string,
    // Add other log-specific properties if necessary
  }).isRequired,

  // Function to set log
  setLog: PropTypes.func.isRequired,

  // Errors prop: Validation errors for log
  errors: PropTypes.shape({
    temperature: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    user: PropTypes.string,
    comments: PropTypes.string,
    // Add other error-specific properties if necessary
  }).isRequired,

  // Users prop: Array of users
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ShipmentTab;
