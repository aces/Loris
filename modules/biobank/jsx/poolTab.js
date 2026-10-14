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
    const {t, data, options} = this.props;
    const specimenTypes = mapFormOptions(
      options.specimen.types, 'label'
    );
    const poolData = Object.values(data.pools);
    const candidatesByPSCID = Object.values(options.candidates)
      .reduce((result, candidate) => {
        if (candidate) {
          result[candidate.pscid] = candidate;
        }
        return result;
      }, {});
    const candidateOf = (pool) => candidatesByPSCID[pool.candidatePSCID];

    const fields = [
      {
        name: 'barcode',
        label: t('Label', {ns: 'biobank'}),
        show: true,
        filter: {name: 'barcode', type: 'text'},
        value: (pool) => pool.label,
      },
      {
        name: 'quantity',
        label: t('Quantity', {ns: 'biobank'}),
        show: true,
        value: (pool) => pool.quantity,
        display: (quantity, pool) => Math.round(quantity*100)/100 + ' '
          + options.specimen.units[pool.unitId].label,
      },
      {
        name: 'pooledSpecimens',
        label: t('Pooled Specimens', {ns: 'biobank'}),
        show: true,
        value: (pool) => pool.specimenBarcodes,
        format: (barcodes) => barcodes
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
        value: (pool) => pool.candidatePSCID,
        format: (pscid, pool) => {
          const candidate = candidateOf(pool);
          if (!candidate) {
            return pscid;
          }
          return <a href={loris.BaseURL + '/' + candidate.id}>{pscid}</a>;
        },
      },
      {
        name: 'session',
        label: t('Visit Label', {ns: 'loris'}),
        show: true,
        filter: {name: 'session', type: 'text'},
        value: (pool) => options.sessions[pool.sessionId].label,
        format: (visitLabel, pool) => {
          const candidate = candidateOf(pool);
          const sessId = candidate && Object.values(candidate).find(
            (sess) => sess.label == visitLabel
          )?.id;
          if (sessId === undefined) {
            return visitLabel;
          }
          const visitLabelURL = loris.BaseURL + '/instrument_list/?candID='
            + candidate.id + '&sessionID=' + sessId;
          return <a href={visitLabelURL}>{visitLabel}</a>;
        },
      },
      {
        name: 'type',
        label: t('Type', {ns: 'loris'}),
        show: true,
        filter: {name: 'type', type: 'select', options: specimenTypes},
        value: (pool) => pool.typeId,
        display: (typeId) => options.specimen.types[typeId].label,
      },
      {
        name: 'site',
        label: t('Site', {ns: 'loris', count: 1}),
        show: true,
        filter: {name: 'site', type: 'select', options: options.centers},
        value: (pool) => pool.centerId,
        display: (centerId) => options.centers[centerId],
      },
      {
        name: 'date',
        label: t('Date', {ns: 'loris'}),
        show: true,
        value: (pool) => pool.date,
      },
      {
        name: 'time',
        label: t('Time', {ns: 'loris'}),
        show: true,
        value: (pool) => pool.time,
      },
      {
        name: 'aliquot',
        label: t('Aliquot', {ns: 'biobank'}),
        show: true,
        value: () => null,
        format: (_, pool) => (
          <CTA
            label={t('Aliquot', {ns: 'biobank'})}
            onUserInput={() => this.openAliquotForm(pool.id)}
          />
        ),
      },
    ];

    return (
      <div>
        <FilterableDataTable
          name='pool'
          data={poolData}
          fields={fields}
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
