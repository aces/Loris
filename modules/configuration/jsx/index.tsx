import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import swal from 'sweetalert2';
import {
  EmailElement,
  RadioElement,
  SelectElement,
  TextareaElement,
  TextboxElement,
} from 'jsx/Form';

declare const loris: {BaseURL: string};

type ConfigOptionMap = Record<string, string>;
type ConfigOptionKey = 'dateFormat'
  | 'instruments'
  | 'logLevels'
  | 'lookupCenter'
  | 'scanTypes';

const DATA_TYPE_OPTIONS: Record<string, ConfigOptionKey> = {
  date_format: 'dateFormat',
  instrument: 'instruments',
  log_level: 'logLevels',
  lookup_center: 'lookupCenter',
  scan_type: 'scanTypes',
};

type ConfigValue = string | number | boolean | string[] | null;

type ConfigCategory = {
  Name: string,
  Label: string,
};

type ConfigItem = {
  ID: string | number,
  Name: string,
  Label: string,
  Description: string,
  Value: ConfigValue,
  DataType: string,
  Disabled: boolean,
  AllowMultiple: boolean,
};

type ConfigOptions = {
  dateFormat: ConfigOptionMap,
  instruments: ConfigOptionMap,
  logLevels: ConfigOptionMap,
  lookupCenter: ConfigOptionMap,
  sandbox: boolean,
  scanTypes: ConfigOptionMap,
};

type CategoriesResponse = ConfigOptions & {
  categories: ConfigCategory[],
};

type CategoryResponse = {
  category: ConfigItem[],
};

type ReloadCategory = () => void;

type BaseURLProps = {
  baseURL: string,
};

type CategorySelectionProps = {
  active: string,
  categories: ConfigCategory[],
  setActive: (category: string) => void,
};

type DevNameProps = {
  enabled: boolean,
  name: string,
};

type SettingLabelProps = {
  item: ConfigItem,
  options: ConfigOptions,
};

type CategoryDisplayProps = BaseURLProps & {
  items: ConfigItem[],
  options: ConfigOptions,
  reloadCategory: ReloadCategory,
};

type ItemDisplayProps = {
  item: ConfigItem,
  onChange: (item: ConfigItem, value: ConfigValue) => void,
  options: ConfigOptions,
  value: ConfigValue,
};

type MultiValueRowProps = {
  dataType: string,
  disabled: boolean,
  name: string,
  onRemove: () => void,
  onChange: (newValue: string) => void,
  options: ConfigOptions,
  value?: string,
};

type RenderInputConfig = {
  dataType: string,
  disabled: boolean,
  label: React.ReactNode,
  name: string,
  noMargins?: boolean,
  onChange: (value: ConfigValue) => void,
  options: ConfigOptions,
  value: ConfigValue,
};

/**
 * Links to related study configuration pages and LORIS configuration docs.
 *
 * @param {BaseURLProps} props React props
 * @return {JSX}
 */
