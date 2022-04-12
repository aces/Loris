import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FilterableDataTable from 'FilterableDataTable';
import SpecimenForm from './specimenForm';

import {mapFormOptions, clone} from './helpers.js';

class PoolTab extends Component {
  constructor() {
    super();

    this.state = {editable: {}, poolId: null};
    this.edit = this.edit.bind(this);
    this.clearEditable = this.clearEditable.bind(this);
    this.openAliquotForm = this.openAliquotForm.bind(this);
    this.mapPoolColumns = this.mapPoolColumns.bind(this);
    this.formatPoolColumns = this.formatPoolColumns.bind(this);
  }

  edit(stateKey) {
    const {editable} = clone(this.state);
    editable[stateKey] = true;
    return new Promise((res) => this.setState({editable}, res()));
  }

  clearEditable() {
    this.setState({editable: {}});
  }

  openAliquotForm(poolId) {
    this.setState({poolId}, () => this.edit('aliquotForm'));
  }

  mapPoolColumns(column, value) {
    const {data, options} = this.props;
    switch (column) {
      case 'Pooled Specimens':
        return value.map((id) => {
          return (data.containers[data.specimens[id].containerId]||{}).barcode;
        });
      case 'Type':
        return options.specimen.types[value].label;
      case 'Site':
        return options.centers[value];
      default:
        return value;
    }
  }

  formatPoolColumns(column, value, row) {
    const {options} = this.props;
    value = this.mapPoolColumns(column, value);
    switch (column) {
      case 'Pooled Specimens':
        const barcodes = value
          .map((barcode, i) => {
            if (loris.userHasPermission('biobank_specimen_view')) {
              return <Link key={i} to={`/barcode=${barcode}`}>{barcode}</Link>;
            }
          })
          .reduce((prev, curr) => [prev, ', ', curr]);
        return <td>{barcodes}</td>;
      case 'PSCID':
        const pscidURL = loris.BaseURL + '/'
        + Object.values(options.candidates).find((cand) => cand.pscid == value).id;
        return <td><a href={pscidURL}>{value}</a></td>;
      case 'Visit Label':
        const visitLabelURL = loris.BaseURL+'/instrument_list/?candID='+row['PSCID']+
          '&sessionID='+Object.values(options.sessions).find((sess) => sess.label == value).id;
        return <td><a href={visitLabelURL}>{value}</a></td>;
      case 'Aliquot':
        const onClick = () => this.openAliquotForm(row['ID']);
        return <td><CTA label='Aliquot' onUserInput={onClick}/></td>;
      default:
        return <td>{value}</td>;
    }
  }


  // TODO: This should be fixed. A lot of hacks are being used to initialize
  // this form and there's definitely better ways to be doing it.
  renderAliquotForm() {
    const {data, options} = this.props;
    if (!(loris.userHasPermission('biobank_specimen_create') && this.state.poolId)) {
      return;
    }
    const specimens = Object.values(data.specimens)
      .filter((specimen) => specimen.poolId == this.state.poolId);
    const parents = specimens
      .map((specimen) => {
        return {specimen: specimen, container: data.containers[specimen.containerId]};
      }
    );

    return (
      <SpecimenForm
        title='Aliquot Pool'
        parent={parents}
        options={options}
        data={data}
        increaseCoordinate={this.props.increaseCoordinate}
        show={this.state.editable.aliquotForm}
        onClose={this.clearEditable}
        onSubmit={this.props.createSpecimens}
      />
    );
  }

  render() {
    const {data, options} = this.props;
    const specimenTypes = mapFormOptions(
      options.specimen.types, 'label'
    );
    const poolData = Object.values(data.pools).map((pool) => {
      return [
        pool.id,
        pool.label,
        Math.round(pool.quantity*100)/100+' '+options.specimen.units[pool.unitId].label,
        pool.specimenIds,
        options.candidates[pool.candidateId].pscid,
        options.sessions[pool.sessionId].label,
        pool.typeId,
        pool.centerId,
        pool.date,
        pool.time,
      ];
    });

    const fields = [
      {label: 'ID', show: false},
      {label: 'Label', show: true, filter: {
        name: 'barcode',
        type: 'text',
      }},
      {label: 'Quantity', show: true},
      {label: 'Pooled Specimens', show: true},
      {label: 'PSCID', show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: 'Visit Label', show: true, filter: {
        name: 'session',
        type: 'text',
      }},
      {label: 'Type', show: true, filter: {
        name: 'type',
        type: 'select',
        options: specimenTypes,
      }},
      {label: 'Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.centers,
      }},
      {label: 'Date', show: true},
      {label: 'Time', show: true},
      {label: 'Aliquot', show: true},
    ];

    return (
      <div>
        <FilterableDataTable
          name='pool'
          data={poolData}
          fields={fields}
          getFormattedCell={this.formatPoolColumns}
          getMappedCell={this.mapPoolColumns}
          loading={this.props.loading}
        />
        {this.renderAliquotForm()}
      </div>
    );
  }
}

export default PoolTab;
