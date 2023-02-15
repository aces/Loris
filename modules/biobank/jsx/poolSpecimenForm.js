import Modal from 'Modal';
import React, {PureComponent} from 'react';
import {mapFormOptions, clone, isEmpty} from './helpers.js';

import swal from 'sweetalert2';

/**
 * Biobank Pool Specimen Form
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 **/
const initialState = {
  pool: {},
  list: {},
  count: 0,
  current: {},
  errors: {},
  containerId: null,
};

class PoolSpecimenForm extends React.Component {
  constructor() {
    super();
    this.state = initialState;
    this.setPool = this.setPool.bind(this);
    this.validateListItem = this.validateListItem.bind(this);
    this.setPoolList = this.setPoolList.bind(this);
  }

  setPool(name, value) {
    const pool = clone(this.state.pool);
    pool[name] = value;
    this.setState({pool});
  }

  setPoolList(containerId) {
    let {current, list, pool, count} = clone(this.state);

    // Increase count
    count++;

    // Set specimen and container
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];

    // Set current global values
    if (isEmpty(list)) {
      current.candidateId = specimen.candidateId;
      current.sessionId = specimen.sessionId;
      current.typeId = specimen.typeId;
      current.centerId = container.centerId;
    }

    // Set list values
    list[count] = {container, specimen};

    // Set current pool values
    const specimenIds = pool.specimenIds || [];
    specimenIds.push(specimen.id);
    pool.centerId = container.centerId;
    pool.specimenIds = specimenIds;

    this.setState(
      {pool, list, count, current, containerId},
      this.setState({containerId: null})
    );
  }

  removeListItem(key) {
    let {pool, list, current} = clone(this.state);
    // remove specimenId from pool.
    pool.specimenIds = pool.specimenIds
    .filter((id) => id != this.state.list[key].specimen.id);

    // delete list at key.
    delete list[key];

    // reset current values if list is empty.
    current = isEmpty(list) ? {} : current;

    // empty barcode input.
    const containerId = null;

    this.setState({pool, list, current, containerId});
  }

  validateListItem(containerId) {
    const {current, list} = clone(this.state);
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];

    // Throw error if new list item does not meet requirements.
    if (!isEmpty(list) &&
      (specimen.candidateId !== current.candidateId ||
      specimen.sessionId !== current.sessionId ||
      specimen.typeId !== current.typeId ||
      container.centerId !== current.centerId)
    ) {
      swal.fire({
        title: 'Oops!',
        text: 'Specimens must be of the same PSCID, Visit Label, Type and Center',
        type: 'warning',
      });
      return Promise.reject();
    }
    return Promise.resolve();
  }

  /**
   * {@inheritDoc}
   *
   * @return {DOMObject}
   */
  render() {
    const {data, options} = this.props;
    const {current, pool, list, containerId, errors} = this.state;

    // generate barcode list from list object.
    const barcodeList = Object.entries(list)
    .map(([key, item]) => {
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
    });

    // Generate Pool form.
    const specimenUnits = mapFormOptions(options.specimen.units, 'label');
    const form = (
      <FormElement name="poolSpecimenForm">
        <div className='row'>
          <div className='col-sm-10 col-sm-offset-1'>
            <StaticElement
              label='Pooling Note'
              text="Select or Scan the specimens to be pooled. Specimens must
                    have a Status of 'Available', have a Quantity of greater
                    than 0, and share the same Type, PSCID, Visit Label
                    and Current Site. Pooled specimens cannot already belong to
                    a pool. Once pooled, the Status of specimen will be changed
                    to 'Dispensed' and there Quantity set to '0'"
            />
            <StaticElement
              label='Specimen Type'
              text={
                (options.specimen.types[current.typeId]||{}).label || '—'
              }
            />
            <StaticElement
              label='PSCID'
              text={
                (options.candidates[current.candidateId]||{}).pscid || '—'
              }
            />
            <StaticElement
              label='Visit Label'
              text={(options.sessions[current.sessionId]||{}).label || '—'}
            />
            <div className='row'>
              <div className='col-xs-6'>
                <h4>Barcode Input</h4>
                <div className='form-top'/>
                <BarcodeInput
                  list={list}
                  data={data}
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
              label='Label'
              onUserInput={this.setPool}
              required={true}
              value={pool.label}
              errorMessage={errors.label}
            />
            <TextboxElement
              name='quantity'
              label='Quantity'
              onUserInput={this.setPool}
              required={true}
              value={pool.quantity}
              errorMessage={errors.quantity}
            />
            <SelectElement
              name='unitId'
              label='Unit'
              options={specimenUnits}
              onUserInput={this.setPool}
              required={true}
              value={pool.unitId}
              errorMessage={errors.unitId}
            />
            <DateElement
              name='date'
              label='Date'
              onUserInput={this.setPool}
              required={true}
              value={pool.date}
              errorMessage={errors.date}
            />
            <TimeElement
              name='time'
              label='Time'
              onUserInput={this.setPool}
              required={true}
              value={pool.time}
              errorMessage={errors.time}
            />
          </div>
        </div>
      </FormElement>
    );

    const handleClose = () => this.setState(initialState, this.props.onClose);
    const handleSubmit = () => {
      return new Promise((resolve, reject) => {
        this.props.onSubmit(pool, list)
        .then(() => resolve(), (errors) => this.setState({errors}, reject()));
      });
    };
    return (
      <Modal
        title='Pool Specimens'
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

PoolSpecimenForm.propTypes = {
};

class BarcodeInput extends PureComponent {
  render() {
    const {list, data, options, errors, containerId} = this.props;

    // Restrict list of barcodes to only those that would be valid.
    const barcodesPrimary = Object.values(data.containers)
    .reduce((result, container) => {
      if (options.container.types[container.typeId].primary == 1) {
        const specimen = data.specimens[container.specimenId];
        const availableId = Object.keys(options.container.stati).find(
          (key) => options.container.stati[key].label === 'Available'
        );
        const inList = Object.values(list)
        .find((i) => i.container.id == container.id);

        if (specimen.quantity > 0 &&
            container.statusId == availableId &&
            specimen.poolId == null &&
            !inList) {
          result[container.id] = container.barcode;
        }
      }
      return result;
    }, {});

    const handleInput = (name, containerId) => {
      containerId && this.props.validateListItem(containerId)
      .then(() => this.props.setPoolList(containerId));
    };
    return (
      <SearchableDropdown
        name={'containerId'}
        label={'Specimen'}
        onUserInput={handleInput}
        options={barcodesPrimary}
        value={containerId}
        errorMessage={errors.total}
      />
    );
  }
}

export default PoolSpecimenForm;
