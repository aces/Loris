import Modal from 'Modal';
import {withTranslation} from 'react-i18next';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {mapFormOptions, clone, isEmpty} from './helpers.js';
import {
  SelectElement,
  StaticElement,
  TextboxElement,
  DateElement,
  TimeElement,
  SearchableDropdown,
} from 'jsx/Form';

import Swal from 'sweetalert2';

const initialState = {
  pool: {},
  list: {},
  filter: {
    candidateId: null,
    sessionid: null,
    typeId: null,
    centerId: null,
  },
  poolId: null,
  count: 0,
  errors: {},
  containerId: null,
};

/**
 * React component with form for entering pool specimens
 */
class PoolSpecimenForm extends React.Component {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.state = initialState;
    this.setPool = this.setPool.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.validateListItem = this.validateListItem.bind(this);
    this.setPoolList = this.setPoolList.bind(this);
  }

  /**
   * Set the current pool.
   *
   * @param {string} name  - the pool name
   * @param {string} value - the pool value
   */
  setPool(name, value) {
    const pool = clone(this.state.pool);
    pool[name] = value;
    this.setState({pool});
  }

  /**
   * Set the current filter on specimens to be selected.
   *
   * @param {string} name  - the filter name
   * @param {string} value - the filter values
   */
  setFilter(name, value) {
    const {filter} = clone(this.state);

    if (name == 'candidateId') {
      filter.sessionId = null;
    }

    filter[name] = value;
    this.setState({filter});
  }

  /**
   * Sets the current pool list
   *
   * @param {number} containerId - specimen to be added to pool via containerId
   */
  setPoolList(containerId) {
    let {filter, list, pool, count} = clone(this.state);

    // Increase count
    count++;

    // Set specimen and container
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];

    // Set current global values
    if (isEmpty(list)) {
      filter.candidateId = specimen.candidateId;
      filter.sessionId = specimen.sessionId;
      filter.typeId = specimen.typeId;
      filter.centerId = container.centerId;
    }

    // Set list values
    list[count] = {container, specimen};

    // Set current pool values
    const specimenIds = pool.specimenIds || [];
    specimenIds.push(specimen.id);
    pool.specimenIds = specimenIds;

    this.setState(
      {pool, list, count, filter},
      this.setState({containerId: null})
    );
  }

  /**
   * Remove a list item
   *
   * @param {string} key - the key to be removed
   */
  removeListItem(key) {
    let {pool, list, filter} = clone(this.state);
    // remove specimenId from pool.
    pool.specimenIds = pool.specimenIds
      .filter((id) => id != this.state.list[key].specimen.id);

    // delete list at key.
    delete list[key];

    // remove center if list is empty.
    filter = isEmpty(list) ? {} : filter;

    // empty barcode input.
    const containerId = null;

    this.setState({pool, list, containerId, filter});
  }

  /**
   * Validate a list item for a container
   *
   * @param {number} containerId - the container being validated
   * @return {Promise} - a resolved or rejected promise
   */
  validateListItem(containerId) {
    const {list, filter} = clone(this.state);
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];

    // Throw error if new list item does not meet requirements.
    if (!isEmpty(list)
      && (specimen.candidateId != filter.candidateId
      || specimen.sessionId != filter.sessionId
      || specimen.typeId != filter.typeId
      || container.centerId !== filter.centerId)
    ) {
      Swal.fire(
        {
          title: this.props.t('Oops!', {ns: 'biobank'}),
          text: t(`Specimens must be of the same PSCID,
                    Visit Label, Type and Center`),
          type: 'warning',
        }
      );
      return Promise.reject();
    }
    return Promise.resolve();
  }

  /**
   * {@inheritDoc}
   *
   * @return {JSX}
   */
  render() {
    const {data, options} = this.props;
    const {pool, list, filter, containerId, errors} = this.state;

    // generate barcode list from list object.
    const barcodeList = Object.entries(list)
      .map(
        ([key, item]) => {
          const removeItem = () => this.removeListItem(key);
          // I cannot get this to work in the css file.
          const style = {
            color: '#DDDDDD',
            marginLeft: 10,
            cursor: 'pointer',
          };
          return (
            <div key={key} className='preparation-item'>
              <div>{item.container.barcode}</div>
              <div
                className='glyphicon glyphicon-remove'
                onClick={removeItem}
                style={style}
              />
            </div>
          );
        }
      );

    // Generate Pool form.
    const specimenUnits = mapFormOptions(options.specimen.units, 'label');
    const form = (
      <div className='row'>
        <div className='col-sm-10 col-sm-offset-1'>
          <StaticElement
            label={this.props.t('Pooling Note', {ns: 'biobank'})}
            text={t(`Select or Scan the specimens to be pooled. Specimens must
                  have a Status of 'Available', have a Quantity of greater
                  than 0, and share the same Type, PSCID, Visit Label
                  and Current Site. Pooled specimens cannot already belong to
                  a pool. Once pooled, the Status of specimen will be changed
                  to 'Dispensed' and there Quantity set to '0'`)}
          />
          <SearchableDropdown
            name='typeId'
            label={this.props.t('Specimen Type', {ns: 'biobank'})}
            onUserInput={this.setFilter}
            disabled={!isEmpty(list)}
            value={filter.typeId}
            options={mapFormOptions(options.specimen.types, 'label')}
          />
          <SearchableDropdown
            name='candidateId'
            label={this.props.t('PSCID', {ns: 'loris'})}
            onUserInput={this.setFilter}
            disabled={!isEmpty(list)}
            value={filter.candidateId}
            options={mapFormOptions(options.candidates, 'pscid')}
          />
          <SearchableDropdown
            name='sessionId'
            label={this.props.t('Visit Label', {ns: 'loris'})}
            onUserInput={this.setFilter}
            disabled={!isEmpty(list) || !filter.candidateId}
            value={filter.sessionId}
            options={mapFormOptions(
              (options?.candidates?.[filter.candidateId] || {}),
              'label'
            )}
          />
          <div className='row'>
            <div className='col-xs-6'>
              <h4>Barcode Input</h4>
              <div className='form-top'/>
              <BarcodeInput
                list={list}
                data={data}
                filter={filter}
                options={options}
                errors={errors}
                containerId={containerId}
                validateListItem={this.validateListItem}
                setPoolList={this.setPoolList}
              />
            </div>
            <div className='col-xs-6'>
              <h4>Barcode List</h4>
              <div className='form-top'/>
              <div className='preparation-list'>
                {barcodeList}
              </div>
            </div>
          </div>
          <div className='form-top'/>
          <TextboxElement
            name='label'
            label={this.props.t('Label', {ns: 'biobank'})}
            onUserInput={this.setPool}
            required={true}
            value={pool.label}
            errorMessage={errors.label}
          />
          <TextboxElement
            name='quantity'
            label={this.props.t('Quantity', {ns: 'biobank'})}
            onUserInput={this.setPool}
            required={true}
            value={pool.quantity}
            errorMessage={errors.quantity}
          />
          <SelectElement
            name='unitId'
            label={this.props.t('Unit', {ns: 'biobank'})}
            options={specimenUnits}
            onUserInput={this.setPool}
            required={true}
            value={pool.unitId}
            errorMessage={errors.unitId}
          />
          <DateElement
            name='date'
            label={this.props.t('Date', {ns: 'loris'})}
            onUserInput={this.setPool}
            required={true}
            value={pool.date}
            errorMessage={errors.date}
          />
          <TimeElement
            name='time'
            label={this.props.t('Time', {ns: 'loris'})}
            onUserInput={this.setPool}
            required={true}
            value={pool.time}
            errorMessage={errors.time}
          />
        </div>
      </div>
    );

    const handleClose = () => this.setState(initialState, this.props.onClose);
    const handleSubmit = () => {
      return new Promise(
        (resolve, reject) => {
          this.props.onSubmit(pool, list)
            .then(() => resolve(), (errors) => this.setState(
              {errors}, reject())
            );
        }
      );
    };
    return (
      <Modal
        title={this.props.t('Pool Specimens', {ns: 'biobank'})}
        show={this.props.show}
        onClose={handleClose}
        onSubmit={handleSubmit}
        throwWarning={true}
      >
        {form}
      </Modal>
    );
  }
}

