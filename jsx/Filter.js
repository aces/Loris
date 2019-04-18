import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
    // XXX: The field.filter||{} is a hack and can be resolved by placing the
    // name property directly under fields and not nested within filter.
    const field = this.props.fields.find((field) => (field.filter||{}).name === name);
    const exact = field.filter.exact || false;
    if (value === null || value === '') {
      delete filter[name];
    } else {
      filter[name] = {
        value: value,
        exact: exact,
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
          element = <TextboxElement/>;
          break;
        case 'select':
          element = <SelectElement options={filter.options}/>;
          break;
        case 'multiselect':
          element = <SelectElement options={filter.options} multiple={true}/>;
          break;
        case 'search':
          element = <SearchableDropdown options={filter.options}/>;
          break;
        case 'date':
          element = <DateElement/>;
          break;
        default:
          element = <TextboxElement/>;
        }

        result.push(React.cloneElement(
          element,
          {
            key: filter.name,
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
      <FormElement
        id={this.props.id}
        name={this.props.name}
      >
        <FieldsetElement
          columns={this.props.columns}
          legend={this.props.title}
        >
          {this.renderFilterFields()}
          <ButtonElement
            label="Clear Filters"
            type="reset"
            onUserInput={this.props.clearFilter}
          />
        </FieldsetElement>
      </FormElement>
    );
  }
}

Filter.defaultProps = {
  id: null,
  clearFilter: function() {
    console.warn('onUpdate() callback is not set!');
  },
  columns: 1,
};
Filter.propTypes = {
  filter: PropTypes.object.isRequired,
  clearFilter: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  columns: PropTypes.string,
  title: PropTypes.string,
  fields: PropTypes.object.isRequired,
};

export default Filter;
