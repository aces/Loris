import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import SpecimenProcessForm from './processForm';
import {VerticalTabs, TabPane} from 'Tabs';
import Modal from 'Modal';
import Loader from 'Loader';
import {mapFormOptions, clone, isEmpty} from './helpers.js';
import {
  TextboxElement,
  SelectElement,
  StaticElement,
  SearchableDropdown,
  CheckboxElement,
} from 'jsx/Form';

import Swal from 'sweetalert2';

const initialState = {
  specimen: {},
  container: {},
  collection: {},
  preparation: {},
  list: {},
  count: 0,
  current: {},
  errors: {specimen: {}, container: {}},
  loading: false,
  editable: {global: true},
  show: {collection: false, preparation: false},
};

/**
 * Biobank Batch Edit Specimen Form
 */
class BatchEditForm extends React.PureComponent {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = initialState;
    this.setSpecimen = this.setSpecimen.bind(this);
    this.setContainer = this.setContainer.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.setProcess = this.setProcess.bind(this);
    this.validateListItem = this.validateListItem.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.setPool = this.setPool.bind(this);
  }

  /**
   * Add a new list item to a container
   *
   * @param {number} containerId - the container to add an item to
   */
  addListItem(containerId) {
    let {
      list,
      current,
      collection,
      preparation,
      count,
      show,
    } = clone(this.state);

    // Increase count.
    count++;

    // Set Specimen and Container.
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];

    // Set current global values.
    current.typeId = specimen.typeId;

    // Set list values.
    list[count] = {specimen, container};

    // This determines if every specimen in the list has the same collection
    // protocol.
    show.collection = Object.keys(list).length > 1 && Object.values(list)
      .every((item, i, listArray) => {
        return item.specimen.collection &&
        item.specimen.collection.protocolId ===
        listArray[0].specimen.collection.protocolId;
      });

    // If so, set the collection protocolId.
    if (show.collection) {
      collection.protocolId = list[
        Object.keys(list)[0]
      ].specimen.collection.protocolId;
    }

    // This determines if every specimen in the list has the same preparation
    // protocol.
    show.preparation = Object.keys(list).length > 1 && Object.values(list)
      .every((item, i, listArray) => {
        return item.specimen.preparation &&
        item.specimen.preparation.protocolId ===
        listArray[0].specimen.preparation.protocolId;
      });

    // If so, set the preparation protocolId.
    if (show.preparation) {
      preparation.protocolId = list[
        Object.keys(list)[0]
      ].specimen.preparation.protocolId;
    }

    this.setState(
      {list, current, collection, preparation, count, show}
    );
  }

  /**
   * Remove a list item from a container
   *
   * @param {string} key - the key to remove
   */
  removeListItem(key) {
    let {list, current} = clone(this.state);
    delete list[key];
    current = isEmpty(list) ? {} : current;
    this.setState({list, current});
  }

  /**
   * Set the current specimen being edited
   *
   * @param {string} name - process name
   * @param {object} value - value to set
   */
  setSpecimen(name, value) {
    const specimen = clone(this.state.specimen);
    specimen[name] = value;
    // if (!value) delete specimen[name];
    this.setState({specimen});
  }

  /**
   * Set the current container being edited
   *
   * @param {string} name - process name
   * @param {object} value - value to set
   */
  setContainer(name, value) {
    const container = clone(this.state.container);
    container[name] = value;
    this.setState({container});
  }

  /**
   * Update the current state object, which acts as a generic state holder for this
   * component.
   *
   * @param {string} name - process name
   * @param {object} value - value to set
   * @return {Promise}
   */
  setCurrent(name, value) {
    const current = clone(this.state.current);
    current[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  /**
   * Sets the process being edited
   *
   * @param {string} name - process name
   * @param {object} value - value to set
   */
  setProcess(name, value) {
    this.setState({[name]: value});
  }

  /**
   * From the selected pool, add all related speciments into the list.
   *
   * @param {string} name - the pool name
   * @param {number} poolId - the pool id
   */
  setPool(name, poolId) {
    const pool = clone(this.props.data.pools[poolId]);

    // This struture is what allows pools to be loaded and then have the pool
    // label disappear once the barcodes have been added to the list.
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
   * Validate the list items for a container
   *
   * @param {number} containerId - the container to validate
   * @return {Promise}
   */
  validateListItem(containerId) {
    const {t} = this.props;
    const {current, list} = clone(this.state);
    const container = this.props.data.containers[containerId];
    const specimen = this.props.data.specimens[container.specimenId];
    if (!isEmpty(list) &&
      (specimen.typeId !== current.typeId)) {
      Swal.fire(
        t('Oops!', {ns: 'biobank'}),
        t('Specimens must be of the same Type and Center', {ns: 'biobank'}),
        'warning'
      );
      return Promise.reject();
    }
    return Promise.resolve();
  }

  /**
   * Render the react component
   *
   * @return {JSX}
   */
  render() {
    if (this.state.loading) {
      return <Loader/>;
    }

    const {t, data, options} = this.props;
    const {poolId, collection, preparation, list, current, errors} = this.state;

    const units = current.typeId ? mapFormOptions(
      options.specimen.typeUnits[current.typeId],
      'label'
    ) : {};
    const stati = mapFormOptions(options.container.stati, 'label');
    const containerTypesPrimary = mapFormOptions(
      options.container.typesPrimary,
      'label',
    );
    const containerTypes = {};
    if (current.typeId && options.specimen.typeContainerTypes[current.typeId]) {
      Object.keys(containerTypesPrimary).forEach((id) => {
        options.specimen.typeContainerTypes[current.typeId].forEach((i) => {
          if (id == i) {
            containerTypes[id] = containerTypesPrimary[id];
          }
        });
      });
    }
    const globalForm = current.typeId ? (
      <EditForm>
        <TextboxElement
          name='quantity'
          label={this.props.t('Quantity', {ns: 'biobank'})}
          value={this.state.specimen.quantity || null}
          errorMessage={errors.specimen.quantity}
          onUserInput={this.setSpecimen}
        />
        <SelectElement
          name='unitId'
          label={this.props.t('Unit', {ns: 'biobank'})}
          value={this.state.specimen.unitId || null}
          options={units}
          errorMessage={errors.specimen.unitId}
          onUserInput={this.setSpecimen}
        />
        {options.specimen.types[current.typeId].freezeThaw == 1 ? (
          <TextboxElement
            name='fTCycle'
            label={this.props.t('Freeze-Thaw Cycle', {ns: 'biobank'})}
            value={this.state.specimen.fTCycle}
            onUserInput={this.setSpecimen}
            errorMessage={errors.specimen.fTCycle}
            min={0}
          />
        ) : null}
        <SelectElement
          name='typeId'
          label={this.props.t('Container Type', {ns: 'biobank'})}
          value={this.state.container.typeId}
          options={containerTypes}
          errorMessage={errors.container.typeId}
          onUserInput={this.setContainer}
        />
        <TextboxElement
          name='lotNumber'
          label={this.props.t('Lot Number', {ns: 'biobank'})}
          value={this.state.container.lotNumber}
          errorMessage={errors.container.lotNumber}
          onUserInput={this.setContainer}
        />
        <SelectElement
          name='statusId'
          label={this.props.t('Status', {ns: 'biobank'})}
          value={this.state.container.statusId}
          options={stati}
          errorMessage={errors.container.statusId}
          onUserInput={this.setContainer}
        />
      </EditForm>
    ) : null;

    const collectionForm = this.state.editable.collection ? (
      <div>
        <StaticElement
          label={this.props.t('Protocol', {ns: 'biobank'})}
          text={options.specimen.protocols[collection.protocolId].label}
        />
        <SpecimenProcessForm
          edit={true}
          errors={errors.specimen.collection || {}}
          options={options}
          process={collection}
          processStage="collection"
          setParent={this.setProcess}
          setCurrent={this.setCurrent}
          typeId={current.typeId}
          hideProtocol={true}
          render={(elements) => (
            <EditForm>
              {elements}
            </EditForm>
          )}
        />
      </div>
    ) : null;

    const preparationForm = this.state.editable.preparation ? (
      <div>
        <StaticElement
          label={this.props.t('Protocol', {ns: 'biobank'})}
          text={options.specimen.protocols[preparation.protocolId].label}
        />
        <EditForm>
          <SpecimenProcessForm
            edit={true}
            errors={errors.specimen.preparation || {}}
            options={options}
            process={preparation}
            processStage='preparation'
            setParent={this.setProcess}
            setCurrent={this.setCurrent}
            typeId={current.typeId}
            hideProtocol={true}
          />
        </EditForm>
      </div>
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

    const tabList = [{
      id: 'global',
      label: this.props.t('Global', {ns: 'biobank'}),
      error: !isEmpty(errors.specimen) || !isEmpty(errors.container),
      content: globalForm,
    }];
    if (this.state.show.collection) {
      tabList.push({
        id: 'collection',
        label: this.props.t('Collection', {ns: 'biobank'}),
        error: !isEmpty(errors.specimen.collection),
        content: collectionForm,
      });
    }
    if (this.state.show.preparation) {
      tabList.push({
        id: 'preparation',
        label: this.props.t('Preparation', {ns: 'biobank'}),
        content: preparationForm,
      });
    }
    const tabContent = tabList
      .map((tab, i) => <TabPane key={i} TabId={tab.id}>{tab.content}</TabPane>);

    const handlePoolInput = (name, value) => value && this.setPool(name, value);
    const handleClose = () => this.setState(initialState, this.props.onClose);

    const handleSubmit = () => {
      this.setState({errors: {container: {}, specimen: {}}});
      const prepList = Object.values(list).map((item) => {
        const specimen = clone(item.specimen);
        const container = clone(item.container);

        // Clone values from global specimen.
        Object.keys(this.state.specimen).forEach((name) => {
          if (this.state.specimen[name] != null) {
            specimen[name] = this.state.specimen[name];
          }
        });

        // Clone values from global container.
        Object.keys(this.state.container).forEach((name) => {
          if (this.state.container[name] != null) {
            container[name] = this.state.container[name];
          }
        });

        // Clone collection values to specimen.
        Object.keys(collection).forEach((name) => {
          if (typeof specimen.collection[name] === 'object' &&
              specimen.collection[name] !== null) {
            Object.keys(collection[name]).forEach((index) => {
              if (collection[name][index] != null) {
                specimen.collection[name][index] = collection[name][index];
              }
            });
          } else {
            if (collection[name] != null) {
              specimen.collection[name] = collection[name];
            }
          }
        });

        // Clone specimen values to specimen.
        Object.keys(preparation).forEach((name) => {
          if (typeof specimen.preparation[name] === 'object' &&
              specimen.preparation[name] !== null) {
            Object.keys(preparation[name]).forEach((index) => {
              if (preparation[name][index] != null) {
                specimen.preparation[name][index] = preparation[name][index];
              }
            });
          } else {
            if (preparation[name] != null) {
              specimen.preparation[name] = preparation[name];
            }
          }
        });

        return {specimen, container};
      });

      return new Promise((resolve, reject) => {
        this.props.onSubmit(prepList)
          .then(() => resolve(), (errors) => this.setState({errors}, reject()));
      });
    };

    const editForms = Object.keys(list).length > 1 ? (
      <div className='form-top'>
        <StaticElement
          label={this.props.t('Editing Note', {ns: 'biobank'})}
          text={this.props.t(`Select a form for the list to
                edit the specimen values. Any previous value associated
                with a Specimen for a given field will be
                overwritten if one is added on this form.`, {ns: 'biobank'})}
        />
        <VerticalTabs
          tabs={tabList}
          onTabChange={(id) => this.setState({editable: {[id]: true}})}
          updateURL={false}
        >
          {tabContent}
        </VerticalTabs>
      </div>
    ) : null;

    return (
      <Modal
        title={this.props.t('Edit Specimens', {ns: 'biobank'})}
        show={this.props.show}
        onClose={handleClose}
        onSubmit={Object.keys(list).length > 1 && handleSubmit}
        throwWarning={true}
      >
        <div className='row'>
          <div className='col-sm-10 col-sm-offset-1'>
            <StaticElement
              label={this.props.t('Editing Note', {ns: 'biobank'})}
              text={t(`Select or Scan the specimens to be edited. Specimens
                    must share the same Type.`, {ns: 'biobank'})}
            />
            <StaticElement
              label='Specimen Type'
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
                  validateListItem={this.validateListItem}
                  addListItem={this.addListItem}
                />
                <SearchableDropdown
                  name={'poolId'}
                  label={this.props.t('Pool', {ns: 'biobank'})}
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
      </Modal>
    );
  }
}

BatchEditForm.propTypes = {
  t: PropTypes.func.isRequired,
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
      protocols: PropTypes.arrayOf(PropTypes.string),
      typeContainerTypes: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    container: PropTypes.shape({
      stati: PropTypes.object,
      typesPrimary: PropTypes.arrayOf(PropTypes.string),
      types: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  list: PropTypes.array.isRequired,
  addListItem: PropTypes.func.isRequired,
  validateListItem: PropTypes.func.isRequired,
};

/**
 * Input form to enter a barcode
 */
class BarcodeInput extends React.PureComponent {
  /**
   * Constructor
   *
   * @param {object} props - React props
   */
  constructor(props) {
    super(props);

    const barcodesPrimary = Object.values(props.data.containers)
      .reduce((result, container) => {
        if (props.options.container.types[container.typeId].primary == 1) {
          const inList = Object.values(props.list)
            .find((i) => i.container.id == container.id);

          if (!inList) {
            result[container.id] = container.barcode;
          }
        }
        return result;
      }, {});

    this.state = {
      barcodesPrimary: barcodesPrimary,
      barcode: null,
    };
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {addListItem} = this.props;

    const handleInput = (name, value) => {
      this.setState({barcode: value});
      const containerId = Object.keys(this.state.barcodesPrimary)
        .find((id) => this.state.barcodesPrimary[id] == value);
      containerId && this.props.validateListItem(containerId)
        .then(() => addListItem(containerId))
        .then(() => this.setState({barcode: null}));
    };
    return (
      <TextboxElement
        name={'barcode'}
        label={this.props.t('Specimen', {ns: 'biobank'})}
        value={this.state.barcode}
        onUserInput={handleInput}
      />
    );
    // <SearchableDropdown
    //   name={'containerId'}
    //   label={'Search Specimen'}
    //   onUserInput={onSearch}
    //   options={this.state.barcodesPrimary}
    //   value={containerId}
    // />
  }
}

BarcodeInput.propTypes = {
  t: PropTypes.func.isRequired,
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
    }).isRequired,
  }).isRequired,
  list: PropTypes.array.isRequired,
  addListItem: PropTypes.func.isRequired,
  validateListItem: PropTypes.func.isRequired,
};

/**
 * Adds a checkbox to all the children components.
 *
 * @param {object} props
 * @param props.children
 * @return {JSX}
 */
function EditForm({children}) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child) || typeof child.type !== 'function') {
      return child;
    }
    const handleClick = (name, value) => {
      if (!value) {
        child.props.onUserInput(name, null);
      }
      if (value && child.props.value == null) {
        child.props.onUserInput(name, '');
      }
    };

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-10">
              {React.cloneElement(child, {required: false})}
            </div>
            <div className="col-xs-2">
              <CheckboxElement
                name={child.props.name}
                value={child.props.value != null}
                onUserInput={handleClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  });
}

export default withTranslation(['biobank', 'loris'])(BatchEditForm);
