import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
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
   * Render React component
   *
   * @return {JSX}
   */
  render() {
    const {editable} = this.state;
    const {t, options} = this.props;

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

    const data = Object.values(containersNonPrimary);
    const barcodeLink = (barcode) => (
      <Link to={`/barcode=${barcode}`}>{barcode}</Link>
    );
    const statusColors = {
      Available: 'green',
      Reserved: 'orange',
      Dispensed: 'red',
      Discarded: 'red',
    };

    const fields = [
      {
        name: 'barcode',
        label: t('Barcode', {ns: 'biobank'}),
        show: true,
        filter: {name: 'barcode', type: 'text'},
        value: (container) => container.barcode,
        format: barcodeLink,
      },
      {
        name: 'type',
        label: t('Type', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'type',
          type: 'select',
          options: containerTypesNonPrimary,
        },
        value: (container) => container.typeId,
        display: (typeId) => options.container.types[typeId].label,
      },
      {
        name: 'status',
        label: t('Status', {ns: 'biobank'}),
        show: true,
        filter: {name: 'status', type: 'select', options: stati},
        value: (container) => container.statusId,
        display: (statusId) => options.container.stati[statusId].label,
        format: (statusId) => {
          const status = options.container.stati[statusId].label;
          return <span style={{color: statusColors[status]}}>{status}</span>;
        },
      },
      {
        name: 'currentSite',
        label: t('Site', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'currentSite',
          type: 'select',
          options: options.centers,
        },
        value: (container) => container.centerId,
        display: (centerId) => options.centers[centerId],
      },
      {
        name: 'parentBarcode',
        label: t('Parent Barcode', {ns: 'biobank'}),
        show: true,
        filter: {name: 'parentBarcode', type: 'text'},
        value: (container) => container.parentContainerBarcode,
        format: (barcode) => barcode && barcodeLink(barcode),
      },
    ];

    const openSearchContainer = () => this.edit('searchContainer');
    const openContainerForm = () => this.edit('containerForm');
    const actions = [
      {
        name: 'goToContainer',
        label: t('Go To Container', {ns: 'biobank'}),
        action: openSearchContainer,
      },
      {
        name: 'addContainer',
        label: t('Add Container', {ns: 'biobank'}),
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
          progress={this.props.loading}
        />
        <Search
          title={t('Go To Container', {ns: 'biobank'})}
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
  t: PropTypes.func.isRequired,
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

export default withTranslation(['biobank', 'loris'])(ContainerTab);
