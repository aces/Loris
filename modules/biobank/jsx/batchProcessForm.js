import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import SpecimenProcessForm from './processForm';
import {VerticalTabs, TabPane} from 'Tabs';
import Modal from 'Modal';
import Loader from 'Loader';
import {mapFormOptions, clone, isEmpty} from './helpers.js';
import {
  StaticElement,
  SearchableDropdown,
} from 'jsx/Form';

import Swal from 'sweetalert2';

const initialState = {
  preparation: {},
  list: {},
  count: 0,
  current: {},
  errors: {specimen: {}},
  loading: false,
  editable: {preparation: true},
};

/**
 * Biobank Bath Process Specimen Form
 */
class BatchProcessForm extends React.PureComponent {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = initialState;
    this.setCurrent = this.setCurrent.bind(this);
    this.setProcess = this.setProcess.bind(this);
    this.validateListItem = this.validateListItem.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.setPool = this.setPool.bind(this);
  }

  /**
   * Sets a process
   *
   * @param {string} name - a name
   * @param {any} value - the value
   * @return {Promise}
   */
  setProcess(name, value) {
    return new Promise((res) => this.setState({[name]: value}, res()));
  }

  /**
   * Add a list item to a container.
   *
   * @param {number} containerId - the container to add an item to
   */
  addListItem(containerId) {
    let {list, current, count} = clone(this.state);

    // Increase count.
    count++;

    // Set Specimen and Container.
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];

    // Set current global values.
    current.typeId = specimen.typeId;

    // Set list values.
    list[count] = {specimen, container};

    this.setState(
      {list, current, count, containerId},
      this.setState({containerId: null})
    );
  }

  /**
   * Set the current pool to display
   *
   * @param {string} name - the name to display
   * @param {number} poolId - the pool to display
   */
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

  /**
   * Remove a key from the list.
   *
   * @param {string} key - the key to remove
   */
  removeListItem(key) {
    let {list, current} = clone(this.state);
    delete list[key];
    current = isEmpty(list) ? {} : current;
    const containerId = null;
    this.setState({list, current, containerId});
  }

  /**
   * Validate a container in a list
   *
   * @param {number} containerId - the container to validate
   * @return {Promise}
   */
  validateListItem(containerId) {
    const {current, list} = clone(this.state);
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];
    if (!isEmpty(list) &&
      (specimen.typeId !== current.typeId)
    ) {
      Swal.fire(
        t('Oops!', {ns: 'biobank'}),
        t('Specimens must be of the same Type', {ns: 'biobank'}),
        'warning'
      );
      return Promise.reject();
    }

    return Promise.resolve();
  }

  /**
   * Validate a list of specimens
   *
   * @param {array} list - the list of specimens to validate
   * @return {Promise}
   */
  validateList(list) {
    return new Promise((resolve, reject) => {
      const barcodes = Object.values(list)
        .filter((item) => !!item.specimen.preparation)
        .map((item) => item.container.barcode);

      if (barcodes.length > 0) {
        return Swal.fire({
          title: t('Warning!', {ns: 'biobank'}),
          html: `Preparation for specimen(s) <b>${barcodes.join(', ')}</b> ` +
            `already exists. By completing this form, the previous `
            + `preparation will be overwritten.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: t('Proceed', {ns: 'loris'})})
          .then((result) => result.value ? resolve(list) : reject());
      } else {
        return resolve(list);
      }
    });
  }

  /**
   * Update the current state object, which acts as a generic state holder for this
   * component.
   *
   * @param {string} name - the name
   * @param {string} value - the value
   * @return {Promise}
   */
  setCurrent(name, value) {
    const current = clone(this.state.current);
    current[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  /**
   * Render the React element
   *
   * @return {JSX}
   */
  render() {
    if (this.state.loading) {
      return <Loader/>;
    }

    const {data, options} = this.props;
    const {
      containerId,
      poolId,
      preparation,
      list,
      current,
      errors,
    } = this.state;

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
      <div className='row'>
        <div className='col-sm-10 col-sm-offset-1'>
          <StaticElement
            label={t('Processing Note', {ns: 'biobank'})}
            text={t(`Select or Scan the specimens to be prepared. Specimens must
                  have a Status of 'Available', and share the same Type.
                  Any previous value associated with a Specimen will be
                  overwritten if one is added on this form.`)}
          />
          <StaticElement
            label={t('Specimen Type', {ns: 'biobank'})}
            text={(options.specimen.types[current.typeId]||{}).label || '—'}
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
    );

    const handleClose = () => this.setState(initialState, this.props.onClose);
    const handleSubmit = () => {
      const prepList = Object.values(list).map((item) => {
        const specimen = clone(item.specimen);
        specimen.preparation = clone(preparation);
        specimen.preparation.centerId = item.container.centerId;
        return specimen;
      });

      return new Promise((resolve, reject) => {
        this.validateList(list, {ns: 'biobank'})
          .then(() => this.props.onSubmit(prepList, {ns: 'biobank'}), () => reject())
          .then(() => resolve(), (errors) => this.setState({errors}, reject()));
      });
    };
    return (
      <Modal
        title={t('Process Specimens', {ns: 'biobank'})}
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

// BatchProcessForm.propTypes
BatchProcessForm.propTypes = {
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        containerId: PropTypes.number.isRequired,
      })
    ).isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    specimen: PropTypes.shape({
      typeUnits: PropTypes.string,
      types: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    container: PropTypes.shape({
      stati: PropTypes.object,
      types: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

/**
 * Component to read a barcode from the barcode scanner
 */
class BarcodeInput extends PureComponent {
  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {data, options, list, containerId, addListItem} = this.props;
    // Create options for barcodes based on match typeId
    const barcodesPrimary = Object.values(data.containers)
      .reduce((result, container) => {
      // Check if container is of type primary
        if (options.container.types[container.typeId].primary == 1) {
          const specimen = data.specimens[container.specimenId];

          // Check if specimen is accessible before proceeding
          if (specimen) {
            const availableId = Object.keys(options.container.stati).find(
              (key) => options.container.stati[key].label == 'Available'
            );
            const protocolExists = Object.values(options.specimen.protocols)
              .find((protocol) => protocol.typeId == specimen.typeId);
            const inList = Object.values(list)
              .find((i) => i.container.id == container.id);

            if (
              container.statusId == availableId && protocolExists && !inList
            ) {
              result[container.id] = container.barcode;
            }
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
        label={t('Specimen', {ns: 'biobank'})}
        onUserInput={handleInput}
        options={barcodesPrimary}
        value={containerId}
      />
    );
  }
}

// BarcodeInput.propTypes
BarcodeInput.propTypes = {
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        containerId: PropTypes.number.isRequired,
      })
    ).isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    container: PropTypes.shape({
      types: PropTypes.arrayOf(PropTypes.string).isRequired,
      stati: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
    }).isRequired,
    specimen: PropTypes.shape({
      types: PropTypes.arrayOf(PropTypes.string),
      protocols: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  list: PropTypes.array.isRequired,
  containerId: PropTypes.number.isRequired,
  addListItem: PropTypes.func.isRequired,
  validateListItem: PropTypes.func.isRequired,
};

export default withTranslation(['biobank', 'loris'])(BatchProcessForm);
