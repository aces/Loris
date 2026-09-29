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

type NumericValue = number | string;

type Archive = {
  AcquisitionCount: NumericValue,
  ArchiveLocation: null | string,
  CenterName: string,
  CreateInfo: null | string,
  CreatingUser: string,
  DateAcquired: null | string,
  DicomArchiveID: string,
  LastUpdate: null | string,
  PatientDoB: null | string,
  PatientID: string,
  PatientName: string,
  PatientSex: null | string,
  ScannerManufacturer: string,
  ScannerModel: string,
  ScannerSerialNumber: string,
  ScannerSoftwareVersion: string,
  SourceLocation: string,
  md5sumArchive: null | string,
  md5sumDicomOnly: null | string,
  patientIDValid: number,
  patientNameValid: number,
  sumTypeVersion: NumericValue,
  tarTypeVersion: null | NumericValue,
};

type ArchiveSeries = {
  EchoTime: null | NumericValue,
  InversionTime: null | NumericValue,
  NumberOfFiles: NumericValue,
  PhaseEncoding: null | string,
  ProtocolName?: string,
  RepetitionTime: null | NumericValue,
  SequenceName: null | string,
  SeriesDescription: null | string,
  SeriesNumber: NumericValue,
  SeriesUID: null | string,
  SliceThickness: null | NumericValue,
};

type ArchiveFile = {
  EchoNumber: null | NumericValue,
  FileName: string,
  FileNumber: null | NumericValue,
  Md5Sum: string,
  SeriesDescription: null | string,
  SeriesNumber: null | NumericValue,
};

type ViewDetailsData = {
  archive: Archive,
  archiveFiles: ArchiveFile[],
  archiveSeries: ArchiveSeries[],
};

declare global {
  interface Window {
    lorisFetch?: typeof fetch,
  }
}

type ViewDetailsProps = WithTranslation & {
  dataURL: string,
};

/**
 * React view for one DICOM archive's metadata.
 *
 * @param {ViewDetailsProps} props Component properties
 * @return {React.ReactElement}
 */
function ViewDetails({dataURL, t}: ViewDetailsProps): React.ReactElement {
  const [data, setData] = useState<ViewDetailsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const lorisFetch = window.lorisFetch ?? fetch;
    lorisFetch(dataURL, {credentials: 'same-origin'})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((responseData: ViewDetailsData) => setData(responseData))
      .catch(() => setError(true));
  }, [dataURL]);

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
    <ArchiveMetadata
      archive={data.archive}
      archiveFiles={data.archiveFiles}
      archiveSeries={data.archiveSeries}
      t={t}
    />
  );
}

type ArchiveMetadataProps = ViewDetailsData & {
  t: WithTranslation['t'],
};

/**
 * Archive summary and expandable series and file details.
 *
 * @param {ArchiveMetadataProps} props Component properties
 * @return {React.ReactElement}
 */
function ArchiveMetadata({
  archive,
  archiveFiles,
  archiveSeries,
  t,
}: ArchiveMetadataProps): React.ReactElement {
  const patientName = displayValue(archive.PatientName);
  const violationsURL = `${loris.BaseURL}/mri_violations?patientName=`
    + encodeURIComponent(patientName);

  return (
    <>
      <h2>{t('Tarchive Metadata', {ns: 'dicom_archive'})}</h2>
      <table className={DETAILS_TABLE_CLASS}>
        <tbody>
          <DetailRow label={t('Acquisition ID', {ns: 'dicom_archive'})}>
            <a href={violationsURL}>
              {displayValue(archive.DicomArchiveID)}
            </a>
          </DetailRow>
          <DetailRow
            invalid={archive.patientIDValid === 0}
            label={t('Patient ID', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.PatientID)}
          </DetailRow>
          <DetailRow
            invalid={archive.patientNameValid === 0}
            label={t('Patient Name', {ns: 'dicom_archive'})}
          >
            {patientName}
          </DetailRow>
          <DetailRow
            label={t('Patient Birthdate', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.PatientDoB)}
          </DetailRow>
          <DetailRow
            label={t('Patient Biological Sex', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.PatientSex)}
          </DetailRow>
          <DetailRow label={t('Date acquired', {ns: 'dicom_archive'})}>
            {displayValue(archive.DateAcquired)}
          </DetailRow>
          <DetailRow label={t('Scanner Model', {ns: 'dicom_archive'})}>
            {displayValue(archive.ScannerManufacturer)}{' '}
            {displayValue(archive.ScannerModel)}{' '}
            ({t('Serial Number', {ns: 'dicom_archive'})}:{' '}
            {displayValue(archive.ScannerSerialNumber)})
          </DetailRow>
          <DetailRow
            label={t('Scanner Software Version', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.ScannerSoftwareVersion)}
          </DetailRow>
          <DetailRow label={t('Acquired at', {ns: 'dicom_archive'})}>
            {displayValue(archive.CenterName)}
          </DetailRow>
          <DetailRow
            label={t('Number of Acquisitions', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.AcquisitionCount)}
          </DetailRow>
          <DetailRow label={t('Archived by', {ns: 'dicom_archive'})}>
            {displayValue(archive.CreatingUser)}
          </DetailRow>
          <DetailRow label={t('Last update', {ns: 'dicom_archive'})}>
            {archive.LastUpdate === null
              ? t('Never', {ns: 'dicom_archive'})
              : ''}
          </DetailRow>
          <DetailRow
            label={t('Summary type version', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.sumTypeVersion)}
          </DetailRow>
          <DetailRow label={t('Source location', {ns: 'dicom_archive'})}>
            {displayValue(archive.SourceLocation)}
          </DetailRow>
          <DetailRow
            label={t('Archive type version', {ns: 'dicom_archive'})}
          >
            {displayValue(archive.tarTypeVersion)}
          </DetailRow>
          <DetailRow label={t('Archive location', {ns: 'dicom_archive'})}>
            {displayValue(archive.ArchiveLocation)}
          </DetailRow>
          <DetailRow label={t('Archiving log', {ns: 'dicom_archive'})}>
            <pre>{displayValue(archive.CreateInfo)}</pre>
          </DetailRow>
          <DetailRow
            label={t('md5sum of Archive', {ns: 'dicom_archive'})}
          >
            <pre><b>{displayValue(archive.md5sumArchive)}</b></pre>
          </DetailRow>
          <DetailRow
            label={t('md5sum of Dicom unzipped', {ns: 'dicom_archive'})}
          >
            <pre><b>{displayValue(archive.md5sumDicomOnly)}</b></pre>
          </DetailRow>
          <SeriesDetails
            series={archiveSeries}
            t={t}
            violationsURL={violationsURL}
          />
          <FileDetails files={archiveFiles} t={t}/>
        </tbody>
      </table>
    </>
  );
}

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

