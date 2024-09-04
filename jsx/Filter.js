import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    CheckboxElement,
    DateElement,
    FieldsetElement,
    TimeElement,
    FormElement,
    NumericElement,
    SelectElement,
    TextboxElement,
} from 'jsx/Form';
import DateTimePartialElement from 'jsx/form/DateTimePartialElement';

/**
 * Filter component
 * A wrapper for form elements inside a selection filter.
 *
 * Constructs filter fields based on this.props.fields configuration object
 *
 * Alters the filter object and sends it to parent on every update.
 *
 * @param {props} props
 * @return {JSX}
 */
function Filter(props) {
  /**
   * Takes query params from url and triggers an update of the fields that are
   * associated with those params, if they exist.
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.forEach((value, name) => {
      // This checks to make sure the filter actually exists
      if (props.fields.find((field) => (field.filter||{}).name == name)) {
        onFieldUpdate(name, searchParams.getAll(name));
      }
    });
  }, []);

  /**
   * Sets filter object to reflect values of input fields.
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   */
  const onFieldUpdate = (name, value) => {
    const {fields} = JSON.parse(JSON.stringify(props));
    const type = fields
      .find((field) => (field.filter||{}).name == name).filter.type;
    const exactMatch = (!(type === 'text' || type === 'date'
      || type === 'datetime'));
    if (value === null || value === '' ||
      (value.constructor === Array && value.length === 0) ||
      (type === 'checkbox' && value === false)) {
      props.removeFilter(name);
    } else {
      props.addFilter(name, value, exactMatch);
    }
  };

  /**
   * Renders the filters based on the defined fields.
   *
   * @return {array}
   */
  const renderFilterFields = () => {
    return props.fields.reduce((result, field) => {
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
                autoSelect={false}
              />
            );
            break;
          case 'multiselect':
            element = (
              <SelectElement
                options={filter.options}
                sortByValue={filter.sortByValue}
                multiple={true}
                emptyOption={false}
              />
            );
            break;
          case 'numeric':
            element = <NumericElement
              options={filter.options}
            />;
            break;
          case 'date':
            element = <DateElement/>;
            break;
          case 'datetime':
            element = <DateTimePartialElement />;
            break;
          case 'checkbox':
            element = <CheckboxElement/>;
            break;
          case 'time':
            element = <TimeElement/>;
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
            value: (props.filters[filter.name] || {}).value || null,
            onUserInput: onFieldUpdate,
          }
        ));
      }

      return result;
    }, []);
  };

  const filterPresets = () => {
    if (props.filterPresets) {
      const presets = props.filterPresets.map((preset) => {
        const handleClick = () => props.updateFilters(preset.filter);
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
    }
  };

  const filterActions = (
    <ul className='nav nav-tabs navbar-right' style={{borderBottom: 'none'}}>
      {filterPresets()}
      <li>
        <a role='button' name='reset' onClick={props.clearFilters}>
          Clear Filter
        </a>
      </li>
    </ul>
  );

  return (
    <FormElement
      id={props.id}
      name={props.name}
    >
      <FieldsetElement
        columns={props.columns}
        legend={props.title}
      >
        {filterActions}
        {renderFilterFields()}
      </FieldsetElement>
    </FormElement>
  );
}

Filter.defaultProps = {
  id: null,
  clearFilter: function() {
    console.warn('onUpdate() callback is not set!');
  },
  columns: 1,
};
Filter.propTypes = {
  filters: PropTypes.object.isRequired,
  clearFilter: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  columns: PropTypes.number,
  title: PropTypes.string,
  fields: PropTypes.array.isRequired,
  removeFilter: PropTypes.func,
  addFilter: PropTypes.func,
  filterPresets: PropTypes.array,
  updateFilters: PropTypes.func,
  clearFilters: PropTypes.func,
};

export default Filter;
