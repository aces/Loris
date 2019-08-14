import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Biobank Collection Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to specimen a biobank file attached to a specific instrument
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 * */
class BiobankContainerForm extends Component {
  render() {
    // Generates new Barcode Form everytime the addContainer button is pressed
    const barcodes = Object.keys(this.props.current.list).map(([key, container], i, list) => {
      return (
        <ContainerBarcodeForm
          key={key}
          containerKey={key}
          id={i+1}
          container={this.props.current.list[key]}
          errors={(this.props.errors[key]||{}).container}
          collapsed={this.props.current.collapsed[key]}
          containerTypesNonPrimary={this.props.containerTypesNonPrimary}
          removeContainer={list.length !== 1 ? () => {
            this.props.removeListItem(key);
          } : null}
          addContainer={i+1 == list.length ? () => {
            this.props.addListItem('container');
          } : null}
          multiplier={this.props.current.multiplier}
          copyContainer={i+1 == list.length && this.props.current.list[key] ? this.props.copyListItem : null}
          setListItem={this.props.setListItem}
          setCurrent={this.props.setCurrent}
          toggleCollapse={this.props.toggleCollapse}
        />
      );
    });

    return (
      <div>
        <div className="row">
          <div className="col-xs-11">
            <SelectElement
              name="projectIds"
              label="Project"
              options={this.props.options.projects}
              onUserInput={this.props.setCurrent}
              required={true}
              multiple={true}
              emptyOption={false}
              value={this.props.current.projectIds}
              errorMessage={(this.props.errors.container||{}).projectIds}
            />
            <SelectElement
              name="centerId"
              label="Site"
              options={this.props.options.centers}
              onUserInput={this.props.setCurrent}
              required={true}
              value={this.props.current.centerId}
              errorMessage={(this.props.errors.container||{}).centerId}
            />
          </div>
        </div>
        {barcodes}
      </div>
    );
  }
}

BiobankContainerForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  barcode: PropTypes.string,
  refreshTable: PropTypes.func,
};

/**
 * Container Barcode Form
 *
 * Acts a subform for ContainerForm
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 **/
class ContainerBarcodeForm extends Component {
  constructor() {
    super();

    this.setContainer = this.setContainer.bind(this);
    this.copy = this.copy.bind(this);
  }

  copy() {
    this.props.copyContainer(this.props.containerKey);
  }

  // TODO: change form.js so this isn't necessary ?
  setContainer(name, value) {
    this.props.setListItem(name, value, this.props.containerKey);
  }

  render() {
    const renderAddContainerButton = () => {
      if (this.props.addContainer) {
        return (
          <div>
            <span className='action'>
              <div
                className='action-button add'
                onClick={this.props.addContainer}
              >
              +
              </div>
            </span>
            <span className='action-title'>
              New Entry
            </span>
          </div>
        );
      }
    };

    const renderCopyContainerButton = () => {
      if (this.props.copyContainer) {
        return (
          <div>
            <span className='action'>
              <div
                className='action-button add'
                onClick={this.copy}
              >
                <span className='glyphicon glyphicon-duplicate'/>
              </div>
            </span>
            <span className='action-title'>
              <input
                className='form-control input-sm'
                type='number'
                min='1'
                max='50'
                style={{width: 50, display: 'inline'}}
                onChange={(e)=>{
this.props.setCurrent('multiplier', e.target.value);
}}
                value={this.props.multiplier}
              />
              Copies
            </span>
          </div>
        );
      }
    };

    const renderRemoveContainerButton = () => {
      if (this.props.removeContainer) {
        const glyphStyle = {
          color: '#DDDDDD',
          marginLeft: 10,
          cursor: 'pointer',
          fontSize: 15,
        };

        return (
          <span
            className='glyphicon glyphicon-remove'
            onClick={this.props.removeContainer}
            style={glyphStyle}
          />
        );
      }
    };

    return (
      <div>
        <div className='row'>
          <div className='col-xs-11'>
            <div>
            <TextboxElement
              name='barcode'
              label={'Barcode ' + this.props.id}
              onUserInput={this.setContainer}
              required={true}
              value={this.props.container.barcode}
              errorMessage={this.props.errors.barcode}
            />
            </div>
          </div>
          <div className='col-xs-1' style={{paddingLeft: 0, marginTop: 10}}>
            <span
              className= {this.props.collapsed ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-up'}
              style={{cursor: 'pointer', fontSize: 15, position: 'relative', right: 40}}
              onClick={() => this.props.toggleCollapse(this.props.containerKey)}
            />
            {renderRemoveContainerButton()}
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-2'/>
          <div className='col-xs-9'>
            <div>
              <SelectElement
                name='typeId'
                label='Container Type'
                options={this.props.containerTypesNonPrimary}
                onUserInput={this.setContainer}
                required={true}
                value={this.props.container.typeId}
                errorMessage={this.props.errors.typeId}
              />
              <TextboxElement
                name='lotNumber'
                label='Lot Number'
                onUserInput={this.setContainer}
                value={this.props.container.lotNumber}
                errorMessage={this.props.errors.lotNumber}
              />
              <DateElement
                name='expirationDate'
                label='Expiration Date'
                onUserInput={this.setContainer}
                value={this.props.container.expirationDate}
                errorMessage={this.props.errors.expirationDate}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-11'>
            <div className='col-xs-3'/>
            <div className='col-xs-4 action'>
              {renderAddContainerButton()}
            </div>
            <div className='col-xs-4 action'>
              {renderCopyContainerButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ContainerBarcodeForm.propTypes = {

};

ContainerBarcodeForm.defaultProps = {
  errors: {},
  multiplier: 1,
};

export default BiobankContainerForm;