type SeriesDetailsProps = {
  series: ArchiveSeries[],
  t: WithTranslation['t'],
  violationsURL: string,
};

/**
 * Expandable table of DICOM series metadata.
 *
 * @param {SeriesDetailsProps} props Component properties
 * @return {React.ReactElement}
 */
function SeriesDetails({
  series,
  t,
  violationsURL,
}: SeriesDetailsProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  return (
    <DetailRow
      label={t('Series', {ns: 'dicom_archive'})}
      topAligned={true}
    >
      <a
        aria-controls="series-data"
        aria-expanded={expanded}
        href="#series-data"
        onClick={(event) => {
          event.preventDefault();
          setExpanded((current) => !current);
        }}
      >
        {t('Show/Hide series', {ns: 'dicom_archive'})} ({series.length})
      </a>
      <div
        className={`collapse${expanded ? ' in' : ''}`}
        hidden={!expanded}
        id="series-data"
      >
        <table className="table table-hover table-primary table-bordered">
          <thead>
            <tr className="info">
              {SERIES_COLUMNS.map(([key, label]) => (
                <th key={key}>{t(label, {ns: 'dicom_archive'})}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((record, index) => (
              <tr key={index}>
                {SERIES_COLUMNS.map(([key]) => (
                  <td key={key}>
                    {key === 'SeriesUID' ? (
                      <a
                        href={`${violationsURL}&seriesUID=${
                          encodeURIComponent(displayValue(record[key]))
                        }`}
                      >
                        {displayValue(record[key])}
                      </a>
                    ) : (
                      displayValue(record[key])
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
  );
}

const FILE_COLUMNS = [
  ['SeriesNumber', 'SeriesNumber'],
  ['FileNumber', 'FileNumber'],
  ['EchoNumber', 'EchoNumber'],
  ['SeriesDescription', 'SeriesDescription'],
  ['Md5Sum', 'Md5Sum'],
  ['FileName', 'FileName'],
] as const;

type FileDetailsProps = {
  files: ArchiveFile[],
  t: WithTranslation['t'],
};

/**
 * Expandable table of archived DICOM files.
 *
 * @param {FileDetailsProps} props Component properties
 * @return {React.ReactElement}
 */
function FileDetails({files, t}: FileDetailsProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  return (
    <DetailRow
      label={t('Files', {ns: 'dicom_archive'})}
      topAligned={true}
    >
      <a
        aria-controls="files-data"
        aria-expanded={expanded}
        href="#files-data"
        onClick={(event) => {
          event.preventDefault();
          setExpanded((current) => !current);
        }}
      >
        {t('Show/Hide files', {ns: 'dicom_archive'})} ({files.length})
      </a>
      <div
        className={`collapse${expanded ? ' in' : ''}`}
        hidden={!expanded}
        id="files-data"
      >
        <table className="table table-hover table-primary table-bordered">
          <thead>
            <tr className="info">
              {FILE_COLUMNS.map(([key, label]) => (
                <th key={key}>{t(label, {ns: 'dicom_archive'})}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.map((record, index) => (
              <tr key={`${record.FileName}-${index}`}>
                {FILE_COLUMNS.map(([key]) => (
                  <td key={key}>{displayValue(record[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DetailRow>
  );
}

type DetailRowProps = {
  children: React.ReactNode,
  invalid?: boolean,
  label: string,
  topAligned?: boolean,
};

/**
 * One row in the archive metadata table.
 *
 * @param {DetailRowProps} props Row properties
 * @return {React.ReactElement}
 */
function DetailRow({
  children,
  invalid = false,
  label,
  topAligned = false,
}: DetailRowProps): React.ReactElement {
  return (
    <tr>
      <th className={topAligned ? 'valign-top' : undefined}>{label}</th>
      <td className={invalid ? 'error' : undefined}>{children}</td>
    </tr>
  );
}

const DETAILS_TABLE_CLASS = [
  'table',
  'table-hover',
  'table-primary',
  'table-bordered',
  'details-outer-table',
].join(' ');

/**
 * Convert an API value into display text.
 *
 * @param {null | number | string | undefined} value API value
 * @return {string}
 */
function displayValue(
  value: null | number | string | undefined
): string {
  return value === null || value === undefined ? '' : String(value);
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
