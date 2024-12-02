import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import {clone, isEmpty} from './helpers.js';

import Globals from './globals';
import Header from './header';
import BiobankSpecimen from './specimen';
import BiobankContainer from './container';
import ProgressBar from 'jsx/ProgressBar';

const initialState = {
  loading: false,
  current: {
    files: {},
    list: {},
    coordinate: null,
    sequential: false,
    count: null,
    multiplier: 1,
    specimen: {},
    container: {},
  },
  errors: {
    container: {},
    specimen: {},
  },
  editable: {
    aliquotForm: false,
    containerParentForm: false,
    loadContainer: false,
    containerCheckout: false,
    containerType: false,
    temperature: false,
    quantity: false,
    status: false,
    center: false,
    collection: false,
    preparation: false,
    analysis: false,
  },
};

/**
 * The Barcode Page is the entry-point for both Specimen and Container Page data.
 */
class BarcodePage extends Component {
  /**
   * constructor
   */
  constructor() {
    super();

    this.state = initialState;
    this.getParentContainerBarcodes
      = this.getParentContainerBarcodes.bind(this);
    this.getCoordinateLabel = this.getCoordinateLabel.bind(this);
    this.edit = this.edit.bind(this);
    this.clearEditable = this.clearEditable.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.setCheckoutList = this.setCheckoutList.bind(this);
    this.editSpecimen = this.editSpecimen.bind(this);
    this.editContainer = this.editContainer.bind(this);
    this.setSpecimen = this.setSpecimen.bind(this);
    this.setContainer = this.setContainer.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.getBarcodePathDisplay = this.getBarcodePathDisplay.bind(this);
  }

  /**
   * Get the barcodes from a parent container recursively
   *
   * @param {object} container - the container with siblings
   * @param {array} barcodes - the initial list of barcodes
   * @return {array}
   */
  getParentContainerBarcodes(container, barcodes=[]) {
    barcodes.push(container.barcode);

    const parent = Object.values(this.props.data.containers)
      .find((c) => container.parentContainerId == c.id);

    parent && this.getParentContainerBarcodes(parent, barcodes);

    return barcodes.slice(0).reverse();
  }

