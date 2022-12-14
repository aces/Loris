import Select from 'react-select';

/**
 * Render a select with option groups that can be
 * filtered
 *
 * @param {object} props - react props
 *
 * @return {ReactDOM}
 */
function FilterableSelectGroup(props) {
    let groups = [];
    const placeholder = props.placeholder || 'Select a category';
    for (const [module, subcategories]
        of Object.entries(props.groups)) {
      let options = [];
      for (const [value, desc] of Object.entries(subcategories)) {
        options.push({
          value: value,
          label: desc,
          module: module,
        });
      }

      let label = module;
      if (props.mapGroupName) {
        label = props.mapGroupName(module);
      }
      groups.push({
        label: label,
        options: options,
      });
    }

    const selected = (e) => {
        props.onChange(e.module, e.value);
    };
    return (
        <div>
            <Select options={groups} onChange={selected}
                 menuPortalTarget={document.body}
                 styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
                 placeholder={placeholder}
            />
        </div>
    );
}

export default FilterableSelectGroup;
