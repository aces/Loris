import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {withTranslation, WithTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import Loader from 'Loader';
import {TabPane, VerticalTabs} from 'Tabs';
import {
  FormElement,
  TextboxElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';
import StudyEntitiesClient from './StudyEntitiesClient';

import jaStrings from '../locale/ja/LC_MESSAGES/configuration.json';
import zhStrings from '../locale/zh/LC_MESSAGES/configuration.json';

declare const loris: {BaseURL: string};

type Cohort = {
  RecruitmentTarget: null | number | string,
  id: number | string,
  options: {
    useEDC: number | string,
    WindowDifference: string,
  },
  title: string,
};

type CohortData = {
  cohorts: Record<string, Cohort>,
  useEDCOptions: Record<string, string>,
  windowDifferenceOptions: Record<string, string>,
};

type CohortValues = {
  RecruitmentTarget: string,
  title: string,
  useEDC: string,
  WindowDifference: string,
};

type SaveStatus = {
  message: string,
  type: 'error' | 'success',
} | null;

type CohortManagerProps = {
  data: CohortData,
  t: WithTranslation['t'],
};

type CohortFormProps = {
  cohort: Cohort,
  cohortID: string,
  isNew: boolean,
  onSaved: (cohortID: string, values: CohortValues) => void,
  t: WithTranslation['t'],
  useEDCOptions: Record<string, string>,
  windowDifferenceOptions: Record<string, string>,
};

const EMPTY_COHORT: Cohort = {
  RecruitmentTarget: '',
  id: 'new',
  options: {
    useEDC: '1',
    WindowDifference: 'battery',
  },
  title: '',
};

/**
 * Convert server data into controlled form values.
 *
 * @param {Cohort} cohort Cohort data
 * @return {CohortValues}
 */
function formValues(cohort: Cohort): CohortValues {
  return {
    RecruitmentTarget: cohort.RecruitmentTarget === null
      ? ''
      : String(cohort.RecruitmentTarget),
    title: cohort.title,
    useEDC: String(cohort.options.useEDC),
    WindowDifference: cohort.options.WindowDifference,
  };
}

/**
 * Create or edit one cohort through the established guarded endpoint.
 *
 * @param {CohortFormProps} props Form properties
 * @return {React.ReactElement}
 */
function CohortForm(props: CohortFormProps): React.ReactElement {
  const [defaults, setDefaults] = useState(() => formValues(props.cohort));
  const [values, setValues] = useState<CohortValues>(defaults);
  const [status, setStatus] = useState<SaveStatus>(null);
  const [saving, setSaving] = useState(false);

  /**
   * Update one controlled field and clear its prior save status.
   *
   * @param {string} name Field name
   * @param {string} value Field value
   */
  const updateValue = (name: string, value: string) => {
    setValues((current) => ({...current, [name]: value}));
    setStatus(null);
  };

  /**
   * Submit the cohort values to the existing update endpoint.
   *
   * @param {React.SyntheticEvent} event Submit event
   */
  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    const body = new URLSearchParams({
      cohortID: props.cohortID,
      RecruitmentTarget: values.RecruitmentTarget,
      title: values.title,
      useEDC: values.useEDC,
      WindowDifference: values.WindowDifference,
    });

    try {
      const responseData = await new StudyEntitiesClient('configuration').save(
        `${loris.BaseURL}/configuration/ajax/updateCohort.php`,
        body
      );

      setDefaults(values);
      setStatus({
        message: responseData.ok
          ?? props.t('Successfully saved', {ns: 'configuration'}),
        type: 'success',
      });
      if (props.isNew) {
        window.setTimeout(() => window.location.reload(), 1000);
      } else {
        props.onSaved(props.cohortID, values);
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error
          ? error.message
          : props.t('Failed to save', {ns: 'configuration'}),
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldPrefix = props.isNew ? 'new-cohort' : `cohort-${props.cohortID}`;

  return (
    <FormElement name={fieldPrefix} id={`form${fieldPrefix}`} onSubmit={submit}>
      <fieldset>
        <input
          className="cohortID"
          name="cohortID"
          type="hidden"
          value={props.cohortID}
        />
        {props.isNew && (
          <div className="alert alert-warning">
            <strong>{props.t('Note', {ns: 'loris'})}</strong>{' '}
            {props.t(
              'After adding a new cohort, Visit labels for this cohort can '
                + 'only be created by editing the configuration file, '
                + '"config.xml". Please contact your administrator if you '
                + 'need more information.',
              {ns: 'configuration'}
            )}
          </div>
        )}
        <div title={props.t(
          'Full descriptive title of the cohort',
          {ns: 'configuration'}
        )}>
          <TextboxElement
            label={props.t('Cohort Name', {ns: 'configuration'})}
            id={`${fieldPrefix}-title`}
            name="title"
            onUserInput={updateValue}
            placeholder={props.isNew
              ? props.t(
                'Please add a cohort title here',
                {ns: 'configuration'}
              )
              : undefined}
            value={values.title}
          />
        </div>
        <div title={props.t(
          'Include field for EDC (Expected Date of Confinement) in '
            + 'Candidate Parameters to record subject\'s due date if '
            + 'applicable',
          {ns: 'configuration'}
        )}>
          <SelectElement
            label={props.t('Use EDC', {ns: 'configuration'})}
            id={`${fieldPrefix}-use-edc`}
            name="useEDC"
            onUserInput={updateValue}
            value={values.useEDC}
            options={Object.fromEntries(Object.entries(props.useEDCOptions).map(
              ([value, label]) => [value, props.t(label, {ns: 'loris'})]
            ))}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
          />
        </div>
        <div title={props.t(
          'Choose a method by which Window Difference will be calculated. '
            + 'It will be displayed in days at the head of every '
            + 'instrument form',
          {ns: 'configuration'}
        )}>
          <SelectElement
            label={props.t(
              'Calculate Window Difference For Instruments Based On',
              {ns: 'configuration'}
            )}
            id={`${fieldPrefix}-window-difference`}
            name="WindowDifference"
            onUserInput={updateValue}
            value={values.WindowDifference}
            options={Object.fromEntries(
              Object.entries(props.windowDifferenceOptions).map(
                ([value, label]) => [
                  value, props.t(label, {ns: 'configuration'}),
                ]
              )
            )}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
          />
        </div>
        <div title={props.t(
          'The target number will be used to generate the recruitment '
            + 'progress bar on the dashboard',
          {ns: 'configuration'}
        )}>
          <TextboxElement
            label={props.t('Recruitment Target', {ns: 'configuration'})}
            id={`${fieldPrefix}-recruitment-target`}
            name="target"
            onUserInput={(_name, value) => updateValue(
              'RecruitmentTarget', value
            )}
            placeholder={props.t(
              'Please add a recruitment target here',
              {ns: 'configuration'}
            )}
            value={values.RecruitmentTarget}
          />
        </div>
        <ButtonElement
          label={props.t('Save', {ns: 'loris'})}
          disabled={saving}
          id={`savecohort${props.cohortID}`}
          type="submit"
          onUserInput={submit}
        />
        <ButtonElement
          label={props.t('Reset', {ns: 'loris'})}
          buttonClass="btn btn-default"
          onUserInput={() => {
            setValues(defaults);
            setStatus(null);
          }}
          type="button"
        />
        {status && (
          <div className="col-sm-offset-3 col-sm-9">
            <label
              className={
                status.type === 'success' ? 'text-success' : 'text-danger'
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
 * React cohort manager.
 *
 * @param {CohortManagerProps} props Page properties
 * @return {React.ReactElement}
 */
function CohortManager(props: CohortManagerProps): React.ReactElement {
  const [cohorts, setCohorts] = useState(props.data.cohorts);

  /**
   * Keep the current tab and heading in sync after an edit.
   *
   * @param {string} cohortID Updated cohort identifier
   * @param {CohortValues} values Updated cohort values
   */
  const updateCohort = (cohortID: string, values: CohortValues) => {
    setCohorts((current) => ({
      ...current,
      [cohortID]: {
        ...current[cohortID],
        RecruitmentTarget: values.RecruitmentTarget,
        options: {
          useEDC: values.useEDC,
          WindowDifference: values.WindowDifference,
        },
        title: values.title,
      },
    }));
  };

  return (
    <>
      <p>
        {props.t(
          'Use this page to manage the configuration of existing cohorts, '
            + 'or to add a new one.',
          {ns: 'configuration'}
        )}
      </p>
      <VerticalTabs
        tabs={[
          {
            id: 'cohortnew',
            label: props.t('New CohortID', {ns: 'configuration'}),
          },
          ...Object.entries(cohorts).map(([cohortID, cohort]) => ({
            id: `cohort${cohortID}`,
            label: cohort.title,
          })),
        ]}
        defaultTab="cohortnew"
        updateURL={false}
      >
        {Object.entries(cohorts).map(([cohortID, cohort]) => (
          <TabPane TabId={`cohort${cohortID}`} key={cohortID}>
            <h2>{cohort.title} (CohortID: {cohortID})</h2>
            <br/>
            <CohortForm
              cohort={cohort}
              cohortID={cohortID}
              isNew={false}
              onSaved={updateCohort}
              t={props.t}
              useEDCOptions={props.data.useEDCOptions}
              windowDifferenceOptions={props.data.windowDifferenceOptions}
            />
          </TabPane>
        ))}
        <TabPane TabId="cohortnew">
          <h2>{props.t('New Cohort', {ns: 'configuration'})}</h2>
          <br/>
          <CohortForm
            cohort={EMPTY_COHORT}
            cohortID="new"
            isNew={true}
            onSaved={() => undefined}
            t={props.t}
            useEDCOptions={props.data.useEDCOptions}
            windowDifferenceOptions={props.data.windowDifferenceOptions}
          />
        </TabPane>
      </VerticalTabs>
    </>
  );
}

/**
 * Load cohort data and render the manager.
 *
 * @param {WithTranslation} props Translation properties
 * @return {React.ReactElement}
 */
function CohortPage(props: WithTranslation): React.ReactElement {
  const [data, setData] = useState<CohortData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dataURL = new URL(window.location.href);
    dataURL.searchParams.set('format', 'json');
    new StudyEntitiesClient<CohortData>('configuration')
      .getById(dataURL.toString())
      .then((responseData: CohortData) => setData(responseData))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <h3>
        {props.t('An error occurred while loading the page.', {ns: 'loris'})}
      </h3>
    );
  }
  if (data === null) {
    return <Loader/>;
  }
  return <CohortManager data={data} t={props.t}/>;
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'configuration', jaStrings);
  i18n.addResourceBundle('zh', 'configuration', zhStrings);

  const workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }

  const Page = withTranslation(['configuration', 'loris'])(CohortPage);
  createRoot(workspace).render(<Page/>);
});

export default withTranslation(['configuration', 'loris'])(CohortPage);
