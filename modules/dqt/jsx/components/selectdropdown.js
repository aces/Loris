import React, {useState} from 'react';

const SelectDropdown = (props) => {
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen((open) => !open);
  };

  const toggleCheckbox = (key) => {
    if (props.multi) {
      const action = (props.options[key]) ? 'uncheck' : 'check';
      props.onFieldClick(key, action);
    } else {
      props.onFieldClick(key);
      toggleDropdown();
    }
  };

  const selectAll = () => {
    for (let option in props.options) {
      if (props.options.hasOwnProperty(option)) {
        if (!props.options[option]) {
          props.onFieldClick(option, 'check');
        }
      }
    }
  };

  const deselectAll = () => {
    for (let option in props.options) {
      if (props.options.hasOwnProperty(option)) {
        if (props.options[option]) {
          props.onFieldClick(option, 'uncheck');
        }
      }
    }
  };

  const updateFilter = (filter) => {
    setFilter(filter);
  };

  let parentDivClass = 'btn-group col-xs-12';
  let selectLabel = 'Visits Selected';
  let selectCount = 0;
  let sizeCount = 0;
  let selectOptions = [];
  let key = '';
  let Filter = '';

  if (open) {
    parentDivClass += ' open';
  }
  if (props.multi) {
    for (key in props.options) {
      // Make sure inherited properties are not checked
      // See http://eslint.org/docs/rules/guard-for-in
      if ({}.hasOwnProperty.call(props.options, key)) {
        sizeCount++;
        selectOptions.push(
          <SelectField
            key={key}
            label={key}
            checked={props.options[key]}
            toggleCheckbox={toggleCheckbox}
            multi={props.multi}
          />
        );
        if (props.options[key]) {
          selectCount++;
        }
      }
    }
    if (selectCount === sizeCount) {
      selectOptions.unshift(
        <SelectField
          key="selectAll"
          label="Select All"
          checked={true}
          toggleCheckbox={deselectAll}
          multi={props.multi}
        />
      );
    } else {
      selectOptions.unshift(
        <SelectField
          key="selectAll"
          label="Select All"
          checked={false}
          toggleCheckbox={selectAll}
          multi={props.multi}
        />
      );
    }
    if (selectCount > 0) {
      selectLabel = selectCount + ' Selected';
    }
  } else {
    for (key in props.options) {
      // Make sure inherited properties are not checked
      // See http://eslint.org/docs/rules/guard-for-in
      if ({}.hasOwnProperty.call(props.options, key)) {
        Filter = filter.toLowerCase();
        if (key.toLowerCase().indexOf(Filter) === -1 &&
          props.options[key].toLowerCase().indexOf(Filter)) {
          continue;
        }
        selectOptions.push(
          <SelectField
            key={key}
            label={props.options[key]}
            checked={props.options[key]}
            toggleCheckbox={toggleCheckbox}
            multi={props.multi}
          />
        );
      }
    }
    selectOptions.unshift(
      <SearchField
        updateFilter={updateFilter}
        filter={filter}
      />
    );
    selectLabel = props.selectedCategory === ''
      ? 'Select One'
      : props.selectedCategory;
  }
  return (
    <div className={parentDivClass}>
      <button type='button'
              className='btn btn-default dropdown-toggle'
              onClick={toggleDropdown}>
        <span className='pull-left'>
          {selectLabel}
        </span>
        <span className='pull-right'>
          <span className='glyphicon glyphicon-menu-down'/>
        </span>
      </button>
      <ul className='dropdown-menu'>
        {selectOptions}
      </ul>
    </div>
  );
};

export default SelectDropdown;