  /**
   * Get the label for a coordinate in a container
   *
   * @param {object} container
   * @return {string}
   */
  getCoordinateLabel(container) {
    const optcontainer = this.props.options.container;
    const datacontainers = this.props.data.containers;
    const parentContainer = datacontainers[container.parentContainerId];
    // if parentContainer is not accessible, this means the user doesn't have access
    if (parentContainer) {
      const dimensions = optcontainer.dimensions[parentContainer.dimensionId];
      let coordinate;
      let j = 1;
      outerloop:
      for (let y=1; y<=dimensions.y; y++) {
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
  }

  /**
   * Set a key as editable
   *
   * @param {string} stateKey - the key to edit
   * @return {Promise}
   */
  edit(stateKey) {
    return new Promise((resolve) => {
      this.clearEditable()
        .then(() => {
          const editable = clone(this.state.editable);
          editable[stateKey] = true;
          this.setState({editable}, resolve());
        });
    });
  }

  /**
   * Reset the editable state of the page
   *
   * @return {Promise}
   */
  clearEditable() {
    const state = clone(this.state);
    state.editable = initialState.editable;
    return new Promise((res) => this.setState(state, res()));
  }

  /**
   * Reset the state of the page
   *
   * @return {Promise}
   */
  clearAll() {
    return new Promise((res) => this.setState(initialState, res()));
  }

  /**
   * Set a list of containers to checkout
   *
   * @param {object} container - a container to checkout?
   */
  setCheckoutList(container) {
    // Clear current container field.
    this.setCurrent('containerId', 1)
      .then(()=>this.setCurrent('containerId', null));
    const list = this.state.current.list;
    list[container.coordinate] = container;
    this.setCurrent('list', list);
  }

  /**
   * Edit a specimen
   *
   * @param {object} specimen - specimen
   * @return {Promise}
   */
  editSpecimen(specimen) {
    specimen = clone(specimen);
    return this.setCurrent('specimen', specimen);
  }

  /**
   * Edit a container
   *
   * @param {object} container - container
   * @return {Promise}
   */
  editContainer(container) {
    container = clone(container);
    return this.setCurrent('container', container);
  }

  /**
   * Update the 'current' object which holds generic state of this component.
   *
   * @param {string} name - the name to display
   * @param {object} value - the error message
   * @return {Promise}
   */
  setCurrent(name, value) {
    const current = clone(this.state.current);
    current[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  /**
   * Set active errors to display
   *
   * @param {string} name - the key with an error
   * @param {string} value - the error message
   */
  setErrors(name, value) {
    const errors = clone(this.state.errors);
    errors[name] = value;
    this.setState({errors});
  }

  /**
   * Get the path to display for a barcode
   *
   * @param {array} parentBarcodes - parent barcodes
   * @return {JSX}
   */
  getBarcodePathDisplay(parentBarcodes) {
    return Object.keys(parentBarcodes).map((i) => {
      const container = Object.values(this.props.data.containers)
        .find(
          (container) =>
            container.barcode == parentBarcodes[parseInt(i)+1]
        );
      let coordinateDisplay;
      if (container) {
        const coordinate = this.getCoordinateLabel(container);
        coordinateDisplay = <b>{'-'+(coordinate || 'UAS')}</b>;
      }
      return (
        <span className='barcodePath'>
          {i != 0 && ': '}
          <Link
            key={i}
            to={`/barcode=${parentBarcodes[i]}`}>{parentBarcodes[i]}
          </Link>
          {coordinateDisplay}
        </span>
      );
    });
  }

  /**
   * Sets the current specimen
   *
   * @param {string} name - the specimen name
   * @param {string} value - the specimen value
   * @return {Promise}
   */
  setSpecimen(name, value) {
    return new Promise((resolve) => {
      const specimen = clone(this.state.current.specimen);
      specimen[name] = value;
      this.setCurrent('specimen', specimen)
        .then(() => resolve());
    });
  }

  /**
   * Sets the current container
   *
   * @param {string} name - the container name
   * @param {string} value - the container value
   * @return {Promise}
   */
  setContainer(name, value) {
    return new Promise((resolve) => {
      const container = clone(this.state.current.container);
      value ? container[name] = value : delete container[name];
      this.setCurrent('container', container)
        .then(() => resolve());
    });
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {current, editable, errors} = clone(this.state);
    const {specimen, container, data, options} = this.props;

    // THIS IS A PLACE HOLDER FOR BETTER LAZY LOADING
    if (isEmpty(data.containers) ||
        isEmpty(data.specimens) || isEmpty(data.pools)
    ) {
      return <ProgressBar value={this.props.loading}/>;
    }

    const updateContainer = (container, close = true) => {
      this.setErrors('container', {});
      return new Promise((resolve) => this.setState({loading: true}, () => {
        if (options.container.stati[container.statusId].label === 'Shipped') {
          container.parentContainerId = null;
          container.coordinate = null;
        }
        return this.props.updateContainer(container)
          .then(() => close && this.clearEditable(),
            (errors) => errors.container && this.setErrors(
              'container', errors.container
            ))
          .then(() => this.setState({loading: false}, resolve()));
      }));
    };

    const updateSpecimen = (specimen) => {
      this.setErrors('specimen', {});
      return this.setState({loading: true}, () =>
        this.props.updateSpecimen(specimen)
          .then(() => this.clearEditable(),
            (errors) => errors.specimen && this.setErrors(
              'specimen', errors.specimen)
          )
          .then(() => this.setState({loading: false}))
      );
    };

    const renderMain = () => {
      if (this.props.specimen) {
        return (
          <BiobankSpecimen
            specimen={specimen}
            container={container}
            options={options}
            errors={this.state.errors}
            current={this.state.current}
            editable={this.state.editable}
            setCurrent={this.setCurrent}
            edit={this.edit}
            clearAll={this.clearAll}
            setSpecimen={this.setSpecimen}
            editSpecimen={this.editSpecimen}
            updateSpecimen={updateSpecimen}
          />
        );
      } else {
        return (
          <BiobankContainer
            history={this.props.history}
            container={container}
            data={data}
            options={options}
            current={this.state.current}
            editable={this.state.editable}
            editContainer={this.editContainer}
            updateContainer={updateContainer}
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

    return (
      <div>
        <Link to={`/`}>
          <span className='glyphicon glyphicon-chevron-left'/>
          Return to Filter
        </Link>
        <Header
          data={data}
          current={current}
          editable={editable}
          options={options}
          editContainer={this.editContainer}
          edit={this.edit}
          specimen={this.props.specimen}
          container={this.props.container}
          clearAll={this.clearAll}
          setContainer={this.setContainer}
          setSpecimen={this.setSpecimen}
          createSpecimens={this.props.createSpecimens}
          updateContainer={updateContainer}
          getParentContainerBarcodes={this.getParentContainerBarcodes}
          getBarcodePathDisplay={this.getBarcodePathDisplay}
          increaseCoordinate={this.props.increaseCoordinate}
          printLabel={this.props.printLabel}
        />
        <div className='summary'>
          <Globals
            loading={this.state.loading}
            current={current}
            errors={errors}
            editable={editable}
            data={data}
            options={options}
            specimen={specimen}
            container={container}
            edit={this.edit}
            clearAll={this.clearAll}
            editContainer={this.editContainer}
            editSpecimen={this.editSpecimen}
            setContainer={this.setContainer}
            setSpecimen={this.setSpecimen}
            uC={() => this.props.updateContainer(current.container)}
            updateContainer={updateContainer}
            updateSpecimen={updateSpecimen}
            getCoordinateLabel={this.getCoordinateLabel}
            setCurrent={this.setCurrent}
          />
          {renderMain()}
        </div>
      </div>
    );
  }
}

BarcodePage.propTypes = {
  data: PropTypes.shape({
    containers: PropTypes.array,
    specimens: PropTypes.array,
    pools: PropTypes.array,
  }),
  options: PropTypes.shape({
    container: PropTypes.shape({
      dimensions: PropTypes.object,
      stati: PropTypes.object,
    }),
  }),
  updateContainer: PropTypes.func,
  updateSpecimen: PropTypes.func,
  printLabel: PropTypes.func,
  increaseCoordinate: PropTypes.func,
  createSpecimens: PropTypes.func,
  loading: PropTypes.bool,
  history: PropTypes.object,
  specimen: PropTypes.object,
  container: PropTypes.shape({
    statusId: PropTypes.number,
    parentContainerId: PropTypes.number,
    coordinate: PropTypes.string,
  }),
};

export default BarcodePage;
