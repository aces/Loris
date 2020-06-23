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

  componentDidMount() {
     const searchParams = new URLSearchParams(location.search);
     const filter = JSON.parse(JSON.stringify(this.props.filter));
     searchParams.forEach((value, name) => {
       if (this.props.fields.find((field) => (field.filter||{}).name == name)) {
         filter[name] = {value: searchParams.getAll(name)};
       }
     });
     this.props.updateFilter(filter);
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
    const exactMatch = (!(type === 'textbox' || type === 'date'));
    if (
      value === null
      || value === ''
      || (value.constructor === Array && value.length === 0)
    ) {
      delete filter[name];
    } else {
      filter[name] = {value, exactMatch};
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
          element = (
            <SelectElement
              key={filter.name}
              options={filter.options}
              sortByValue={filter.sortByValue}
            />
          );
          break;
        case 'multiselect':
          element = <SelectElement
            key={filter.name}
            options={filter.options}
            multiple={true}
            emptyOption={false}
          />;
          break;
        case 'numeric':
          element = <NumericElement
            key={filter.name}
            options={filter.options}
          />;
          break;
        case 'date':
          element = <DateElement key={filter.name}/>;
          break;
        case 'checkbox':
          element = <CheckboxElement key={filter.name}/>;
          break;
        default:
          element = <TextboxElement key={filter.name}/>;
        }

        // The value prop has to default to false if the first two options
        // are undefined so that the checkbox component is a controlled input
        // element with a starting default value
        result.push(React.cloneElement(
          element,
          {
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
    const filterPresets = () => {
      if (this.props.filterPresets) {
        const presets = this.props.filterPresets.map((preset) => {
          const handleClick = () => this.props.updateFilter(preset.filter);
          return <li><a onClick={handleClick}>{preset.label}</a></li>;
        });
        return (
          <li className='dropdown'>
            <a
              className='dropdown-toggle'
              data-toggle='dropdown'
              role='button'
            >
              Load Filter Preset <span className='caret'/>
            </a>
            <ul className='dropdown-menu' role='menu'>
              {presets}
            </ul>
          </li>
        );
      };
    };

    const filterActions = (
      <ul className='nav nav-tabs navbar-right' style={{borderBottom: 'none'}}>
        {filterPresets()}
        <li>
          <a role='button' onClick={this.props.clearFilter}>Clear Filter</a>
        </li>
      </ul>
    );

    return (
      <FormElement
        id={this.props.id}
        name={this.props.name}
      >
        <FieldsetElement
          columns={this.props.columns}
          legend={this.props.title}
        >
          {filterActions}
          {this.renderFilterFields()}
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
