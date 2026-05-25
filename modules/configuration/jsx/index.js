import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {
  EmailElement,
  RadioElement,
  SelectElement,
  TextareaElement,
  TextboxElement,
} from 'jsx/Form';

const DATA_TYPE_OPTIONS = {
  date_format: 'dateFormat',
  instrument: 'instruments',
  log_level: 'logLevels',
  lookup_center: 'lookupCenter',
  scan_type: 'scanTypes',
};

/**
 * Intro text for the configuration page.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function IntroText(props) {
  return (
    <div>
      <p>
        Please enter the various configuration variables into the fields below.
        For information on how to configure LORIS, please refer to the Help
        section and/or the Developer&apos;s guide.
      </p>
      <p>
        To configure study cohorts&nbsp;
        <a href={`${props.baseURL}/configuration/cohort/`}>click here</a>.
        &nbsp;To configure study projects&nbsp;
        <a href={`${props.baseURL}/configuration/project/`}>click here</a>.
      </p>
      <p>
        To configure the diagnosis trajectory of the study&nbsp;
        <a href={`${props.baseURL}/configuration/diagnosis_evolution/`}>
          click here
        </a>.
      </p>
    </div>
  );
}

IntroText.propTypes = {
  baseURL: PropTypes.string.isRequired,
};

/**
 * Category navigation.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function CategorySelection(props) {
  const categories = props.categories.map((item) => (
    <li
      key={item.Name}
      className={item.Name === props.active ? 'active' : ''}
    >
      <a
        href={`#${item.Name}`}
        onClick={(e) => {
          e.preventDefault();
          props.setActive(item.Name);
        }}
      >
        {item.Label}
      </a>
    </li>
  ));

  return (
    <div className="col-md-3">
      <ul className="nav nav-pills nav-stacked" role="tablist">
        {categories}
      </ul>
    </div>
  );
}

CategorySelection.propTypes = {
  active: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  setActive: PropTypes.func.isRequired,
};

/**
 * Render the development-only config name.
 *
 * @param {object} props React props
 * @return {?JSX}
 */
function DevName(props) {
  if (!props.enabled) {
    return null;
  }
  return <div className="config-dev-name pull-right"><i>{props.name}</i></div>;
}

