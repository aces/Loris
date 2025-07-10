import React from 'react';
import Select, {SingleValue} from 'react-select';

type SelectOption = {
    label: string,
    value: string,
    module: string,
};

type SelectGroup = {
    label: string,
    options: SelectOption[],
};

/**
 * Render a select with option groups that can be
 * filtered
 *
 * @param {object} props - react props
 * @param {function} props.onChange - Callback on selection change
 * @param {string?} props.placeholder - An optional placeholder value when no elements are selected
 * @param {object} props.groups - Groups to select the dropdown into
 * @param {function} props.mapGroupName - A mapper from backend to frontend name for groups
 * @returns {React.ReactElement} - The element
 */
function FilterableSelectGroup(props: {
    onChange: (module: string, value: string) => void,
    placeholder?: string,
    groups: object,
    mapGroupName?: (module: string) => string,
}) {
  const options: SelectOption[] = [];  // Changed from SelectGroup[] to SelectOption[]
  const placeholder = props.placeholder || 'Select a Category';

  for (const module of Object.keys(props.groups)) {
    let label = module;
    if (props.mapGroupName) {  // Added missing opening brace
      label = props.mapGroupName(module);
    }
    options.push({
      value: module,    // Changed from undefined 'value' to 'module'
      label: label,     // Changed from undefined 'desc' to 'label'
      module: module,
    });
  }

  const selected = (e: SingleValue<SelectOption>) => {
    const val: SelectOption = e as SelectOption;
    props.onChange(val.module, val.value);
  };
  
  return (
    <div>
      <Select options={options} onChange={selected}  // Changed from 'groups' to 'options'
        menuPortalTarget={document.body}
        styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
        placeholder={placeholder}
      />
    </div>
  );
}

export default FilterableSelectGroup;