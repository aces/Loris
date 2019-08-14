import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Link} from 'react-router-dom';
import swal from 'sweetalert2';

import Loader from 'Loader';

import BiobankFilter from './filter';
import BiobankSpecimen from './specimen';
import BiobankContainer from './container';

const defaultState = () => ({
  current: {
    files: {},
    list: {},
    collapsed: {},
    coordinate: null,
    sequential: false,
    candidateId: null,
    centerId: null,
    originId: null,
    sessionId: null,
    typeId: null,
    count: null,
    multiplier: 1,
    specimen: {},
    container: {},
    pool: {},
    poolId: null,
    preparation: {},
  },
  errors: {
    container: {},
    specimen: {},
    pool: {},
    list: {},
    preparation: {},
  },
  editable: {
    specimenForm: false,
    containerForm: false,
    aliquotForm: false,
    containerParentForm: false,
    loadContainer: false,
    containerCheckout: false,
    temperature: false,
    quantity: false,
    status: false,
    center: false,
    collection: false,
    preparation: false,
    analysis: false,
    batchPreparationForm: false,
    poolSpecimenForm: false,
    searchSpecimen: false,
    searchContainer: false,
  },
});

class BiobankIndex extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoaded: false,
      options: {
        specimen: {},
        container: {},
      },
      data: {
        specimens: {},
        containers: {},
        pools: {},
      },
      ...defaultState(),
    };

    this.fetch = this.fetch.bind(this);
    this.loadAllData = this.loadAllData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.groupContainers = this.groupContainers.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.routeBarcode = this.routeBarcode.bind(this);
    this.clone = this.clone.bind(this);
    this.mapFormOptions = this.mapFormOptions.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.edit = this.edit.bind(this);
    this.editSpecimen = this.editSpecimen.bind(this);
    this.editContainer = this.editContainer.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.setContainerData = this.setContainerData.bind(this);
    this.setSpecimenData = this.setSpecimenData.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.setListItem = this.setListItem.bind(this);
    this.setPoolList = this.setPoolList.bind(this);
    this.setCheckoutList = this.setCheckoutList.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.copyListItem = this.copyListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.getCoordinateLabel = this.getCoordinateLabel.bind(this);
    this.getParentContainerBarcodes = this.getParentContainerBarcodes.bind(this);
    this.getBarcodePathDisplay = this.getBarcodePathDisplay.bind(this);
    this.createSpecimens = this.createSpecimens.bind(this);
    this.setSpecimen = this.setSpecimen.bind(this);
    this.setContainer = this.setContainer.bind(this);
    this.setPool = this.setPool.bind(this);
    this.updateSpecimen = this.updateSpecimen.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.createPool = this.createPool.bind(this);
    this.saveBatchPreparation = this.saveBatchPreparation.bind(this);
    this.createContainers = this.createContainers.bind(this);
    this.validateSpecimen = this.validateSpecimen.bind(this);
    this.validateProcess = this.validateProcess.bind(this);
    this.validateContainer = this.validateContainer.bind(this);
    this.post = this.post.bind(this);
  }

  componentDidMount() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadOptions()
    .then(() => this.loadData(this.props.containerAPI, 'containers'))
    .then(() => this.loadData(this.props.poolAPI, 'pools'))
    .then(() => this.loadData(this.props.specimenAPI, 'specimens'))
    .then(() => this.setState({isLoaded: true}));
  }

  loadData(url, state) {
    return new Promise((resolve) => {
      this.fetch(url, 'GET')
        .then((dataList) => {
          const data = this.state.data;
          data[state] = state === 'containers' ? this.groupContainers(dataList) : dataList;
          this.setState({data}, resolve());
        });
    });
  }

  // This function groups containers into three categories: all, primary and nonPrimary
  groupContainers(dataList) {
    const data = Object.keys(dataList).reduce((result, id) => {
      if (this.state.options.container.types[dataList[id].typeId].primary === '1') {
        result.primary[id] = dataList[id];
      } else {
        result.nonPrimary[id] = dataList[id];
      }
      return result;
    }, {primary: {}, nonPrimary: {}});
    data.all = dataList;
    return data;
  }

  loadOptions() {
    return new Promise((resolve) => {
      this.fetch(this.props.optionsAPI, 'GET')
      .then((options) => this.setState({options}, resolve()));
    });
  }

  fetch(url, method) {
    return fetch(url, {credentials: 'same-origin', method: method})
      .then((resp) => resp.json())
      .catch((error, errorCode, errorMsg) => console.error(error, errorCode, errorMsg));
  }

  clone(object) {
    return JSON.parse(JSON.stringify(object));
  }

  routeBarcode(barcode) {
    const container = Object.values(this.state.data.containers.all)
      .find((container) => container.barcode == barcode);

    const specimen = Object.values(this.state.data.specimens)
      .find((specimen) => specimen.containerId == container.id);

    return {container, specimen};
  }

  mapFormOptions(object, attribute) {
    return Object.keys(object).reduce((result, id) => {
      result[id] = object[id][attribute];
      return result;
    }, {});
  }

  edit(stateKey) {
    return new Promise((resolve) => {
      this.clearEditable()
        .then(() => {
          const editable = this.clone(this.state.editable);
          editable[stateKey] = true;
          this.setState({editable}, resolve());
        });
    });
  }

  clearEditable() {
    const state = this.clone(this.state);
    state.editable = defaultState().editable;
    return new Promise((res) => this.setState(state, res()));
  }

  clearAll() {
    const state = Object.assign(this.clone(this.state), defaultState());
    return new Promise((res) => this.setState(state, res()));
  }

  toggleCollapse(key) {
    const collapsed = this.state.current.collapsed;
    collapsed[key] = !collapsed[key];
    this.setCurrent('collapsed', collapsed);
  }

  setListItem(name, value, key) {
    const list = this.state.current.list;
    list[key][name] = value;
    this.setCurrent('list', list);
  }

  setCheckoutList(container) {
    // Clear current container field.
    this.setCurrent('containerId', 1)
      .then(()=>this.setCurrent('containerId', null));
    const list = this.state.current.list;
    list[container.coordinate] = container;
    this.setCurrent('list', list);
  }

  // TODO: revisit if this should be here, or in specimenPoolForm.js
  // I am now thinking that it might be best to put it in specimenPoolForm.js
  setPoolList(containerId) {
    this.setCurrent('containerId', containerId)
      .then(() => this.setCurrent('containerId', null));

    const list = this.clone(this.state.current.list);
    const specimenIds = this.state.current.pool.specimenIds || [];
    const container = this.clone(this.state.data.containers.primary[containerId]);
    const specimen = Object.values(this.state.data.specimens)
      .find((specimen) => specimen.containerId == containerId);

    let count = this.state.current.count;
    if (count == null) {
      count = 0;
    } else {
      count++;
    }

    list[count] = {container, specimen};
    specimenIds.push(specimen.id);

    this.setCurrent('count', count);
    this.setCurrent('list', list);
    this.setCurrent('candidateId', specimen.candidateId);
    this.setCurrent('sessionId', specimen.sessionId);
    this.setCurrent('typeId', specimen.typeId);
    this.setCurrent('centerId', container.centerId);
    this.setPool('centerId', container.centerId);
    this.setPool('specimenIds', specimenIds);
  }

  editSpecimen(specimen) {
    return new Promise((resolve) => {
      specimen = this.clone(specimen);
      this.setCurrent('specimen', specimen)
        .then(() => resolve());
    });
  }

  editContainer(container) {
    return new Promise((resolve) => {
      container = this.clone(container);
      this.setCurrent('container', container)
        .then(() => resolve());
    });
  }

  setCurrent(name, value) {
    return new Promise((resolve) => {
      const current = this.state.current;
      current[name] = value;
      this.setState({current}, resolve());
    });
  }

  setErrors(name, value) {
    const errors = this.state.errors;
    errors[name] = value;
    this.setState({errors});
  }

  addListItem(item) {
    const current = this.state.current;
    current.count++;
    current.collapsed[current.count] = true;
    switch (item) {
      case 'specimen':
        current.list[current.count] = {collection: {}, container: {}};
        break;
      case 'container':
        current.list[current.count] = {};
        break;
    }

    this.setState({current});
  }

  copyListItem(key) {
    const current = this.clone(this.state.current);
    for (let i=1; i<=current.multiplier; i++) {
      current.count++;
      current.list[current.count] = this.clone(current.list[key]);
      (current.list[current.count].container||{}).barcode &&
        delete current.list[current.count].container.barcode;
      current.list[current.count].barcode &&
        delete current.list[current.count].barcode;
      current.collapsed[current.count] = true;
    }

    this.setState({current});
  }

  removeListItem(key) {
    const current = this.state.current;
    delete current.list[key];
    if (Object.keys(current.list).length === 0) {
      // TODO: this might need to be replaced by a clearCurrent() function later.
      this.setState({current: defaultState().current});
    } else {
      this.setState({current});
    }
  }

  getCoordinateLabel(container) {
    const parentContainer = this.state.data.containers.all[container.parentContainerId];
    const dimensions = this.state.options.container.dimensions[parentContainer.dimensionId];
    let coordinate;
    let j = 1;
    outerloop:
    for (let y=1; y<=dimensions.y; y++) {
      innerloop:
      for (let x=1; x<=dimensions.x; x++) {
        if (j == container.coordinate) {
          if (dimensions.xNum == 1 && dimensions.yNum == 1) {
            coordinate = x + (dimensions.x * (y-1));
          } else {
            const xVal = dimensions.xNum == 1 ? x : String.fromCharCode(64+x);
            const yVal = dimensions.yNum == 1 ? y : String.fromCharCode(64+y);
            coordinate = yVal+''+xVal;
          }
          break outerloop;
        }
        j++;
      }
    }
    return coordinate;
  }

  getParentContainerBarcodes(container, barcodes=[]) {
    barcodes.push(container.barcode);

    const parent = Object.values(this.state.data.containers.nonPrimary)
      .find((c) => container.parentContainerId == c.id);

    parent && this.getParentContainerBarcodes(parent, barcodes);

    return barcodes.slice(0).reverse();
  }

  getBarcodePathDisplay(parentBarcodes) {
    return Object.keys(parentBarcodes).map((i) => {
      const container = Object.values(this.state.data.containers.all)
        .find((container) => container.barcode == parentBarcodes[parseInt(i)+1]);
      let coordinateDisplay;
      if (container) {
        const coordinate = this.getCoordinateLabel(container);
        coordinateDisplay = <b>{'-'+(coordinate || 'UAS')}</b>;
      }
      return (
        <span className='barcodePath'>
          {i != 0 && ': '}
          <Link key={i} to={`/barcode=${parentBarcodes[i]}`}>{parentBarcodes[i]}</Link>
          {coordinateDisplay}
        </span>
      );
    });
  }

  setSpecimen(name, value) {
    return new Promise((resolve) => {
      const specimen = this.state.current.specimen;
      specimen[name] = value;
      this.setCurrent('specimen', specimen)
      .then(() => resolve());
    });
  }

  setContainer(name, value) {
    return new Promise((resolve) => {
      const container = this.state.current.container;
      value ? container[name] = value : delete container[name];
      this.setCurrent('container', container)
      .then(() => resolve());
    });
  }

  setPool(name, value) {
    return new Promise((resolve) => {
      const pool = this.state.current.pool;
      pool[name] = value;
      this.setCurrent('pool', pool)
      .then(() => resolve());
    });
  }

  setContainerData(containers) {
    return new Promise((resolve) => {
      const data = this.state.data;
      Object.values(containers).forEach((container) => {
        data.containers.all[container.id] = container;
        data.containers.nonPrimary[container.id] = container;
      });

      this.setState({data}, resolve());
    });
  }

  setSpecimenData(specimenList) {
    return new Promise((resolve) => {
      const data = this.state.data;
      specimenList
        .forEach((specimen) => data.specimens[specimen.id] = specimen);
      this.setState({data}, resolve());
    });
  }

  updateSpecimen(specimen, closeOnSuccess = true) {
    const onSuccess = () => {
      closeOnSuccess && this.clearAll()
        .then(() => swal('Specimen Save Successful', '', 'success'));
    };

    this.validateSpecimen(specimen)
    .then(() => this.post(specimen, this.props.specimenAPI, 'PUT', onSuccess))
    .then((updatedSpecimens) => this.setSpecimenData(updatedSpecimens));
  }

  updateContainer(container, closeOnSuccess = true) {
    const onSuccess = () => {
      closeOnSuccess && this.clearAll()
        .then(() => swal('Container Save Successful', '', 'success'));
    };

    // FIXME: These lines of code are really messy and I would like to find a
    // better way to do this.
    // const containers = this.clone(this.state.data.containers.all);
    // const oldContainer = containers[container.id];
    // const oldParent = containers[oldContainer.parentContainerId];
    // const newParent = containers[container.parentContainerId];

    // if (oldContainer.parentContainerId || container.parentContainerId) {
    //   if (oldContainer.parentContainerId == container.parentContainerId && oldContainer.parentContainerId != null) {
    //     newParent.childContainerIds.splice(newParent.childContainerIds.indexOf(container.id), 1);
    //     newParent.childContainerIds = [...newParent.childContainerIds, container.id];
    //   } else if (oldContainer.parentContainerId == null && container.parentContainerId) {
    //     newParent.childContainerIds = [...newParent.childContainerIds, container.id];
    //   } else if (oldContainer.parentContainerId && container.parentContainerId == null) {
    //     oldParent.childContainerIds.splice(oldParent.childContainerIds.indexOf(container.id), 1);
    //   } else if (oldContainer.parentContainerId != container.parentContainerId) {
    //     oldParent.childContainerIds.splice(oldParent.childContainerIds.indexOf(container.id), 1);
    //     newParent.childContainerIds = [...newParent.childContainerIds, container.id];
    //   }
    // }

    return new Promise((resolve) => {
      this.validateContainer(container)
      .then(() => this.post(container, this.props.containerAPI, 'PUT', onSuccess))
      .then((containers) => this.setContainerData(containers))
      .then(() => this.loadData(this.props.containerAPI, 'containers'))
      .then(() => resolve());
    });
  }

  createSpecimens() {
    return new Promise((resolve) => {
      const listValidation = [];
      const list = this.clone(this.state.current.list);
      const projectIds = this.state.current.projectIds;
      const centerId = this.state.current.centerId;
      // TODO: consider making a getAvailableId() function;
      const availableId = Object.keys(this.state.options.container.stati).find(
        (key) => this.state.options.container.stati[key].label === 'Available'
      );

      Object.keys(list).forEach((key) => {
        // set specimen values
        const specimen = list[key];
        specimen.candidateId = this.state.current.candidateId;
        specimen.sessionId = this.state.current.sessionId;
        specimen.quantity = specimen.collection.quantity;
        specimen.unitId = specimen.collection.unitId;
        specimen.collection.centerId = centerId;
        if ((this.state.options.specimen.types[specimen.typeId]||{}).freezeThaw == 1) {
          specimen.fTCycle = 0;
        }
        specimen.parentSpecimenIds = this.state.current.parentSpecimenIds || null;

        // set container values
        const container = specimen.container;
        container.statusId = availableId;
        container.temperature = 20;
        container.projectIds = projectIds;
        container.centerId = centerId;
        container.originId = centerId;

        specimen.container = container;
        list[key] = specimen;

        listValidation.push(this.validateContainer(container, key));
        listValidation.push(this.validateSpecimen(specimen, key));
      });

      const onSuccess = () => swal('Save Successful', '', 'success');
      Promise.all(listValidation)
      .then(() => this.post(list, this.props.specimenAPI, 'POST', onSuccess))
      .then(() => this.clearAll())
      .then(() => this.loadAllData())
      .then(() => resolve())
      .catch((e) => console.error(e));
    });
  }

  createContainers() {
    return new Promise((resolve, reject) => {
      const listValidation = [];
      const list = this.state.current.list;
      const availableId = Object.keys(this.state.options.container.stati).find(
        (key) => this.state.options.container.stati[key].label === 'Available'
      );

      Object.entries(list).forEach(([key, container]) => {
        container.statusId = availableId;
        container.temperature = 20;
        container.projectIds = this.state.current.projectIds;
        container.originId = this.state.current.centerId;
        container.centerId = this.state.current.centerId;

        listValidation.push(this.validateContainer(container, key));
      });

      const onSuccess = () => swal('Container Creation Successful', '', 'success');
      Promise.all(listValidation)
      .then(() => this.post(list, this.props.containerAPI, 'POST', onSuccess))
      .then((containers) => {
        console.log(containers);
        this.setContainerData(containers);
      })
      .then(() => this.clearAll())
      .then(() => resolve())
      .catch(() => reject());
    });
  }

  createPool() {
    const dispensedId = Object.keys(this.state.options.container.stati)
      .find((key) => this.state.options.container.stati[key].label === 'Dispensed');
    const update = Object.values(this.state.current.list)
      .reduce((result, item) => {
        item.container.statusId = dispensedId;
        item.specimen.quantity = '0';
        return [...result,
                () => this.updateContainer(item.container, false),
                () => this.updateSpecimen(item.specimen, false),
              ];
      }, []);

    const pool = this.clone(this.state.current.pool);
    const onSuccess = () => swal('Pooling Successful!', '', 'success');
    return new Promise((resolve, reject) => {
      this.validatePool(pool)
      .then(() => this.post(pool, this.props.poolAPI, 'POST', onSuccess))
      .then(() => Promise.all(update.map((update) => update())))
      .then(() => this.clearAll())
      .then(() => this.loadAllData())
      .then(() => resolve())
      .catch((e) => reject());
    });
  }

  saveBatchPreparation() {
    return new Promise((resolve) => {
      const list = this.clone(this.state.current.list);
      const preparation = this.clone(this.state.current.preparation);
      preparation.centerId = this.state.current.centerId;
      const saveList = Object.values(list)
        .map((item) => {
          const specimen = this.clone(item.specimen);
          specimen.preparation = preparation;
          return (() => this.post(specimen, this.props.specimenAPI, 'PUT').then((spec) => this.setSpecimenData(spec)));
        });

      const attributes = this.state.options.specimen.protocolAttributes[preparation.protocolId];
      const validateParams = [
        preparation,
        attributes,
        ['protocolId', 'centerId', 'date', 'time'],
      ];

      this.validateProcess(...validateParams)
        .then(() => this.validateBatchPreparation(list))
        .then(() => Promise.all(saveList.map((item) => item())))
        .then(() => this.clearAll())
        .then(() => swal('Batch Preparation Successful!', '', 'success'))
        .then(() => resolve())
        .catch((e) => this.setErrors('preparation', e));
    });
  }

  post(data, url, method, onSuccess) {
    return new Promise((resolve, reject) => {
      return fetch(url, {
        credentials: 'same-origin',
        method: method,
        body: JSON.stringify(this.clone(data)),
      })
      .then((response) => {
        if (response.ok) {
          // this.loadAllData();
          onSuccess instanceof Function && onSuccess();
          resolve(response.json());
        } else {
          response.json()
          .then((data) => swal(data.error, '', 'error'))
          .then(() => reject());
        }
      })
      .catch((error) => console.error(error));
    });
  }

  validateSpecimen(specimen, key) {
    return new Promise((resolve, reject) => {
      const errors = this.clone(this.state.errors);
      errors.specimen = {};

      const required = ['typeId', 'quantity', 'unitId', 'candidateId', 'sessionId', 'collection'];
      const float = ['quantity'];

      required.map((field) => {
        if (specimen[field] == null) {
          errors.specimen[field] = 'This field is required! ';
        }
      });

      float.map((field) => {
        if (isNaN(specimen[field])) {
          errors.specimen[field] = 'This field must be a number! ';
        }
      });

      if (specimen.quantity < 0) {
        errors.specimen.quantity = 'This field must be greater than 0';
      }

      const validateProcess = [
        this.validateProcess(
          specimen.collection,
          this.state.options.specimen.protocolAttributes[specimen.collection.protocolId],
          ['protocolId', 'examinerId', 'quantity', 'unitId', 'centerId', 'date', 'time'],
          ['quantity']
        ),
      ];

      if (specimen.preparation) {
        validateProcess.push(
          this.validateProcess(
            specimen.preparation,
            this.state.options.specimen.protocolAttributes[specimen.preparation.protocolId],
            ['protocolId', 'examinerId', 'centerId', 'date', 'time']
          )
        );
      }

      if (specimen.analysis) {
        validateProcess.push(
          this.validateProcess(
            specimen.analysis,
            this.state.options.specimen.protocolAttributes[specimen.analysis.protocolId],
            ['protocolId', 'examinerId', 'centerId', 'date', 'time']
          )
        );
      }

      Promise.all(validateProcess)
      .catch((e) => errors.specimen.process = e)
      .then(() => {
        // TODO: try to use setErrors function here
        if (key) {
          errors.list[key] = errors.list[key] || {};
          errors.list[key].specimen = errors.specimen;
        }

        if (this.isEmpty(errors.specimen)) {
          this.setState({errors}, resolve());
        } else {
          this.setState({errors}, reject(errors));
        }
      });
    });
  }

  // TODO: make use of this function elsewhere in the code
  isEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  validateProcess(process, attributes, required, number) {
    return new Promise((resolve, reject) => {
      let errors = {};
      let regex;

      // validate required fields
      required && required.map((field) => {
        if (process[field] == null) {
          errors[field] = 'This field is required! ';
        }
      });

      // validate floats
      number && number.map((field) => {
        if (isNaN(process[field])) {
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
      if (process.data) {
        errors.data = {};
        const datatypes = this.state.options.specimen.attributeDatatypes;

        Object.keys(process.data).forEach((attributeId) => {
          // validate required
          if (this.state.options.specimen.protocolAttributes[process.protocolId][attributeId].required == 1
              && !process.data[attributeId]) {
            errors.data[attributeId] = 'This field is required!';
          }

          // validate number
          if (datatypes[attributes[attributeId].datatypeId].datatype === 'number') {
            if (isNaN(process.data[attributeId])) {
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

        if (Object.keys(errors.data).length == 0) {
          delete errors.data;
        }
      }

      // return errors if they exist
      if (Object.keys(errors).length != 0) {
        reject(errors);
      } else {
        resolve();
      }
    });
  }

  validateContainer(container, key) {
    return new Promise((resolve, reject) => {
      const errors = this.state.errors;
      errors.container = {};

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
          errors.container[field] = 'This field is required! ';
        }
      });

      float.map((field) => {
        if (isNaN(container[field])) {
          errors.container[field] = 'This field must be a number! ';
        }
      });

      Object.values(this.state.data.containers.all).map((c) => {
        if (container.barcode === c.barcode && container.id !== c.id) {
          errors.container.barcode = 'Barcode must be unique.';
        }
      });

      // TODO: Regex barcode check will eventually go here.
      // The regex is not currently in the schema and should be implemented here
      // when it is.

      // TODO: try to use setErrors function here
      if (key) {
        errors.list[key] = errors.list[key] || {};
        errors.list[key].container = errors.container;
      }

      if (Object.keys(errors.container).length == 0) {
        this.setState({errors}, resolve());
      } else {
        this.setState({errors}, reject());
      }
    });
  }

  validatePool(pool) {
    return new Promise((resolve, reject) => {
      let regex;
      const errors = this.state.errors;
      errors.pool = {};

      const required = ['label', 'quantity', 'unitId', 'date', 'time'];

      required.forEach((field) => {
        if (!pool[field]) {
          errors.pool[field] = 'This field is required! ';
        }
      });

      if (isNaN(pool.quantity)) {
        errors.pool.quantity = 'This field must be a number! ';
      }

      // validate date
      regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
      if (regex.test(pool.date) === false ) {
        errors.pool.date = 'This field must be a valid date! ';
      }

      // validate time
      regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (regex.test(pool.time) === false) {
        errors.pool.time = 'This field must be a valid time! ';
      }

      if (pool.specimenIds == null || pool.specimenIds.length < 2) {
        errors.pool.total = 'Pooling requires at least 2 specimens';
      };

      if (Object.keys(errors.pool).length == 0) {
        this.setState({errors}, resolve());
      } else {
        this.setState({errors}, reject());
      }
    });
  }

  validateBatchPreparation(list) {
    return new Promise((resolve, reject) => {
      const barcodes = Object.values(list)
        .filter((item) => !!item.specimen.preparation)
        .map((item) => item.container.barcode);

      if (barcodes.length > 0) {
        return swal({
          title: 'Warning!',
          html: `Preparation for specimen(s) <b>${barcodes.join(', ')}</b> ` +
            `already exists. By completing this form, the previous preparation ` +
            `will be overwritten.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Proceed'})
        .then((result) => result.value ? resolve() : reject());
      } else {
        return resolve();
      }
    });
  }

  render() {
    if (!this.state.isLoaded) {
     return (
       <div style={{height: 500}}><Loader/></div>
     );
    }

    const barcode = (props) => {
      // TODO: Refactor 'target'. The idea is good, but it should be more clear
      // what is happening throughout the code.
      const target = this.routeBarcode(props.match.params.barcode);
      if (target.specimen) {
        return (
          <BiobankSpecimen
            data={this.state.data}
            target={target}
            options={this.state.options}
            errors={this.state.errors}
            current={this.state.current}
            editable={this.state.editable}
            mapFormOptions={this.mapFormOptions}
            setContainer={this.setContainer}
            updateContainer={this.updateContainer}
            setSpecimen={this.setSpecimen}
            updateSpecimen={this.updateSpecimen}
            setCurrent={this.setCurrent}
            toggleCollapse={this.toggleCollapse}
            setListItem={this.setListItem}
            addListItem={this.addListItem}
            copyListItem={this.copyListItem}
            removeListItem={this.removeListItem}
            edit={this.edit}
            clearAll={this.clearAll}
            createSpecimens={this.createSpecimens}
            editSpecimen={this.editSpecimen}
            editContainer={this.editContainer}
            getCoordinateLabel={this.getCoordinateLabel}
            getParentContainerBarcodes={this.getParentContainerBarcodes}
            getBarcodePathDisplay={this.getBarcodePathDisplay}
          />
        );
      } else {
        return (
          <BiobankContainer
            history={props.history}
            data={this.state.data}
            target={target}
            options={this.state.options}
            errors={this.state.errors}
            current={this.state.current}
            editable={this.state.editable}
            mapFormOptions={this.mapFormOptions}
            editContainer={this.editContainer}
            setContainer={this.setContainer}
            updateContainer={this.updateContainer}
            setCurrent={this.setCurrent}
            setCheckoutList={this.setCheckoutList}
            edit={this.edit}
            clearAll={this.clearAll}
            getCoordinateLabel={this.getCoordinateLabel}
            getParentContainerBarcodes={this.getParentContainerBarcodes}
            getBarcodePathDisplay={this.getBarcodePathDisplay}
          />
        );
      }
    };

    const filter = (props) => (
      <BiobankFilter
        isLoaded={this.state.isLoaded}
        history={props.history}
        data={this.state.data}
        options={this.state.options}
        current={this.state.current}
        errors={this.state.errors}
        editable={this.state.editable}
        setSpecimenHeader={this.setSpecimenHeader}
        updateFilter={this.updateFilter}
        resetFilter={this.resetFilter}
        mapFormOptions={this.mapFormOptions}
        edit={this.edit}
        clearAll={this.clearAll}
        toggleCollapse={this.toggleCollapse}
        setCurrent={this.setCurrent}
        setErrors={this.setErrors}
        setListItem={this.setListItem}
        setPool={this.setPool}
        setPoolList={this.setPoolList}
        addListItem={this.addListItem}
        copyListItem={this.copyListItem}
        removeListItem={this.removeListItem}
        createPool={this.createPool}
        createContainers={this.createContainers}
        createSpecimens={this.createSpecimens}
        saveBatchPreparation={this.saveBatchPreparation}
      />
    );

    return (
      <BrowserRouter basename='/biobank'>
        <Switch>
          <Route exact path='/' render={filter}/>
          <Route exact path='/barcode=:barcode' render={barcode}/>
        </Switch>
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
    />,
    document.getElementById('lorisworkspace'));
});
