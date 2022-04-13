import React, {Component} from 'react';

import Modal from 'Modal';
import {ListForm, ListItem} from './listForm.js';
import {clone, mapFormOptions} from './helpers.js';

/**
 * Container Form
 *
 **/

const initialState = {
  current: {},
  list: {},
  errors: {list: {}},
};

/**
 * A form for editing Containers in the Biobank
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
        title='Add New Container'
        show={show}
        onClose={handleClose}
        onSubmit={this.handleSubmit}
        throwWarning={true}
      >
        <FormElement>
          <div className="row">
            <div className="col-xs-11">
              <SelectElement
                name="projectIds"
                label="Project"
                options={options.projects}
                onUserInput={this.setCurrent}
                required={true}
                multiple={true}
                emptyOption={false}
                value={current.projectIds}
                errorMessage={(errors.container||{}).projectIds}
              />
              <SelectElement
                name="centerId"
                label="Site"
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
        </FormElement>
      </Modal>
    );
  }
}

ContainerForm.propTypes = {
};

/**
 * Container Barcode Form
 *
 * Acts a subform for ContainerForm
 **/
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
          label='Barcode'
          onUserInput={this.setContainer}
          required={true}
          value={item.barcode}
          errorMessage={errors.barcode}
        />
        <SelectElement
          name='typeId'
          label='Container Type'
          options={containerTypesNonPrimary}
          onUserInput={this.setContainer}
          required={true}
          value={item.typeId}
          errorMessage={errors.typeId}
        />
        <TextboxElement
          name='lotNumber'
          label='Lot Number'
          onUserInput={this.setContainer}
          value={item.lotNumber}
          errorMessage={errors.lotNumber}
        />
        <DateElement
          name='expirationDate'
          label='Expiration Date'
          onUserInput={this.setContainer}
          value={item.expirationDate}
          errorMessage={errors.expirationDate}
        />
      </ListItem>
    );
  }
}

ContainerSubForm.propTypes = {
};

ContainerSubForm.defaultProps = {
};

export default ContainerForm;