function IntroText(props: BaseURLProps): React.ReactElement {
  return (
    <div>
      <p>
        Please enter the various configuration variables into the fields below.
        For information on how to configure LORIS, please refer to the Help
        section and/or the Developer's guide.
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

/**
 * Category navigation.
 *
 * @param {CategorySelectionProps} props React props
 * @return {JSX}
 */
function CategorySelection(
  props: CategorySelectionProps
): React.ReactElement {
  const categories = props.categories.map((item) => (
    <li
      key={item.Name}
      className={item.Name === props.active ? 'active' : ''}
    >
      <a
        href={`#${item.Name}`}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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

/**
 * Render the development-only config name.
 *
 * @param {DevNameProps} props React props
 * @return {?JSX}
 */
function DevName(props: DevNameProps): React.ReactElement | null {
  if (!props.enabled) {
    return null;
  }
  return <div className="config-dev-name"><i>{props.name}</i></div>;
}

/**
 * User-facing label plus the development config key in sandbox mode.
 *
 * @param {SettingLabelProps} props React props
 * @return {JSX}
 */
function SettingLabel(
  props: SettingLabelProps
): React.ReactElement {
  return (
    <>
      {props.item.Label}
      <DevName enabled={props.options.sandbox} name={props.item.Name} />
    </>
  );
}

/**
 * Convert a config value into a stable comparison key.
 *
 * @param {ConfigValue} value Config value
 * @return {string}
 */
function valueKey(value: ConfigValue): string {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map(String));
  }
  return String(value ?? '');
}

/**
 * Return the save payload for a configuration item.
 *
 * @param {ConfigItem} item Configuration item
 * @param {ConfigValue} value Draft value
 * @return {object}
 */
function settingPayload(
  item: ConfigItem,
  value: ConfigValue
): Record<string, unknown> {
  if (item.AllowMultiple) {
    return {values: Array.isArray(value) ? value.map(String) : []};
  }
  return {value: String(value ?? '')};
}

/**
 * Interpret the stored boolean value for radio rendering.
 *
 * @param {ConfigValue} value Config value
 * @return {boolean}
 */
function booleanValue(value: ConfigValue): boolean {
  return value === true || value === 1 || value === '1' || value === 'true';
}

/**
 * Category body.
 *
 * @param {CategoryDisplayProps} props React props
 * @return {JSX}
 */
function CategoryDisplay(props: CategoryDisplayProps): React.ReactElement {
  /**
   * Build draft values from the loaded category items.
   *
   * @return {object}
   */
  const initialDrafts = () => Object.fromEntries(
    props.items.map((item) => [item.Name, item.Value])
  ) as Record<string, ConfigValue>;
  const [drafts, setDrafts] = useState<Record<string, ConfigValue>>(
    initialDrafts
  );
  const [changed, setChanged] = useState<Record<string, true>>({});

  useEffect(() => {
    setDrafts(initialDrafts());
    setChanged({});
  }, [props.items]);

  const itemByName = Object.fromEntries(
    props.items.map((item) => [item.Name, item])
  ) as Record<string, ConfigItem>;
  const changedNames = Object.keys(changed);

  /**
   * Update the local draft value for an item.
   *
   * @param {ConfigItem} item Configuration item
   * @param {ConfigValue} value Draft value
   */
  const updateDraft = (item: ConfigItem, value: ConfigValue) => {
    setDrafts((current) => ({
      ...current,
      [item.Name]: value,
    }));
    setChanged((current) => {
      const next = {...current};
      if (valueKey(value) === valueKey(item.Value)) {
        delete next[item.Name];
      } else {
        next[item.Name] = true;
      }
      return next;
    });
  };

  /**
   * Save all modified settings in the active category.
   */
  const saveChanges = () => {
    Promise.all(changedNames.map((name) => {
      const item = itemByName[name];
      return saveSetting(
        props.baseURL,
        name,
        settingPayload(item, drafts[name])
      );
    })).then(() => {
      const labels = changedNames
        .map((name) => itemByName[name]?.Label ?? name)
        .join(', ');
      void swal.fire('Success!', `Successfully saved ${labels}`, 'success');
      props.reloadCategory();
    }).catch(showSaveError);
  };

  const rows = props.items.map((item) => (
    <ItemDisplay
      key={item.ID}
      item={item}
      onChange={updateDraft}
      options={props.options}
      value={drafts[item.Name] ?? item.Value}
    />
  ));

  return (
    <div className="col-md-9">
      {rows}
      <div className="row submit-area">
        <div className="col-sm-offset-3 col-sm-9 btn-container">
          <button
            className="btn btn-primary"
            disabled={changedNames.length === 0}
            onClick={saveChanges}
            type="button"
          >
            Submit
          </button>
          <button
            className="btn btn-default"
            disabled={changedNames.length === 0}
            onClick={() => {
              setDrafts(initialDrafts());
              setChanged({});
            }}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Single configuration setting.
 *
 * @param {ItemDisplayProps} props React props
 * @return {JSX}
 */
function ItemDisplay(props: ItemDisplayProps): React.ReactElement {
  const item = props.item;
  if (item.AllowMultiple) {
    return (
      <MultiValueInput
        item={item}
        onChange={props.onChange}
        options={props.options}
        value={props.value}
      />
    );
  }

  return (
    <div title={item.Description}>
      <SingleValueInput
        item={item}
        onChange={props.onChange}
        options={props.options}
        value={props.value}
      />
    </div>
  );
}

/**
 * Single-value configuration input.
 *
 * @param {ItemDisplayProps} props React props
 * @return {JSX}
 */
function SingleValueInput(props: ItemDisplayProps): React.ReactElement {
  /**
   * Update the draft value for this setting.
   *
   * @param {ConfigValue} value Draft value
   */
  const updateValue = (value: ConfigValue) => props.onChange(
    props.item,
    value
  );

  return renderInput({
    dataType: props.item.DataType,
    disabled: props.item.Disabled,
    label: <SettingLabel item={props.item} options={props.options} />,
    name: props.item.Name,
    onChange: updateValue,
    options: props.options,
    value: props.value,
  });
}

/**
 * Multi-value configuration input.
 *
 * @param {ItemDisplayProps} props React props
 * @return {JSX}
 */
function MultiValueInput(props: ItemDisplayProps): React.ReactElement {
  const values = Array.isArray(props.value) ? props.value.map(String) : [];

  /**
   * Update the draft values for this setting.
   *
   * @param {string[]} newValues Draft values
   */
  const setValues = (newValues: string[]) => props.onChange(
    props.item,
    newValues
  );

  const rows = values.map((value, idx) => (
    <MultiValueRow
      dataType={props.item.DataType}
      disabled={props.item.Disabled}
      key={`${props.item.Name}-${idx}`}
      name={props.item.Name}
      onRemove={() => setValues(values.filter((_el, i) => i !== idx))}
      onChange={(newValue) => {
        const newValues = [...values];
        newValues[idx] = newValue;
        setValues(newValues);
      }}
      options={props.options}
      value={value}
    />
  ));

  return (
    <div className="row form-group" title={props.item.Description}>
      <div className="col-sm-3">
        <label className="col-sm-12 control-label config-name">
          <SettingLabel item={props.item} options={props.options} />
        </label>
      </div>
      <div className="col-sm-9">
        {rows}
        <button
          className="btn btn-success add"
          disabled={props.item.Disabled}
          onClick={() => setValues([...values, ''])}
          type="button"
        >
          <span className="glyphicon glyphicon-plus"></span> Add field
        </button>
      </div>
    </div>
  );
}

/**
 * One row in a multi-value input.
 *
 * @param {MultiValueRowProps} props React props
 * @return {JSX}
 */
function MultiValueRow({
  dataType,
  disabled,
  name,
  onRemove,
  onChange,
  options,
  value: initialValue = '',
}: MultiValueRowProps): React.ReactElement {
  /**
   * Update the draft value for this row.
   *
   * @param {ConfigValue} newValue Draft value
   */
  const updateValue = (newValue: ConfigValue) => onChange(
    String(newValue ?? '')
  );

  return (
    <div className="input-group entry">
      {renderInput({
        dataType: dataType,
        disabled: disabled,
        label: '',
        name: name,
        noMargins: true,
        onChange: updateValue,
        options: options,
        value: initialValue,
      })}
      <div className="input-group-btn">
        <button
          className="btn btn-danger btn-remove"
          disabled={disabled}
          onClick={onRemove}
          type="button"
        >
          <span className="glyphicon glyphicon-remove"></span>&nbsp;
        </button>
      </div>
    </div>
  );
}

/**
 * Render the proper form element for a config data type.
 *
 * @param {RenderInputConfig} config Render config
 * @return {JSX}
 */
function renderInput(config: RenderInputConfig): React.ReactElement {
  const value = String(config.value ?? '');

  switch (config.dataType) {
  case 'boolean':
    return (
      <RadioElement
        checked={booleanValue(config.value) ? 'yes' : 'no'}
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        noMargins={config.noMargins}
        onUserInput={(_name: string, inputValue: string) => {
          config.onChange(inputValue === 'yes' ? 'true' : 'false');
        }}
        options={{'yes': 'Yes', 'no': 'No'}}
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
        noMargins={config.noMargins}
        onUserInput={(_name: string, inputValue: string) => {
          config.onChange(inputValue);
        }}
        options={config.options[DATA_TYPE_OPTIONS[config.dataType]]}
        value={value}
      />
    );
  case 'email':
    return (
      <EmailElement
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        noMargins={config.noMargins}
        onUserInput={(_name: string, inputValue: string) => {
          config.onChange(inputValue);
        }}
        value={value}
      />
    );
  case 'textarea':
    return (
      <TextareaElement
        disabled={config.disabled}
        label={config.label}
        name={config.name}
        noMargins={config.noMargins}
        onUserInput={(_name: string, inputValue: string) => {
          config.onChange(inputValue);
        }}
        value={value}
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
        noMargins={config.noMargins}
        onUserInput={(_name: string, inputValue: string) => {
          config.onChange(inputValue);
        }}
        value={value}
      />
    );
  default:
    return (
      <div className="text-danger">Unsupported type {config.dataType}</div>
    );
  }
}

/**
 * Save a configuration setting.
 *
 * @param {string} baseURL LORIS base URL
 * @param {string} setting Setting name
 * @param {object} payload JSON payload
 * @return {Promise<void>}
 */
function saveSetting(
  baseURL: string,
  setting: string,
  payload: Record<string, unknown>
): Promise<void> {
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
  });
}

/**
 * Show save errors consistently.
 *
 * @param {Error} error Error object
 * @return {void}
 */
function showSaveError(error: Error): void {
  void swal.fire('Error', error.toString(), 'error');
}

/**
 * Entrypoint for the configuration module.
 *
 * @param {BaseURLProps} props React props
 * @return {JSX}
 */
function ConfigurationIndex(props: BaseURLProps): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState<ConfigCategory[]>([]);
  const [categoryItems, setCategoryItems] = useState<ConfigItem[]>([]);
  const [options, setOptions] = useState<ConfigOptions>({
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
      return resp.json() as Promise<CategoriesResponse>;
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
      return resp.json() as Promise<CategoryResponse>;
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
          reloadCategory={() => setReloadKey((current) => current + 1)}
        />
      </div>
    </div>
  );
}

window.addEventListener('load', () => {
  const workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }
  const root = createRoot(workspace);
  root.render(<ConfigurationIndex baseURL={loris.BaseURL} />);
});
