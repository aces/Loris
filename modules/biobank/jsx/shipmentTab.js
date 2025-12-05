import React, {useState, useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import FilterableDataTable from '../../../jsx/FilterableDataTable'; // Temporary CBIGR Override for 26.0
import {UseShipment} from './Shipment';
// import Container from './Container';
import Modal from '../../../jsx/Modal'; // Temporary CBIGR Override for 26.0
import TriggerableModal from '../../../jsx/TriggerableModal'; // Temporary CBIGR Override for 26.0

import {
  StaticElement,
  TextboxElement,
  SelectElement,
  DateElement,
  TimeElement,
  TextareaElement,
  CTA,
} from '../../../jsx/Form'; // Temporary CBIGR Override for 26.0

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
  const { t } = useTranslation(['biobank', 'loris']);
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
      case t('biobank:Origin Site'):
        return options.centers[value];
      case t('biobank:Destination Site'):
        return options.centers[value];
      default:
        return value;
    }
  };

  const formatShipmentColumns = (column, value, row) => {
    value = mapShipmentColumns(column, value);
    switch (column) {
    case t('biobank:Barcode', {count: 1}):
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
      case t('biobank:Actions'):
      if (row[t('biobank:Status')] !== 'received') {
        return (
          <td>
            <ReceiveShipment
              shipment={shipments[row[t('biobank:Barcode')]]}
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
    {label: t('biobank:Barcode', {count: 1}), show: true, filter: {
      name: 'barcode',
      type: 'text',
    }},
    {label: t('biobank:Type'), show: true, filter: {
      name: 'type',
      type: 'select',
      options: options.shipment.types,
    }},
    {label: t('biobank:Status'), show: true, filter: {
      name: 'status',
      type: 'select',
      options: options.shipment.statuses,
    }},
    {label: t('biobank:Origin Site'), show: true, filter: {
      name: 'originCenterId',
      type: 'select',
      options: options.centers,
    }},
    {label: t('biobank:Destination Site'), show: true, filter: {
      name: 'destinationCenterId',
      type: 'select',
      options: options.centers,
    }},
    {label: t('biobank:Actions'), show: true},
  ];

  const actions = [
    {
      name: 'addShipment',
      label: t('biobank:Add Shipment'),
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
  const { t } = useTranslation(['biobank', 'loris']);
  const logs = shipment.logs.map((log, i) => {
    return (
      <>
        <h4>Shipment Log {i+1}</h4>
        <HorizontalRule/>
        <StaticElement
          label={t('loris:Site')}
          text={centers[log.centerId]}
        />
        <StaticElement
          label={t('biobank:Status')}
          text={log.status}
        />
        <StaticElement
          label={t('biobank:Temperature')}
          text={log.temperature}
        />
        <StaticElement
          label={t('biobank:Date & Time')}
          text={log.time.date.substring[0, 15]}
        />
        <StaticElement
          label={t('biobank:User')}
          text={log.user}
        />
        <StaticElement
          label={t('biobank:Comments')}
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
        label={t('Barcode', {ns: 'biobank'})}
        text={shipment.barcode}
      />
      <StaticElement
        label={t('Type', {ns: 'biobank'})}
        text={shipment.type}
      />
      <StaticElement
        label={t('Containers', {ns: 'biobank'})}
        text={containerBarcodes}
      />
      <StaticElement
        label={t('Origin Center', {ns: 'biobank'})}
        text={centers[shipment.logs[0].centerId]}
      />
      <StaticElement
        label={t('Destination Center', {ns: 'biobank'})}
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
  const { t } = useTranslation('biobank');
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
      title={t('biobank:Create Shipment')}
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <StaticElement
        label={t('loris:Note')}
        text={t(`biobank:Any container or specimen added to this form will be
        dissassociated from its parent. Any children of the containers listed
        will also be added to the shipment.`)}
      />
      <TextboxElement
        name='barcode'
        label={t('biobank:Barcode')}
        onUserInput={handler.set}
        value={shipment.barcode}
        errorMessage={errors.barcode}
        required={true}
      />
      <SelectElement
        name='type'
        label={t('biobank:Container Type')}
        onUserInput={handler.set}
        value={shipment.type}
        options={types}
        errorMessage={errors.type}
        required={true}
      />
      <InputList
        name='barcode'
        label={t('biobank:Container')}
        items={shipment.containerIds}
        setItems={handler.setContainerIds}
        options={data.containers}
        errorMessage={errors.containerIds}
      />
      <SelectElement
        name='destinationCenterId'
        label={t('biobank:Destination Center')}
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
  const { t } = useTranslation('biobank');
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
      label={t('biobank:Receive Shipment')}
      title={t('biobank:Receive Shipment')+' '+shipment.barcode}
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
  log = {},
  setLog,
  errors = {},
  users,
}) {
  const { t } = useTranslation(['biobank', 'loris']);
  return (
    <>
      <TextboxElement
        name='temperature'
        label={t('biobank:Temperature')}
        onUserInput={setLog}
        value={log.temperature}
        errorMessage={errors.temperature}
        required={true}
      />
      <DateElement
        name='date'
        label={t('loris:Date')}
        onUserInput={setLog}
        value={log.date}
        errorMessage={errors.date}
        required={true}
      />
      <TimeElement
        name='time'
        label={t('loris:Time')}
        onUserInput={setLog}
        value={log.time}
        errorMessage={errors.time}
        required={true}
      />
      <SelectElement
        name='user'
        label={t('biobank:Done by')}
        onUserInput={setLog}
        value={log.user}
        options={users}
        errorMessage={errors.user}
        required={true}
      />
      <TextareaElement
        name='comments'
        label={t('biobank:Comments')}
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

// The following code needs to eventually be extracted to Form.js

/**
 * Form Header component.
 * Renders a header (h1-h6) with a horizontal rule below it.
 *
 * @param {object} props - The parameters for the FormHeader component.
 * @param {number} [props.level=4] - The heading level (1-6) for the header tag (e.g., 1 for <h1>). Defaults to 4.
 * @param {string} [props.header=''] - The text content to display within the header tag. Defaults to an empty string.
 * @return {JSX.Element} The rendered header and horizontal rule.
 */
function FormHeader({level = 4, header = ''}) {
  const Tag = 'h' + level;
  return (
    <>
      <Tag>{header}</Tag>
      <HorizontalRule/>
    </>
  );
}

FormHeader.propTypes = {
  /**
   * The heading level (1-6) for the header tag (e.g., 1 for <h1>).
   * Defaults to 4 if not provided.
   */
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  /**
   * The text content to display within the header tag.
   * Defaults to an empty string if not provided.
   */
  header: PropTypes.string,
};

/**
 * Horizontal Rule component.
 * Renders a styled horizontal line for visual separation.
 *
 * @return {JSX.Element} The rendered div element with a horizontal line style.
 */
function HorizontalRule() {
  const lineStyle = {
    borderTop: '1.5px solid #DDDDDD',
    paddingTop: 15,
    marginTop: 0,
  };
  return <div style={lineStyle}/>;
}

HorizontalRule.propTypes = {
  // This component does not accept any props, so propTypes is an empty object.
  // If you wanted to explicitly ensure no props are passed, you could use:
  // children: PropTypes.node // if you wanted to allow children but nothing else
  // or simply leave it as an empty object if no props are expected at all.
};

/**
 * Input List component.
 * Renders an input field to add items to a list, displays the current list,
 * and allows items to be removed.
 *
 * @param {object} props - The parameters for the InputList component.
 * @param {string} props.name - The HTML `name` attribute for the underlying textbox element.
 * @param {string} props.label - The label text to display for the input and list headers.
 * @param {Array<string>} props.items - An array of item keys (strings) currently in the list.
 * @param {function(Array<string>): void} props.setItems - A callback function to update the list of items.
 * @param {string|Array<string>} [props.errorMessage] - An optional error message or array of messages to display for the input.
 * @param {object} props.options - An object mapping item keys to their full data objects.
 * Each data object must contain a property matching `props.name`
 * to display the item correctly.
 * @return {JSX.Element} The rendered input list component.
 */
function InputList({
  name,
  label,
  items,
  setItems,
  errorMessage,
  options,
}) {
  const [item, setItem] = useState('');

  const removeItem = (index) => setItems(items.filter((item, i) => index != i));
  const addItem = () => {
    const match = Object.keys(options)
      .find((key) => options[key][name] == item);
    // if entry is in list of options and does not already exist in the list.
    if (match && !items.includes(match)) {
      setItems([...items, match]);
      setItem('');
    }
  };

  const listStyle = {
    border: '1px solid #DDD',
    borderRadius: '10px',
    minHeight: '85px',
    padding: '5px',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  };

  const listItemStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const itemsDisplay = items.map((item, i) => {
    const style = {
      color: '#DDDDDD',
      marginLeft: 10,
      cursor: 'pointer',
    };
    return (
      <div key={i} style={listItemStyle}>
        <div>{options[item][name]}</div>
        <div
          className='glyphicon glyphicon-remove'
          onClick={() => removeItem(i)}
          style={style}
        />
      </div>
    );
  });

  const error = errorMessage instanceof Array ?
    errorMessage.join(' ') : errorMessage;
  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div style={{flex: '0.47'}}>
        <FormHeader header={label + ' Input'}/>
        <InlineField weights={[1, 0]}>
          <TextboxElement
            name={name}
            onUserInput={(name, value) => setItem(value)}
            value={item}
            errorMessage={error}
          />
          <CTA
            label='Add'
            onUserInput={addItem}
          />
        </InlineField>
      </div>
      <div style={{flex: '0.47'}}>
        <FormHeader header={label + ' List'}/>
        <div style={listStyle}>
          {itemsDisplay}
        </div>
      </div>
    </div>
  );
}

InputList.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  setItems: PropTypes.func.isRequired,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  options: PropTypes.objectOf(
    PropTypes.shape({
      [PropTypes.PropTypes.string]: PropTypes.string, // This is a placeholder, actual key is dynamic (props.name)
    }).isRequired
  ).isRequired,
};

/**
 * Inline Field component.
 * A layout component that arranges its children horizontally using flexbox.
 * It can distribute space among children based on provided `weights`.
 *
 * @param {object} props - The parameters for the InlineField component.
 * @param {React.ReactNode} props.children - The child React elements to be rendered inline.
 * @param {string} [props.label=''] - An optional label for the inline field (though not directly rendered by this component). Defaults to an empty string.
 * @param {Array<number>} [props.weights=[]] - An optional array of numbers specifying the flex-grow weights for each child element. The index of the weight corresponds to the child's index. Defaults to an empty array (meaning children will not grow by default).
 * @return {JSX.Element} The rendered container with inline fields.
 */
function InlineField({children, label = '', weights = []}) {
  const fields = React.Children.map(children, (child, i) => {
    return (
      <div style={{flex: weights[i] || 0}}>
        {child}
      </div>
    );
  });

  const inlineStyle = {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'spaceBetween',
  };
  return (
    <div style={inlineStyle}>
      {fields}
    </div>
  );
}

InlineField.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  weights: PropTypes.arrayOf(PropTypes.number),
};

export default withTranslation()(ShipmentTab);
