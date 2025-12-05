import {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import BiobankFilter from './filter';
import BarcodePage from './barcodePage';

import frStrings from '../locale/fr/LC_MESSAGES/biobank.json';

import {clone, isEmpty, get, getStream, post} from './helpers.js';

/**
 * The main React entrypoint for the biobank module. This component
 * renders the index page.
 */
class BiobankIndex extends Component {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = {
      data: {
        containers: {},
        pools: {},
        specimens: {},
      },
      loading: 0,
      options: {
        candidatesSessions: {},
        candidates: {},
        centers: {},
        container: {
          types: {},
          typesPrimary: {},
          typesNonPrimary: {},
          dimensions: {},
          stati: {},
        },
        diagnoses: {},
        examiners: {},
        users: {},
        projects: {},
        sessions: {},
        specimen: {
          types: {},
          typeUnits: {},
          typeContainerTypes: {},
          protocols: {},
          protocolAttributes: {},
          protocolContainers: {},
          processes: {},
          processAttributes: {},
          attributes: {},
          attributeDatatypes: {},
          attributesOptions: {},
          units: {},
        },
        shipment: {
          statuses: {},
          types: {},
        },
      },
    };

    this.printLabel = this.printLabel.bind(this);
    this.routeBarcode = this.routeBarcode.bind(this);
    this.setData = this.setData.bind(this);
    this.increaseCoordinate = this.increaseCoordinate.bind(this);
    this.updateSpecimen = this.updateSpecimen.bind(this);
    this.updateSpecimens = this.updateSpecimens.bind(this);
    this.editSpecimens = this.editSpecimens.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.createPool = this.createPool.bind(this);
    this.saveBatchEdit = this.saveBatchEdit.bind(this);
    this.createSpecimens = this.createSpecimens.bind(this);
    this.createContainers = this.createContainers.bind(this);
    this.validateSpecimen = this.validateSpecimen.bind(this);
    this.validateProcess = this.validateProcess.bind(this);
    this.validateContainer = this.validateContainer.bind(this);
  }

  /**
   * React lifecycle method
   */
  async componentDidMount() {
    const updateProgress = (loading) => this.setState({loading});

    const specimens = getStream(this.props.specimenAPI, updateProgress);
    const containers = get(this.props.containerAPI);
    const pools = get(this.props.poolAPI);
    const options = await get(this.props.optionsAPI);
    this.setState({options});

    const data = this.state.data;
    data.containers = await containers;
    data.specimens = await specimens;
    data.pools = await pools;
    this.setState({data});
    updateProgress(100);
  }

  /**
   * Sets data for entities
   *
   * @param {string} type - the type of entity
   * @param {object} entities - the entities to set
   * @return {Promise}
   */
  setData(type, entities) {
    return new Promise((resolve) => {
      const data = clone(this.state.data);
      entities.forEach((entity) => data[type][entity.id] = entity);
      this.setState({data}, resolve());
    });
  }

  /**
   * Send a request to a server to print a label
   *
   * @param {object} labelParams - the properties of the label to print
   * @return {Promise}
   */
  printLabel(labelParams) {
    return post(labelParams, this.props.labelAPI, 'POST');
  }

  /**
   * Find the appropriate container for a barcode.
   *
   * @param {string} barcode - the value to route
   * @return {object}
   */
  routeBarcode(barcode) {
    const container = Object.values(this.state.data.containers)
      .find((container) => container.barcode == barcode);

    const specimen = Object.values(this.state.data.specimens)
      .find((specimen) => specimen.containerId == container.id);

    return {container, specimen};
  }

  /**
   * Send a request to update a single specimen on the server after
   * validating it
   *
   * @param {object} specimen - the specimen to update
   * @return {Promise}
   */
  updateSpecimen(specimen) {
    const errors = this.validateSpecimen(specimen);
    if (!isEmpty(errors)) {
      return Promise.rejecthis.props.t({specimen: errors}, {ns: 'biobank'});
    }

    return post(specimen, this.props.specimenAPI, 'PUT')
      .then((specimens) => this.setData('specimens', specimens));
  }

  /**
   * Update multiple specimens at once
   *
   * @param {array} list - the list of specimens to update
   * @return {Promise}
   */
  updateSpecimens(list) {
    const updateList = list
      .map((specimen) => () => this.updateSpecimen(specimen));

    return Promise.all(updateList.map((updateSpecimen) => updateSpecimen()));
  }

  /**
   * Edit a list of specimens
   *
   * @param {array} list - a list of specimens
   * @return {Promise}
   */
  editSpecimens(list) {
    let errors = {};
    errors.specimen = this.validateSpecimen(list[0].specimen);
    errors.container = this.validateContainer(list[0].container);
    if (!isEmpty(errors.specimen) || !isEmpty(errors.container)) {
      return Promise.rejecthis.props.t(errors, {ns: 'biobank'});
    }

    const specimenList = list
      .map((item) => () => this.updateSpecimen(item.specimen));
    const containerList = list
      .map((item) => () => this.updateContainer(item.container));

    return Promise.all(specimenList.map((item) => item()))
      .then(() => Promise.all(containerList.map((item) => item())));
  }

  /**
   * Sends a request to update a container on the server
   *
   * @param {object} container - the container to update
   * @return {Promise}
   */
  updateContainer(container) {
    const errors = this.validateContainer(container);
    if (!isEmpty(errors)) {
      return Promise.rejecthis.props.t({container: errors}, {ns: 'biobank'});
    }

    return post(container, this.props.containerAPI, 'PUT')
      .then((containers) => this.setData('containers', containers));
  }

  /**
   * Increase the coordinates of a container to put it in the
   * next available slot.
   *
   * @param {object} coordinate - the coordinate to increment
   * @param {number} parentContainerId - the parent container
   * @return {number}
   */
  increaseCoordinate(coordinate, parentContainerId) {
    const containers = this.state.data.containers;
    const childCoordinates = containers[parentContainerId].childContainerIds
      .reduce((result, id) => {
        const container = containers[id];
        if (container.coordinate) {
          result[container.coordinate] = id;
        }
        return result;
      }, {});

    const increment = (coord) => {
      coord++;
      if (childCoordinates.hasOwnProperty(coord)) {
        coord = incrementhis.props.t(coord, {ns: 'biobank'});
      }

      return coord;
    };

    return incrementhis.props.t(coordinate, {ns: 'biobank'});
  }

  /**
   * Create a batch of specimens
   *
   * @param {object} list - list of specimens
   * @param {object} current - holds current state for specific values
   * @param {boolean} print - whether the barcodes should be printed
   * @return {Promise}
   */
  createSpecimens(list, current, print) {
    const {options, data} = this.state;
    const centerId = current.centerId;
    const availableId = Object.keys(options.container.stati).find(
      (key) => options.container.stati[key].label === 'Available'
    );
    const errors = {specimen: {}, container: {}, list: {}};

    let isError = false;
    Object.keys(list).reduce((coord, key) => {
      // set specimen values
      const specimen = list[key];
      specimen.candidateId = current.candidateId;
      specimen.sessionId = current.sessionId;
      specimen.quantity = specimen.collection.quantity;
      specimen.unitId = specimen.collection.unitId;
      specimen.collection.centerId = centerId;
      if ((options.specimen.types[specimen.typeId]||{}).freezeThaw == 1) {
        specimen.fTCycle = 0;
      }
      specimen.parentSpecimenIds = current.parentSpecimenIds || null;

      // set container values
      const container = specimen.container;
      container.statusId = availableId;
      container.temperature = 20;
      container.centerId = centerId;
      container.originId = centerId;

      // If the container is assigned to a parent, place it sequentially in the
      // parent container and inherit the status, temperature and centerId.
      if (current.container.parentContainerId) {
        const containerParentId = current.container.parentContainerId;
        container.parentContainerId = current.container.parentContainerId;
        const parentContainer = data.containers[containerParentId];
        const dims = options.container.dimensions;
        const dimensions = dims[parentContainer.dimensionId];
        const capacity = dimensions.x * dimensions.y * dimensions.z;
        coord = this.increaseCoordinate(
          coord,
          current.container.parentContainerId
        );
        if (coord <= capacity) {
          container.coordinate = parseInthis.props.t(coord, {ns: 'biobank'});
        } else {
          container.coordinate = null;
        }
        container.statusId = parentContainer.statusId;
        container.temperature = parentContainer.temperature;
        container.centerId = parentContainer.centerId;
      }

      // if specimen type id is not set yet, this will throw an error
      if (specimen.typeId) {
      }

      specimen.container = container;
      list[key] = specimen;

      // this is so the global params (sessionId, candidateId, etc.) show errors
      // as well.
      errors.container = this.validateContainer(container, key);
      errors.specimen = this.validateSpecimen(specimen, key);

      if (!isEmpty(errors.container)) {
        errors.list[key] = {container: errors.container};
      }
      if (!isEmpty(errors.specimen)) {
        errors.list[key] = {...errors.list[key], specimen: errors.specimen};
      }

      if (!isEmpty(errors.list[key])) {
        isError = true;
      }

      return coord;
    }, 0);

    if (isError) {
      return Promise.rejecthis.props.t(errors, {ns: 'biobank'});
    }

    const printBarcodes = (entities) => {
      return new Promise((resolve) => {
        if (print) {
          Swal.fire({
            title: this.props.t('Print Barcodes?', {ns: 'biobank'}),
            type: 'question',
            confirmButtonText: this.props.t('Yes', {ns: 'loris'}),
            cancelButtonText: this.props.t('No', {ns: 'loris'}),
            showCancelButton: true,
          })
            .then((result) => {
              if (result.value) {
                const labelParams = [];
                Object.values(entities.specimens).forEach((specimen) => {
                  labelParams.push({
                    barcode: specimen.barcode,
                    type: options.specimen.types[specimen.typeId].label,
                    pscid: specimen.candidatePSCID,
                    sampleNumber: specimen.sampleNumber,
                  });
                });
                return this.printLabel(labelParams);
              }
            })
            .then(() => resolve())
            .catch((error) => {
              console.error('Printing error:', error);
              resolve();
            });
        } else {
          resolve();
        }
      });
    };


    return post(list, this.props.specimenAPI, 'POST')
      .then((entities) => {
        return printBarcodes(entities)
          .then(() => {
            this.setData('containers', entities.containers);
            this.setData('specimens', entities.specimens);
          });
      })
      .then(() => Promise.resolve());
  }

  /**
   * Create containers
   *
   * @param {object} list - list of containers
   * @param {object} current - values held in current state
   * @param {object} errors - list of errors
   * @return {Promise}
   */
  createContainers(list, current, errors) {
    const stati = this.state.options.container.stati;
    const availableId = Object.keys(stati)
      .find((key) => stati[key].label === 'Available');

    let isError = false;
    Object.entries(list).forEach(([key, container]) => {
      container.statusId = availableId;
      container.temperature = 20;
      container.originId = current.centerId;
      container.centerId = current.centerId;

      errors.container = this.validateContainer(container, key);
      errors.list[key] = this.validateContainer(container, key);
      if (!isEmpty(errors.list[key])) {
        isError = true;
      }
    });

    if (isError) {
      return Promise.rejecthis.props.t(errors, {ns: 'biobank'});
    }

    return post(list, this.props.containerAPI, 'POST')
      .then((containers) => this.setData('containers', containers))
      .then(() => Promise.resolve());
  }

  /**
   * Create a new pool
   *
   * @param {object} pool - the pool to create
   * @param {object} list - the specimens to add to the pool
   * @return {Promise}
   */
  createPool(pool, list) {
    const stati = this.state.options.container.stati;
    const dispensedId = Object.keys(stati)
      .find(
        (key) => stati[key].label === 'Dispensed'
      );
    const update = Object.values(list)
      .reduce((result, item) => {
        item.container.statusId = dispensedId;
        item.specimen.quantity = '0';

        // XXX: By updating the container and specimen after, it's causing issues
        // if they don't meet validation. The error is being thrown only after the
        // pool has already been saved to the database! Not sure how to resolve this.
        return [...result,
          () => this.updateContainer(item.container, false),
          () => this.updateSpecimen(item.specimen, false),
        ];
      }, []);

    const errors = this.validatePool(pool);
    if (!isEmpty(errors)) {
      return Promise.rejecthis.props.t(errors, {ns: 'biobank'});
    }

    return post(pool, this.props.poolAPI, 'POST')
      .then((pools) => this.setData('pools', pools))
      .then(() => Promise.all(update.map((update) => update())));
  }

  /**
   * Save a batch of edits
   *
   * @param {object} list - a list of edits
   * @return {Promise}
   */
  saveBatchEdit(list) {
    const saveList = list
      .map((specimen) => () => post(specimen, this.props.specimenAPI, 'PUT'));

    const errors = this.validateSpecimen(list[0]);
    if (!isEmpty(errors)) {
      return Promise.rejecthis.props.t(errors, {ns: 'biobank'});
    }

    return Promise.all(saveList.map((item) => item()))
      .then(
        (data) => Promise.all(
          data.map((item) => this.setData('specimens', item))
        )
      ).then(() => Swal.fire(this.props.t('Batch Preparation Successful!', {ns: 'biobank'}), '', 'success'));
  }

  /**
   * Validate a specimen
   *
   * @param {object} specimen - the specimen to validate
   * @return {object} an object of errors
   */
  validateSpecimen(specimen) {
    const errors = {};

    const required = [
      'typeId',
      'quantity',
      'unitId',
      'candidateId',
      'sessionId',
      'collection',
    ];
    const float = ['quantity'];
    const positive = ['quantity', 'fTCycle'];
    const integer = ['fTCycle'];

    required.map((field) => {
      // TODO: seems like for certain cases it needs to be !== null
      if (!specimen[field]) {
        errors[field] = this.props.t('This field is required.', {ns: 'biobank'});
      }
    });

    float.map((field) => {
      if (isNaN(parseInthis.props.t(specimen[field], {ns: 'biobank'})) || !isFinite(specimen[field])) {
        errors[field] = this.props.t('This field must be a number. ', {ns: 'biobank'});
      }
    });

    positive.map((field) => {
      if (specimen[field] != null && specimen[field] < 0) {
        errors[field] = this.props.t('This field must not be negative.', {ns: 'biobank'});
      }
    });

    integer.map((field) => {
      if (specimen[field] != null
          && !/^\+?(0|[1-9]\d*)$/.testhis.props.t(specimen[field], {ns: 'biobank'})
      ) {
        errors[field] = this.props.t('This field must be an integer.', {ns: 'biobank'});
      }
    });

    const optspecimen = this.state.options.specimen;
    errors.collection =
      this.validateProcess(
        specimen.collection,
        optspecimen.protocolAttributes[specimen.collection.protocolId],
        [
          'protocolId',
          'examinerId',
          'quantity',
          'unitId',
          'centerId',
          'date',
          'time',
        ],
        ['quantity']
      );

    // collection should only be set if there are errors associated with it.
    if (isEmpty(errors.collection)) {
      delete errors.collection;
    }

    if (specimen.preparation) {
      errors.preparation =
        this.validateProcess(
          specimen.preparation,
          optspecimen.protocolAttributes[specimen.preparation.protocolId],
          ['protocolId', 'examinerId', 'centerId', 'date', 'time']
        );
    }

    if (isEmpty(errors.preparation)) {
      delete errors.preparation;
    }

    if (specimen.analysis) {
      errors.analysis =
        this.validateProcess(
          specimen.analysis,
          optspecimen.protocolAttributes[specimen.analysis.protocolId],
          ['protocolId', 'examinerId', 'centerId', 'date', 'time']
        );
    }

    if (isEmpty(errors.analysis)) {
      delete errors.analysis;
    }

    return errors;
  }

  /**
   * Validate a process
   *
   * @param {object} process - the process to validate
   * @param {object} attributes - the attributes of the process
   * @param {array} required - the required fields
   * @param {array} number - an array of fields that must be numbers
   * @return {object} errors
   */
  validateProcess(process, attributes, required, number) {
    let errors = {};
    let regex;

    // validate required fields
    required && required.map((field) => {
      if (!process[field]) {
        errors[field] = this.props.t('This field is required! ', {ns: 'biobank'});
      }
    });

    // validate floats
    number && number.map((field) => {
      if (isNaN(parseInthis.props.t(process[field], {ns: 'biobank'})) || !isFinite(process[field])) {
        errors[field] = this.props.t('This field must be a number! ', {ns: 'biobank'});
      }
    });

    // validate date
    regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (regex.testhis.props.t(process.date, {ns: 'biobank'}) === false ) {
      errors.date = this.props.t('This field must be a valid date! ', {ns: 'biobank'});
    }

    // validate time
    regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (regex.testhis.props.t(process.time, {ns: 'biobank'}) === false) {
      errors.time = this.props.t('This field must be a valid time! ', {ns: 'biobank'});
    }

    // validate custom attributes
    if (!isEmpty(process.data)) {
      errors.data = {};
      const specimenopts = this.state.options.specimen;
      const datatypes = specimenopts.attributeDatatypes;

      // FIXME: This if statement was introduced because certain processes have
      // a data object even though their protocol isn't associated with attributes.
      // This is a sign of bad importing/configuration and should be fixed in
      // configuration rather than here.
      if (attributes) {
        Object.values(attributes)
          .forEach((attribute) => {
          // validate required
            if (attribute.required == 1
              && !process.data[attribute.id]) {
              errors.data[attribute.id] = this.props.t('This field is required!', {ns: 'biobank'});
            }

            const dataTypeId= attribute.datatypeId;
            // validate number
            if (datatypes[dataTypeId].datatype === 'number') {
              if (isNaN(parseInthis.props.t(process.data[attribute.id], {ns: 'biobank'})) ||
                !isFinite(process.data[attribute.id])) {
                errors.data[attribute.id] = this.props.t('This field must be a number!', {ns: 'biobank'});
              }
            }

            // validate date
            if (datatypes[dataTypeId].datatype === 'date') {
              regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
              if (regex.testhis.props.t(process.data[attribute.id], {ns: 'biobank'}) === false ) {
                errors.data[attribute.id] = this.props.t('This field must be a valid date! ', {ns: 'biobank'});
              }
            }

            // validate time
            if (datatypes[dataTypeId].datatype === 'time') {
              regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
              if (regex.testhis.props.t(process.data[attribute.id], {ns: 'biobank'}) === false) {
                errors.data[attribute.id] = this.props.t('This field must be a valid time! ', {ns: 'biobank'});
              }
            }

          // TODO: Eventually introduce file validation.
          });
      }

      if (isEmpty(errors.data)) {
        delete errors.data;
      }
    }

    return errors;
  }

  /**
   * Validate a container object
   *
   * @param {object} container - the container to validate
   * @return {object} - an object full of errors
   */
  validateContainer(container) {
    const errors = {};

    const required = [
      'barcode',
      'typeId',
      'temperature',
      'statusId',
      'centerId',
    ];

    const float = [
      'temperature',
    ];

    required.map((field) => {
      if (!container[field]) {
        errors[field] = this.props.t('This field is required! ', {ns: 'biobank'});
      }
    });

    float.map((field) => {
      if (isNaN(parseInthis.props.t(container[field], {ns: 'biobank'})) || !isFinite(container[field])) {
        errors[field] = this.props.t('This field must be a number! ', {ns: 'biobank'});
      }
    });

    Object.values(this.state.data.containers).map((c) => {
      if (container.barcode === c.barcode && container.id !== c.id) {
        errors.barcode = this.props.t('Barcode must be unique.', {ns: 'biobank'});
      }
    });

    // TODO: Regex barcode check will eventually go here.
    // The regex is not currently in the schema and should be implemented here
    // when it is.

    return errors;
  }

  /**
   * Validate a pool of speciments
   *
   * @param {object} pool - The pool to validate
   * @return {object} an object of any errors
   */
  validatePool(pool) {
    let regex;
    const errors = {};

    const required = ['label', 'quantity', 'unitId', 'date', 'time'];

    required.forEach((field) => {
      if (!pool[field]) {
        errors[field] = this.props.t('This field is required! ', {ns: 'biobank'});
      }
    });

    if (isNaN(parseInthis.props.t(pool.quantity, {ns: 'biobank'})) || !isFinite(pool.quantity)) {
      errors.quantity = this.props.t('This field must be a number! ', {ns: 'biobank'});
    }

    // validate date
    regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (regex.testhis.props.t(pool.date, {ns: 'biobank'}) === false ) {
      errors.date = this.props.t('This field must be a valid date! ', {ns: 'biobank'});
    }

    // validate time
    regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (regex.testhis.props.t(pool.time, {ns: 'biobank'}) === false) {
      errors.time = this.props.t('This field must be a valid time! ', {ns: 'biobank'});
    }

    if (pool.specimenIds == null || pool.specimenIds.length < 2) {
      errors.total = this.props.t('Pooling requires at least 2 specimens', {ns: 'biobank'});
    }

    return errors;
  }

  /**
   * Render React component
   *
   * @return {JSX}
   */
  render() {
    const barcode = (props) => {
      const target = this.routeBarcode(props.match.params.barcode);
      return (
        <BarcodePage
          history={props.history}
          specimen={target.specimen}
          container={target.container}
          data={this.state.data}
          options={this.state.options}
          updateSpecimen={this.updateSpecimen}
          updateContainer={this.updateContainer}
          createSpecimens={this.createSpecimens}
          createContainers={this.createContainers}
          printLabel={this.printLabel}
          increaseCoordinate={this.increaseCoordinate}
          loading={this.state.loading}
        />
      );
    };

    const filter = (props) => (
      <div>
        <BiobankFilter
          history={props.history}
          data={this.state.data}
          setData={this.setData}
          options={this.state.options}
          increaseCoordinate={this.increaseCoordinate}
          createPool={this.createPool}
          createContainers={this.createContainers}
          createSpecimens={this.createSpecimens}
          editSpecimens={this.editSpecimens}
          updateSpecimens={this.updateSpecimens}
          loading={this.state.loading}
        />
      </div>
    );

    return (
      <BrowserRouter basename='/biobank'>
        <div>
          <Switch>
            <Route exact path='/' render={filter}/>
            <Route exact path='/barcode=:barcode' render={barcode}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

// biobankIndex.propTypes
BiobankIndex.propTypes = {
  specimenAPI: PropTypes.object.isRequired,
  containerAPI: PropTypes.object.isRequired,
  poolAPI: PropTypes.object.isRequired,
  optionsAPI: PropTypes.object.isRequired,
  labelAPI: PropTypes.object.isRequired,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('fr', 'biobank', frStrings);
  const biobank = `${loris.BaseURL}/biobank/`;
  const Index = withTranslation(
  )(BiobankIndex);
  createRoot(
    documen.getElementById('lorisworkspace')
  ).render(
    <Index
      specimenAPI={`${biobank}specimenendpoint/`}
      containerAPI={`${biobank}containerendpoint/`}
      poolAPI={`${biobank}poolendpoint/`}
      optionsAPI={`${biobank}optionsendpoint/`}
      labelAPI={`${loris.BaseURL}${loris.config('printEndpoint')}`}
    />
  );
});
