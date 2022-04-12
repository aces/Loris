import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import FilterableDataTable from 'FilterableDataTable';
import {useShipment} from './Shipment';
// import Container from './Container';
import TriggerableModal from 'TriggerableModal';

import {get} from './helpers.js';

// TODO:
// - Make sure all subcontainers are loaded into shipment
// - Make sure all containers change center when shipment is received
// - Make sure to block all

function ShipmentTab({
  data,
  setData,
  options,
}) {
  const [shipments, setShipments] = useState({});
  const users = {};
  // TODO: There has to be a better way to query this!!!
  Object.values(options.users).forEach((user) => {
    users[user.label] = user.label;
  });

  // TODO: Look into this for standardization: https://www.robinwieruch.de/react-hooks-fetch-data
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

  const formatShipmentColumns = (column, value, row) => {
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
                containers={data.containers}
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
      options.centers[shipment.originCenterId],
      options.centers[shipment.destinationCenterId],
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

  const forms = [
    <CreateShipment
      data={data}
      centers={options.centers}
      types={options.shipment.types}
      users={users}
      updateShipments={updateShipments}
      setData={setData}
    />,
  ];

  return (
    <FilterableDataTable
      data={shipmentData}
      fields={fields}
      forms={forms}
      getFormattedCell={formatShipmentColumns}
    />
  );
}

function ShipmentInformation({
  shipment,
  containers = {},
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

  const containerBarcodes = shipment.containerIds.map((id, i) => {
    const barcode = (containers[id] || {}).barcode;
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

function CreateShipment({
  data,
  centers,
  types,
  users,
  updateShipments,
  setData,
}) {
  const logIndex = 0;
  const handler = new useShipment();
  const shipment = handler.getShipment();
  const errors = handler.getErrors();
  const onSubmit = async () => {
    const entities = await handler.post();
    updateShipments(entities.shipments);
    await setData('containers', entities.containers);
  };
  const onOpen = () => {
    handler.addLog({status: 'created'});
  };

  // If the associated shipments containers change, update the site of the log.
  useEffect(() => {
    if (shipment.containerIds.length === 1) {
      const container = data.containers[shipment.containerIds[0]];
      handler.setLog('centerId', container.centerId, logIndex);
    }
  }, [shipment.containerIds]);

  return (
    <TriggerableModal
      label='Create Shipment'
      title='Create Shipment'
      onUserInput={onOpen}
      onSubmit={onSubmit}
      onClose={handler.clear}
    >
      <StaticElement
        label='Note'
        text="Any container or specimen added to this form will be dissassociated
        from its parent. Any children of the containers listed will also be added
        to the shipment."
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
      <InputList
        name='barcode'
        label="Container"
        items={shipment.containerIds}
        setItems={handler.setContainerIds}
        options={data.containers}
        errorMessage={errors.containerIds}
      />
      <SelectElement
        name='destinationCenterId'
        label='Destination Center'
        onUserInput={handler.set}
        value={shipment.destinationCenterId}
        options={centers}
        errorMessage={errors.destinationCenterId}
        required={true}
      />
      <ShipmentLogForm
        log={shipment.logs[logIndex]}
        setLog={(name, value) => handler.setLog(name, value, logIndex)}
        errors={errors.logs[logIndex]}
        users={users}
      />
    </TriggerableModal>
  );
}

function ReceiveShipment({
  shipment,
  users,
  updateShipments,
  setData,
}) {
  const handler = new useShipment(shipment);
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

/**
 * Return a form for the shipment log
 *
 * @param {object} log - the log
 * @param {callback} setLog - a callback for when the log is set
 * @param {object} errors - a list of errors
 * @param {object} users - a list of selectable users
 *
 * @return {ReactDOM[]}
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

export default ShipmentTab;
