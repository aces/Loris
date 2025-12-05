import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import {mapFormOptions} from './helpers.js';
import ContainerDisplay from './containerDisplay';

/**
 * Biobank Container
 *
 * Fetches data corresponding to a given Container from Loris backend and
 * displays a page allowing viewing of meta information of the container
 */
class BiobankContainer extends Component {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.drag = this.drag.bind(this);
  }

  /**
   * Handle dragging of a container
   *
   * @param {Event} e - the drag event
   */
  drag(e) {
    const container = JSON.stringify(this.props.data.containers[e.target.id]);
    e.dataTransfer.setData('text/plain', container);
  }

  /**
   * Render React component
   *
   * @return {JSX}
   */
  render() {
    const {current, data, editable, options, container} = this.props;

    const checkoutButton = () => {
      if (!(loris.userHasPermission('biobank_container_update'))
              || (data.containers[container.id].childContainerIds.length == 0)
      ) {
        return;
      }

      return (
        <div style = {{marginLeft: 'auto', height: '10%', marginRight: '10%'}}>
          <div
            className={!editable.containerCheckout && !editable.loadContainer ?
              'action-button update open' : 'action-button update closed'}
            title={this.props.t('Checkout Child Containers', {ns: 'biobank'})}
            onClick={()=> this.props.edit('containerCheckout')}
          >
            <span className='glyphicon glyphicon-share'/>
          </div>
        </div>
      );
    };

    const parentBarcodes = this.props.getParentContainerBarcodes(container);
    const barcodes = mapFormOptions(data.containers, 'barcode');
    // delete values that are parents of the container
    Object.keys(parentBarcodes)
      .forEach(
        (key) => Object.keys(barcodes)
          .forEach(
            (i) => (parentBarcodes[key] == barcodes[i])
                && delete barcodes[i]
          )
      );

    const barcodePathDisplay = this.props.getBarcodePathDisplay(parentBarcodes);
    const coordinates = data.containers[container.id].childContainerIds
      .reduce(
        (result, id) => {
          const container = data.containers[id];
          if (container.coordinate) {
            result[container.coordinate] = id;
          }
          return result;
        }, {}
      );

    const containerDisplay = (
      <div className='display-container'>
        {checkoutButton()}
        <ContainerDisplay
          history={this.props.history}
          data={data}
          container={container}
          barcodes={barcodes}
          current={current}
          options={options}
          dimensions={options.container.dimensions[container.dimensionId]}
          coordinates={coordinates}
          editable={editable}
          edit={this.props.edit}
          clearAll={this.props.clearAll}
          setCurrent={this.props.setCurrent}
          setCheckoutList={this.props.setCheckoutList}
          editContainer={this.props.editContainer}
          updateContainer={this.props.updateContainer}
        />
        <div style={{display: 'inline'}}>
          {barcodePathDisplay}
        </div>
      </div>
    );

    const containerList = () => {
      if (!container.childContainerIds) {
        return <div className='title'>This Container is Empty!</div>;
      }
      const childIds = container.childContainerIds;
      let listAssigned = [];
      let coordinateList = [];
      let listUnassigned = [];
      childIds.forEach(
        (childId) => {
          if (!loris.userHasPermission('biobank_specimen_view')) {
            return;
          }
          const child = data.containers[childId];
          if (child.coordinate) {
            listAssigned.push(
              <div>
                <Link
                  key={childId}
                  to={`/barcode=${child.barcode}`}>
                  {child.barcode}
                </Link>
              </div>
            );
            const coordinate = this.props.getCoordinateLabel(child);
            coordinateList.push(<div>at {coordinate}</div>);
          } else {
            listUnassigned.push(
              <div>
                <Link
                  key={childId}
                  to={`/barcode=${child.barcode}`}
                  id={child.id}
                  draggable={true}
                  onDragStart={this.drag}
                >
                  {child.barcode}
                </Link>
                <br/>
              </div>
            );
          }
        }
      );

      return (
        <div>
          <div className='title'>
            {listAssigned.length !== 0 ? this.props.t('Assigned Containers', {ns: 'biobank'}) : null}
          </div>
          <div className='container-coordinate'>
            <div>{listAssigned}</div>
            <div style={{paddingLeft: 10}}>{coordinateList}</div>
          </div>
          {listAssigned.length !==0 ? <br/> : null}
          <div className='title'>
            {listUnassigned.length !== 0 ? this.props.t('Unassigned Containers', {ns: 'biobank'}) : null}
          </div>
          {listUnassigned}
        </div>
      );
    };

    return (
      <div className="container-display">
        {containerDisplay}
        <div className='container-list'>
          {containerList()}
        </div>
      </div>
    );
  }
}

BiobankContainer.propTypes = {
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        coordinate: PropTypes.string,
        barcode: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        childContainerIds: PropTypes.arrayOf(PropTypes.number),
        dimensionId: PropTypes.number,
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        containerId: PropTypes.number.isRequired,
      })
    ).isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,
  current: PropTypes.number.isRequired,
  editable: PropTypes.shape({
    containerCheckout: PropTypes.func.isRequired,
    loadContainer: PropTypes.func.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    container: PropTypes.shape({
      dimensions: PropTypes.object,
      stati: PropTypes.object,
      types: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  container: PropTypes.shape({
    id: PropTypes.number.isRequired,
    coordinate: PropTypes.string,
    barcode: PropTypes.string.isRequired,
    childContainerIds: PropTypes.arrayOf(PropTypes.number),
    dimensionId: PropTypes.number,
  }).isRequired,
  edit: PropTypes.func.isRequired,
  getParentContainerBarcodes: PropTypes.func.isRequired,
  getBarcodePathDisplay: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  clearAll: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setCheckoutList: PropTypes.func.isRequired,
  editContainer: PropTypes.func.isRequired,
  updateContainer: PropTypes.func.isRequired,
  getCoordinateLabel: PropTypes.func.isRequired,
};

export default withTranslation(['biobank', 'loris'])(BiobankContainer);
