import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {withTranslation, WithTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import Loader from 'Loader';

import frStrings from '../locale/fr/LC_MESSAGES/dicom_archive.json';
import hiStrings from '../locale/hi/LC_MESSAGES/dicom_archive.json';
import jaStrings from '../locale/ja/LC_MESSAGES/dicom_archive.json';
import zhStrings from '../locale/zh/LC_MESSAGES/dicom_archive.json';

declare const loris: {BaseURL: string};

type DataValue = null | number | string;
type DataRecord = Record<string, DataValue>;

type ViewDetailsData = {
  archive: DataRecord,
  archiveFiles: DataRecord[],
  archiveSeries: DataRecord[],
};

declare global {
  interface Window {
    lorisFetch?: typeof fetch,
  }
}

type ViewDetailsProps = WithTranslation & {
  dataURL: string,
};

type DetailRowProps = {
  children: React.ReactNode,
  invalid?: boolean,
  label: string,
  topAligned?: boolean,
};

const SERIES_COLUMNS = [
  ['SeriesNumber', 'Series Number'],
  ['SeriesDescription', 'Series Description'],
  ['ProtocolName', 'Protocol Name'],
  ['SequenceName', 'Sequence Name'],
  ['EchoTime', 'Echo Time'],
  ['RepetitionTime', 'Repetition Time'],
  ['InversionTime', 'Inversion Time'],
  ['SliceThickness', 'Slice Thickness'],
  ['PhaseEncoding', 'Phase Encoding'],
  ['NumberOfFiles', 'Number of Files'],
  ['SeriesUID', 'SeriesUID'],
] as const;

const FILE_COLUMNS = [
  ['SeriesNumber', 'SeriesNumber'],
  ['FileNumber', 'FileNumber'],
  ['EchoNumber', 'EchoNumber'],
  ['SeriesDescription', 'SeriesDescription'],
  ['Md5Sum', 'Md5Sum'],
  ['FileName', 'FileName'],
] as const;

const DETAILS_TABLE_CLASS = [
  'table',
  'table-hover',
  'table-primary',
  'table-bordered',
  'details-outer-table',
].join(' ');

/**
 * Convert a database value into display text.
 *
 * @param {DataValue | undefined} value Database value
 * @return {string}
 */
function displayValue(value: DataValue | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

/**
 * One row in the archive metadata table.
 *
 * @param {DetailRowProps} props Row properties
 * @return {React.ReactElement}
 */
function DetailRow(props: DetailRowProps): React.ReactElement {
  return (
    <tr>
      <th className={props.topAligned ? 'valign-top' : undefined}>
        {props.label}
      </th>
      <td className={props.invalid ? 'error' : undefined}>
        {props.children}
      </td>
    </tr>
  );
}

/**
 * React view for one DICOM archive's metadata.
 *
 * @param {ViewDetailsProps} props Component properties
 * @return {React.ReactElement}
 */
function ViewDetails(props: ViewDetailsProps): React.ReactElement {
  const [data, setData] = useState<ViewDetailsData | null>(null);
  const [error, setError] = useState(false);
  const [showSeries, setShowSeries] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    const lorisFetch = window.lorisFetch ?? fetch;
    lorisFetch(props.dataURL, {credentials: 'same-origin'})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((responseData: ViewDetailsData) => setData(responseData))
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

  const archive = data.archive;
  const patientName = displayValue(archive.PatientName);
  const violationsURL = `${loris.BaseURL}/mri_violations?patientName=`
    + encodeURIComponent(patientName);

  return (
    <>
      <h2>{props.t('Tarchive Metadata', {ns: 'dicom_archive'})}</h2>
      <table className={DETAILS_TABLE_CLASS}>
        <tbody>
          <DetailRow label={props.t('Acquisition ID', {ns: 'dicom_archive'})}>
            <a href={violationsURL}>
              {displayValue(archive.DicomArchiveID)}
            </a>
          </DetailRow>
          <DetailRow
            invalid={Number(archive.patientIDValid) === 0}
            label={props.t('Patient ID', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.PatientID)}
          </DetailRow>
          <DetailRow
            invalid={Number(archive.patientNameValid) === 0}
            label={props.t('Patient Name', {ns: 'dicom_archive'})}
          >
            {patientName}
          </DetailRow>
          <DetailRow
            label={props.t('Patient Birthdate', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.PatientDoB)}
          </DetailRow>
          <DetailRow
            label={props.t('Patient Biological Sex', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.PatientSex)}
          </DetailRow>
          <DetailRow label={props.t('Date acquired', {ns: 'dicom_archive'})}>
            {displayValue(archive.DateAcquired)}
          </DetailRow>
          <DetailRow
            label={props.t('Scanner Model', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.ScannerManufacturer)}{' '}
            {displayValue(archive.ScannerModel)}{' '}
            ({props.t('Serial Number', {ns: 'dicom_archive'})}:{' '}
            {displayValue(archive.ScannerSerialNumber)})
          </DetailRow>
          <DetailRow
            label={props.t('Scanner Software Version', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.ScannerSoftwareVersion)}
          </DetailRow>
          <DetailRow label={props.t('Acquired at', {ns: 'dicom_archive'})}>
            {displayValue(archive.CenterName)}
          </DetailRow>
          <DetailRow
            label={props.t('Number of Acquisitions', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.AcquisitionCount)}
          </DetailRow>
          <DetailRow label={props.t('Archived by', {ns: 'dicom_archive'})}>
            {displayValue(archive.CreatingUser)}
          </DetailRow>
          <DetailRow label={props.t('Last update', {ns: 'dicom_archive'})}>
            {archive.LastUpdate === null || archive.LastUpdate === undefined
              ? props.t('Never', {ns: 'dicom_archive'})
              : ''}
          </DetailRow>
          <DetailRow
            label={props.t('Summary type version', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.sumTypeVersion)}
          </DetailRow>
          <DetailRow label={props.t('Source location', {ns: 'dicom_archive'})}>
            {displayValue(archive.SourceLocation)}
          </DetailRow>
          <DetailRow
            label={props.t('Archive type version', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.tarTypeVersion)}
          </DetailRow>
          <DetailRow label={props.t('Archive location', {ns: 'dicom_archive'})}>
            {displayValue(archive.ArchiveLocation)}
          </DetailRow>
          <DetailRow label={props.t('Archiving log', {ns: 'dicom_archive'})}>
            <pre>{displayValue(archive.CreateInfo)}</pre>
          </DetailRow>
          <DetailRow
            label={props.t('md5sum of Archive', {ns: 'dicom_archive'})}
          >
            <pre><b>{displayValue(archive.md5sumArchive)}</b></pre>
          </DetailRow>
          <DetailRow
            label={props.t('md5sum of Dicom unzipped', {ns: 'dicom_archive'})}
          >
            <pre><b>{displayValue(archive.md5sumDicomOnly)}</b></pre>
          </DetailRow>
          <DetailRow
            label={props.t('Series', {ns: 'dicom_archive'})}
            topAligned={true}
          >
            <a
              aria-controls="series-data"
              aria-expanded={showSeries}
              href="#series-data"
              onClick={(event) => {
                event.preventDefault();
                setShowSeries((current) => !current);
              }}
            >
              {props.t('Show/Hide series', {ns: 'dicom_archive'})}{' '}
              ({data.archiveSeries.length})
            </a>
            <div
              className={`collapse${showSeries ? ' in' : ''}`}
              hidden={!showSeries}
              id="series-data"
            >
              <table className="table table-hover table-primary table-bordered">
                <thead>
                  <tr className="info">
                    {SERIES_COLUMNS.map(([key, label]) => (
                      <th key={key}>
                        {props.t(label, {ns: 'dicom_archive'})}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.archiveSeries.map((series, index) => (
                    <tr key={displayValue(series.TarchiveSeriesID) || index}>
                      {SERIES_COLUMNS.map(([key]) => (
                        <td key={key}>
                          {key === 'SeriesUID' ? (
                            <a
                              href={`${violationsURL}&seriesUID=${
                                encodeURIComponent(displayValue(series[key]))
                              }`}
                            >
                              {displayValue(series[key])}
                            </a>
                          ) : (
                            displayValue(series[key])
                              || (key === 'ProtocolName' ? 'Unknown' : '')
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailRow>
          <DetailRow
            label={props.t('Files', {ns: 'dicom_archive'})}
            topAligned={true}
          >
            <a
              aria-controls="files-data"
              aria-expanded={showFiles}
              href="#files-data"
              onClick={(event) => {
                event.preventDefault();
                setShowFiles((current) => !current);
              }}
            >
              {props.t('Show/Hide files', {ns: 'dicom_archive'})}{' '}
              ({data.archiveFiles.length})
            </a>
            <div
              className={`collapse${showFiles ? ' in' : ''}`}
              hidden={!showFiles}
              id="files-data"
            >
              <table className="table table-hover table-primary table-bordered">
                <thead>
                  <tr className="info">
                    {FILE_COLUMNS.map(([key, label]) => (
                      <th key={key}>
                        {props.t(label, {ns: 'dicom_archive'})}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.archiveFiles.map((file, index) => (
                    <tr key={displayValue(file.TarchiveFileID) || index}>
                      {FILE_COLUMNS.map(([key]) => (
                        <td key={key}>{displayValue(file[key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailRow>
        </tbody>
      </table>
    </>
  );
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('fr', 'dicom_archive', frStrings);
  i18n.addResourceBundle('hi', 'dicom_archive', hiStrings);
  i18n.addResourceBundle('ja', 'dicom_archive', jaStrings);
  i18n.addResourceBundle('zh', 'dicom_archive', zhStrings);

  const workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }

  const dataURL = new URL(window.location.href);
  dataURL.searchParams.set('format', 'json');

  const Details = withTranslation(['dicom_archive', 'loris'])(ViewDetails);
  createRoot(workspace).render(<Details dataURL={dataURL.toString()}/>);
});

export default withTranslation(['dicom_archive', 'loris'])(ViewDetails);
