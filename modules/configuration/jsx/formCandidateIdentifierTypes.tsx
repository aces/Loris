import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  withTranslation,
  WithTranslation,
} from 'react-i18next';

import i18n from 'I18nSetup';
import Loader from 'Loader';
import {TabPane, VerticalTabs} from 'Tabs';
import {
  FormElement,
  TextboxElement,
  SelectElement,
  CheckboxElement,
  ButtonElement,
} from 'jsx/Form';

import StudyEntitiesClient from './StudyEntitiesClient';

import jaStrings from '../locale/ja/LC_MESSAGES/configuration.json';
import frStrings from '../locale/fr/LC_MESSAGES/configuration.json';
import zhStrings from '../locale/zh/LC_MESSAGES/configuration.json';

declare const loris: {BaseURL: string};

type IdentifierType = {
  candidateIdentifierTypeID: number,
  name: string,
  format: string,
  isRequired: boolean,
  isUnique: boolean,
  autoGenerate: boolean,
  allowMultiple: boolean,
  projectIDs: string[],
};

type IdentifierTypeData = {
  identifierTypes: Record<string, IdentifierType>,
  projects: Record<string, string>,
};

type IdentifierTypeValues = {
  name: string,
  format: string,
  isRequired: boolean,
  isUnique: boolean,
  autoGenerate: boolean,
  allowMultiple: boolean,
  projectIDs: string[],
};

type SaveStatus = {
  message: string,
  type: 'error' | 'success',
} | null;

type IdentifierTypeManagerProps = {
  data: IdentifierTypeData,
  t: WithTranslation['t'],
};

type IdentifierTypeFormProps = {
  identifierType: IdentifierType,
  identifierTypeID: string,
  isNew: boolean,
  projects: Record<string, string>,
  onSaved: (id: string, values: IdentifierTypeValues) => void,
  t: WithTranslation['t'],
};

const EMPTY_IDENTIFIER_TYPE: IdentifierType = {
  candidateIdentifierTypeID: 0,
  name: '',
  format: '',
  isRequired: false,
  isUnique: false,
  autoGenerate: false,
  allowMultiple: false,
  projectIDs: [],
};

/**
 * Convert server data into controlled form values.
 *
 * @param {IdentifierType} identifierType Identifier type
 * @return {IdentifierTypeValues}
 */
function formValues(
  identifierType: IdentifierType
): IdentifierTypeValues {
  return {
    name: identifierType.name,
    format: identifierType.format,
    isRequired: identifierType.isRequired,
    isUnique: identifierType.isUnique,
    autoGenerate: identifierType.autoGenerate,
    allowMultiple: identifierType.allowMultiple,
    projectIDs: identifierType.projectIDs.map(String),
  };
}

/**
 * Create or edit one candidate identifier type.
 *
 * @param {IdentifierTypeFormProps} props Form properties
 * @return {React.ReactElement}
 */
