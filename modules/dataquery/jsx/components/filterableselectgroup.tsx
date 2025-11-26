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
 * @param {string?} props.label - Select input label
 * @returns {React.ReactElement} - The element
 */
function FilterableSelectGroup(props: {
    onChange: (module: string, value: string) => void,
    placeholder?: string,
    groups: object,
    mapGroupName?: (module: string) => string,
    label?: string,
}) {
  const groups: SelectGroup[] = [];
  const placeholder = props.placeholder || 'Select a category';
  for (const [module, subcategories]
    of Object.entries(props.groups)) {
    const options: SelectOption[] = [];
    for (const [value, desc]
      of Object.entries(subcategories) as unknown as [string, string]) {
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

  /**
   * Callback to call when the selection changes.
   *
   * @param {object} e - The click event callback
   * @param {string} e.module - The module
   * @param {string} e.value - The value
   * @returns {void}
   */
  const selected = (e: SingleValue<SelectGroup>) => {
    // The callback should be (e: SelectOption) but typescript
    // is convinced that it's a SingleValue<SelectGroup>.
    // console.log(e) confirms that it has the same structure
    // as SelectOption, so just convert it and explicitly
    // cast it unsafely to make the compiler happy.
    const val: SelectOption = e as unknown as SelectOption;
    props.onChange(val.module, val.value);
  };
  return (
    <div>
      {props.label ?
        <label style={{width: '100%', fontSize: '24px'}}>
          {props.label}
          <Select options={groups} onChange={selected}
            menuPortalTarget={document.body}
            styles={{menuPortal:
                        /**
                         * Add a z-index to ensure the element stays visible
                         *
                         * @param {object} base - the base CSS
                         * @returns {object} - the new CSS with z-index added
                         */
                        (base) => ({...base, zIndex: 9999}),
            valueContainer:
                            /**
                             * Adds appropriate zIndex to the react select's base CSS
                             *
                             * @param {object} base - The current CSS
                             * @returns {object} New CSS with z-index added
                             */
                            (base) => ({
                              ...base,
                              fontSize: '14px',
                              fontWeight: 400,
                            }),
            }}
            placeholder={placeholder}
          />
        </label>
        :
        <Select options={groups} onChange={selected}
          menuPortalTarget={document.body}
          styles={{menuPortal:
                      /**
                       * Add a z-index to ensure the element stays visible
                       *
                       * @param {object} base - the base CSS
                       * @returns {object} - the new CSS with z-index added
                       */
                      (base) => ({...base, zIndex: 9999})}
          }
          placeholder={placeholder}
        />
      }
    </div>
  );
}

export default FilterableSelectGroup;

