import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';

import {clone, mapFormOptions} from './helpers.js';
import FilterableDataTable from 'FilterableDataTable';
import SpecimenForm from './specimenForm';
import PoolSpecimenForm from './poolSpecimenForm';
import BatchProcessForm from './batchProcessForm';
import BatchEditForm from './batchEditForm';
import Search from './search';

/**
 * JSX Component representing the specimen tab of the biobank
 * module.
 */
class SpecimenTab extends Component {
  /**
   * Constructor for SpecimenTab
   */
  constructor() {
    super();
    this.state = {editable: {}};
    this.edit = this.edit.bind(this);
    this.clearEditable = this.clearEditable.bind(this);
  }

  /**
   * Make the form editable
   *
   * @param {object} stateKey - the key holding the state
   * @return {Promise}
   */
  edit(stateKey) {
    const {editable} = clone(this.state);
    editable[stateKey] = true;
    return new Promise((res) => this.setState({editable}, res()));
  }

  /**
   * Clear the editable state of this tab.
   */
  clearEditable() {
    this.setState({editable: {}});
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {editable} = this.state;
    const {t, data, options} = this.props;
    const barcodesPrimary = Object.values(data.containers)
      .reduce((result, container) => {
        if (options.container.types[container.typeId].primary == 1) {
          result[container.id] = container.barcode;
        }
        return result;
      }, {});
    const specimenTypes = mapFormOptions(options.specimen.types, 'label');
    const containerTypesPrimary = mapFormOptions(
      options.container.typesPrimary, 'label'
    );
    const stati = mapFormOptions(options.container.stati, 'label');
    const diagnoses = mapFormOptions(options.diagnoses, 'label');
    const specimenData = Object.values(data.specimens);
    const containerOf = (specimen) => data.containers[specimen.containerId];
    const candidateOf = (specimen) => options.candidates[specimen.candidateId];
    const barcodeLink = (barcode) => (
      <Link to={`/barcode=${barcode}`}>{barcode}</Link>
    );
    const statusColors = {
      Available: 'green',
      Reserved: 'orange',
      Dispensed: 'red',
      Discarded: 'red',
    };

    let specimenAttributeFields = [];
    Object.keys(options.specimen.processAttributes)
      .forEach((processId) => {
        const process = options.specimen.processes[processId]
          .label.toLowerCase();
        Object.keys(options.specimen.processAttributes[processId])
          .forEach((attributeId) => {
            const protocolIds = options.specimen
              .processAttributes[processId][attributeId].protocolIds;
            specimenAttributeFields.push(
              {
                name: `attribute_${processId}_${attributeId}`,
                label: options.specimen.attributes[attributeId].label,
                show: true,
                value: (specimen) => {
                  const processData = specimen[process];
                  if (!processData?.data
                    || !protocolIds.includes(processData.protocolId.toString())
                  ) {
                    return null;
                  }
                  return processData.data[attributeId];
                },
              },
            );
          });
      });
    const fields = [
      {
        name: 'barcode',
        label: t('Barcode', {ns: 'biobank'}),
        show: true,
        filter: {name: 'barcode', type: 'text'},
        value: (specimen) => specimen.barcode,
        format: barcodeLink,
      },
      {
        name: 'type',
        label: t('Type', {ns: 'loris'}),
        show: true,
        filter: {name: 'type', type: 'select', options: specimenTypes},
        value: (specimen) => specimen.typeId,
        display: (typeId) => options.specimen.types[typeId].label,
      },
      {
        name: 'containerType',
        label: t('Container Type', {ns: 'biobank'}),
        show: true,
        filter: {
          name: 'containerType',
          type: 'select',
          options: containerTypesPrimary,
        },
        value: (specimen) => containerOf(specimen).typeId,
        display: (typeId) => options.container.typesPrimary[typeId].label,
      },
      {
        name: 'quantity',
        label: t('Quantity', {ns: 'biobank'}),
        show: true,
        value: (specimen) => specimen.quantity,
        display: (quantity, specimen) => quantity + ' '
          + options.specimen.units[specimen.unitId].label,
      },
      {
        name: 'fTCycle',
        label: t('F/T Cycle', {ns: 'biobank'}),
        show: false,
        filter: {name: 'fTCycle', type: 'text', hide: true},
        value: (specimen) => specimen.fTCycle || null,
      },
      {
        name: 'parentSpecimens',
        label: t('Parent Specimen(s)', {ns: 'biobank'}),
        show: false,
        filter: {name: 'parentSpecimens', type: 'text', hide: true},
        value: (specimen) => specimen.parentSpecimenBarcodes,
        format: (barcodes) => barcodes && barcodes
          .map((barcode) => (
            <Link key={barcode} to={`/barcode=${barcode}`}>{barcode}</Link>
          ))
          .reduce((prev, curr) => [prev, ', ', curr]),
      },
      {
        name: 'pscid',
        label: t('PSCID', {ns: 'loris'}),
        show: true,
        filter: {name: 'pscid', type: 'text'},
        value: (specimen) => specimen.candidatePSCID,
        format: (pscid, specimen) => {
          if (!candidateOf(specimen)) {
            return pscid;
          }
          const candidateURL = loris.BaseURL + '/' + specimen.candidateId;
          return <a href={candidateURL}>{pscid}</a>;
        },
      },
      {
        name: 'sex',
        label: t('Sex', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'sex',
          type: 'select',
          options: {
            Male: t('Male', {ns: 'biobank'}),
            Female: t('Female', {ns: 'biobank'}),
          },
        },
        value: (specimen) => candidateOf(specimen)?.sex || null,
      },
      {
        name: 'age',
        label: t('Age at Collection', {ns: 'biobank'}),
        show: true,
        filter: {name: 'age', type: 'number-range'},
        value: (specimen) => specimen.candidateAge,
      },
      {
        name: 'diagnosis',
        label: t('Diagnosis', {ns: 'biobank'}),
        show: true,
        filter: {name: 'diagnosis', type: 'multiselect', options: diagnoses},
        value: (specimen) => candidateOf(specimen)?.diagnosisIds || null,
        display: (diagnosisIds) => (diagnosisIds || [])
          .map((id) => options.diagnoses[id].label)
          .join(', '),
      },
      {
        name: 'session',
        label: t('Visit Label', {ns: 'loris'}),
        show: true,
        filter: {name: 'session', type: 'text'},
        value: (specimen) => options.sessions[specimen.sessionId]?.label,
        format: (visitLabel, specimen) => {
          if (!candidateOf(specimen)) {
            return visitLabel;
          }
          const visitLabelURL = loris.BaseURL + '/instrument_list/?candID='
            + specimen.candidateId + '&sessionID=' + specimen.sessionId;
          return <a href={visitLabelURL}>{visitLabel}</a>;
        },
      },
      {
        name: 'pool',
        label: t('Pool', {ns: 'biobank'}),
        show: false,
        filter: {name: 'pool', type: 'text', hide: true},
        value: (specimen) => specimen.poolId
          ? (data.pools[specimen.poolId] || {}).label
          : null,
      },
      {
        name: 'status',
        label: t('Status', {ns: 'biobank'}),
        show: true,
        filter: {name: 'status', type: 'select', options: stati},
        value: (specimen) => containerOf(specimen).statusId,
        display: (statusId) => options.container.stati[statusId].label,
        format: (statusId) => {
          const status = options.container.stati[statusId].label;
          return <span style={{color: statusColors[status]}}>{status}</span>;
        },
      },
      {
        name: 'project',
        label: t('Project', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'project',
          type: 'multiselect',
          options: options.projects,
        },
        value: (specimen) => specimen.projectId,
        display: (projectId) => options.projects[projectId],
      },
      {
        name: 'currentSite',
        label: t('Current Site', {ns: 'biobank'}),
        show: true,
        filter: {
          name: 'currentSite',
          type: 'select',
          options: options.centers,
        },
        value: (specimen) => specimen.centerId,
        display: (centerId) => options.centers[centerId],
      },
      {
        name: 'drawSite',
        label: t('Draw Site', {ns: 'biobank'}),
        show: true,
        filter: {name: 'drawSite', type: 'select', options: options.centers},
        value: (specimen) => options.sessions[specimen.sessionId]?.centerId,
        display: (centerId) => options.centers[centerId],
      },
      {
        name: 'collectionDate',
        label: t('Collection Date', {ns: 'biobank'}),
        show: true,
        filter: {name: 'collectionDate', type: 'date'},
        value: (specimen) => specimen.collection.date,
      },
      {
        name: 'collectionTime',
        label: t('Collection Time', {ns: 'biobank'}),
        show: true,
        filter: {name: 'collectionTime', type: 'text'},
        value: (specimen) => specimen.collection.time,
      },
      {
        name: 'preparationTime',
        label: t('Preparation Time', {ns: 'biobank'}),
        show: true,
        filter: {name: 'preparationTime', type: 'text'},
        value: (specimen) => (specimen.preparation || {}).time,
      },
      {
        name: 'containerBarcode',
        label: t('Container Barcode', {ns: 'biobank'}),
        show: true,
        filter: {name: 'containerBarcode', type: 'text'},
        value: (specimen) => containerOf(specimen).parentContainerBarcode,
        format: (barcode, specimen) => {
          const parentId = containerOf(specimen).parentContainerId;
          return data.containers[parentId] ? barcodeLink(barcode) : barcode;
        },
      },
      {
        name: 'coordinate',
        label: t('Coordinate', {ns: 'biobank'}),
        show: true,
        value: (specimen) => containerOf(specimen).coordinate,
      },
      ...specimenAttributeFields,
    ];

    const openSearchSpecimen = () => this.edit('searchSpecimen');
    const openSpecimenForm = () => this.edit('specimenForm');
    const openPoolForm = () => this.edit('poolSpecimenForm');
    const openBatchProcessForm = () => this.edit('batchProcessForm');
    const openBatchEditForm = () => this.edit('batchEditForm');
    const actions = [
      {
        name: 'goToSpecimen',
        label: this.props.t('Go To Specimen', {ns: 'biobank'}),
        action: openSearchSpecimen,
      },
      {
        name: 'addSpecimen',
        label: t('Add Specimen', {ns: 'biobank'}),
        action: openSpecimenForm,
      },
      {
        name: 'poolSpecimen',
        label: t('Pool Specimens', {ns: 'biobank'}),
        action: openPoolForm,
      },
      {
        name: 'batchProcess',
        label: this.props.t('Process Specimens', {ns: 'biobank'}),
        action: openBatchProcessForm,
      },
      {
        name: 'batchEdit',
        label: t('Edit Specimens', {ns: 'biobank'}),
        action: openBatchEditForm,
      },
    ];

    return (
      <div>
        <FilterableDataTable
          name='specimen'
          data={specimenData}
          fields={fields}
          actions={actions}
          progress={this.props.loading}
        />
        <Search
          title={this.props.t('Go To Specimen', {ns: 'biobank'})}
          show={editable.searchSpecimen}
          onClose={this.clearEditable}
          barcodes={barcodesPrimary}
          history={this.props.history}
        />
        {loris.userHasPermission('biobank_specimen_create') ?
          <SpecimenForm
            title={this.props.t('Add New Specimen', {ns: 'biobank'})}
            options={options}
            data={data}
            increaseCoordinate={this.props.increaseCoordinate}
            show={editable.specimenForm}
            onClose={this.clearEditable}
            onSubmit={this.props.createSpecimens}
          /> : null}
        {loris.userHasPermission('biobank_pool_create') ?
          <PoolSpecimenForm
            options={this.props.options}
            data={this.props.data}
            show={editable.poolSpecimenForm}
            onClose={this.clearEditable}
            onSubmit={this.props.createPool}
          /> : null}
        {loris.userHasPermission('biobank_specimen_update') ?
          <BatchProcessForm
            show={editable.batchProcessForm}
            onClose={this.clearEditable}
            onSubmit={this.props.updateSpecimens}
            options={this.props.options}
            data={this.props.data}
          /> : null}
        {loris.userHasPermission('biobank_specimen_alter') ?
          <BatchEditForm
            show={editable.batchEditForm}
            onClose={this.clearEditable}
            onSubmit={this.props.editSpecimens}
            options={this.props.options}
            data={this.props.data}
          /> : null}
      </div>
    );
  }
}

