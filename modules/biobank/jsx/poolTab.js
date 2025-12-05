import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import FilterableDataTable from 'FilterableDataTable';
import {CTA} from 'jsx/Form.js';
import SpecimenForm from './specimenForm';

import {mapFormOptions, clone} from './helpers.js';

/**
 * React component for the Pool tab of the Biobank module.
 */
class PoolTab extends Component {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = {editable: {}, poolId: null};
    this.edit = this.edit.bind(this);
    this.clearEditable = this.clearEditable.bind(this);
    this.openAliquotForm = this.openAliquotForm.bind(this);
    this.mapPoolColumns = this.mapPoolColumns.bind(this);
    this.formatPoolColumns = this.formatPoolColumns.bind(this);
  }

  /**
   * Make the form editable
   *
   * @param {string} stateKey - name of form that will be editable
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
   * Open the aliquot form for a pool
   *
   * @param {number} poolId - the pool id
   */
  openAliquotForm(poolId) {
    this.setState({poolId}, () => this.edit('aliquotForm'));
  }

  /**
   * Map IDs in the pool columns to a string value.
   *
   * @param {string} column - the column name being mapped
   * @param {string} value - the column value being mapped
   * @return {string}
   */
  mapPoolColumns(column, value) {
    const {options} = this.props;
    switch (column) {
    case this.props.t('Type', {ns: 'biobank'}):
      return options.specimen.types[value].label;
    case this.props.t('Site', {ns: 'loris', count: 1}):
      return options.centers[value];
    default:
      return value;
    }
  }

  /**
   * Format a row of columns for the pooled specimen.
   *
   * @param {string} column - the column name
   * @param {string} value - the column value
   * @param {object} row - all the values from the row
   * @return {JSX}
   */
  formatPoolColumns(column, value, row) {
    const {options} = this.props;
    value = this.mapPoolColumns(column, value);
    const candId = Object.values(options.candidates)
      .find((cand) => cand?.pscid == row[this.props.t('PSCID', {ns: 'loris'})])?.id;

    // If candId is defined, then the user has access to the candidate and a
    // hyperlink can be established.
    const candidatePermission = candId !== undefined;
    switch (column) {
    case this.props.t('Pooled Specimens', {ns: 'biobank'}):
      const barcodes = value
        .map((barcode, i) => {
          return <Link key={i} to={`/barcode=${barcode}`}>{barcode}</Link>;
        })
        .reduce((prev, curr) => [prev, ', ', curr]);
      return <td>{barcodes}</td>;
    case this.props.t('PSCID', {ns: 'loris'}):
      if (candidatePermission) {
        return <td><a href={loris.BaseURL + '/' + candId}>{value}</a></td>;
      }
      return <td>{value}</td>;
    case this.props.t('Visit Label', {ns: 'loris'}):
      if (candidatePermission) {
        const sessId = Object.values(options.candidates[candId]).find(
          (sess) => sess.label == value
        )?.id;
        const sessionPermission = sessId !== undefined;
        if (sessionPermission) {
          const visitLabelURL = loris.BaseURL+'/instrument_list/?candID='+
            candId+'&sessionID='+sessId;
          return <td><a href={visitLabelURL}>{value}</a></td>;
        }
      }
      return <td>{value}</td>;
    case this.props.t('Aliquot', {ns: 'biobank'}):
      const onClick = () => this.openAliquotForm(row['ID']);
      return <td><CTA label={this.props.t('Aliquot', {ns: 'biobank'})} onUserInput={onClick}/></td>;
    default:
      return <td>{value}</td>;
    }
  }


  /**
   * Render the aliquot form
   *
   * @return {JSX}
   */
  renderAliquotForm() {
    // TODO: This should be fixed. A lot of hacks are being used to initialize
    // this form and there's definitely better ways to be doing it.
    const {data, options} = this.props;
    if (!(loris.userHasPermission('biobank_specimen_create')
        && this.state.poolId)
    ) {
      return;
    }
    const specimens = Object.values(data.specimens)
      .filter((specimen) => specimen.poolId == this.state.poolId);
    const parents = specimens
      .map((specimen) => {
        return {
          specimen: specimen,
          container: data.containers[specimen.containerId],
        };
      }
      );

    return (
      <SpecimenForm
        title={this.props.t('Aliquot Pool', {ns: 'biobank'})}
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

  /**
   * Render the react component
   *
   * @return {JSX}
   */
  render() {
    const {data, options} = this.props;
    const specimenTypes = mapFormOptions(
      options.specimen.types, 'label'
    );
    const poolData = Object.values(data.pools).map((pool) => {
      return [
        pool.id,
        pool.label,
        Math.round(pool.quantity*100)/100 +
           ' ' +
            options.specimen.units[pool.unitId].label,
        pool.specimenBarcodes,
        pool.candidatePSCID,
        options.sessions[pool.sessionId].label,
        pool.typeId,
        pool.centerId,
        pool.date,
        pool.time,
      ];
    });

    const fields = [
      {label: 'ID', show: false},
      {label: this.props.t('Label', {ns: 'biobank'}), show: true, filter: {
        name: 'barcode',
        type: 'text',
      }},
      {label: this.props.t('Quantity', {ns: 'biobank'}), show: true},
      {label: this.props.t('Pooled Specimens', {ns: 'biobank'}), show: true},
      {label: this.props.t('PSCID', {ns: 'loris'}), show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: this.props.t('Visit Label', {ns: 'loris'}), show: true, filter: {
        name: 'session',
        type: 'text',
      }},
      {label: this.props.t('Type', {ns: 'biobank'}), show: true, filter: {
        name: 'type',
        type: 'select',
        options: specimenTypes,
      }},
      {label: this.props.t('Site', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.centers,
      }},
      {label: this.props.t('Date', {ns: 'loris'}), show: true},
      {label: this.props.t('Time', {ns: 'loris'}), show: true},
      {label: this.props.t('Aliquot', {ns: 'biobank'}), show: true},
    ];

    return (
      <div>
        <FilterableDataTable
          name='pool'
          data={poolData}
          fields={fields}
          getFormattedCell={this.formatPoolColumns}
          getMappedCell={this.mapPoolColumns}
          progress={this.props.loading}
        />
        {this.renderAliquotForm()}
      </div>
    );
  }
}

// PoolTab.propTypes
PoolTab.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    specimen: PropTypes.shape({
      units: PropTypes.array,
      types: PropTypes.array,
    }).isRequired,
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
    candidates: PropTypes.arrayOf(PropTypes.string),
    projects: PropTypes.arrayOf(PropTypes.string).isRequired,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  increaseCoordinate: PropTypes.func.isRequired,
  createSpecimens: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withTranslation(['biobank', 'loris'])(PoolTab);
