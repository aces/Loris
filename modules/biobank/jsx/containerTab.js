import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import FilterableDataTable from 'FilterableDataTable';
import Search from './search';
import ContainerForm from './containerForm';
import {mapFormOptions, clone} from './helpers.js';

/**
 * React component for the Container tab in the Biobank module
 */
class ContainerTab extends Component {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = {editable: {}};
    this.edit = this.edit.bind(this);
    this.clearEditable = this.clearEditable.bind(this);
    this.mapContainerColumns = this.mapContainerColumns.bind(this);
    this.formatContainerColumns = this.formatContainerColumns.bind(this);
  }

  /**
   * Mark a key as editable
   *
   * @param {string} stateKey - the key
   * @return {Promise}
   */
  edit(stateKey) {
    const {editable} = clone(this.state);
    editable[stateKey] = true;
    return new Promise((res) => this.setState({editable}, res()));
  }

  /**
   * Clear the editable state of this form.
   */
  clearEditable() {
    this.setState({editable: {}});
  }

  /**
   * Map the columns for this container
   *
   * @param {string} column - the column name
   * @param {string} value - the column value
   * @return {string}
   */
  mapContainerColumns(column, value) {
    switch (column) {
    case 'Type':
      return this.props.options.container.types[value].label;
    case 'Status':
      return this.props.options.container.stati[value].label;
    case 'Site':
      return this.props.options.centers[value];
    default:
      return value;
    }
  }

  /**
   * Format the cells for a column in the container
   *
   * @param {string} column - the column name to format
   * @param {string} value - the value of the column
   * @param {object} row - the rest of the row
   * @return {JSX} a table cell
   */
  formatContainerColumns(column, value, row) {
    value = this.mapContainerColumns(column, value);
    switch (column) {
    case 'Barcode':
      return <td><Link to={`/barcode=${value}`}>{value}</Link></td>;
    case 'Status':
      const style = {};
      switch (value) {
      case 'Available':
        style.color = 'green';
        break;
      case 'Reserved':
        style.color = 'orange';
        break;
      case 'Dispensed':
        style.color = 'red';
        break;
      case 'Discarded':
        style.color = 'red';
        break;
      }
      return <td style={style}>{value}</td>;
    case 'Parent Barcode':
      return <td><Link to={`/barcode=${value}`}>{value}</Link></td>;
    default:
      return <td>{value}</td>;
    }
  }

  /**
   * Render React component
   *
   * @return {JSX}
   */
  render() {
    const {editable} = this.state;

    const stati = mapFormOptions(
      this.props.options.container.stati, 'label'
    );
    const containerTypesNonPrimary = mapFormOptions(
      this.props.options.container.typesNonPrimary, 'label'
    );
    const containersNonPrimary = Object.values(this.props.data.containers)
      .reduce(
        (result, container) => {
          // TODO: this check is necessary or else the page will go blank when the
          // first specimen is added.
          if (container) {
            const tprops = this.props.options.container.types;
            if (tprops[container.typeId].primary == 0) {
              result[container.id] = container;
            }
            return result;
          }
        }, {}
      );
    const barcodesNonPrimary = mapFormOptions(
      containersNonPrimary, 'barcode'
    );

    const data = Object.values(containersNonPrimary).map(
      (container) => {
        return [
          container.barcode,
          container.typeId,
          container.statusId,
          container.centerId,
          container.parentContainerBarcode,
        ];
      }
    );

    const fields = [
      {label: 'Barcode', show: true, filter: {
        name: 'barcode',
        type: 'text',
      }},
      {label: 'Type', show: true, filter: {
        name: 'type',
        type: 'select',
        options: containerTypesNonPrimary,
      }},
      {label: 'Status', show: true, filter: {
        name: 'status',
        type: 'select',
        options: stati,
      }},
      {label: 'Site', show: true, filter: {
        name: 'currentSite',
        type: 'select',
        options: this.props.options.centers,
      }},
      {label: 'Parent Barcode', show: true, filter: {
        name: 'parentBarcode',
        type: 'text',
      }},
    ];

    const openSearchContainer = () => this.edit('searchContainer');
    const openContainerForm = () => this.edit('containerForm');
    const actions = [
      {
        name: 'goToContainer',
        label: 'Go To Container',
        action: openSearchContainer,
      },
      {
        name: 'addContainer',
        label: 'Add Container',
        action: openContainerForm,
        show: loris.userHasPermission('biobank_container_create'),
      },
    ];

    return (
      <div>
        <FilterableDataTable
          name='container'
          data={data}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatContainerColumns}
          getMappedCell={this.mapContainerColumns}
          progress={this.props.loading}
        />
        <Search
          title='Go To Container'
          show={editable.searchContainer}
          onClose={this.clearEditable}
          barcodes={barcodesNonPrimary}
          history={this.props.history}
        />
        {loris.userHasPermission('biobank_container_create') ?
          <ContainerForm
            options={this.props.options}
            show={editable.containerForm}
            onClose={this.clearEditable}
            onSubmit={this.props.createContainers}
          /> : null}
      </div>
    );
  }
}

// ContainerTab.propTypes
ContainerTab.propTypes = {
  options: PropTypes.shape({
    container: PropTypes.shape({
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      stati: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
      typesNonPrimary: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  data: PropTypes.shape({
    containers: PropTypes.array.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  createContainers: PropTypes.func.isRequired,
};

export default ContainerTab;
