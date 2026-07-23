import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {withTranslation, WithTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import Loader from 'Loader';

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

type SaveResponse = {
  error?: string,
  ok?: string,
};

declare global {
  interface Window {
    lorisFetch?: typeof fetch,
  }
}

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

type FormRowProps = {
  children: React.ReactNode,
  label: string,
  tooltip: string,
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
 * Render one labelled cohort form row.
 *
 * @param {FormRowProps} props Row properties
 * @return {React.ReactElement}
 */
function FormRow(props: FormRowProps): React.ReactElement {
  return (
    <div className="form-group">
      <div
        className="col-sm-12 col-md-3"
        title={props.tooltip}
      >
        <label className="col-sm-12 control-label">{props.label}</label>
      </div>
      <div className="col-sm-12 col-md-9">{props.children}</div>
    </div>
  );
}

/**
 * Create or edit one cohort through the established guarded endpoint.
 *
 * @param {CohortFormProps} props Form properties
 * @return {React.ReactElement}
 */
function CohortForm(props: CohortFormProps): React.ReactElement {
  const [defaults] = useState(() => formValues(props.cohort));
  const [values, setValues] = useState<CohortValues>(defaults);
  const [status, setStatus] = useState<SaveStatus>(null);
  const [saving, setSaving] = useState(false);

  /**
   * Update one controlled field and clear its prior save status.
   *
   * @param {keyof CohortValues} name Field name
   * @param {string} value Field value
   */
  const updateValue = (name: keyof CohortValues, value: string) => {
    setValues((current) => ({...current, [name]: value}));
    setStatus(null);
  };

  /**
   * Submit the cohort values to the existing update endpoint.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Submit event
   */
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      const lorisFetch = window.lorisFetch ?? fetch;
      const response = await lorisFetch(
        `${loris.BaseURL}/configuration/ajax/updateCohort.php`,
        {
          body,
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          method: 'POST',
        }
      );
      const responseData = await response.json() as SaveResponse;
      if (!response.ok) {
        throw new Error(
          responseData.error
            ?? props.t('Failed to save', {ns: 'configuration'})
        );
      }

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
    <form
      className="form-horizontal"
      id={`form${fieldPrefix}`}
      method="post"
      onSubmit={submit}
      role="form"
    >
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
        <FormRow
          label={props.t('Cohort Name', {ns: 'configuration'})}
          tooltip={props.t(
            'Full descriptive title of the cohort',
            {ns: 'configuration'}
          )}
        >
          <input
            className="form-control cohortTitle"
            id={`${fieldPrefix}-title`}
            name="title"
            onChange={(event) => updateValue('title', event.target.value)}
            placeholder={props.isNew
              ? props.t(
                'Please add a cohort title here',
                {ns: 'configuration'}
              )
              : undefined}
            value={values.title}
          />
        </FormRow>
        <FormRow
          label={props.t('Use EDC', {ns: 'configuration'})}
          tooltip={props.t(
            'Include field for EDC (Expected Date of Confinement) in '
              + 'Candidate Parameters to record subject\'s due date if '
              + 'applicable',
            {ns: 'configuration'}
          )}
        >
          <select
            className="form-control cohortuseEDC"
            id={`${fieldPrefix}-use-edc`}
            name="useEDC"
            onChange={(event) => updateValue('useEDC', event.target.value)}
            value={values.useEDC}
          >
            {Object.entries(props.useEDCOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {props.t(label, {ns: 'loris'})}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow
          label={props.t(
            'Calculate Window Difference For Instruments Based On',
            {ns: 'configuration'}
          )}
          tooltip={props.t(
            'Choose a method by which Window Difference will be calculated. '
              + 'It will be displayed in days at the head of every '
              + 'instrument form',
            {ns: 'configuration'}
          )}
        >
          <select
            className="form-control cohortWindowDifference"
            id={`${fieldPrefix}-window-difference`}
            name="WindowDifference"
            onChange={(event) => updateValue(
              'WindowDifference',
              event.target.value
            )}
            value={values.WindowDifference}
          >
            {Object.entries(props.windowDifferenceOptions).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {props.t(label, {ns: 'configuration'})}
                </option>
              )
            )}
          </select>
        </FormRow>
        <FormRow
          label={props.t('Recruitment Target', {ns: 'configuration'})}
          tooltip={props.t(
            'The target number will be used to generate the recruitment '
              + 'progress bar on the dashboard',
            {ns: 'configuration'}
          )}
        >
          <input
            className="form-control cohortRecruitmentTarget"
            id={`${fieldPrefix}-recruitment-target`}
            name="target"
            onChange={(event) => updateValue(
              'RecruitmentTarget',
              event.target.value
            )}
            placeholder={props.t(
              'Please add a recruitment target here',
              {ns: 'configuration'}
            )}
            value={values.RecruitmentTarget}
          />
        </FormRow>
        <div className="form-group">
          <div className="col-sm-offset-3 col-sm-9">
            <button
              className="btn btn-primary savecohort"
              disabled={saving}
              id={`savecohort${props.cohortID}`}
              type="submit"
            >
              {props.t('Save', {ns: 'loris'})}
            </button>{' '}
            <button
              className="btn btn-default"
              onClick={() => {
                setValues(defaults);
                setStatus(null);
              }}
              type="button"
            >
              {props.t('Reset', {ns: 'loris'})}
            </button>{' '}
            {status && (
              <label
                className={
                  status.type === 'success' ? 'text-success' : 'text-danger'
                }
              >
                {status.message}
              </label>
            )}
          </div>
        </div>
      </fieldset>
    </form>
  );
}

/**
 * React cohort manager.
 *
 * @param {CohortManagerProps} props Page properties
 * @return {React.ReactElement}
 */
function CohortManager(props: CohortManagerProps): React.ReactElement {
  const [activeID, setActiveID] = useState('new');
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
      <div className="col-md-3">
        <ul
          className="nav nav-pills nav-stacked"
          data-tabs="tabs"
          role="tablist"
        >
          <li className={activeID === 'new' ? 'active' : undefined}>
            <a
              aria-selected={activeID === 'new'}
              href="#cohortnew"
              id="#cohortnew"
              onClick={(event) => {
                event.preventDefault();
                setActiveID('new');
              }}
              role="tab"
            >
              {props.t('New CohortID', {ns: 'configuration'})}
            </a>
          </li>
          {Object.entries(cohorts).map(([cohortID, cohort]) => (
            <li
              className={activeID === cohortID ? 'active' : undefined}
              key={cohortID}
            >
              <a
                aria-selected={activeID === cohortID}
                href={`#cohort${cohortID}`}
                id={`#cohort${cohortID}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveID(cohortID);
                }}
                role="tab"
              >
                {cohort.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-md-7">
        <div className="tab-content">
          {Object.entries(cohorts).map(([cohortID, cohort]) => (
            <div
              className={
                `tab-pane${activeID === cohortID ? ' active' : ''}`
              }
              hidden={activeID !== cohortID}
              id={`cohort${cohortID}`}
              key={cohortID}
            >
              <h2>{cohort.title} (CohortID: {cohortID})</h2>
              <br/>
              <CohortForm
                cohort={cohort}
                cohortID={cohortID}
                isNew={false}
                onSaved={updateCohort}
                t={props.t}
                useEDCOptions={props.data.useEDCOptions}
                windowDifferenceOptions={
                  props.data.windowDifferenceOptions
                }
              />
            </div>
          ))}
          <div
            className={`tab-pane${activeID === 'new' ? ' active' : ''}`}
            hidden={activeID !== 'new'}
            id="cohortnew"
          >
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
          </div>
        </div>
      </div>
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
    const lorisFetch = window.lorisFetch ?? fetch;
    lorisFetch(dataURL.toString(), {credentials: 'same-origin'})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((responseData: CohortData) => setData(responseData))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <h3>
        {props.t('An error occured while loading the page.', {ns: 'loris'})}
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
