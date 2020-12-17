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
   * Takes qeury params from url and triggers an update of the fields that are
   * associated with those params, if they exist.
   */
  componentDidMount() {
     const searchParams = new URLSearchParams(location.search);
     searchParams.forEach((value, name) => {
       // This checks to make sure the filter actually exists
       if (this.props.fields.find((field) => (field.filter||{}).name == name)) {
         this.onFieldUpdate(name, searchParams.getAll(name));
       }
     });
   }

  /**
   * Sets filter object to reflect values of input fields.
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   */
  onFieldUpdate(name, value) {
    const {filter, fields} = JSON.parse(JSON.stringify(this.props));
    const searchParams = new URLSearchParams(location.search);
    const type = fields.find((field) => (field.filter||{}).name == name).type;
    const exactMatch = (!(type === 'text' || type === 'date'));
    if (value === null || value === '' ||
        (value.constructor === Array && value.length === 0)) {
      delete filter[name];
      searchParams.delete(name);
    } else {
      if (value.constructor === Array) {
        searchParams.delete(name);
        value.forEach((v) => searchParams.append(name, v));
      } else {
        searchParams.set(name, value);
      }
      filter[name] = {value, exactMatch};
    }
    this.props.updateFilter(filter);
    history.replaceState(filter, '', `?${searchParams.toString()}`);
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
          element = (
            <SelectElement
              options={filter.options}
              sortByValue={filter.sortByValue}
            />
          );
          break;
        case 'multiselect':
          element = (
            <SelectElement
              options={filter.options}
              multiple={true}
              emptyOption={false}
            />
          );
          break;
        case 'numeric':
          element = <NumericElement options={filter.options}/>;
          break;
        case 'date':
          element = <DateElement/>;
          break;
        case 'checkbox':
          element = <CheckboxElement/>;
          break;
        default:
          element = <TextboxElement/>;
        }

        // The value prop has to default to false if the first two options
        // are undefined so that the checkbox component is a controlled input
        // element with a starting default value
        result.push(React.cloneElement(
          element,
          {
            key: filter.name,
            name: filter.name,
            label: field.label,
            value: (this.props.filter[filter.name] || {}).value || false,
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
  columns: PropTypes.number,
  title: PropTypes.string,
  fields: PropTypes.array.isRequired,
};

export default Filter;