function IdentifierTypeForm(
  props: IdentifierTypeFormProps
): React.ReactElement {
  const [defaults, setDefaults] = useState(
    () => formValues(props.identifierType)
  );
  const [values, setValues] = useState<IdentifierTypeValues>(defaults);
  const [status, setStatus] = useState<SaveStatus>(null);
  const [saving, setSaving] = useState(false);

  /**
   * Update one controlled form field.
   *
   * @param {string} name Field name
   * @param {string|string[]|boolean} value New value
   */
  const updateValue = (
    name: string,
    value: string | string[] | boolean
  ) => {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
    setStatus(null);
  };

  /**
   * Validate required fields.
   *
   * @return {string|null} Error message or null
   */
  const validationError = (): string | null => {
    if (!values.name.trim()) {
      return props.t(
        'Failed to save, must enter an identifier type name!',
        {ns: 'configuration'}
      );
    }

    if (!values.format.trim()) {
      return props.t(
        'Failed to save, must enter an identifier format!',
        {ns: 'configuration'}
      );
    }

    return null;
  };

  /**
   * Submit the form to the existing AJAX endpoint.
   *
   * @param {React.SyntheticEvent} event Submit event
   */
  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const error = validationError();

    if (error !== null) {
      setStatus({
        message: error,
        type: 'error',
      });
      return;
    }

    setSaving(true);
    setStatus(null);

    const body = new URLSearchParams({
      CandidateIdentifierTypeID: props.identifierTypeID,
      Name: values.name.trim(),
      Format: values.format.trim(),
      IsRequired: values.isRequired ? '1' : '0',
      IsUnique: values.isUnique ? '1' : '0',
      AutoGenerate: values.autoGenerate ? '1' : '0',
      AllowMultiple: values.allowMultiple ? '1' : '0',
    });

    values.projectIDs.forEach((projectID) => {
      body.append('ProjectIDs[]', projectID);
    });

    try {
      await new StudyEntitiesClient('configuration').save(
        `${loris.BaseURL}/configuration/ajax/updateCandidateIdentifierType.php`,
        body
      );

      setDefaults({...values});

      setStatus({
        message: props.t(
          'Successfully saved',
          {ns: 'configuration'}
        ),
        type: 'success',
      });

      if (props.isNew) {
        window.setTimeout(() => window.location.reload(), 1000);
      } else {
        props.onSaved(props.identifierTypeID, values);
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error
          ? error.message
          : props.t(
            'Failed to save candidate identifier type.',
            {ns: 'configuration'}
          ),
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldPrefix = props.isNew
    ? 'new-identifier-type'
    : `identifier-type-${props.identifierTypeID}`;

  return (
    <FormElement
      name={fieldPrefix}
      id={`form-${fieldPrefix}`}
      onSubmit={submit}
    >
      <fieldset>
        <input
          name="CandidateIdentifierTypeID"
          type="hidden"
          value={props.identifierTypeID}
        />

        <div title={props.t(
          'Identifier name, e.g. PSCID or ExternalID',
          {ns: 'configuration'}
        )}>
          <TextboxElement
            label={props.t('Name', {ns: 'configuration'})}
            id={`${fieldPrefix}-name`}
            name="name"
            value={values.name}
            onUserInput={updateValue}
          />
        </div>

        <div title={props.t(
          'Template used to generate or validate identifier values.',
          {ns: 'configuration'}
        )}>
          <TextboxElement
            label={props.t('Format', {ns: 'configuration'})}
            id={`${fieldPrefix}-format`}
            name="format"
            value={values.format}
            onUserInput={updateValue}
          />
        </div>

        <div title={props.t(
          'Whether candidates using this identifier type must have at least'
          + ' one value',
          {ns: 'configuration'}
        )}>
          <CheckboxElement
            label={props.t('Required', {ns: 'configuration'})}
            id={`${fieldPrefix}-required`}
            name="isRequired"
            value={values.isRequired}
            onUserInput={updateValue}
          />
        </div>

        <div title={props.t(
          'Whether identifier values must be unique across candidates',
          {ns: 'configuration'}
        )}>
          <CheckboxElement
            label={props.t('Unique', {ns: 'configuration'})}
            id={`${fieldPrefix}-unique`}
            name="isUnique"
            value={values.isUnique}
            onUserInput={updateValue}
          />
        </div>

        <div title={props.t(
          'Whether LORIS generates the value automatically from the format',
          {ns: 'configuration'}
        )}>
          <CheckboxElement
            label={props.t('Auto Generate', {ns: 'configuration'})}
            id={`${fieldPrefix}-auto-generate`}
            name="autoGenerate"
            value={values.autoGenerate}
            onUserInput={updateValue}
          />
        </div>

        <div title={props.t(
          'Whether a candidate can have more than one value of this type',
          {ns: 'configuration'}
        )}>
          <CheckboxElement
            label={props.t('Allow Multiple', {ns: 'configuration'})}
            id={`${fieldPrefix}-allow-multiple`}
            name="allowMultiple"
            value={values.allowMultiple}
            onUserInput={updateValue}
          />
        </div>

        <div title={props.t(
          'Projects in which this identifier type can be used. An identifier'
          + ' type can be associated with multiple projects.',
          {ns: 'configuration'}
        )}>
          <SelectElement
            label={props.t('Projects', {ns: 'configuration'})}
            id={`${fieldPrefix}-projects`}
            name="projectIDs"
            multiple={true}
            value={values.projectIDs}
            onUserInput={updateValue}
            options={props.projects}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
          />
        </div>

        <ButtonElement
          label={props.t('Save', {ns: 'loris'})}
          disabled={saving}
          id={`save-identifier-type-${props.identifierTypeID}`}
          type="submit"
          onUserInput={submit}
        />

        <ButtonElement
          label={props.t('Reset', {ns: 'loris'})}
          buttonClass="btn btn-default"
          type="button"
          onUserInput={() => {
            setValues({...defaults});
            setStatus(null);
          }}
        />

        {status && (
          <div className="col-sm-offset-3 col-sm-9">
            <label
              className={
                status.type === 'success'
                  ? 'text-success'
                  : 'text-danger'
              }
            >
              {status.message}
            </label>
          </div>
        )}
      </fieldset>
    </FormElement>
  );
}

/**
 * React candidate identifier type manager.
 *
 * @param {IdentifierTypeManagerProps} props Page properties
 * @return {React.ReactElement}
 */
function IdentifierTypeManager(
  props: IdentifierTypeManagerProps
): React.ReactElement {
  const [identifierTypes, setIdentifierTypes] = useState(
    props.data.identifierTypes
  );

  /**
   * Update the displayed name after saving.
   *
   * @param {string} id Identifier type ID
   * @param {IdentifierTypeValues} values Updated form values
   */
  const updateIdentifierType = (
    id: string,
    values: IdentifierTypeValues
  ) => {
    setIdentifierTypes((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...values,
      },
    }));
  };

  return (
    <>
      <p>
        {props.t(
          'Use this page to manage the configuration of existing candidate'
          + ' identifier types, or to add a new one.',
          {ns: 'configuration'}
        )}
      </p>

      <VerticalTabs
        tabs={[
          {
            id: 'identifier-type-new',
            label: props.t(
              'New Identifier Type',
              {ns: 'configuration'}
            ),
          },
          ...Object.entries(identifierTypes).map(([id, identifierType]) => ({
            id: `identifier-type-${id}`,
            label: identifierType.name,
          })),
        ]}
        defaultTab="identifier-type-new"
        updateURL={false}
      >
        {Object.entries(identifierTypes).map(([id, identifierType]) => (
          <TabPane
            TabId={`identifier-type-${id}`}
            key={id}
          >
            <h2>
              {identifierType.name} (ID: {id})
            </h2>
            <br/>

            <IdentifierTypeForm
              identifierType={identifierType}
              identifierTypeID={id}
              isNew={false}
              projects={props.data.projects}
              onSaved={updateIdentifierType}
              t={props.t}
            />
          </TabPane>
        ))}

        <TabPane TabId="identifier-type-new">
          <h2>
            {props.t(
              'New Identifier Type',
              {ns: 'configuration'}
            )}
          </h2>
          <br/>

          <IdentifierTypeForm
            identifierType={EMPTY_IDENTIFIER_TYPE}
            identifierTypeID="new"
            isNew={true}
            projects={props.data.projects}
            onSaved={() => undefined}
            t={props.t}
          />
        </TabPane>
      </VerticalTabs>
    </>
  );
}

