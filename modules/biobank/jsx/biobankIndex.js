import {BrowserRouter, Route, Switch} from 'react-router-dom';
import swal from 'sweetalert2';

import BiobankFilter from './filter';
import BarcodePage from './barcodePage';
import {clone, isEmpty, get, getStream, post} from './helpers.js';

class BiobankIndex extends React.Component {
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
        sessionCenters: {},
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

  async componentDidMount() {
    const updateProgress = (loading) => this.setState({loading});

    const specimens = getStream(this.props.specimenAPI, updateProgress);
    const containers = get(this.props.containerAPI);
    const pools = get(this.props.poolAPI);
    const options = await get(this.props.optionsAPI, updateProgress);
    this.setState({options});

    const data = this.state.data;
    data.containers = await containers;
    data.specimens = await specimens;
    data.pools = await pools;
    this.setState({data});
  }

  setData(type, entities) {
    return new Promise((resolve) => {
      const data = clone(this.state.data);
      entities.forEach((entity) => data[type][entity.id] = entity);
      this.setState({data}, resolve());
    });
  }

  printLabel(labelParams) {
    return post(labelParams, this.props.labelAPI, 'POST');
  }

  routeBarcode(barcode) {
    const container = Object.values(this.state.data.containers)
      .find((container) => container.barcode == barcode);

    const specimen = Object.values(this.state.data.specimens)
      .find((specimen) => specimen.containerId == container.id);

    return {container, specimen};
  }

  updateSpecimen(specimen) {
    const errors = this.validateSpecimen(specimen);
    if (!isEmpty(errors)) {
      return Promise.reject({specimen: errors});
    }

    return post(specimen, this.props.specimenAPI, 'PUT')
    .then((specimens) => this.setData('specimens', specimens));
  }

  // TODO: This should eventually check for errors and replace 'updateSpecimen'
  // All updates can be sent via an array. This change should be reflected in
  // the backend too. It should also be able to be be sent with a nested
  // container object.
  updateSpecimens(list) {
    const updateList = list
    .map((specimen) => () => this.updateSpecimen(specimen));

    return Promise.all(updateList.map((updateSpecimen) => updateSpecimen()));
  }

  editSpecimens(list) {
    let errors = {};
    errors.specimen = this.validateSpecimen(list[0].specimen);
    errors.container = this.validateContainer(list[0].container);
    if (!isEmpty(errors.specimen) || !isEmpty(errors.container)) {
      return Promise.reject(errors);
    }

    // TODO: For now, specimens and their respective containers are sent
    // separately and 1 by 1 to be updated. They should eventually be sent
    // together and batched in an array.
    const specimenList = list
    .map((item) => () => this.updateSpecimen(item.specimen));
    const containerList = list
    .map((item) => () => this.updateContainer(item.container));

    return Promise.all(specimenList.map((item) => item()))
    .then(() => Promise.all(containerList.map((item) => item())));
  }

  updateContainer(container) {
    const errors = this.validateContainer(container);
    if (!isEmpty(errors)) {
      return Promise.reject({container: errors});
    }

    return post(container, this.props.containerAPI, 'PUT')
    .then((containers) => this.setData('containers', containers));
  }

  increaseCoordinate(coordinate, parentContainerId) {
    const childCoordinates = this.state.data.containers[parentContainerId].childContainerIds
    .reduce((result, id) => {
      const container = this.state.data.containers[id];
      if (container.coordinate) {
        result[container.coordinate] = id;
      }
      return result;
    }, {});

    const increment = (coord) => {
      coord++;
      if (childCoordinates.hasOwnProperty(coord)) {
        coord = increment(coord);
      }

      return coord;
    };

    return increment(coordinate);
  }

