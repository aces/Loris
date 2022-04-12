import {useState} from 'react';
import {get, post} from './helpers.js';

export function useShipment(initShipment = {}) {
  const [init, setInit] = useState(initShipment);
  const [shipment, setShipment] = useState(new Shipment(init));
  const [errors, setErrors] = useState(new Shipment({}));

  this.set = (name, value) => setShipment(shipment.set(name, value));
  this.setContainerIds = (value) => this.set('containerIds', value);
  this.addLog = (log) => this.setLogs(shipment.addLog(log));
  this.setLogs = (value) => this.set('logs', value);
  this.setLog = (name, value, index) => this.setLogs(shipment.setLog(name, value, index));
  this.remove = (name) => setShipment(shipment.remove(name));
  this.clear = () => {
    setShipment(new Shipment(init));
    setErrors(new Shipment({}));
  };
  this.post = async () => await post(shipment, `${loris.BaseURL}/biobank/shipments/`, 'POST')
    .catch((e) => Promise.reject(setErrors(new Shipment(e))));
  this.put = async () => await post(shipment, `${loris.BaseURL}/biobank/shipments/`, 'PUT')
    .then((shipments) => {
      setInit(new Shipment(shipments[0]));
      setShipment(new Shipment(shipments[0]));
      return shipments;
    })
    .catch((e) => Promise.reject(setErrors(new Shipment(e))));
  this.getShipment = () => shipment;
  this.getErrors = () => errors;

  return this;
}

class Shipment {
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

  set(name, value) {
    return new Shipment({...this, [name]: value});
  }

  remove(name) {
    return new Shipment({name, ...this});
  }

  async load(id) {
   const shipment = await get(`${loris.BaseURL}/biobank/shipments/${id}`);
   return new Shipment(shipment);
  }

  addLog(log) {
    return [...this.logs, new Log(log)];
  };

  setLog(name, value, index) {
    return this.logs.map((log, i) => {
      if (i !== index) {
        return log;
      }
      return new Log({...log, [name]: value});
    });
  };
}

class Log {
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

  set(name, value) {
    return new Log({...this, [name]: value});
  }
}

export default Shipment;
