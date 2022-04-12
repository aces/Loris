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

class ContainerForm extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.setCurrent = this.setCurrent.bind(this);
    this.setList = this.setList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setCurrent(name, value) {
    const {current} = clone(this.state);
    current[name] = value;
    this.setState({current});
  }

  setList(list) {
    this.setState({list});
  }

  handleSubmit() {
    const {list, current, errors} = this.state;
    return new Promise((resolve, reject) => {
      this.props.onSubmit(list, current, errors)
      .then(() => resolve(), (errors) => this.setState({errors}, reject()));
    });
  }

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
  constructor() {
    super();

    this.setContainer = this.setContainer.bind(this);
  }

  setContainer(name, value) {
    this.props.setListItem(name, value, this.props.itemKey);
  }

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
