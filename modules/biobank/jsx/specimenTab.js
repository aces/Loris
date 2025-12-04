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
    this.mapSpecimenColumns = this.mapSpecimenColumns.bind(this);
    this.formatSpecimenColumns = this.formatSpecimenColumns.bind(this);
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
   * Map a specimen id to a string value for display.
   *
   * @param {string} column - the column name being mapped
   * @param {string} value - the value being mapped
   * @return {string}
   */
  mapSpecimenColumns(column, value) {
    const {options} = this.props;
    switch (column) {
    case 'Type':
      return options.specimen.types[value].label;
    case 'Container Type':
      return options.container.typesPrimary[value].label;
    case 'Diagnosis':
      if (Array.isArray(value) && value.length > 0) {
        return value.map((id) => options.diagnoses[id].label);
      }
      break;
    case 'Visit Label':
      return options.sessions[value].label;
    case 'Status':
      return options.container.stati[value].label;
    case 'Current Site':
      return options.centers[value];
    case 'Draw Site':
      return options.centers[value];
    case 'Project':
      return options.projects[value];
    default:
      return value;
    }
  }

  /**
   * Format columns for a specimen row
   *
   * @param {string} column - the column name being mapped
   * @param {string} value - the value being mapped
   * @param {array} row - an array of the row values
   * @return {JSX}
   */
  formatSpecimenColumns(column, value, row) {
    const {data, options} = this.props;
    const display = this.mapSpecimenColumns(column, value);
    const candidate = Object.values(options.candidates)
      .find((cand) => cand?.pscid == row['PSCID']);
    const candidatePermission = candidate !== undefined;
    switch (column) {
    case 'Barcode':
      return <td><Link to={`/barcode=${display}`}>{display}</Link></td>;
    case 'Parent Specimens':
      // TODO: if the user doesn't have access then these shouldn't be hyperlinked
      const barcodes = display && display.map((id, key) => {
        return <Link key={key} to={`/barcode=${display}`}>{display}</Link>;
      }).reduce((prev, curr) => [prev, ', ', curr]);
      return <td>{barcodes}</td>;
    case 'PSCID':
      if (candidatePermission) {
        return (
          <td>
            <a href={loris.BaseURL + '/' + candidate.id}>{display}</a>
          </td>
        );
      }
      return <td>{display}</td>;
    case 'Visit Label':
      if (candidatePermission) {
        const visitLabelURL = loris.BaseURL+'/instrument_list/?candID='+
          candidate.id+'&sessionID='+value;
        return <td><a href={visitLabelURL}>{display}</a></td>;
      }
      return <td>{display}</td>;
    case 'Status':
      const style = {};
      switch (display) {
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
      return <td style={style}>{display}</td>;
    case 'Container Barcode':
      // check if container has be queried
      if (
        Object.values(data.containers)
          .find((container) => container.barcode == display)
      ) {
        return <td><Link to={`/barcode=${display}`}>{display}</Link></td>;
      }
      return <td>{display}</td>;
    default:
      return <td>{display}</td>;
    }
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {editable} = this.state;
    const {data, options} = this.props;
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
    const specimenData = Object.values(data.specimens).map((specimen) => {
      const container = data.containers[specimen.containerId];
      let specimenAttributeData = [];
      Object.keys(options.specimen.processAttributes)
        .forEach((processId) => {
          Object.keys(options.specimen.processAttributes[processId])
            .forEach((attributeId) => {
              const sopt = options.specimen;
              const process = sopt.processes[processId].label.toLowerCase();
              if ((specimen[process]||{}).data) {
                const processIdStr = specimen[process].protocolId.toString();
                const attrs = options.specimen.processAttributes;
                const protocols = attrs[processId][attributeId].protocolIds;
                if (protocols.includes(processIdStr)) {
                  const data = specimen[process].data[attributeId];
                  specimenAttributeData.push(data);
                } else {
                  specimenAttributeData.push(null);
                }
              }
            });
        });
      const candidate = options.candidates[specimen.candidateId];
      return [
        specimen.barcode,
        specimen.typeId,
        container.typeId,
        specimen.quantity+' '+options.specimen.units[specimen.unitId].label,
        specimen.fTCycle || null,
        specimen.parentSpecimenBarcodes,
        specimen.candidatePSCID,
        candidate?.sex || null,
        specimen.candidateAge,
        candidate?.diagnosisIds || null,
        specimen.sessionId,
        specimen.poolId ? (data.pools[specimen.poolId]||{}).label : null,
        container.statusId,
        specimen.projectId,
        specimen.centerId,
        options.sessions[specimen.sessionId]?.centerId,
        specimen.collection.date,
        specimen.collection.time,
        (specimen.preparation||{}).time,
        container.parentContainerBarcode,
        container.coordinate,
        ...specimenAttributeData,
      ];
    });

    let specimenAttributeFields = [];
    Object.keys(options.specimen.processAttributes)
      .forEach((processId) => {
        Object.keys(options.specimen.processAttributes[processId])
          .forEach((attributeId) => {
            specimenAttributeFields.push(
              {
                label: options.specimen.attributes[attributeId].label,
                show: true,
              },
            );
          });
      });
    const fields = [
      {label: 'Barcode', show: true, filter: {
        name: 'barcode',
        type: 'text',
      }},
      {label: 'Type', show: true, filter: {
        name: 'type',
        type: 'select',
        options: specimenTypes,
      }},
      {label: 'Container Type', show: true, filter: {
        name: 'containerType',
        type: 'select',
        options: containerTypesPrimary,
      }},
      {label: 'Quantity', show: true},
      {label: 'F/T Cycle', show: false, filter: {
        name: 'fTCycle',
        type: 'text',
        hide: true,
      }},
      {label: 'Parent Specimen(s)', show: false, filter: {
        name: 'parentSpecimens',
        type: 'text',
        hide: true,
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: 'Sex', show: true, filter: {
        name: 'sex',
        type: 'select',
        options: {Male: 'Male', Female: 'Female'},
      }},
      {label: 'Age at Collection', show: true, filter: {
        name: 'age',
        type: 'number',
      }},
      {label: 'Diagnosis', show: true, filter: {
        name: 'diagnosis',
        type: 'multiselect',
        options: diagnoses,
      }},
      {label: 'Visit Label', show: true, filter: {
        name: 'session',
        type: 'text',
      }},
      {label: 'Pool', show: false, filter: {
        name: 'pool',
        type: 'text',
        hide: true,
      }},
      {label: 'Status', show: true, filter: {
        name: 'status',
        type: 'select',
        options: stati,
      }},
      {label: 'Project', show: true, filter: {
        name: 'project',
        type: 'multiselect',
        options: options.projects,
      }},
      {label: 'Current Site', show: true, filter: {
        name: 'currentSite',
        type: 'select',
        options: options.centers,
      }},
      {label: 'Draw Site', show: true, filter: {
        name: 'drawSite',
        type: 'select',
        options: options.centers,
      }},
      {label: 'Collection Date', show: true, filter: {
        name: 'collectionDate',
        type: 'date',
      }},
      {label: 'Collection Time', show: true, filter: {
        name: 'collectionTime',
        type: 'text',
      }},
      {label: 'Preparation Time', show: true, filter: {
        name: 'preparationTime',
        type: 'text',
      }},
      {label: 'Container Barcode', show: true, filter: {
        name: 'containerBarcode',
        type: 'text',
      }},
      {label: t('Coordinate', {ns: 'loris'}), show: true},
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
        label: t('Go To Specimen', {ns: 'biobank'}),
        action: openSearchSpecimen,
      },
      {name: 'addSpecimen', label: 'Add Specimen', action: openSpecimenForm},
      {name: 'poolSpecimen', label: 'Pool Specimens', action: openPoolForm},
      {
        name: 'batchProcess',
        label: t('Process Specimens', {ns: 'biobank'}),
        action: openBatchProcessForm,
      },
      {name: 'batchEdit', label: 'Edit Specimens', action: openBatchEditForm},
    ];

    return (
      <div>
        <FilterableDataTable
          name='specimen'
          data={specimenData}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatSpecimenColumns}
          getMappedCell={this.mapSpecimenColumns}
          progress={this.props.loading}
        />
        <Search
          title='Go To Specimen'
          show={editable.searchSpecimen}
          onClose={this.clearEditable}
          barcodes={barcodesPrimary}
          history={this.props.history}
        />
        {loris.userHasPermission('biobank_specimen_create') ?
          <SpecimenForm
            title='Add New Specimen'
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

export default withTranslation()(SpecimenTab);