  createSpecimens(list, current, print) {
    const {options, data} = this.state;
    const labelParams = [];
    const projectIds = current.projectIds;
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
      container.projectIds = projectIds;
      container.centerId = centerId;
      container.originId = centerId;

      // If the container is assigned to a parent, place it sequentially in the
      // parent container and inherit the status, temperature and centerId.
      if (current.container.parentContainerId) {
        container.parentContainerId = current.container.parentContainerId;
        const parentContainer = data.containers[current.container.parentContainerId];
        const dimensions = options.container.dimensions[parentContainer.dimensionId];
        const capacity = dimensions.x * dimensions.y * dimensions.z;
        coord = this.increaseCoordinate(coord, current.container.parentContainerId);
        if (coord <= capacity) {
          container.coordinate = parseInt(coord);
        } else {
          container.coordinate = null;
        }
        container.statusId = parentContainer.statusId;
        container.temperature = parentContainer.temperature;
        container.centerId = parentContainer.centerId;
      }

      // if specimen type id is not set yet, this will throw an error
      if (specimen.typeId) {
        labelParams.push({
          barcode: container.barcode,
          type: options.specimen.types[specimen.typeId].label,
        });
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
      return Promise.reject(errors);
    }

    const printBarcodes = () => {
      return new Promise((resolve) => {
        if (print) {
          swal({
            title: 'Print Barcodes?',
            type: 'question',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          })
          .then((result) => result.value && this.printLabel(labelParams))
          .then(() => resolve());
        } else {
          resolve();
        }
      });
    };

    return printBarcodes()
    .then(() => post(list, this.props.specimenAPI, 'POST'))
    .then((entities) => {
      this.setData('containers', entities.containers);
      this.setData('specimens', entities.specimens);
    })
    .then(() => Promise.resolve());
  }

  createContainers(list, current, errors) {
    const availableId = Object.keys(this.state.options.container.stati)
    .find((key) => this.state.options.container.stati[key].label === 'Available');

    let isError = false;
    Object.entries(list).forEach(([key, container]) => {
      container.statusId = availableId;
      container.temperature = 20;
      container.projectIds = current.projectIds;
      container.originId = current.centerId;
      container.centerId = current.centerId;

      errors.container = this.validateContainer(container, key);
      errors.list[key] = this.validateContainer(container, key);
      if (!isEmpty(errors.list[key])) {
        isError = true;
      }
    });

    if (isError) {
      return Promise.reject(errors);
    }

    return post(list, this.props.containerAPI, 'POST')
    .then((containers) => this.setData('containers', containers))
    .then(() => Promise.resolve());
  }

  createPool(pool, list) {
    const dispensedId = Object.keys(this.state.options.container.stati)
    .find((key) => this.state.options.container.stati[key].label === 'Dispensed');
    const update = Object.values(list)
    .reduce((result, item) => {
      item.container.statusId = dispensedId;
      item.specimen.quantity = '0';
      return [...result,
              () => this.updateContainer(item.container, false),
              () => this.updateSpecimen(item.specimen, false),
            ];
    }, []);

    const errors = this.validatePool(pool);
    if (!isEmpty(errors)) {
      return Promise.reject(errors);
    }

    return post(pool, this.props.poolAPI, 'POST')
    .then((pools) => this.setData('pools', pools))
    .then(() => Promise.all(update.map((update) => update())));
  }

  saveBatchEdit(list) {
    const saveList = list
    .map((specimen) => () => post(specimen, this.props.specimenAPI, 'PUT'));

    const errors = this.validateSpecimen(list[0]);
    if (!isEmpty(errors)) {
      return Promise.reject(errors);
    }

    return Promise.all(saveList.map((item) => item()))
    .then((data) => Promise.all(data.map((item) => this.setData('specimens', item))))
    .then(() => swal('Batch Preparation Successful!', '', 'success'));
  }

  validateSpecimen(specimen, key) {
    const errors = {};

    const required = ['typeId', 'quantity', 'unitId', 'candidateId', 'sessionId', 'collection'];
    const float = ['quantity'];
    const positive = ['quantity', 'fTCycle'];
    const integer = ['fTCycle'];

    required.map((field) => {
      // TODO: seems like for certain cases it needs to be !== null
      if (!specimen[field]) {
        errors[field] = 'This field is required! ';
      }
    });

    float.map((field) => {
      if (isNaN(parseInt(specimen[field])) || !isFinite(specimen[field])) {
        errors[field] = 'This field must be a number! ';
      }
    });

    positive.map((field) => {
      if (specimen[field] != null && specimen[field] < 0) {
        errors[field] = 'This field must not be negative!';
      }
    });

    integer.map((field) => {
      if (specimen[field] != null && !/^\+?(0|[1-9]\d*)$/.test(specimen[field])) {
        errors[field] = 'This field must be an integer!';
      }
    });

    errors.collection =
      this.validateProcess(
        specimen.collection,
        this.state.options.specimen.protocolAttributes[specimen.collection.protocolId],
        ['protocolId', 'examinerId', 'quantity', 'unitId', 'centerId', 'date', 'time'],
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
          this.state.options.specimen.protocolAttributes[specimen.preparation.protocolId],
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
          this.state.options.specimen.protocolAttributes[specimen.analysis.protocolId],
          ['protocolId', 'examinerId', 'centerId', 'date', 'time']
        );
    }

    if (isEmpty(errors.analysis)) {
      delete errors.analysis;
    }

