import React from 'react';
import PropTypes from 'prop-types';

import {
  SearchableDropdown,
} from 'jsx/Form';

import ContainerDisplay from './containerDisplay';

import {clone} from './helpers';

/**
 * Biobank Container Parent Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to specimen a biobank file attached to a specific instrument
 *
 * @param {object} props The component's props
 */
function ContainerParentForm(props) {
  const {data, current, options} = props;

  const setInheritedProperties = (name, containerId) => {
    if (!containerId) {
      return;
    }

    const parentContainer = data.containers[containerId];
    const container = clone(current.container);
    container.parentContainerId = parentContainer.id;
    container.coordinate = null;
    container.temperature = parentContainer.temperature;
    container.centerId = parentContainer.centerId;
    container.statusId = parentContainer.statusId;

    props.setCurrent('container', container);
  };

  const removeChildContainers = (object, id) => {
    delete object[id];
    for (let key in data.containers) {
      if (id == data.containers[key].parentContainerId) {
        object = removeChildContainers(object, key);
      }
    }
    return object;
  };

  let containerBarcodesNonPrimary = Object.values(data.containers)
    .reduce((result, container) => {
      if (options.container.types[container.typeId].primary == 0) {
        const dimensions = options.container.dimensions[data.containers[
          container.id
        ].dimensionId];
        const capacity = dimensions.x * dimensions.y * dimensions.z;
        const available = capacity - container.childContainerIds.length;
        result[container.id] = container.barcode +
           ' (' +available + ' Available Spots)';
      }
      return result;
    }, {});

  // Delete child containers from options if a container is being placed in a
  // another container.
  if (props.container) {
    containerBarcodesNonPrimary = removeChildContainers(
      containerBarcodesNonPrimary,
      props.container.id
    );
  }

  const renderContainerDisplay = () => {
    if (!(current.container.parentContainerId && props.display)) {
      return;
    }

    const coordinates = data.containers[
      current.container.parentContainerId
    ].childContainerIds
      .reduce((result, id) => {
        const container = data.containers[id];
        if (container.coordinate) {
          result[container.coordinate] = id;
        }
        return result;
      }, {});

    return (
      <ContainerDisplay
        container={props.container}
        data={data}
        dimensions={options.container.dimensions[data.containers[
          current.container.parentContainerId
        ].dimensionId]}
        coordinates={coordinates}
        parentContainerId={current.container.parentContainerId}
        options={options}
        select={true}
        selectedCoordinate={current.container.coordinate}
        setContainer={props.setContainer}
      />
    );
  };

  return (
    <div className='row'>
      <div className="col-lg-11">
        <SearchableDropdown
          name="parentContainerId"
          label="Parent Container Barcode"
          options={containerBarcodesNonPrimary}
          onUserInput={setInheritedProperties}
          value={current.container.parentContainerId}
        />
      </div>
      {renderContainerDisplay()}
    </div>
  );
}

ContainerParentForm.propTypes = {
  setContainer: PropTypes.func.isRequired,
  data: PropTypes.object,
  container: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  current: PropTypes.shape({
    container: PropTypes.shape({
      parentContainerId: PropTypes.number,
      coordinate: PropTypes.string,
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  setCurrent: PropTypes.func.isRequired,
  display: PropTypes.string.isRequired,
};

export default ContainerParentForm;
