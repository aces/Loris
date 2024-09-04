<h2>Tarchive Metadata</h2>
<table class="table table-hover table-primary table-bordered details-outer-table">
  <tr>
    <th>Acquisition ID</th>
    <td>
      <a href="/mri_violations?patientName={$archive.PatientName}">
        {$archive.DicomArchiveID}
      </a>
    </td>
  </tr>
  <tr>
    <th>Patient ID</th>
    <td{if $archive.patientIDValid == 0} class="error"{/if}>{$archive.PatientID}</td>
  </tr>
  <tr>
    <th>Patient Name</th>
    <td{if $archive.patientNameValid == 0} class="error"{/if}>{$archive.PatientName}</td>
  </tr>
  <tr>
    <th>Patient Birthdate</th>
    <td>{$archive.PatientDoB}</td>
  </tr>
  <tr>
    <th>Patient Biological Sex</th>
    <td>{$archive.PatientSex}</td>
  </tr>
  <tr>
    <th>Date acquired</th>
    <td>{$archive.DateAcquired}</td>
  </tr>
  <tr>
    <th>Scanner Model</th>
    <td>
      {$archive.ScannerManufacturer} {$archive.ScannerModel}
      (Serial Number: {$archive.ScannerSerialNumber})
    </td>
  </tr>
  <tr>
    <th>Scanner Software Version</th>
    <td>{$archive.ScannerSoftwareVersion}</td>
  </tr>
  <tr>
    <th>Acquired at</th>
    <td>{$archive.CenterName}</td>
  </tr>
  <tr>
    <th>Number of Acquisitions</th>
    <td>{$archive.AcquisitionCount}</td>
  </tr>
  <tr>
    <th>Archived by</th>
    <td>{$archive.CreatingUser}</td>
  </tr>
  <tr>
    <th>Last update</th>
    <td>{if !isset($archive.LastUpdate)}Never{/if}</td>
  </tr>
  <tr>
    <th>Summary type version</th>
    <td>{$archive.sumTypeVersion}</td>
  </tr>
  <tr>
    <th>Source location</th>
    <td>{$archive.SourceLocation}</td>
  </tr>
  <tr>
    <th>Archive type version</th>
    <td>{$archive.tarTypeVersion}</td>
  </tr>
  <tr>
    <th>Archive location</th>
    <td>{$archive.ArchiveLocation}</td>
  </tr>
  <tr>
    <th>Archiving log</th>
    <td>
      <pre>{$archive.CreateInfo}</pre>
    </td>
  </tr>
  <tr>
    <th>md5sum of Archive</th>
    <td>
      <pre><b>{$archive.md5sumArchive}</b></pre>
    </td>
  </tr>
  <tr>
    <th>md5sum of Dicom unzipped</th>
    <td>
      <pre><b>{$archive.md5sumDicomOnly}</b></pre>
    </td>
  </tr>
  <tr>
    <th class="valign-top">Series</th>
    <td>
      <a data-toggle="collapse" href="#series-data" aria-expanded="false" aria-controls="series-data">
        Show/Hide series ({count($archive_series)})
      </a>
      <div id="series-data" class="collapse">
        <table class="table table-hover table-primary table-bordered">
        <tr class="info">
          <th>Series Number</th>
          <th>Series Description</th>
          <th>Protocol Name</th>
          <th>Sequence Name</th>
          <th>Echo Time</th>
          <th>Repetition Time</th>
          <th>Inversion Time</th>
          <th>Slice Thickness</th>
          <th>Phase Encoding</th>
          <th>Number of Files</th>
          <th>SeriesUID</th>
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
    <th class="valign-top">Files</th>
    <td>
      <a data-toggle="collapse" href="#files-data" aria-expanded="false" aria-controls="files-data">
        Show/Hide files ({count($archive_files)})
      </a>
      <div id="files-data" class="collapse">
        <table class="table table-hover table-primary table-bordered">
          <tr class="info">
            <th>SeriesNumber</th>
            <th>FileNumber</th>
            <th>EchoNumber</th>
            <th>SeriesDescription</th>
            <th>Md5Sum</th>
            <th>FileName</th>
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