// PoolSpecimenForm.propTypes
PoolSpecimenForm.propTypes = {
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        centerId: PropTypes.number.isRequired,
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  options: PropTypes.shape({
    specimen: PropTypes.shape({
      units: PropTypes.string,
      types: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    candidates: PropTypes.arrayOf(PropTypes.string),
    sessions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

/**
 * React component to read input from a barcode
 */
class BarcodeInput extends PureComponent {
  /**
   * Render react component
   *
   * @return {JSX}
   */
  render() {
    const {list, data, filter, options, errors, containerId} = this.props;

    // Restrict list of barcodes to only those that would be valid.
    const barcodesPrimary = Object.values(data.containers)
      .reduce(
        (result, container) => {
          if (options.container.types[container.typeId].primary == 1) {
            const specimen = data.specimens[container.specimenId] || {};
            const availableId = Object.keys(options.container.stati).find(
              (key) => options.container.stati[key].label === 'Available'
            );
            const inList = Object.values(list)
              .find((i) => i.container.id == container.id);

            const candidateMatch = !filter.candidateId
              || specimen.candidateId == filter.candidateId;
            const sessionMatch = !filter.sessionId
              || specimen.sessionId == filter.sessionId;
            const typeMatch = !filter.typeId
              || specimen.typeId == filter.typeId;

            if (specimen.quantity > 0
                && container.statusId == availableId
                && specimen.poolId == null
                && !inList
                && candidateMatch
                && sessionMatch
                && typeMatch
            ) {
              result[container.id] = container.barcode;
            }
          }
          return result;
        }, {}
      );

    const handleInput = (name, containerId) => {
      containerId && this.props.validateListItem(containerId)
        .then(() => this.props.setPoolList(containerId));
    };
    return (
      <SearchableDropdown
        name={'containerId'}
        label={this.props.t('Specimen', {ns: 'biobank'})}
        onUserInput={handleInput}
        options={barcodesPrimary}
        value={containerId}
        errorMessage={errors.total}
      />
    );
  }
}

// BarcodeInput.propTypes
BarcodeInput.propTypes = {
  list: PropTypes.array.isRequired,
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        // Define specimen-specific properties if necessary
      })
    ).isRequired,
  }).isRequired,
  filter: PropTypes.shape({
    candidateId: PropTypes.string,
    sessionId: PropTypes.string,
    typeId: PropTypes.string,
  }).isRequired,
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
      ).isRequired,
    }).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    total: PropTypes.string,
  }).isRequired,
  containerId: PropTypes.number.isRequired,
  validateListItem: PropTypes.func.isRequired,
  setPoolList: PropTypes.func.isRequired,
};

export default withTranslation(['biobank', 'loris'])(PoolSpecimenForm);