    return errors;
  }

  validateProcess(process, attributes, required, number) {
    let errors = {};
    let regex;

    // validate required fields
    required && required.map((field) => {
      if (!process[field]) {
        errors[field] = 'This field is required! ';
      }
    });

    // validate floats
    number && number.map((field) => {
      if (isNaN(parseInt(process[field])) || !isFinite(process[field])) {
        errors[field] = 'This field must be a number! ';
      }
    });

    // validate date
    regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (regex.test(process.date) === false ) {
      errors.date = 'This field must be a valid date! ';
    }

    // validate time
    regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (regex.test(process.time) === false) {
      errors.time = 'This field must be a valid time! ';
    }

    // validate custom attributes
    if (!isEmpty(process.data)) {
      errors.data = {};
      const datatypes = this.state.options.specimen.attributeDatatypes;

      const protocolAttributes = this.state.options.specimen.protocolAttributes[process.protocolId];
      // FIXME: This if statement was introduced because certain processes have
      // a data object even though their protocol isn't associated with attributes.
      // This is a sign of bad importing/configuration and should be fixed in configuration
      // rather than here.
      if (protocolAttributes) {
        Object.keys(protocolAttributes)
          .forEach((attributeId) => {
          // validate required
          if (protocolAttributes[attributeId].required == 1
              && !process.data[attributeId]) {
            errors.data[attributeId] = 'This field is required!';
          }

          // validate number
          if (datatypes[attributes[attributeId].datatypeId].datatype === 'number') {
            if (isNaN(parseInt(process.data[attributeId])) ||
                !isFinite(process.data[attributeId])) {
              errors.data[attributeId] = 'This field must be a number!';
            }
          }

          // validate date
          if (datatypes[attributes[attributeId].datatypeId].datatype === 'date') {
            regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
            if (regex.test(process.data[attributeId]) === false ) {
              errors.data[attributeId] = 'This field must be a valid date! ';
            }
          }

          // validate time
          if (datatypes[attributes[attributeId].datatypeId].datatype === 'time') {
            regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (regex.test(process.data[attributeId]) === false) {
              errors.data[attributeId] = 'This field must be a valid time! ';
            }
          }

          // TODO: Eventually introduce file validation.
        });
      }

      if (isEmpty(errors.data)) {
        delete errors.data;
      }
    }

    // Return Errors
    return errors;
  }

  validateContainer(container, key) {
    const errors = {};

    const required = [
      'barcode',
      'typeId',
      'temperature',
      'statusId',
      'projectIds',
      'centerId',
    ];

    const float = [
      'temperature',
    ];

    required.map((field) => {
      if (!container[field]) {
        errors[field] = 'This field is required! ';
      }
    });

    float.map((field) => {
      if (isNaN(parseInt(container[field])) || !isFinite(container[field])) {
        errors[field] = 'This field must be a number! ';
      }
    });

    Object.values(this.state.data.containers).map((c) => {
      if (container.barcode === c.barcode && container.id !== c.id) {
        errors.barcode = 'Barcode must be unique.';
      }
    });

    // TODO: Regex barcode check will eventually go here.
    // The regex is not currently in the schema and should be implemented here
    // when it is.

    return errors;
  }

  validatePool(pool) {
    let regex;
    const errors = {};

    const required = ['label', 'quantity', 'unitId', 'date', 'time'];

    required.forEach((field) => {
      if (!pool[field]) {
        errors[field] = 'This field is required! ';
      }
    });

    if (isNaN(parseInt(pool.quantity)) || !isFinite(pool.quantity)) {
      errors.quantity = 'This field must be a number! ';
    }

    // validate date
    regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (regex.test(pool.date) === false ) {
      errors.date = 'This field must be a valid date! ';
    }

    // validate time
    regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (regex.test(pool.time) === false) {
      errors.time = 'This field must be a valid time! ';
    }

    if (pool.specimenIds == null || pool.specimenIds.length < 2) {
      errors.total = 'Pooling requires at least 2 specimens';
    };

    return errors;
  }

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

window.addEventListener('load', () => {
  const biobank = `${loris.BaseURL}/biobank/`;
  ReactDOM.render(
    <BiobankIndex
      specimenAPI={`${biobank}specimenendpoint/`}
      containerAPI={`${biobank}containerendpoint/`}
      poolAPI={`${biobank}poolendpoint/`}
      optionsAPI={`${biobank}optionsendpoint/`}
      labelAPI={`${biobank}labelendpoint/`}
    />,
    document.getElementById('lorisworkspace'));
});
