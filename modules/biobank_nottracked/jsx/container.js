import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import Globals from './globals';
import ContainerDisplay from './containerDisplay';
import ContainerCheckout from './containerCheckout';

/**
 * Biobank Container
 *
 * Fetches data corresponding to a given Container from Loris backend and
 * displays a page allowing viewing of meta information of the container
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 * */
class BiobankContainer extends Component {
  constructor() {
    super();
    this.drag = this.drag.bind(this);
  }

  drag(e) {
    const container = JSON.stringify(this.props.data.containers.all[e.target.id]);
    e.dataTransfer.setData('text/plain', container);
  }

  render() {
    const {current, data, editable, errors, options, target} = this.props;

    const checkoutButton = () => {
      if (!(loris.userHasPermission('biobank_container_update') &&
          data.containers.nonPrimary[target.container.id].childContainerIds.length !== 0)) {
        return;
      }

      return (
        <div style = {{marginLeft: 'auto', height: '10%', marginRight: '10%'}}>
          <div
            className={!editable.containerCheckout && !editable.loadContainer ?
              'action-button update open' : 'action-button update closed'}
            title='Checkout Child Containers'
            onClick={()=>{
              this.props.edit('containerCheckout');
            }}
          >
            <span className='glyphicon glyphicon-share'/>
          </div>
        </div>
      );
    };

    const parentBarcodes = this.props.getParentContainerBarcodes(target.container);
    const barcodes = this.props.mapFormOptions(data.containers.all, 'barcode');
    // delete values that are parents of the container
    Object.keys(parentBarcodes)
      .forEach((key) => Object.keys(barcodes)
        .forEach((i) => (parentBarcodes[key] == barcodes[i]) && delete barcodes[i])
    );

    const barcodePathDisplay = this.props.getBarcodePathDisplay(parentBarcodes);
    const coordinates = data.containers.nonPrimary[target.container.id].childContainerIds
      .reduce((result, id) => {
        const container = data.containers.all[id];
        if (container.coordinate) {
          result[container.coordinate] = id;
        }
        return result;
      }, {});

    const containerDisplay = (
      <div className='display-container'>
        {checkoutButton()}
        <ContainerDisplay
          history={this.props.history}
          data={data}
          target={target}
          barcodes={barcodes}
          container={current.container}
          current={current}
          options={options}
          dimensions={options.container.dimensions[target.container.dimensionId]}
          coordinates={coordinates}
          editable={editable}
          edit={this.props.edit}
          clearAll={this.props.clearAll}
          setCurrent={this.props.setCurrent}
          setCheckoutList={this.props.setCheckoutList}
          mapFormOptions={this.props.mapFormOptions}
          editContainer={this.props.editContainer}
          updateContainer={this.props.updateContainer}
        />
        <div style={{display: 'inline'}}>
          {barcodePathDisplay}
        </div>
      </div>
    );

    const containerList = () => {
      if (Object.keys(target.container.childContainerIds).length === 0) {
        return <div className='title'>This Container is Empty!</div>;
      }
      const childIds = target.container.childContainerIds;
      let listAssigned = [];
      let coordinateList = [];
      let listUnassigned = [];
      Object.values(childIds).forEach((childId) => {
        if (!loris.userHasPermission('biobank_specimen_view')) {
          return;
        }

        const child = data.containers.all[childId];
        if (child.coordinate) {
          listAssigned.push(
            <div><Link key={childId} to={`/barcode=${child.barcode}`}>{child.barcode}</Link></div>
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
      });

      return (
        <div>
          <div className='title'>
            {listAssigned.length !== 0 ? 'Assigned Containers' : null}
          </div>
          <div className='container-coordinate'>
            <div>{listAssigned}</div>
            <div style={{paddingLeft: 10}}>{coordinateList}</div>
          </div>
            {listAssigned.length !==0 ? <br/> : null}
          <div className='title'>
            {listUnassigned.length !== 0 ? 'Unassigned Containers' : null}
          </div>
          {listUnassigned}
        </div>
      );
    };

    return (
      <div id='container-page'>
        <div className="container-header">
          <div className='container-title'>
            <div className='barcode'>
              Barcode
              <div className='value'>
                <strong>{target.container.barcode}</strong>
              </div>
              Address: {barcodePathDisplay} <br/>
              Lot Number: {target.container.lotNumber} <br/>
              Expiration Date: {target.container.expirationDate}
            </div>
            <ContainerCheckout
              container={target.container}
              current={current}
              editContainer={this.props.editContainer}
              setContainer={this.props.setContainer}
              updateContainer={this.props.updateContainer}
            />
          </div>
        </div>
        <div className='summary'>
          <Globals
            container={current.container}
            data={data}
            editable={editable}
            errors={errors}
            target={target}
            options={options}
            edit={this.props.edit}
            clearAll={this.props.clearAll}
            mapFormOptions={this.props.mapFormOptions}
            editContainer={this.props.editContainer}
            setContainer={this.props.setContainer}
            updateContainer={this.props.updateContainer}
            getCoordinateLabel={this.props.getCoordinateLabel}
          />
          {containerDisplay}
          <div className='container-list'>
            {containerList()}
          </div>
        </div>
      </div>
    );
  }
}

BiobankContainer.propTypes = {
  containerPageDataURL: PropTypes.string.isRequired,
};

export default BiobankContainer;
