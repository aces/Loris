import {PureComponent} from 'react';
import SpecimenProcessForm from './processForm';
import {VerticalTabs, TabPane} from 'Tabs';
import Modal from 'Modal';
import Loader from 'Loader';
import {mapFormOptions, clone, isEmpty} from './helpers.js';

import swal from 'sweetalert2';

/**
 * Biobank Bath Process Specimen Form
 *
 * TODO: DESCRIPTION
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 **/
const initialState = {
  preparation: {},
  list: {},
  count: 0,
  current: {},
  errors: {specimen: {}},
  loading: false,
  editable: {preparation: true},
};

class BatchProcessForm extends React.PureComponent {
  constructor() {
    super();

    this.state = initialState;
    this.setCurrent = this.setCurrent.bind(this);
    this.setProcess = this.setProcess.bind(this);
    this.validateListItem = this.validateListItem.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.setPool = this.setPool.bind(this);
  };

  setProcess(name, value) {
    return new Promise((res) => this.setState({[name]: value}, res()));
  }

  addListItem(containerId) {
    let {list, current, preparation, count} = clone(this.state);

    // Increase count.
    count++;

    // Set Specimen and Container.
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];

    // Set current global values.
    current.typeId = specimen.typeId;
    current.centerId = container.centerId;

    // Set list values.
    list[count] = {specimen, container};

    // Set current preparation values.
    preparation.centerId = container.centerId;

