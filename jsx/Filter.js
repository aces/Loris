import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Filter component.
 * A wrapper for form elements inside a selection filter.
 *
 * Constructs filter fields based on this.props.fields configuration object
 *
 * Alters the filter object and sends it to parent on every update.
 *
 */
class Filter extends Component {
  constructor(props) {
    super(props);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.renderFilterFields = this.renderFilterFields.bind(this);
  }

  /**
   * Sets filter object to reflect values of input fields.
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   * @param {string} id - id of the form element
   * @param {string} type - type of the form element
   */
  onFieldUpdate(name, value, id, type) {
    const filter = JSON.parse(JSON.stringify(this.props.filter));
    const exactMatch = type === 'textbox' ? false : true;
    if (value === null || value === '') {
      delete filter[name];
    } else {
      filter[name] = {
        value: value,
        exactMatch: exactMatch,
      };
    }

    this.props.updateFilter(filter);
  }

  renderFilterFields() {
    return this.props.fields.reduce((result, field) => {
      const filter = field.filter;
      if (filter && filter.hide !== true) {
        let element;
        switch (filter.type) {
        case 'text':
          element = <TextboxElement key={filter.name}/>;
          break;
        case 'select':
          element = <SelectElement key={filter.name} options={filter.options}/>;
          break;
        default:
          element = <TextboxElement key={filter.name}/>;
        }

        result.push(React.cloneElement(
          element,
          {
            name: filter.name,
            label: field.label,
            value: (this.props.filter[filter.name] || {}).value,
            onUserInput: this.onFieldUpdate,
          }
        ));
      }

      return result;
    }, []);
  }

  render() {
    return (
      <Panel
        height={this.props.height}
        title={this.props.title}
      >
        <FormElement
          id={this.props.id}
          name={this.props.name}
          columns={this.props.columns}
        >
          {this.renderFilterFields()}
          <ButtonElement
            label="Clear Filters"
            type="reset"
            onUserInput={this.props.clearFilter}
          />
        </FormElement>
      </Panel>
    );
  }
}

Filter.defaultProps = {
  height: '100%',
  title: 'Selection Filter',
  id: null,
  clearFilter: function() {
    console.warn('onUpdate() callback is not set!');
  },
};
Filter.propTypes = {
  filter: PropTypes.object.isRequired,
  clearFilter: PropTypes.func.isRequired,
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
};

export default Filter;
