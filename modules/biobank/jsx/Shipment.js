import {useState} from 'react';
import {get, post} from './helpers.js';

/**
 * React effect for creating a request to create a new
 * shipment
 *
 * @param {object} initShipment - the initial value for the shipment
 * @return {Shipment}
 */
export function UseShipment(initShipment = {}) {
  const [init, setInit] = useState(initShipment);
  const [shipment, setShipment] = useState(new Shipment(init));
  const [errors, setErrors] = useState(new Shipment({}));

  this.set = (name, value) => setShipment(shipment.set(name, value));
  this.setContainerIds = (value) => this.set('containerIds', value);
  this.addLog = (log) => this.setLogs(shipment.addLog(log));
  this.setLogs = (value) => this.set('logs', value);
  this.setLog = (name, value, index) =>
    this.setLogs(shipment.setLog(name, value, index));
  this.remove = (name) => setShipment(shipment.remove(name));
  this.clear = () => {
    setShipment(new Shipment(init));
    setErrors(new Shipment({}));
  };
  this.post = async () =>
    await post(
      shipment,
      `${loris.BaseURL}/biobank/shipments/`,
      'POST'
    ).catch((e) => Promise.reject(setErrors(new Shipment(e))));
  this.put = async () =>
    await post(
      shipment,
      `${loris.BaseURL}/biobank/shipments/`,
      'PUT'
    ).then((shipments) => {
      setInit(new Shipment(shipments[0]));
      setShipment(new Shipment(shipments[0]));
      return shipments;
    })
      .catch((e) => Promise.reject(setErrors(new Shipment(e))));
  this.getShipment = () => shipment;
  this.getErrors = () => errors;

  return this;
}

/**
 * A Shipment of a container
 */
class Shipment {
  /**
   * Constructor
   *
   * @param {object} params - The shipment parameters
   * @param {string} params.id - Shipment ID
   * @param {string} params.barcode - Shipment barcode
   * @param {string} params.type - Shipment type
   * @param {number} params.destinationCenterId - Destination center ID
   * @param {Array} params.logs - Logs for this shipment
   * @param {Array} params.containerIds - Container IDs in this shipment
   */
  constructor({
    id = null,
    barcode = null,
    type = null,
    destinationCenterId = null,
    logs = [],
    containerIds = [],
  }) {
    this.id = id;
    this.barcode = barcode;
    this.type = type;
    this.destinationCenterId = destinationCenterId;
    this.logs = logs.map((log) => new Log(log));
    this.containerIds = containerIds;
  }

  /**
   * Sets name to value in this shipment
   *
   * @param {string} name - the key
   * @param {object} value - the value
   * @return {Shipment}
   */
  set(name, value) {
    return new Shipment({...this, [name]: value});
  }

  /**
   * Remove attribuet from shipment
   *
   * @param {object} name - attribute to be removed
   * @return {Shipment}
   */
  remove(name) {
    return new Shipment({name, ...this});
  }

  /**
   * Load a shipment from the server
   *
   * @param {string} id - the id of the shipment
   * @return {Shipment}
   */
  async load(id) {
    const shipment = await get(`${loris.BaseURL}/biobank/shipments/${id}`);
    return new Shipment(shipment);
  }

  /**
   * Adds a new log to this shipment
   *
   * @param {object} log - the log values
   * @return {array}
   */
  addLog(log) {
    return [...this.logs, new Log(log)];
  }

  /**
   * Sets the log at index i to name/value
   *
   * @param {string} name - the log name
   * @param {any} value - the log value
   * @param {number} index - the index
   * @return {array}
   */
  setLog(name, value, index) {
    return this.logs.map((log, i) => {
      if (i !== index) {
        return log;
      }
      return new Log({...log, [name]: value});
    });
  }
}

/**
 * A log of shipments
 */
class Log {
  /**
   * Constructor
   *
   * @param {object} props - React props
   */
  constructor(props = {}) {
    this.barcode = props.barcode || null;
    this.centerId = props.centerId || null;
    this.status = props.status || null;
    this.user = props.user || null;
    this.temperature = props.temperature || null;
    this.date = props.date || null;
    this.time = props.time || null;
    this.comments = props.comments || null;
  }

  /**
   * Set a value
   *
   * @param {string} name - the key
   * @param {any} value - the value
   * @return {Log} - A new log object with the key set to value
   */
  set(name, value) {
    return new Log({...this, [name]: value});
  }
}

export default Shipment;
