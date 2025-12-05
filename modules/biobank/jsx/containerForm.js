import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';

import Modal from 'Modal';
import {ListForm, ListItem} from './listForm.js';
import {
  SelectElement,
  TextboxElement,
  DateElement,
} from 'jsx/Form';
import {clone, mapFormOptions} from './helpers.js';


const initialState = {
  current: {},
  list: {},
  errors: {list: {}},
};

/**
 * A Form for adding Containers
 */
class ContainerForm extends Component {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.state = initialState;
    this.setCurrent = this.setCurrent.bind(this);
    this.setList = this.setList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Set the current container being displayed
   *
   * @param {string} name - the name of the container
   * @param {string} value - the value
   */
  setCurrent(name, value) {
    const {current} = clone(this.state);
    current[name] = value;
    this.setState({current});
  }

  /**
   * Sets a list in the container state
   *
   * @param {object} list - the state to set
   */
  setList(list) {
    this.setState({list});
  }

  /**
   * Handle submission of a form by calling onSubmit callback
   *
   * @return {Promise}
   */
  handleSubmit() {
    const {list, current, errors} = this.state;
    return new Promise((resolve, reject) => {
      this.props.onSubmit(list, current, errors)
        .then(() => resolve(), (errors) => this.setState({errors}, reject()));
    });
  }

  /**
   * Render React component
   *
   * @return {JSX}
   */
  render() {
    const {current, errors, list} = this.state;
    const {options, show} = this.props;
    const handleClose = () => this.setState(initialState, this.props.onClose);
    return (
      <Modal
        title={this.props.t('Add New Container')}
        show={show}
        onClose={handleClose}
        onSubmit={this.handleSubmit}
        throwWarning={true}
      >
        <div className="row">
          <div className="col-xs-11">
            <SelectElement
              name="centerId"
              label={this.props.t("Site", {ns: 'loris'})}
              options={options.centers}
              onUserInput={this.setCurrent}
              required={true}
              value={current.centerId}
              errorMessage={(errors.container||{}).centerId}
            />
          </div>
        </div>
        <ListForm
          list={list}
          errors={errors.list}
          setList={this.setList}
          listItem={{}}
        >
          <ContainerSubForm options={options}/>
        </ListForm>
      </Modal>
    );
  }
}

// ContainerForm.propTypes
ContainerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  options: PropTypes.shape({
    centers: PropTypes.arrayOf(PropTypes.string).isRequired,
    container: PropTypes.shape({
      typesNonPrimary: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * Container Barcode Form
 *
 * Acts a subform for ContainerForm
 */
class ContainerSubForm extends Component {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.setContainer = this.setContainer.bind(this);
  }

  /**
   * Set a value in the container
   *
   * @param {string} name - key name in list
   * @param {string} value - value in list
   */
  setContainer(name, value) {
    this.props.setListItem(name, value, this.props.itemKey);
  }

  /**
   * Render React component
   *
   * @return {JSX}
   */
  render() {
    const {item, errors, options} = this.props;

    const containerTypesNonPrimary = mapFormOptions(
      options.container.typesNonPrimary, 'label'
    );
    return (
      <ListItem {...this.props}>
        <TextboxElement
          name='barcode'
          label={this.props.t('Barcode', {ns: 'biobank'})}
          onUserInput={this.setContainer}
          required={true}
          value={item.barcode}
          errorMessage={errors.barcode}
        />
        <SelectElement
          name='typeId'
          label={this.props.t('Container Type', {ns: 'biobank'})}
          options={containerTypesNonPrimary}
          onUserInput={this.setContainer}
          required={true}
          value={item.typeId}
          errorMessage={errors.typeId}
        />
        <TextboxElement
          name='lotNumber'
          label={this.props.t('Lot Number', {ns: 'biobank'})}
          onUserInput={this.setContainer}
          value={item.lotNumber}
          errorMessage={errors.lotNumber}
        />
        <DateElement
          name='expirationDate'
          label={this.props.t('Expiration Date', {ns: 'biobank'})}
          onUserInput={this.setContainer}
          value={item.expirationDate}
          errorMessage={errors.expirationDate}
        />
      </ListItem>
    );
  }
}

// ContainerSubForm.propTypes
ContainerSubForm.propTypes = {
  setListItem: PropTypes.func.isRequired,
  itemKey: PropTypes.string.isRequired,
  item: PropTypes.shape({
    barcode: PropTypes.string.isRequired,
    typeId: PropTypes.number.isRequired,
    lotNumber: PropTypes.string.isRequired,
    expirationDate: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    barcode: PropTypes.string,
    typeId: PropTypes.string,
    lotNumber: PropTypes.string,
    expirationDate: PropTypes.string,
  }).isRequired,
  options: PropTypes.shape({
    container: PropTypes.shape({
      typesNonPrimary: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
};

export default withTranslation(['biobank', 'loris'])(ContainerForm);
