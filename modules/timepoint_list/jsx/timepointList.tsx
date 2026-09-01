import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {withTranslation, WithTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import Loader from 'Loader';

import esStrings from '../locale/es/LC_MESSAGES/timepoint_list.json';
import frStrings from '../locale/fr/LC_MESSAGES/timepoint_list.json';
import jaStrings from '../locale/ja/LC_MESSAGES/timepoint_list.json';
import zhStrings from '../locale/zh/LC_MESSAGES/timepoint_list.json';

declare const loris: {BaseURL: string};

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

type TimepointListProps = WithTranslation & {
  dataURL: string,
};

declare global {
  interface Window {
    lorisFetch?: typeof fetch,
  }
}

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

/**
 * Render the candidate summary table.
 *
 * @param props Component properties
 * @return Candidate summary
 */
function CandidateInfo(
  props: Pick<TimepointListData, 'candidate' | 'dobAge' | 'edcAge'>
  & WithTranslation
): React.ReactElement {
  const displayParameters = Object.entries(
    props.candidate.DisplayParameters ?? {}
  );

  return (
    <table
      cellPadding="2"
      className="table table-info table-bordered dynamictable"
      style={{maxWidth: 'none'}}
    >
      <thead>
        <tr className="info">
          <th>{props.t('Derived Age', {ns: 'timepoint_list'})}</th>
          <th>{props.t('EDC Age', {ns: 'timepoint_list'})}</th>
          <th>{props.t('Biological Sex', {ns: 'timepoint_list'})}</th>
          <th>{props.t('Project', {ns: 'loris'})}</th>
          {displayParameters.map(([name]) => <th key={name}>{name}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.dobAge}</td>
          <td>{props.edcAge}</td>
          <td>{props.candidate.SexLabel}</td>
          <td>{props.candidate.ProjectTitleLabel}</td>
          {displayParameters.map(([name, value]) => (
            <td key={name}>{displayValue(value)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

/**
 * Render the actions available for this candidate.
 *
 * @param props Component properties
 * @return Candidate actions, when available
 */
function Actions(
  props: Pick<TimepointListData, 'actions' | 'candID'> & WithTranslation
): React.ReactElement | null {
  if (
    !props.actions.hasCandidateParameterAccess
    && !props.actions.isDataEntryPerson
    && !props.actions.isImagingPerson
  ) {
    return null;
  }

  const candidateQuery = `candID=${encodeURIComponent(props.candID)}`
    + `&identifier=${encodeURIComponent(props.candID)}`;

  return (
    <div className="col-xs-12 row">
      <h3>{props.t('Actions:', {ns: 'timepoint_list'})}</h3>
      {props.actions.isDataEntryPerson && (
        <a
          className="btn btn-default"
          href={`${loris.BaseURL}/create_timepoint/?${candidateQuery}`}
          role="button"
        >
          {props.t('Create time point', {ns: 'timepoint_list'})}
        </a>
      )}
      {' '}
      {props.actions.isImagingPerson && (
        <a
          className="btn btn-default"
          href={`${loris.BaseURL}/imaging_browser/?DCCID=${
            encodeURIComponent(props.candID)
          }`}
          role="button"
        >
          {props.t('View Imaging datasets', {ns: 'timepoint_list'})}
        </a>
      )}
      {' '}
      {props.actions.hasCandidateParameterAccess && (
        <a
          className="btn btn-default"
          href={`${loris.BaseURL}/candidate_parameters/?${candidateQuery}`}
          role="button"
        >
          {props.t('Candidate Info', {ns: 'timepoint_list'})}
        </a>
      )}
    </div>
  );
}

/**
 * Render the visit rows.
 *
 * @param props Component properties
 * @return Visit rows
 */
function TimepointRows(
  props: Pick<TimepointListData, 'candID' | 'timePoints'> & WithTranslation
): React.ReactElement {
  if (props.timePoints.length === 0) {
    return (
      <tr>
        <td colSpan={10}>
          {props.t(
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
      {props.timePoints.map((timePoint) => {
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
                  encodeURIComponent(props.candID)
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
                  {props.t('Yes', {ns: 'loris'})}
                </a>
              ) : (
                props.t('No', {ns: 'loris'})
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
                  ? props.t('Pass', {ns: 'loris'})
                  : props.t('Failure', {ns: 'loris'})
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

/**
 * Render the visit table.
 *
 * @param props Component properties
 * @return Visit table
 */
function TimepointTable(
  props: Pick<TimepointListData, 'candID' | 'timePoints'> & WithTranslation
): React.ReactElement {
  return (
    <>
      <strong>
        {props.t('List of Visits (Time Points)', {ns: 'timepoint_list'})}
      </strong>
      <table
        cellPadding="2"
        className="table table-hover table-primary table-bordered dynamictable"
        style={{marginTop: 0}}
      >
        <thead>
          <tr className="info">
            <th>
              {props.t('Visit Label', {ns: 'loris'})}<br/>
              ({props.t('Click to Open', {ns: 'timepoint_list'})})
            </th>
            <th>{props.t('Cohort', {ns: 'loris'})}</th>
            <th>{props.t('Site', {ns: 'loris'})}</th>
            <th>{props.t('Project', {ns: 'loris'})}</th>
            <th>{props.t('Stage', {ns: 'loris'})}</th>
            <th>{props.t('Stage Status', {ns: 'timepoint_list'})}</th>
            <th>{props.t('Date of Stage', {ns: 'timepoint_list'})}</th>
            <th>{props.t('Sent To DCC', {ns: 'loris'})}</th>
            <th>{props.t('Imaging Scan Done', {ns: 'timepoint_list'})}</th>
            <th>{props.t('Feedback', {ns: 'loris'})}</th>
            <th>{props.t('BVL QC', {ns: 'timepoint_list'})}</th>
            <th>{props.t('BVL Exclusion', {ns: 'timepoint_list'})}</th>
            <th>{props.t('Registered By', {ns: 'timepoint_list'})}</th>
            <th>{props.t('Language', {ns: 'loris'})}</th>
          </tr>
        </thead>
        <tbody>
          <TimepointRows {...props}/>
        </tbody>
      </table>
    </>
  );
}

/**
 * Load and render the timepoint list.
 *
 * @param props Component properties
 * @return Timepoint list page
 */
function TimepointList(props: TimepointListProps): React.ReactElement {
  const [data, setData] = useState<TimepointListData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const lorisFetch = window.lorisFetch ?? fetch;
    lorisFetch(props.dataURL, {credentials: 'same-origin'})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((responseData: TimepointListData) => setData(responseData))
      .catch(() => setError(true));
  }, [props.dataURL]);

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

  return (
    <>
      <CandidateInfo {...data} {...props}/>
      <Actions {...data} {...props}/>
      <div className="clearfix"/>
      <TimepointTable {...data} {...props}/>
    </>
  );
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('es', 'timepoint_list', esStrings);
  i18n.addResourceBundle('fr', 'timepoint_list', frStrings);
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
