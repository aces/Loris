import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {withTranslation, WithTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import Loader from 'Loader';

import esStrings from '../locale/es/LC_MESSAGES/timepoint_list.json';
import frStrings from '../locale/fr/LC_MESSAGES/timepoint_list.json';
import hiStrings from '../locale/hi/LC_MESSAGES/timepoint_list.json';
import jaStrings from '../locale/ja/LC_MESSAGES/timepoint_list.json';
import zhStrings from '../locale/zh/LC_MESSAGES/timepoint_list.json';

declare const loris: {BaseURL: string};
declare const $: (selector: string) => {DynamicTable: () => void};

declare global {
  interface Window {
    lorisFetch?: typeof fetch,
  }
}

type DisplayValue = boolean | null | number | string;

type CandidateData = {
  DisplayParameters: Record<string, DisplayValue>,
  ProjectTitleLabel: string,
  SexLabel: string,
};

type LanguageData = {
  label: string,
};

type TimePointData = {
  BVLQCExclusion: DisplayValue,
  BVLQCStatus: DisplayValue,
  BVLQCType: DisplayValue,
  BVLQCTypeLabel: string,
  CohortTitleLabel: string,
  CurrentStageLabel: string,
  ProjectNameLabel: string,
  SessionID: DisplayValue,
  SiteNameLabel: string,
  Submitted: DisplayValue,
  VisitLabel: string,
  currentDate: DisplayValue,
  currentStage: string,
  currentStatusLabel: string,
  feedbackColor: string,
  feedbackCount: DisplayValue,
  feedbackStatusLabel: string,
  language: LanguageData,
  realName: DisplayValue,
  scanDone: DisplayValue,
  staticStage?: boolean,
};

type ActionData = {
  hasCandidateParameterAccess: boolean,
  isDataEntryPerson: boolean,
  isImagingPerson: boolean,
};

type TimepointListData = {
  actions: ActionData,
  candID: string,
  candidate: CandidateData,
  dobAge: string,
  edcAge: string,
  timePoints: TimePointData[],
};

/**
 * Convert a value from the JSON response into table text.
 *
 * @param value Value to display
 * @return Display text
 */
function displayValue(value: DisplayValue | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

/**
 * Match the truthy checks used by the legacy Smarty template.
 *
 * @param value Value to check
 * @return Whether the value should be displayed as present
 */
function hasValue(value: DisplayValue | undefined): boolean {
  return value !== null
    && value !== undefined
    && value !== ''
    && value !== 0
    && value !== '0'
    && value !== false;
}

/** Candidate summary component properties. */
type CandidateInfoProps = Pick<
  TimepointListData,
  'candidate' | 'dobAge' | 'edcAge'
> & Pick<WithTranslation, 't'>;

/**
 * Render the candidate summary table.
 *
 * @param {CandidateInfoProps} props Component properties
 * @return Candidate summary
 */
function CandidateInfo({
  candidate,
  dobAge,
  edcAge,
  t,
}: CandidateInfoProps
): React.ReactElement {
  const displayParameters = Object.entries(
    candidate.DisplayParameters ?? {}
  );

  return (
    <table
      cellPadding="2"
      className="table table-info table-bordered dynamictable"
      style={{maxWidth: 'none'}}
    >
      <thead>
        <tr className="info">
          <th>{t('Derived Age', {ns: 'timepoint_list'})}</th>
          <th>{t('EDC Age', {ns: 'timepoint_list'})}</th>
          <th>{t('Biological Sex', {ns: 'timepoint_list'})}</th>
          <th>{t('Project', {ns: 'loris'})}</th>
          {displayParameters.map(([name]) => <th key={name}>{name}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{dobAge}</td>
          <td>{edcAge}</td>
          <td>{candidate.SexLabel}</td>
          <td>{candidate.ProjectTitleLabel}</td>
          {displayParameters.map(([name, value]) => (
            <td key={name}>{displayValue(value)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

/** Candidate actions component properties. */
type ActionsProps = Pick<TimepointListData, 'actions' | 'candID'>
  & Pick<WithTranslation, 't'>;

/**
 * Render the actions available for this candidate.
 *
 * @param {ActionsProps} props Component properties
 * @return Candidate actions, when available
 */
function Actions({actions, candID, t}: ActionsProps
): React.ReactElement | null {
  if (
    !actions.hasCandidateParameterAccess
    && !actions.isDataEntryPerson
    && !actions.isImagingPerson
  ) {
    return null;
  }

  const candidateQuery = `candID=${encodeURIComponent(candID)}`
    + `&identifier=${encodeURIComponent(candID)}`;

  return (
    <div className="col-xs-12 row">
      <h3>{t('Actions:', {ns: 'timepoint_list'})}</h3>
      {actions.isDataEntryPerson && (
        <a
          className="btn btn-default"
          href={`${loris.BaseURL}/create_timepoint/?${candidateQuery}`}
          role="button"
        >
          {t('Create time point', {ns: 'timepoint_list'})}
        </a>
      )}
      {' '}
      {actions.isImagingPerson && (
        <a
          className="btn btn-default"
          href={`${loris.BaseURL}/imaging_browser/?DCCID=${
            encodeURIComponent(candID)
          }`}
          role="button"
        >
          {t('View Imaging datasets', {ns: 'timepoint_list'})}
        </a>
      )}
      {' '}
      {actions.hasCandidateParameterAccess && (
        <a
          className="btn btn-default"
          href={`${loris.BaseURL}/candidate_parameters/?${candidateQuery}`}
          role="button"
        >
          {t('Candidate Info', {ns: 'timepoint_list'})}
        </a>
      )}
    </div>
  );
}

/** Visit-row component properties. */
type TimepointRowsProps = Pick<TimepointListData, 'candID' | 'timePoints'>
  & Pick<WithTranslation, 't'>;

/**
 * Render the visit rows.
 *
 * @param {TimepointRowsProps} props Component properties
 * @return Visit rows
 */
function TimepointRows({candID, timePoints, t}: TimepointRowsProps
): React.ReactElement {
  if (timePoints.length === 0) {
    return (
      <tr>
        <td colSpan={10}>
          {t(
            'You do not have access to any timepoints registered for this '
              + 'candidate.',
            {ns: 'timepoint_list'}
          )}
        </td>
      </tr>
    );
  }

  return (
    <>
      {timePoints.map((timePoint) => {
        const sessionID = displayValue(timePoint.SessionID);
        const staticStage = timePoint.staticStage
          || timePoint.currentStage === 'Not Started';
        const hasScanData = timePoint.scanDone !== null
          && timePoint.scanDone !== ''
          && timePoint.scanDone !== false;

        return (
          <tr key={sessionID}>
            <td>
              <a
                href={`${loris.BaseURL}/instrument_list/?candID=${
                  encodeURIComponent(candID)
                }&sessionID=${encodeURIComponent(sessionID)}`}
              >
                {timePoint.VisitLabel}
              </a>
            </td>
            <td>{timePoint.CohortTitleLabel}</td>
            <td>{timePoint.SiteNameLabel}</td>
            <td>{timePoint.ProjectNameLabel}</td>
            {staticStage ? (
              <td colSpan={3}>{timePoint.CurrentStageLabel}</td>
            ) : (
              <>
                <td>{timePoint.CurrentStageLabel}</td>
                <td>{timePoint.currentStatusLabel}</td>
                <td>{displayValue(timePoint.currentDate)}</td>
              </>
            )}
            <td>
              {timePoint.Submitted === 'Y'
                ? <img alt="" src={`${loris.BaseURL}/images/check_blue.gif`}/>
                : '-'}
            </td>
            <td>
              {!hasScanData ? (
                <img
                  alt="Data Missing"
                  src={`${loris.BaseURL}/images/delete.gif`}
                />
              ) : hasValue(timePoint.scanDone) ? (
                <a
                  className="timepoint_list"
                  href={`${loris.BaseURL}/imaging_browser/viewSession/`
                    + `?sessionID=${encodeURIComponent(sessionID)}`}
                >
                  {t('Yes', {ns: 'loris'})}
                </a>
              ) : (
                t('No', {ns: 'loris'})
              )}
            </td>
            <td style={{backgroundColor: timePoint.feedbackColor}}>
              {hasValue(timePoint.feedbackCount)
                ? timePoint.feedbackStatusLabel
                : '-'}
            </td>
            <td>
              {hasValue(timePoint.BVLQCStatus) ? (
                hasValue(timePoint.BVLQCType)
                  ? timePoint.BVLQCTypeLabel
                  : ''
              ) : (
                <img alt="" src={`${loris.BaseURL}/images/delete.gif`}/>
              )}
            </td>
            <td>
              {hasValue(timePoint.BVLQCExclusion) ? (
                timePoint.BVLQCExclusion === 'Not Excluded'
                  ? t('Pass', {ns: 'loris'})
                  : t('Failure', {ns: 'loris'})
              ) : (
                <img alt="" src={`${loris.BaseURL}/images/delete.gif`}/>
              )}
            </td>
            <td>{displayValue(timePoint.realName)}</td>
            <td>{timePoint.language.label}</td>
          </tr>
        );
      })}
    </>
  );
}

/** Visit-table component properties. */
type TimepointTableProps = Pick<TimepointListData, 'candID' | 'timePoints'>
  & Pick<WithTranslation, 't'>;

/**
 * Render the visit table.
 *
 * @param {TimepointTableProps} props Component properties
 * @return Visit table
 */
function TimepointTable({candID, timePoints, t}: TimepointTableProps
): React.ReactElement {
  return (
    <>
      <strong>
        {t('List of Visits (Time Points)', {ns: 'timepoint_list'})}
      </strong>
      <table
        cellPadding="2"
        className="table table-hover table-primary table-bordered dynamictable"
        style={{marginTop: 0}}
      >
        <thead>
          <tr className="info">
            <th>
              {t('Visit Label', {ns: 'loris'})}<br/>
              ({t('Click to Open', {ns: 'timepoint_list'})})
            </th>
            <th>{t('Cohort', {ns: 'loris'})}</th>
            <th>{t('Site', {ns: 'loris'})}</th>
            <th>{t('Project', {ns: 'loris'})}</th>
            <th>{t('Stage', {ns: 'loris'})}</th>
            <th>{t('Stage Status', {ns: 'timepoint_list'})}</th>
            <th>{t('Date of Stage', {ns: 'timepoint_list'})}</th>
            <th>{t('Sent To DCC', {ns: 'loris'})}</th>
            <th>{t('Imaging Scan Done', {ns: 'timepoint_list'})}</th>
            <th>{t('Feedback', {ns: 'loris'})}</th>
            <th>{t('BVL QC', {ns: 'timepoint_list'})}</th>
            <th>{t('BVL Exclusion', {ns: 'timepoint_list'})}</th>
            <th>{t('Registered By', {ns: 'timepoint_list'})}</th>
            <th>{t('Language', {ns: 'loris'})}</th>
          </tr>
        </thead>
        <tbody>
          <TimepointRows candID={candID} timePoints={timePoints} t={t}/>
        </tbody>
      </table>
    </>
  );
}

/** Timepoint-list page properties. */
type TimepointListProps = WithTranslation & {
  dataURL: string,
};

/**
 * Load and render the timepoint list.
 *
 * @param {TimepointListProps} props Component properties
 * @return Timepoint list page
 */
function TimepointList({dataURL, t}: TimepointListProps): React.ReactElement {
  const [data, setData] = useState<TimepointListData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const lorisFetch = window.lorisFetch ?? fetch;
    lorisFetch(dataURL, {
      credentials: 'same-origin',
      headers: {Accept: 'application/json'},
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((responseData: TimepointListData) => setData(responseData))
      .catch(() => setError(true));
  }, [dataURL]);

  useEffect(() => {
    if (data !== null) {
      // The legacy plugin must run after React has rendered both tables.
      // eslint-disable-next-line no-jquery/no-jquery-constructor, no-jquery/no-other-methods
      $('.dynamictable').DynamicTable();
    }
  }, [data]);

  if (error) {
    return (
      <h3>
        {t('An error occured while loading the page.', {ns: 'loris'})}
      </h3>
    );
  }

  if (data === null) {
    return <Loader/>;
  }

  return (
    <>
      <CandidateInfo
        candidate={data.candidate}
        dobAge={data.dobAge}
        edcAge={data.edcAge}
        t={t}
      />
      <Actions actions={data.actions} candID={data.candID} t={t}/>
      <div className="clearfix"/>
      <TimepointTable
        candID={data.candID}
        timePoints={data.timePoints}
        t={t}
      />
    </>
  );
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('es', 'timepoint_list', esStrings);
  i18n.addResourceBundle('fr', 'timepoint_list', frStrings);
  i18n.addResourceBundle('hi', 'timepoint_list', hiStrings);
  i18n.addResourceBundle('ja', 'timepoint_list', jaStrings);
  i18n.addResourceBundle('zh', 'timepoint_list', zhStrings);

  const workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }

  const dataURL = new URL(window.location.href);
  dataURL.searchParams.set('format', 'json');

  const Page = withTranslation(['timepoint_list', 'loris'])(TimepointList);
  createRoot(workspace).render(<Page dataURL={dataURL.toString()}/>);
});

export default withTranslation(['timepoint_list', 'loris'])(TimepointList);
