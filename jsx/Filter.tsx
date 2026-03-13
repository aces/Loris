import React, {useEffect} from 'react';
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
import {useTranslation} from 'react-i18next';
import './Filter.css';
import type {Filter, Filters, Field, FilterConfig} from './DataTable.d';

export type FieldWithFilter = Field & { filter: FilterConfig };

export interface FilterPreset {
    label: string;
    filter: Filters;
}

interface FilterProps {
    id?: string;
    name?: string;
    columns?: number;
    title?: string;
    fields: FieldWithFilter[];
    filters: Filters;
    addFilter: (
      name: string,
      value: Filter['value'],
      exactMatch: boolean
    ) => void;
    removeFilter: (name: string) => void;
    updateFilters: (filters: Filters) => void;
    clearFilters: () => void;
    filterPresets?: FilterPreset[];
}

/**
 * Filter component
 * A wrapper for form elements inside a selection filter.
 *
 * Constructs filter fields based on this.props.fields configuration object
 *
 * Alters the filter object and sends it to parent on every update.
 *
 * @param {props} props - Component properties
 * @return {JSX}
 */
function Filter({
  fields,
  filters,
  addFilter,
  removeFilter,
  updateFilters,
  clearFilters,
  id = '',
  name = '',
  columns = 1,
  title = '',
  filterPresets,
}: FilterProps) {
  const {t} = useTranslation(['loris']);
  /**
   * Takes query params from url and triggers an update of the fields that are
   * associated with those params, if they exist.
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, name) => {
      if (fields.find((field) => field.filter?.name === name)) {
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
  const onFieldUpdate = (name: string, value: any) => {
    const field = fields.find((f) => f.filter?.name === name);
    if (!field) return;

    const type = field.filter.type;
    const exactMatch = !['text', 'date', 'datetime', 'multiselect']
      .includes(type);

    const isEmpty =
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (type === 'checkbox' && value === false);

    if (isEmpty) {
      removeFilter(name);
    } else {
      addFilter(name, value, exactMatch);
    }
  };

  /**
   * Renders the filters based on the defined fields.
   *
   * @return {array}
   */
  const renderFilterFields = () => {
    return fields .map((field) => {
      const filter = field.filter;

      if (filter.hide) return;

      // Shared props for all elements
      const commonProps = {
        key: filter.name,
        name: filter.name,
        label: field.label,
        value: filters[filter.name]?.value ?? undefined,
        onUserInput: onFieldUpdate,
        labelPlacementTop: true,
      };

      switch (filter.type) {
      case 'text':
        return <TextboxElement {...commonProps} />;
      case 'select':
      case 'multiselect':
        return (
          <SelectElement
            {...commonProps}
            options={filter.options}
            sortByValue={filter.sortByValue}
            multiple={filter.type === 'multiselect'}
            emptyOption={false}
            autoSelect={false}
          />
        );
      case 'numeric':
        return <NumericElement {...commonProps} />;
      case 'date':
        return <DateElement {...commonProps} />;
      case 'datetime':
        return <DateTimePartialElement {...commonProps} />;
      case 'checkbox':
        return <CheckboxElement {...commonProps} />;
      case 'time':
        return <TimeElement {...commonProps} />;
      default:
        return <TextboxElement {...commonProps} />;
      }
    });
  };

  /**
   *
   */
  const renderPresets = () => {
    if (!filterPresets) return null;

    return (
      <li className="dropdown">
        <a
          className="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          style={{cursor: 'pointer'}}
        >
          {t('Load Filter Preset')} <span className="caret" />
        </a>
        <ul className="dropdown-menu" role="menu">
          {filterPresets.map((preset) => (
            <li key={preset.label}>
              <a
                onClick={() => updateFilters(preset.filter)}
                style={{cursor: 'pointer'}}
              >
                {preset.label}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <FormElement
      id={id}
      name={name}
      onSubmit={(e) => e.preventDefault()}
    >
      <FieldsetElement columns={columns} legend={title}>
        <ul
          className="nav nav-tabs navbar-right"
          style={{borderBottom: 'none'}}
        >
          {renderPresets()}
          <li>
            <a role="button" onClick={clearFilters} style={{cursor: 'pointer'}}>
              {t('Clear Filters')}
            </a>
          </li>
        </ul>
        <div className='filter-container'>
          {renderFilterFields()}
        </div>
      </FieldsetElement>
    </FormElement>
  );
}

export default Filter;