/**
 * Load identifier type data and render the manager.
 *
 * @param {WithTranslation} props Translation properties
 * @return {React.ReactElement}
 */
function IdentifierTypePage(
  props: WithTranslation
): React.ReactElement {
  const [data, setData] = useState<IdentifierTypeData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dataURL = new URL(window.location.href);
    dataURL.searchParams.set('format', 'json');

    new StudyEntitiesClient<IdentifierTypeData>('configuration')
      .getById(dataURL.toString())
      .then((responseData: IdentifierTypeData) => {
        setData(responseData);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <h3>
        {props.t(
          'An error occurred while loading the page.',
          {ns: 'loris'}
        )}
      </h3>
    );
  }

  if (data === null) {
    return <Loader/>;
  }

  return (
    <IdentifierTypeManager
      data={data}
      t={props.t}
    />
  );
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'configuration', jaStrings);
  i18n.addResourceBundle('fr', 'configuration', frStrings);
  i18n.addResourceBundle('zh', 'configuration', zhStrings);

  const workspace = document.getElementById('lorisworkspace');

  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }

  const Page = withTranslation(
    ['configuration', 'loris']
  )(IdentifierTypePage);

  createRoot(workspace).render(<Page/>);
});

export default withTranslation(
  ['configuration', 'loris']
)(IdentifierTypePage);
