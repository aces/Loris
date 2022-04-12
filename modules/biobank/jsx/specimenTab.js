import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {clone, mapFormOptions} from './helpers.js';
import FilterableDataTable from 'FilterableDataTable';
import SpecimenForm from './specimenForm';
import PoolSpecimenForm from './poolSpecimenForm';
import BatchProcessForm from './batchProcessForm';
import BatchEditForm from './batchEditForm';
import Search from './search';

class SpecimenTab extends Component {
  constructor() {
    super();
    this.state = {editable: {}};
    this.edit = this.edit.bind(this);
    this.clearEditable = this.clearEditable.bind(this);
    this.mapSpecimenColumns = this.mapSpecimenColumns.bind(this);
    this.formatSpecimenColumns = this.formatSpecimenColumns.bind(this);
  }

  edit(stateKey) {
    const {editable} = clone(this.state);
    editable[stateKey] = true;
    return new Promise((res) => this.setState({editable}, res()));
  }

  clearEditable() {
    this.setState({editable: {}});
  }

  mapSpecimenColumns(column, value) {
    const {options, data} = this.props;
    switch (column) {
      case 'Type':
        return options.specimen.types[value].label;
      case 'Container Type':
        return options.container.typesPrimary[value].label;
      case 'Parent Specimen(s)':
        if (value instanceof Array) {
          return value
          .map((id) => data.containers[data.specimens[id].containerId].barcode);
        }
        break;
      case 'Diagnosis':
        return value.map((id) => options.diagnoses[id].label);
      case 'Status':
        return options.container.stati[value].label;
      case 'Current Site':
        return options.centers[value];
      case 'Draw Site':
        return options.centers[value];
      case 'Projects':
        return value.map((id) => options.projects[id]);
      default:
        return value;
    }
  }

  formatSpecimenColumns(column, value, row) {
    const {options} = this.props;
    value = this.mapSpecimenColumns(column, value);
    const candId = Object.values(options.candidates)
      .find((cand) => cand.pscid == row['PSCID']).id;
    switch (column) {
      case 'Barcode':
        return <td><Link to={`/barcode=${value}`}>{value}</Link></td>;
      case 'Parent Specimens':
        const barcodes = value && value.map((id, key) => {
          return <Link key={key} to={`/barcode=${value}`}>{value}</Link>;
        }).reduce((prev, curr) => [prev, ', ', curr]);
        return <td>{barcodes}</td>;
      case 'PSCID':
        return <td><a href={loris.BaseURL + '/' + candId}>{value}</a></td>;
      case 'Visit Label':
        const visitLabelURL = loris.BaseURL+'/instrument_list/?candID='+candId+
          '&sessionID='+Object.values(options.sessions).find((sess) => sess.label == value).id;
        return <td><a href={visitLabelURL}>{value}</a></td>;
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
      case 'Container Barcode':
        return <td><Link to={`/barcode=${value}`}>{value}</Link></td>;
      default:
        return <td>{value}</td>;
     }
  }
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
    const containerTypesPrimary = mapFormOptions(options.container.typesPrimary, 'label');
    const stati = mapFormOptions(options.container.stati, 'label');
    const diagnoses = mapFormOptions(options.diagnoses, 'label');
    const specimenData = Object.values(data.specimens).map((specimen) => {
      const container = data.containers[specimen.containerId];
      const parentContainer = data.containers[container.parentContainerId] || {};
      let specimenAttributeData = [];
      Object.keys(options.specimen.processAttributes)
        .forEach((processId) => {
          Object.keys(options.specimen.processAttributes[processId])
            .forEach((attributeId) => {
              const process = options.specimen.processes[processId].label.toLowerCase();
              if ((specimen[process]||{}).data) {
                if (options.specimen.processAttributes[processId][attributeId].protocolIds.includes(specimen[process].protocolId.toString())) {
                  specimenAttributeData.push(specimen[process].data[attributeId]);
                } else {
                  specimenAttributeData.push(null);
                }
              }
            });
        });
      return [
        container.barcode,
        specimen.typeId,
        container.typeId,
        specimen.quantity+' '+options.specimen.units[specimen.unitId].label,
        specimen.fTCycle || null,
        specimen.parentSpecimenIds,
        options.candidates[specimen.candidateId].pscid,
        options.candidates[specimen.candidateId].sex,
        specimen.candidateAge,
        options.candidates[specimen.candidateId].diagnosisIds,
        options.sessions[specimen.sessionId].label,
        specimen.poolId ? (data.pools[specimen.poolId]||{}).label : null,
        container.statusId,
        container.projectIds,
        container.centerId,
        options.sessionCenters[specimen.sessionId].centerId,
        specimen.collection.date,
        specimen.collection.time,
        (specimen.preparation||{}).time,
        parentContainer.barcode,
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
              {label: options.specimen.attributes[attributeId].label, show: true}
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
      {label: 'Projects', show: true, filter: {
        name: 'projects',
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
      {label: 'Coordinate', show: true},
      ...specimenAttributeFields,
    ];

    const openSearchSpecimen = () => this.edit('searchSpecimen');
    const openSpecimenForm = () => this.edit('specimenForm');
    const openPoolForm = () => this.edit('poolSpecimenForm');
    const openBatchProcessForm = () => this.edit('batchProcessForm');
    const openBatchEditForm = () => this.edit('batchEditForm');
    const actions = [
      {name: 'goToSpecimen', label: 'Go To Specimen', action: openSearchSpecimen},
      {name: 'addSpecimen', label: 'Add Specimen', action: openSpecimenForm},
      {name: 'poolSpecimen', label: 'Pool Specimens', action: openPoolForm},
      {name: 'batchProcess', label: 'Process Specimens', action: openBatchProcessForm},
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
          loading={this.props.loading}
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
        {loris.userHasPermission('biobank_specimen_update') ?
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
};

SpecimenTab.defaultProps = {
};

export default SpecimenTab;