    this.setState(
      {preparation, list, current, count, containerId},
      this.setState({containerId: null})
    );
  }

  setPool(name, poolId) {
    const pool = clone(this.props.data.pools[poolId]);

    this.setState({loading: true});
    this.setCurrent('poolId', poolId)
    .then(() => Promise.all(pool.specimenIds
      .map((specimenId) => Object.values(this.state.list)
        .find((item) => item.specimen.id === specimenId)
        || this.addListItem(this.props.data.specimens[specimenId].containerId))
      .map((p) => p instanceof Promise ? p : Promise.resolve(p))))
    .then(() => this.setCurrent('poolId', null))
    .then(() => this.setState({loading: false}));
  }

  removeListItem(key) {
    let {list, current} = clone(this.state);
    delete list[key];
    current = isEmpty(list) ? {} : current;
    const containerId = null;
    this.setState({list, current, containerId});
  }

  validateListItem(containerId) {
    const {current, list} = clone(this.state);
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];
    if (!isEmpty(list) &&
      (specimen.typeId !== current.typeId)
    ) {
      swal.fire('Oops!', 'Specimens must be of the same Type', 'warning');
      return Promise.reject();
    }
    // XXX: This is what the validation used to be. Removed because CBIGR requires
    // process from two different sites that are semantically the same. When
    // project-level permissions are enabled, this should be restored.
    // if (!isEmpty(list) &&
    //   (specimen.typeId !== current.typeId ||
    //   container.centerId !== current.centerId)
    // ) {
    //   swal.fire('Oops!', 'Specimens must be of the same Type and Center', 'warning');
    //   return Promise.reject();
    // }
    return Promise.resolve();
  }

  validateList(list) {
    return new Promise((resolve, reject) => {
      const barcodes = Object.values(list)
        .filter((item) => !!item.specimen.preparation)
        .map((item) => item.container.barcode);

      if (barcodes.length > 0) {
        return swal({
          title: 'Warning!',
          html: `Preparation for specimen(s) <b>${barcodes.join(', ')}</b> ` +
            `already exists. By completing this form, the previous preparation ` +
            `will be overwritten.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Proceed'})
        .then((result) => result.value ? resolve(list) : reject());
      } else {
        return resolve(list);
      }
    });
  }

  setCurrent(name, value) {
    const current = clone(this.state.current);
    current[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  render() {
    if (this.state.loading) {
      return <Loader/>;
    }

    const {data, options} = this.props;
    const {containerId, poolId, preparation, list, current, errors} = this.state;

    const preparationForm = this.state.editable.preparation ? (
      <SpecimenProcessForm
        edit={true}
        errors={errors.specimen.preparation || {}}
        options={options}
        process={preparation}
        processStage='preparation'
        setParent={this.setProcess}
        setCurrent={this.setCurrent}
        typeId={current.typeId}
      />
    ) : null;

    // TODO: This should likely be filtered so that only pools that match the
    // proper criteria are left in the list.
    const pools = mapFormOptions(data.pools, 'label');
    const glyphStyle = {
      color: '#DDDDDD',
      marginLeft: 10,
      cursor: 'pointer',
    };

    const barcodeList = Object.entries(list)
      .map(([key, item]) => {
        const handleRemoveItem = () => this.removeListItem(key);
        return (
          <div key={key} className='preparation-item'>
            <div>{item.container.barcode}</div>
            <div
              className='glyphicon glyphicon-remove'
              style={glyphStyle}
              onClick={handleRemoveItem}
            />
          </div>
        );
      });

    const editForms = Object.keys(list).length > 1 && (
      <div className='form-top'>
        <VerticalTabs
          tabs={[{id: 'preparation', label: 'Preparation'}]}
          onTabChange={(id) => this.setState({editable: {[id]: true}})}
          updateURL={false}
        >
          <TabPane TabId='preparation'>{preparationForm}</TabPane>
        </VerticalTabs>
      </div>
    );

    const handlePoolInput = (name, value) => value && this.setPool(name, value);
    const form = (
      <FormElement>
        <div className='row'>
          <div className='col-sm-10 col-sm-offset-1'>
            <StaticElement
              label='Processing Note'
              text="Select or Scan the specimens to be prepared. Specimens must
                    have a Status of 'Available', and share the same Type and
                    Site. Any previous value associated with a Specimen will be
                    overwritten if one is added on this form."
            />
            <StaticElement
              label='Specimen Type'
              text={(options.specimen.types[current.typeId]||{}).label || '—'}
            />
            <StaticElement
              label='Site'
              text={options.centers[current.centerId] || '—'}
            />
            <div className='row'>
              <div className='col-xs-6'>
                <h4>Barcode Input</h4>
                <div className='form-top'/>
                <BarcodeInput
                  data={data}
                  options={options}
                  list={list}
                  containerId={containerId}
                  validateListItem={this.validateListItem}
                  addListItem={this.addListItem}
                />
                <SearchableDropdown
                  name={'poolId'}
                  label={'Pool'}
                  onUserInput={handlePoolInput}
                  options={pools}
                  value={poolId}
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
            {editForms}
          </div>
        </div>
      </FormElement>
    );

    const handleClose = () => this.setState(initialState, this.props.onClose);
    const handleSubmit = () => {
      const prepList = Object.values(list).map((item) => {
        const specimen = clone(item.specimen);
        specimen.preparation = preparation;
        return specimen;
      });

      return new Promise((resolve, reject) => {
        this.validateList(list)
        .then(() => this.props.onSubmit(prepList), () => reject())
        .then(() => resolve(), (errors) => this.setState({errors}, reject()));
      });
    };
    return (
      <Modal
        title='Process Specimens'
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

BatchProcessForm.propTypes = {
};

class BarcodeInput extends PureComponent {
  render() {
    const {data, options, list, containerId, addListItem} = this.props;
    // Create options for barcodes based on match typeId
    const barcodesPrimary = Object.values(data.containers)
    .reduce((result, container) => {
      if (options.container.types[container.typeId].primary == 1) {
        const specimen = data.specimens[container.specimenId];
        const availableId = Object.keys(options.container.stati).find(
          (key) => options.container.stati[key].label == 'Available'
        );
        const protocolExists = Object.values(options.specimen.protocols).find(
          (protocol) => protocol.typeId == specimen.typeId
        );
        const inList = Object.values(list)
        .find((i) => i.container.id == container.id);

        if (container.statusId == availableId && protocolExists && !inList) {
          result[container.id] = container.barcode;
        }
      }
      return result;
    }, {});

    const handleInput = (name, containerId) => {
      containerId && this.props.validateListItem(containerId)
      .then(() => addListItem(containerId));
    };
    return (
      <SearchableDropdown
        name={'containerId'}
        label={'Specimen'}
        onUserInput={handleInput}
        options={barcodesPrimary}
        value={containerId}
      />
    );
  }
}

export default BatchProcessForm;
