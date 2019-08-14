import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ContainerDisplay from './containerDisplay.js';

/**
 * Biobank Container Parent Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to specimen a biobank file attached to a specific instrument
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 * */

class ContainerParentForm extends Component {
  constructor() {
    super();
    this.setInheritedProperties = this.setInheritedProperties.bind(this);
  }

  // TODO: there might be a better way to do this.
  setInheritedProperties(name, value) {
    const {data, setContainer} = this.props;
    const container = data.containers.nonPrimary[value];

    setContainer(name, value);
    setContainer('coordinate', null);
    setContainer('temperature', container.temperature);
    setContainer('centerId', container.centerId);
    setContainer('statusId', container.statusId);
  }

  removeChildContainers(object, id) {
    const {data} = this.props;
    delete object[id];
    for (let key in data.containers.nonPrimary) {
      if (id == data.containers.nonPrimary[key].parentContainerId) {
        object = this.removeChildContainers(object, key);
      }
    }
    return object;
  }

  render() {
    const {container, data, target, options, display} = this.props;
    const {mapFormOptions, setContainer} = this.props;
    let containerBarcodesNonPrimary = mapFormOptions(
      data.containers.nonPrimary, 'barcode'
    );

    // Delete child containers from options
    if (target) {
      containerBarcodesNonPrimary = this.removeChildContainers(containerBarcodesNonPrimary, target.container.id);
    }

    const renderContainerDisplay = () => {
      if (!(container.parentContainerId && display)) {
        return;
      }

      const coordinates = data.containers.nonPrimary[container.parentContainerId].childContainerIds
        .reduce((result, id) => {
          const container = data.containers.all[id];
          if (container.coordinate) {
            result[container.coordinate] = id;
          }
          return result;
        }, {});

      return (
        <ContainerDisplay
          target={target}
          data={data}
          dimensions={options.container.dimensions[data.containers.nonPrimary[
                container.parentContainerId
              ].dimensionId]
          }
          coordinates={coordinates}
          parentContainerId={container.parentContainerId}
          options={options}
          select={true}
          selectedCoordinate={container.coordinate}
          setContainer={setContainer}
        />
      );
    };

    return (
      <FormElement>
        <SelectElement
          name="parentContainerId"
          label="Parent Container Barcode"
          options={containerBarcodesNonPrimary}
          onUserInput={this.setInheritedProperties}
          value={container.parentContainerId}
        />
        {renderContainerDisplay()}
      </FormElement>
    );
  }
}

ContainerParentForm.propTypes = {
  mapFormOptions: PropTypes.func.isRequired,
  setContainer: PropTypes.func.isRequired,
  data: PropTypes.object,
  target: PropTypes.object,
  container: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default ContainerParentForm;