DevName.propTypes = {
  enabled: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

/**
 * Category body.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function CategoryDisplay(props) {
  const rows = props.items.map((item) => (
    <ItemDisplay
      key={item.ID}
      baseURL={props.baseURL}
      item={item}
      options={props.options}
      reloadCategory={props.reloadCategory}
    />
  ));

  return <div className="col-md-9">{rows}</div>;
}

CategoryDisplay.propTypes = {
  baseURL: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  reloadCategory: PropTypes.func.isRequired,
};

/**
 * Single configuration setting.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function ItemDisplay(props) {
  const item = props.item;
  if (item.AllowMultiple) {
    return (
      <MultiValueInput
        baseURL={props.baseURL}
        item={item}
        options={props.options}
        reloadCategory={props.reloadCategory}
      />
    );
  }

  return (
    <div title={item.Description}>
      <SingleValueInput
        baseURL={props.baseURL}
        item={item}
        options={props.options}
        reloadCategory={props.reloadCategory}
      />
      <DevName enabled={props.options.sandbox} name={item.Name} />
    </div>
  );
}

ItemDisplay.propTypes = {
  baseURL: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  reloadCategory: PropTypes.func.isRequired,
};

/**
 * Single-value configuration input.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function SingleValueInput(props) {
  const [value, setValue] = useState(props.item.Value);

  useEffect(() => {
    setValue(props.item.Value);
  }, [props.item.Value]);

  const saveChange = (newValue) => {
    if (newValue === props.item.Value) {
      return;
    }
    saveSetting(props.baseURL, props.item.Name, {value: newValue})
      .then(() => props.reloadCategory())
      .catch(showSaveError);
  };

  return renderInput({
    dataType: props.item.DataType,
    disabled: props.item.Disabled,
    label: props.item.Label,
    name: props.item.Name,
    onChange: (newValue) => {
      setValue(newValue);
    },
    onCommit: saveChange,
    options: props.options,
    value: value,
  });
}

SingleValueInput.propTypes = {
  baseURL: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  reloadCategory: PropTypes.func.isRequired,
};

/**
 * Multi-value configuration input.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function MultiValueInput(props) {
  const values = Array.isArray(props.item.Value) ? props.item.Value : [];
  const [isAdding, setIsAdding] = useState(false);

  const saveValues = (newValues) => {
    saveSetting(props.baseURL, props.item.Name, {values: newValues})
      .then(() => {
        setIsAdding(false);
        props.reloadCategory();
      })
      .catch(showSaveError);
  };

  const rows = values.map((value, idx) => (
    <MultiValueRow
      dataType={props.item.DataType}
      disabled={props.item.Disabled}
      key={`${props.item.Name}-${idx}`}
      name={props.item.Name}
      onRemove={() => saveValues(values.filter((el, i) => i !== idx))}
      onSave={(newValue) => {
        const newValues = [...values];
        newValues[idx] = newValue;
        saveValues(newValues);
      }}
      options={props.options}
      value={value}
    />
  ));

  if (isAdding) {
    rows.push(
      <MultiValueRow
        dataType={props.item.DataType}
        disabled={props.item.Disabled}
        key={`${props.item.Name}-new`}
        name={props.item.Name}
        onRemove={() => setIsAdding(false)}
        onSave={(newValue) => saveValues([...values, newValue])}
        options={props.options}
        value=""
      />
    );
  }

  return (
    <div className="form-group" title={props.item.Description}>
      <div className="col-sm-3">
        <label className="col-sm-12 control-label config-name">
          {props.item.Label}
        </label>
        <DevName enabled={props.options.sandbox} name={props.item.Name} />
      </div>
      <div className="col-sm-9">
        {rows}
        {!isAdding && (
          <button
            className="btn btn-success add"
            disabled={props.item.Disabled}
            onClick={() => setIsAdding(true)}
            type="button"
          >
            <span className="glyphicon glyphicon-plus"></span> Add field
          </button>
        )}
      </div>
    </div>
  );
}

MultiValueInput.propTypes = {
  baseURL: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  reloadCategory: PropTypes.func.isRequired,
};

/**
 * One row in a multi-value input.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function MultiValueRow(props) {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div className="input-group entry">
      {renderInput({
        dataType: props.dataType,
        disabled: props.disabled,
        label: '',
        name: props.name,
        onChange: setValue,
        onCommit: props.onSave,
        options: props.options,
        value: value,
      })}
      <div className="input-group-btn">
        <button
          className="btn btn-danger btn-remove"
          disabled={props.disabled}
          onClick={props.onRemove}
          type="button"
        >
          <span className="glyphicon glyphicon-remove"></span>&nbsp;
        </button>
      </div>
    </div>
  );
}

MultiValueRow.propTypes = {
  dataType: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.string,
};

MultiValueRow.defaultProps = {
  value: '',
};

/**
 * Render the proper form element for a config data type.
 *
 * @param {object} config Render config
 * @return {JSX}
 */
function renderInput(config) {
  switch (config.dataType) {
  case 'boolean':
    return (
      <RadioElement
        checked={booleanRadioValue(config.value)}
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        onUserInput={(name, value) => config.onCommit(value)}
        options={booleanRadioOptions(config.value)}
      />
    );
  case 'date_format':
  case 'instrument':
  case 'log_level':
  case 'lookup_center':
  case 'scan_type':
    return (
      <SelectElement
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        onUserInput={(name, value) => config.onCommit(value)}
        options={config.options[DATA_TYPE_OPTIONS[config.dataType]]}
        value={config.value}
      />
    );
  case 'email':
    return (
      <EmailElement
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        onUserBlur={(name, value) => config.onCommit(value)}
        onUserInput={(name, value) => config.onChange(value)}
        value={config.value}
      />
    );
  case 'textarea':
    return (
      <TextareaElement
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        onUserBlur={(name, value) => config.onCommit(value)}
        onUserInput={(name, value) => config.onChange(value)}
        value={config.value}
      />
    );
  case 'path':
  case 'text':
  case 'web_path':
    return (
      <TextboxElement
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        onUserBlur={(name, value) => config.onCommit(value)}
        onUserInput={(name, value) => config.onChange(value)}
        value={config.value}
      />
    );
  default:
    return (
      <div className="text-danger">Unsupported type {config.dataType}</div>
    );
  }
}

/**
 * Return the radio value matching the stored boolean representation.
 *
 * @param {*} value Stored boolean value
 * @return {string}
 */
function booleanRadioValue(value) {
  if (value === '1' || value === 1) {
    return '1';
  }
  if (value === '0' || value === 0) {
    return '0';
  }
  if (value === true || value === 'true') {
    return 'true';
  }
  return 'false';
}

/**
 * Preserve legacy 1/0 boolean storage when a setting already uses it.
 *
 * @param {*} value Stored boolean value
 * @return {object}
 */
function booleanRadioOptions(value) {
  if (value === '1' || value === '0' || value === 1 || value === 0) {
    return {'1': 'Yes', '0': 'No'};
  }
  return {'true': 'Yes', 'false': 'No'};
}

/**
 * Save a configuration setting.
 *
 * @param {string} baseURL LORIS base URL
 * @param {string} setting Setting name
 * @param {object} payload JSON payload
 * @return {Promise<void>}
 */
function saveSetting(baseURL, setting, payload) {
  return fetch(`${baseURL}/configuration/setting/${setting}`, {
    body: JSON.stringify({
      setting: setting,
      ...payload,
    }),
    credentials: 'same-origin',
    method: 'PUT',
  }).then((resp) => {
    if (!resp.ok) {
      throw new Error(`Could not save ${setting}`);
    }
    return resp.json();
  }).then(() => {
    swal.fire('Success!', `Successfully saved ${setting}`, 'success');
  });
}

/**
 * Show save errors consistently.
 *
 * @param {Error} error Error object
 * @return {void}
 */
function showSaveError(error) {
  swal.fire('Error', error.toString(), 'error');
}

/**
 * Entrypoint for the configuration module.
 *
 * @param {object} props React props
 * @return {JSX}
 */
function ConfigurationIndex(props) {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [options, setOptions] = useState({
    dateFormat: {},
    instruments: {},
    logLevels: {},
    lookupCenter: {},
    sandbox: false,
    scanTypes: {},
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    fetch(`${props.baseURL}/configuration/categories`, {
      credentials: 'same-origin',
    }).then((resp) => {
      if (!resp.ok) {
        throw new Error('Could not retrieve configuration categories');
      }
      return resp.json();
    }).then((data) => {
      setCategories(data.categories);
      setOptions({
        dateFormat: data.dateFormat,
        instruments: data.instruments,
        logLevels: data.logLevels,
        lookupCenter: data.lookupCenter,
        sandbox: data.sandbox,
        scanTypes: data.scanTypes,
      });
      if (data.categories.length > 0) {
        setActiveCategory(data.categories[0].Name);
      }
    }).catch((error) => {
      showSaveError(error);
    });
  }, [props.baseURL]);

  useEffect(() => {
    if (activeCategory === '') {
      return;
    }
    fetch(`${props.baseURL}/configuration/categories/${activeCategory}`, {
      credentials: 'same-origin',
    }).then((resp) => {
      if (!resp.ok) {
        throw new Error(`Could not retrieve category ${activeCategory}`);
      }
      return resp.json();
    }).then((data) => {
      setCategoryItems(data.category);
    }).catch((error) => {
      showSaveError(error);
    });
  }, [activeCategory, props.baseURL, reloadKey]);

  return (
    <div>
      <IntroText baseURL={props.baseURL} />
      <div className="row">
        <CategorySelection
          active={activeCategory}
          categories={categories}
          setActive={setActiveCategory}
        />
        <CategoryDisplay
          baseURL={props.baseURL}
          items={categoryItems}
          options={options}
          reloadCategory={() => setReloadKey(reloadKey + 1)}
        />
      </div>
    </div>
  );
}

ConfigurationIndex.propTypes = {
  baseURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  const root = createRoot(document.getElementById('lorisworkspace'));
  root.render(<ConfigurationIndex baseURL={loris.BaseURL} />);
});
