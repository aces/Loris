import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FilterableDataTable from 'FilterableDataTable';
import Search from './search';
import ContainerForm from './containerForm';
import {mapFormOptions, clone} from './helpers.js';

class ContainerTab extends Component {
  constructor() {
    super();

    this.state = {editable: {}};
    this.edit = this.edit.bind(this);
    this.clearEditable = this.clearEditable.bind(this);
    this.mapContainerColumns = this.mapContainerColumns.bind(this);
    this.formatContainerColumns = this.formatContainerColumns.bind(this);
  }

  edit(stateKey) {
    const {editable} = clone(this.state);
    editable[stateKey] = true;
    return new Promise((res) => this.setState({editable}, res()));
  }

  clearEditable() {
    this.setState({editable: {}});
  }

  mapContainerColumns(column, value) {
    switch (column) {
      case 'Type':
        return this.props.options.container.types[value].label;
      case 'Status':
        return this.props.options.container.stati[value].label;
      case 'Projects':
        return value.map((id) => this.props.options.projects[id]);
      case 'Site':
        return this.props.options.centers[value];
      case 'Parent Barcode':
        return (value && this.props.data.containers[value].barcode);
      default:
        return value;
    }
  }

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
      case 'Projects':
        return <td>{value.join(', ')}</td>;
      case 'Parent Barcode':
        return <td><Link to={`/barcode=${value}`}>{value}</Link></td>;
      default:
        return <td>{value}</td>;
    }
  }

  render() {
    const {editable} = this.state;

    const stati = mapFormOptions(
      this.props.options.container.stati, 'label'
    );
    const containerTypesNonPrimary = mapFormOptions(
      this.props.options.container.typesNonPrimary, 'label'
    );
    const containersNonPrimary = Object.values(this.props.data.containers)
      .reduce((result, container) => {
        // TODO: this check is necessary or else the page will go blank when the
        // first specimen is added.
        if (container) {
          if (this.props.options.container.types[container.typeId].primary == 0) {
            result[container.id] = container;
          }
          return result;
        }
      }, {});
    const barcodesNonPrimary = mapFormOptions(
      containersNonPrimary, 'barcode'
    );

    const data = Object.values(containersNonPrimary).map(
      (container) => {
        return [
          container.barcode,
          container.typeId,
          container.statusId,
          container.projectIds,
          container.centerId,
          container.parentContainerId,
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
      {label: 'Projects', show: true, filter: {
        name: 'project',
        type: 'multiselect',
        options: this.props.options.projects,
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
      {name: 'goToContainer', label: 'Go To Container', action: openSearchContainer},
      {name: 'addContainer', label: 'Add Container', action: openContainerForm},
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
          loading={this.props.loading}
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

export default ContainerTab;
