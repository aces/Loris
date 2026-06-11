<h2>{dgettext("dicom_archive", "Tarchive Metadata")}</h2>
<table class="table table-hover table-primary table-bordered details-outer-table">
  <tr>
    <th>{dgettext("dicom_archive", "Acquisition ID")}</th>
    <td>
      <a href="/mri_violations?patientName={$archive.PatientName}">
        {$archive.DicomArchiveID}
      </a>
    </td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Patient ID")}</th>
    <td{if $archive.patientIDValid == 0} class="error"{/if}>{$archive.PatientID}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Patient Name")}</th>
    <td{if $archive.patientNameValid == 0} class="error"{/if}>{$archive.PatientName}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Patient Birthdate")}</th>
    <td>{$archive.PatientDoB}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Patient Biological Sex")}</th>
    <td>{$archive.PatientSex}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Date acquired")}</th>
    <td>{$archive.DateAcquired}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Scanner Model")}</th>
    <td>
      {$archive.ScannerManufacturer} {$archive.ScannerModel}
      ({dgettext("dicom_archive", "Serial Number")}: {$archive.ScannerSerialNumber})
    </td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Scanner Software Version")}</th>
    <td>{$archive.ScannerSoftwareVersion}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Acquired at")}</th>
    <td>{$archive.CenterName}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Number of Acquisitions")}</th>
    <td>{$archive.AcquisitionCount}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Archived by")}</th>
    <td>{$archive.CreatingUser}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Last update")}</th>
    <td>{if !isset($archive.LastUpdate)}{dgettext("dicom_archive", "Never")}{/if}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Summary type version")}</th>
    <td>{$archive.sumTypeVersion}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Source location")}</th>
    <td>{$archive.SourceLocation}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Archive type version")}</th>
    <td>{$archive.tarTypeVersion}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Archive location")}</th>
    <td>{$archive.ArchiveLocation}</td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "Archiving log")}</th>
    <td>
      <pre>{$archive.CreateInfo}</pre>
    </td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "md5sum of Archive")}</th>
    <td>
      <pre><b>{$archive.md5sumArchive}</b></pre>
    </td>
  </tr>
  <tr>
    <th>{dgettext("dicom_archive", "md5sum of Dicom unzipped")}</th>
    <td>
      <pre><b>{$archive.md5sumDicomOnly}</b></pre>
    </td>
  </tr>
  <tr>
    <th class="valign-top">{dgettext("dicom_archive", "Series")}</th>
    <td>
      <a data-toggle="collapse" href="#series-data" aria-expanded="false" aria-controls="series-data">
        {dgettext("dicom_archive", "Show/Hide series")} ({count($archive_series)})
      </a>
      <div id="series-data" class="collapse">
        <table class="table table-hover table-primary table-bordered">
        <tr class="info">
          <th>{dgettext("dicom_archive", "Series Number")}</th>
          <th>{dgettext("dicom_archive", "Series Description")}</th>
          <th>{dgettext("dicom_archive", "Protocol Name")}</th>
          <th>{dgettext("dicom_archive", "Sequence Name")}</th>
          <th>{dgettext("dicom_archive", "Echo Time")}</th>
          <th>{dgettext("dicom_archive", "Repetition Time")}</th>
          <th>{dgettext("dicom_archive", "Inversion Time")}</th>
          <th>{dgettext("dicom_archive", "Slice Thickness")}</th>
          <th>{dgettext("dicom_archive", "Phase Encoding")}</th>
          <th>{dgettext("dicom_archive", "Number of Files")}</th>
          <th>{dgettext("dicom_archive", "SeriesUID")}</th>
        </tr>
        {section name=record loop=$archive_series}
          <tr>
            <td>{$archive_series[record].SeriesNumber}</td>
            <td>{$archive_series[record].SeriesDescription|escape:'htmlall'}</td>
            <td>{$archive_series[record].ProtocolName|default:"Unknown"}</td>
            <td>{$archive_series[record].SequenceName}</td>
            <td>{$archive_series[record].EchoTime}</td>
            <td>{$archive_series[record].RepetitionTime}</td>
            <td>{$archive_series[record].InversionTime}</td>
            <td>{$archive_series[record].SliceThickness}</td>
            <td>{$archive_series[record].PhaseEncoding}</td>
            <td>{$archive_series[record].NumberOfFiles}</td>
            <td>
              <a href="/mri_violations?patientName={$archive.PatientName}&seriesUID={$archive_series[record].SeriesUID}">
                {$archive_series[record].SeriesUID}
              </a>
            </td>
          </tr>
        {/section}
      </table>
      </div>
    </td>
  </tr>
  <tr>
    <th class="valign-top">{dgettext("dicom_archive", "Files")}</th>
    <td>
      <a data-toggle="collapse" href="#files-data" aria-expanded="false" aria-controls="files-data">
        {dgettext("dicom_archive", "Show/Hide files")} ({count($archive_files)})
      </a>
      <div id="files-data" class="collapse">
        <table class="table table-hover table-primary table-bordered">
          <tr class="info">
            <th>{dgettext("dicom_archive", "SeriesNumber")}</th>
            <th>{dgettext("dicom_archive", "FileNumber")}</th>
            <th>{dgettext("dicom_archive", "EchoNumber")}</th>
            <th>{dgettext("dicom_archive", "SeriesDescription")}</th>
            <th>{dgettext("dicom_archive", "Md5Sum")}</th>
            <th>{dgettext("dicom_archive", "FileName")}</th>
          </tr>
          {section name=record loop=$archive_files}
            <tr>
              <td>{$archive_files[record].SeriesNumber}</td>
              <td>{$archive_files[record].FileNumber}</td>
              <td>{$archive_files[record].EchoNumber}</td>
              <td>{$archive_files[record].SeriesDescription}</td>
              <td>{$archive_files[record].Md5Sum}</td>
              <td>{$archive_files[record].FileName}</td>
            </tr>
          {/section}
        </table>
      </div>
    </td>
  </tr>
</table>