SpecimenTab.propTypes = {
  t: PropTypes.func.isRequired,
  options: PropTypes.shape({
    specimen: PropTypes.shape({
      attributes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
      units: PropTypes.string, // Added based on errors
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      processes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
      processAttributes: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.shape({
            protocolIds: PropTypes.arrayOf(PropTypes.number),
          })
        )
      ),
      typeContainerTypes: PropTypes.arrayOf(PropTypes.string).isRequired, // Added based on previous propTypes
    }).isRequired,
    container: PropTypes.shape({
      types: PropTypes.obj,
      typesPrimary: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      stati: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    diagnoses: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
      })
    ),
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
    projects: PropTypes.arrayOf(PropTypes.string).isRequired,
    candidates: PropTypes.arrayOf(PropTypes.string).isRequired,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,

  // Data prop: Contains containers, specimens, and pools data
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        statusId: PropTypes.number, // Added based on error
        temperature: PropTypes.number, // Added based on error
        comments: PropTypes.string, // Added based on error
        // Add other container-specific properties if necessary
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        // Add other specimen-specific properties if necessary
      })
    ).isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,

  // Functional props
  onSubmit: PropTypes.func.isRequired,
  increaseCoordinate: PropTypes.func.isRequired,
  createSpecimens: PropTypes.func.isRequired,
  createPool: PropTypes.func.isRequired,
  updateSpecimens: PropTypes.func.isRequired,
  editSpecimens: PropTypes.func.isRequired,

  // UI Control props
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,

  // History prop: For navigation
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  // Current state props
  current: PropTypes.shape({
    specimen: PropTypes.shape({
      quantity: PropTypes.number,
      unitId: PropTypes.number,
      // Add other specimen-specific properties if necessary
    }).isRequired,
    container: PropTypes.shape({
      statusId: PropTypes.number.isRequired,
      temperature: PropTypes.number,
      comments: PropTypes.string,
      // Add other container-specific properties if necessary
    }).isRequired,
  }).isRequired,

  // Errors prop: Handles validation errors
  errors: PropTypes.shape({
    container: PropTypes.shape({
      typeId: PropTypes.string,
      temperature: PropTypes.string,
      statusId: PropTypes.string,
      comments: PropTypes.string,
    }),
    specimen: PropTypes.shape({
      quantity: PropTypes.string,
      unitId: PropTypes.string,
      // Add other specimen-specific error properties if necessary
    }),
  }).isRequired,

  // Additional props based on errors
  loading: PropTypes.bool.isRequired,
};

export default withTranslation(['biobank', 'loris'])(SpecimenTab);
