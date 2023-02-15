import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {clone, isEmpty} from './helpers.js';

import Globals from './globals';
import Header from './header';
import BiobankSpecimen from './specimen';
import BiobankContainer from './container';
import LoadingBar from 'jsx/LoadingBar';

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

class BarcodePage extends Component {
  constructor() {
    super();

    this.state = initialState;
    this.getParentContainerBarcodes = this.getParentContainerBarcodes.bind(this);
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

  getParentContainerBarcodes(container, barcodes=[]) {
    barcodes.push(container.barcode);

    const parent = Object.values(this.props.data.containers)
      .find((c) => container.parentContainerId == c.id);

    parent && this.getParentContainerBarcodes(parent, barcodes);

    return barcodes.slice(0).reverse();
  }

  getCoordinateLabel(container) {
    const parentContainer = this.props.data.containers[container.parentContainerId];
    const dimensions = this.props.options.container.dimensions[parentContainer.dimensionId];
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

  clearEditable() {
    const state = clone(this.state);
    state.editable = initialState.editable;
    return new Promise((res) => this.setState(state, res()));
  }

  clearAll() {
    return new Promise((res) => this.setState(initialState, res()));
  }

  setCheckoutList(container) {
    // Clear current container field.
    this.setCurrent('containerId', 1)
      .then(()=>this.setCurrent('containerId', null));
    const list = this.state.current.list;
    list[container.coordinate] = container;
    this.setCurrent('list', list);
  }

  editSpecimen(specimen) {
    specimen = clone(specimen);
    return this.setCurrent('specimen', specimen);
  }

  editContainer(container) {
    container = clone(container);
    return this.setCurrent('container', container);
  }

  setCurrent(name, value) {
    const current = clone(this.state.current);
    current[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  setErrors(name, value) {
    const errors = this.state.errors;
    errors[name] = value;
    this.setState({errors});
  }

  getBarcodePathDisplay(parentBarcodes) {
    return Object.keys(parentBarcodes).map((i) => {
      const container = Object.values(this.props.data.containers)
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
      const specimen = clone(this.state.current.specimen);
      specimen[name] = value;
      this.setCurrent('specimen', specimen)
      .then(() => resolve());
    });
  }

  setContainer(name, value) {
    return new Promise((resolve) => {
      const container = clone(this.state.current.container);
      value ? container[name] = value : delete container[name];
      this.setCurrent('container', container)
      .then(() => resolve());
    });
  }

  render() {
    const {current, editable, errors} = clone(this.state);
    const {specimen, container, data, options} = this.props;

    // THIS IS A PLACE HOLDER FOR BETTER LAZY LOADING
    if (isEmpty(data.containers) || isEmpty(data.specimens) || isEmpty(data.pools)) {
      return <LoadingBar progress={this.props.loading}/>;
    }

    const updateContainer = (container, close = true) => {
      this.setErrors('container', {});
      return new Promise((resolve) => this.setState({loading: true}, () =>
        this.props.updateContainer(container)
        .then(() => close && this.clearEditable(),
          (errors) => errors && this.setErrors('container', errors.container))
        .then(() => this.setState({loading: false}, resolve()))
      ));
    };
    const updateSpecimen = (specimen) => {
      this.setErrors('specimen', {});
      return this.setState({loading: true}, () =>
        this.props.updateSpecimen(specimen)
        .then(() => this.clearEditable(),
          (errors) => errors && this.setErrors('specimen', errors.specimen))
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
          editContainer={this.editContainer}
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

export default BarcodePage;
